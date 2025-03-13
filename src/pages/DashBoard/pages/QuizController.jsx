import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";
import { useQuizContext } from "../../../context/QuizContext";
import questionsAPI from "../../../features/services/questions";
import answersAPI from "../../../features/services/answers";
import Swal from 'sweetalert2';

const QuizController = () => {
  const { questions, answers, fetchQuestions, fetchAnswers } = useQuizContext();
  const [qaSets, setQaSets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSet, setEditingSet] = useState(null);
  const [newSet, setNewSet] = useState({
    name: "",
    questions: [{ id: 1, text: "", answers: ["", "", "", ""] }]
  });

  const itemsPerPage = 5;

  useEffect(() => {
    if (questions.length > 0 && answers.length > 0) {
      const groupedQuestions = questions.reduce((acc, question) => {
        const quizId = question.quizId;
        const quizName = question.quizName || "Bộ câu hỏi chưa đặt tên";

        if (!acc[quizId]) {
          acc[quizId] = {
            id: quizId,
            QuizName: quizName,
            description: question.description || "",
            questions: []
          };
        }

        const questionAnswers = answers.filter(answer => answer.questionId === question.questionId)
          .map(answer => answer.answerText || answer.text);

        acc[quizId].questions.push({
          id: question.questionId,
          text: question.questionText || question.text,
          answers: questionAnswers.length ? questionAnswers : ["", "", "", ""]
        });

        return acc;
      }, {});

      setQaSets(Object.values(groupedQuestions));
    }
  }, [questions, answers]);

  useEffect(() => {
    fetchQuestions();
    fetchAnswers();
  }, [fetchQuestions, fetchAnswers]);

  const filteredSets = qaSets.filter((set) =>
    set.QuizName && set.QuizName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedSets = filteredSets.slice(startIndex, startIndex + itemsPerPage);

  const handleAddQuestion = () => {
    setNewSet({
      ...newSet,
      questions: [
        ...newSet.questions,
        { id: newSet.questions.length + 1, text: "", answers: ["", "", "", ""] }
      ]
    });
  };

  const handleSaveSet = async () => {
    if (!newSet.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa nhập tên bộ câu hỏi',
        text: 'Vui lòng nhập tên bộ câu hỏi trước khi lưu.',
      });
      return;
    }

    try {
      if (editingSet) {
        await questionsAPI.editQuestions(editingSet.id, {
          quizId: editingSet.id,
          quizName: newSet.name,
          description: editingSet.description || ""
        });

        for (const question of newSet.questions) {
          let questionId = question.id;

          if (questions.some(q => q.questionId === questionId)) {
            await questionsAPI.editQuestions(questionId, {
              questionId: questionId,
              questionText: question.text,
              quizId: editingSet.id
            });
          } else {
            const newQuestionResponse = await questionsAPI.createQuestions({
              questionText: question.text,
              quizId: editingSet.id
            });
            questionId = newQuestionResponse.data.questionId;
          }

          for (let i = 0; i < question.answers.length; i++) {
            const answerText = question.answers[i];
            const existingAnswer = answers.find(a =>
              a.questionId === questionId && (a.order === i || a.orderNumber === i));

            if (existingAnswer) {
              await answersAPI.editAnswers(existingAnswer.answerId, {
                answerId: existingAnswer.answerId,
                answerText: answerText,
                questionId: questionId,
                orderNumber: i
              });
            } else {
              await answersAPI.createAnswers({
                answerText: answerText,
                questionId: questionId,
                orderNumber: i
              });
            }
          }
        }
      } else {
        const newQuizResponse = await questionsAPI.createQuestions({
          quizName: newSet.name,
          description: "",
          dateCreated: new Date().toISOString()
        });

        const quizId = newQuizResponse.data.quizId;

        for (const question of newSet.questions) {
          const newQuestionResponse = await questionsAPI.createQuestions({
            questionText: question.text,
            quizId: quizId
          });

          const questionId = newQuestionResponse.data.questionId;

          for (let i = 0; i < question.answers.length; i++) {
            await answersAPI.createAnswers({
              answerText: question.answers[i],
              questionId: questionId,
              orderNumber: i
            });
          }
        }
      }

      fetchQuestions();
      fetchAnswers();

      setIsModalOpen(false);
      setNewSet({ name: "", questions: [{ id: 1, text: "", answers: ["", "", "", ""] }] });
      setEditingSet(null);

      Swal.fire({
        icon: 'success',
        title: 'Lưu thành công',
        text: 'Bộ câu hỏi đã được lưu thành công!',
      });
    } catch (error) {
      console.error("Lỗi khi lưu bộ câu hỏi:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Đã có lỗi xảy ra khi lưu bộ câu hỏi. Vui lòng thử lại.',
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa bộ câu hỏi này không?',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        const setQuestions = questions.filter(q => q.quizId === id);

        for (const question of setQuestions) {
          const questionAnswers = answers.filter(a => a.questionId === question.questionId);

          for (const answer of questionAnswers) {
            await answersAPI.deleteAnswers(answer.answerId);
          }

          await questionsAPI.deleteQuestions(question.questionId);
        }

        await questionsAPI.deleteQuestions(id);

        fetchQuestions();
        fetchAnswers();

        Swal.fire({
          icon: 'success',
          title: 'Xóa thành công',
          text: 'Bộ câu hỏi đã được xóa thành công!',
        });
      } catch (error) {
        console.error("Lỗi khi xóa bộ câu hỏi:", error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Đã có lỗi xảy ra khi xóa bộ câu hỏi. Vui lòng thử lại.',
        });
      }
    }
  };

  const handleEdit = (set) => {
    setEditingSet(set);
    setNewSet({
      name: set.QuizName,
      questions: set.questions.map(q => ({
        ...q,
        answers: [...q.answers]
      }))
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8">
      <header className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-lg">
          <FiSearch className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Quản lý Q&A</h1>
      </header>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-90">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setEditingSet(null);
              setNewSet({ name: "", questions: [{ id: 1, text: "", answers: ["", "", "", ""] }] });
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl flex items-center gap-3 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5" /> Thêm mới Q&A
          </button>
        </div>

        {displayedSets.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="text-gray-600 text-xl mb-4 font-semibold">Không tìm thấy câu hỏi nào</p>
            <p className="text-gray-400">Hãy tạo câu hỏi đầu tiên của bạn!</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Câu hỏi</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Câu trả lời</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {displayedSets.map((set) => (
                  set.questions.map((question) => (
                    <tr key={question.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-8 py-5 font-medium">{question.text}</td>
                      <td className="px-8 py-5">
                        {question.answers.map((answer, i) => (
                          <div key={i}>{answer}</div>
                        ))}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleEdit(set)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full transition-all duration-200"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(set.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full transition-all duration-200"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${currentPage === i + 1 ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {editingSet ? "Chỉnh sửa" : "Tạo mới"} bộ Q&A
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-all duration-200">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên bộ câu hỏi</label>
                <input
                  type="text"
                  value={newSet.name}
                  onChange={(e) => setNewSet({ ...newSet, name: e.target.value })}
                  className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Nhập tên bộ câu hỏi"
                />
              </div>

              {newSet.questions.map((question, qIndex) => (
                <div key={question.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Câu hỏi {qIndex + 1}
                    </label>
                    {newSet.questions.length > 1 && (
                      <button
                        onClick={() => {
                          const updatedQuestions = newSet.questions.filter((_, i) => i !== qIndex);
                          setNewSet({ ...newSet, questions: updatedQuestions });
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => {
                      const updatedQuestions = [...newSet.questions];
                      updatedQuestions[qIndex].text = e.target.value;
                      setNewSet({ ...newSet, questions: updatedQuestions });
                    }}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Nhập câu hỏi"
                  />
                  {question.answers.map((answer, aIndex) => (
                    <div key={aIndex} className="flex items-center gap-4">
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => {
                          const updatedQuestions = [...newSet.questions];
                          updatedQuestions[qIndex].answers[aIndex] = e.target.value;
                          setNewSet({ ...newSet, questions: updatedQuestions });
                        }}
                        className="w-full p-2 border rounded-lg"
                        placeholder={`Câu trả lời ${aIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              ))}

              <button
                onClick={handleAddQuestion}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:bg-gradient-to-r from-blue-700 to-purple-700 transition-all duration-300"
              >
                Thêm câu hỏi
              </button>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-6 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveSet}
                className="py-2 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:bg-gradient-to-r from-blue-700 to-purple-700 transition-all duration-300"
              >
                {editingSet ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizController;
