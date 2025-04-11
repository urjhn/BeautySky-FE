import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";
import { useQuizContext } from "../../../context/QuizContext";
import questionsAPI from "../../../features/services/questions";
import answersAPI from "../../../features/services/answers";
import Swal from 'sweetalert2';

const QuizController = () => {
  const { questions, answers, fetchQuestions, fetchAnswers } = useQuizContext();
  const [questionsList, setQuestionsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    questionId: 0,
    questionText: "",
    orderNumber: 1,
    quizId: 1,
    answers: [
      { answerId: 0, answerText: "", skinTypeId: "", point: "" },
      { answerId: 0, answerText: "", skinTypeId: "", point: "" },
      { answerId: 0, answerText: "", skinTypeId: "", point: "" },
      { answerId: 0, answerText: "", skinTypeId: "", point: "" },
      { answerId: 0, answerText: "", skinTypeId: "", point: "" }
    ]
  });

  const itemsPerPage = 3;

  useEffect(() => {
    if (questions.length > 0 && answers.length > 0) {
      // Process each question individually without grouping
      const processedQuestions = questions.map(question => {
        const questionAnswers = answers.filter(answer => answer.questionId === question.questionId)
          .map(answer => ({
            answerId: answer.answerId,
            answerText: answer.answerText || answer.text || "",
            skinTypeId: answer.skinTypeId || "",
            point: answer.point || ""
          }));

        return {
          questionId: question.questionId,
          questionText: question.questionText || question.text || "",
          orderNumber: question.orderNumber || 0,
          quizId: question.quizId,
          answers: questionAnswers.length ? questionAnswers : [
            { answerId: 0, answerText: "", skinTypeId: "", point: "" },
            { answerId: 0, answerText: "", skinTypeId: "", point: "" },
            { answerId: 0, answerText: "", skinTypeId: "", point: "" },
            { answerId: 0, answerText: "", skinTypeId: "", point: "" },
            { answerId: 0, answerText: "", skinTypeId: "", point: "" }
          ]
        };
      });

      setQuestionsList(processedQuestions);
    }
  }, [questions, answers]);

  // Data loading effect
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    const loadData = async () => {
      try {
        const timeoutMs = 10000; // 10 seconds
        
        const questionsPromise = fetchQuestions(timeoutMs);
        await questionsPromise;
        
        if (isMounted) {
          await fetchAnswers(timeoutMs);
        }
        
        retryCount = 0;
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [fetchQuestions, fetchAnswers]);

  // Filter questions based on search term
  const filteredQuestions = questionsList.filter((question) => {
    const searchLower = searchTerm.toLowerCase().trim();
    
    if (!searchLower) return true;
    
    // Search in question content
    if (question.questionText && question.questionText.toLowerCase().includes(searchLower)) 
      return true;
    
    // Search in question ID
    if (question.questionId && question.questionId.toString().includes(searchLower)) 
      return true;
    
    // Search in question order
    if (question.orderNumber && question.orderNumber.toString().includes(searchLower)) 
      return true;
    
    // Search in answers
    return question.answers.some(a => {
      // Search in answer content
      if (a.answerText && a.answerText.toLowerCase().includes(searchLower)) 
        return true;
      
      // Search in skin type
      if (a.skinTypeId && a.skinTypeId.toString().toLowerCase().includes(searchLower)) 
        return true;
      
      // Search in points
      if (a.point && a.point.toString().includes(searchLower)) 
        return true;
      
      // Search in answer ID
      if (a.answerId && a.answerId.toString().includes(searchLower)) 
        return true;
      
      return false;
    });
  });
  
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage);



  const createQuestionAndAnswers = async (question) => {
    try {
      if (!question.questionText || question.questionText.trim().length < 3) {
        throw new Error("Nội dung câu hỏi phải có ít nhất 3 ký tự");
      }
      
      // Get max order number for this quizId
      const allQuestionsResponse = await questionsAPI.getAll();
      const allQuestions = allQuestionsResponse.data;
      
      const quizQuestions = Array.isArray(allQuestions) 
        ? allQuestions.filter(q => q.quizId === question.quizId)
        : [];
      
      const maxOrder = quizQuestions.length > 0
        ? Math.max(...quizQuestions.map(q => q.orderNumber || 0))
        : 0;
      
      // Create new question with correct orderNumber
      const newQuestionData = {
        questionText: question.questionText.trim(),
        orderNumber: maxOrder + 1,
        quizId: Number(question.quizId) // Ensure quizId is a number
      };
      const newQuestionResponse = await questionsAPI.createQuestions(newQuestionData);
      
      // Check if question creation was successful
      if (newQuestionResponse.status === 200) {
        // Get all questions to find the newly created one
        const allQuestionsResponse = await questionsAPI.getAll();
        const allQuestions = allQuestionsResponse.data;
        
        // Find the newly created question based on content and order
        // Sort by ID descending to get the most recent one
        const sortedQuestions = Array.isArray(allQuestions) 
          ? [...allQuestions].sort((a, b) => b.questionId - a.questionId) 
          : [];
        
        const newQuestion = sortedQuestions.find(q => 
          q.questionText.trim() === newQuestionData.questionText.trim()
        );
        
        if (newQuestion && newQuestion.questionId) {
          // Found the new question
          const questionId = newQuestion.questionId;
          
          // Process answers
          const validAnswers = question.answers.filter(answer => answer.answerText.trim());
              
          if (validAnswers.length === 0) {
            throw new Error("Câu hỏi phải có ít nhất một câu trả lời");
          }
          
          const answerPromises = validAnswers.map(answer => {
            const answerData = {
              answerText: answer.answerText.trim(),
              questionId: questionId,
              skinTypeId: answer.skinTypeId || "",
              point: answer.point || "0"
            };
            return answersAPI.createAnswers(answerData);
          });
      
          await Promise.all(answerPromises);
          return questionId;
        } else {
          console.error("Không thể tìm thấy câu hỏi vừa được tạo");
          throw new Error("Không thể tìm thấy câu hỏi vừa được tạo");
        }
        } else {
          throw new Error("Không thể tạo câu hỏi: " + JSON.stringify(newQuestionResponse.data));
        }
        } catch (error) {
          console.error("Lỗi khi tạo câu hỏi và câu trả lời:", error);
          if (error.response && error.response.data) {
            console.error("Chi tiết lỗi API:", error.response.data);
            throw new Error(`Lỗi từ API: ${JSON.stringify(error.response.data)}`);
          }
          throw error;
        }
        };


  const handleDelete = async (questionId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa câu hỏi này không?',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        // Find the specific question
        const questionToDelete = questions.find(q => q.questionId === questionId);
        
        if (!questionToDelete) {
          throw new Error("Không tìm thấy câu hỏi để xóa");
        }
        // Delete related answers first
        const questionAnswers = answers.filter(a => a.questionId === questionId);
        for (const answer of questionAnswers) {
          await answersAPI.deleteAnswers(answer.answerId);
        }
        
        // Delete the question
        await questionsAPI.deleteQuestions(questionId);
        
        // Refresh data
        await fetchQuestions();
        await fetchAnswers();
        
        Swal.fire({
          icon: 'success',
          title: 'Xóa thành công',
          text: 'Câu hỏi đã được xóa thành công!',
        });
      } catch (error) {
        console.error("Lỗi khi xóa câu hỏi:", error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: `Đã có lỗi xảy ra khi xóa câu hỏi: ${error.message}`,
        });
      }
    }
  };

  const handleEdit = (question) => {
    try {
      if (!question) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể chỉnh sửa câu hỏi. Câu hỏi không hợp lệ.',
        });
        return;
      }
  
      // Set the editing question and initialize the form
      setEditingQuestion(question);
      setNewQuestion({
        questionId: question.questionId,
        questionText: question.questionText,
        orderNumber: question.orderNumber,
        quizId: question.quizId,
        answers: question.answers.length ? question.answers.map(a => ({
          answerId: a.answerId,
          answerText: a.answerText,
          skinTypeId: a.skinTypeId || "",
          point: a.point || ""
        })) : [
          { answerId: 0, answerText: "", skinTypeId: "", point: "" },
          { answerId: 0, answerText: "", skinTypeId: "", point: "" },
          { answerId: 0, answerText: "", skinTypeId: "", point: "" },
          { answerId: 0, answerText: "", skinTypeId: "", point: "" },
          { answerId: 0, answerText: "", skinTypeId: "", point: "" },
        ]
      });
  
      // Open modal for editing
      setIsModalOpen(true);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: `Không thể chỉnh sửa câu hỏi. Đã có lỗi xảy ra: ${error.message}`,
      });
    }
  };
  
  const handleAddNewQuestion = () => {
    setIsModalOpen(true);
    setEditingQuestion(null);
    
    // Initialize new question with default values
    setNewQuestion({ 
      questionId: 0, 
      questionText: "", 
      orderNumber: 1,
      quizId: 1,
      answers: [  
        { answerId: 0, answerText: "", skinTypeId: "", point: "" },
        { answerId: 0, answerText: "", skinTypeId: "", point: "" },
        { answerId: 0, answerText: "", skinTypeId: "", point: "" },
        { answerId: 0, answerText: "", skinTypeId: "", point: "" },
        { answerId: 0, answerText: "", skinTypeId: "", point: "" }
      ]
    });
  };

  const handleSaveQuestion = async () => {
    try {
      // Validation
      if (!newQuestion.questionText || newQuestion.questionText.trim() === "") {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Vui lòng nhập nội dung cho câu hỏi.',
        });
        return;
      }
      
      const validAnswers = newQuestion.answers.filter(a => a.answerText.trim() !== "");
      if (validAnswers.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Câu hỏi phải có ít nhất một câu trả lời.',
        });
        return;
      }

      if (editingQuestion) {
        // Update existing question
        const questionData = {
          questionId: newQuestion.questionId,
          questionText: newQuestion.questionText.trim(),
          orderNumber: newQuestion.orderNumber || 1,
          quizId: newQuestion.quizId
        };
        
        // Update question
        await questionsAPI.editQuestions(newQuestion.questionId, questionData);
        
        // Handle answers - update existing ones and create new ones
        for (const answer of newQuestion.answers) {
          if (answer.answerText.trim() === "") continue;
          
          if (answer.answerId > 0) {
            // Update existing answer
            const answerData = {
              answerId: answer.answerId,
              answerText: answer.answerText.trim(),
              questionId: newQuestion.questionId,
              skinTypeId: answer.skinTypeId || "",
              point: answer.point || "0"
            };
            await answersAPI.editAnswers(answer.answerId, answerData);
          } else {
            // Create new answer
            const answerData = {
              answerText: answer.answerText.trim(),
              questionId: newQuestion.questionId,
              skinTypeId: answer.skinTypeId || "",
              point: answer.point || "0"
            };
            await answersAPI.createAnswers(answerData);
          }
        }
        
        // Delete removed answers
        const existingAnswers = answers.filter(a => a.questionId === newQuestion.questionId);
        const keptAnswerIds = newQuestion.answers
          .filter(a => a.answerId > 0 && a.answerText.trim() !== "")
          .map(a => a.answerId);
          
        for (const existingAns of existingAnswers) {
          if (!keptAnswerIds.includes(existingAns.answerId)) {
            await answersAPI.deleteAnswers(existingAns.answerId);
          }
        }
      } else {
        // Create new question and answers
        await createQuestionAndAnswers(newQuestion);
      }

      // Close modal and refresh
      setIsModalOpen(false);
      setEditingQuestion(null);
      await fetchQuestions();
      await fetchAnswers();
      
      Swal.fire({
        icon: 'success',
        title: 'Lưu thành công',
        text: 'Câu hỏi đã được lưu thành công!',
      });
    } catch (error) {
      console.error("Lỗi khi lưu câu hỏi:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        html: `Đã có lỗi xảy ra khi lưu câu hỏi:<br><pre>${error.message}</pre>`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8">
      <header className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-lg">
          <FiSearch className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Quản lý Q&A</h1>
      </header>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-90">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo câu hỏi, câu trả lời, loại da, điểm số..."
              className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddNewQuestion}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl flex items-center gap-3 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5" /> Thêm mới câu hỏi
          </button>
        </div>

        {displayedQuestions.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="text-gray-600 text-xl mb-4 font-semibold">Không tìm thấy câu hỏi nào</p>
            <p className="text-gray-400">Hãy tạo câu hỏi đầu tiên của bạn!</p>
          </div>
        ) :  (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">STT</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Câu hỏi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Câu trả lời</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Loại da</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Điểm</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {displayedQuestions.map((question, index) => (
                  <tr key={question.questionId} className="border-b hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-5 font-medium">{question.orderNumber}</td>
                    <td className="px-6 py-5">{question.questionText}</td>
                    <td className="px-6 py-5">
                      <div className="grid grid-cols-1 gap-2">
                        {question.answers.map((answer, i) => (
                          answer.answerText && <div key={answer.answerId || i} className="text-sm">{answer.answerText}</div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="grid grid-cols-1 gap-2">
                        {question.answers.map((answer, i) => (
                          answer.answerText && <div key={answer.answerId || i} className="text-sm">{answer.skinTypeId}</div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="grid grid-cols-1 gap-2">
                        {question.answers.map((answer, i) => (
                          answer.answerText && <div key={answer.answerId || i} className="text-sm">{answer.point}</div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleEdit(question)}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full transition-all duration-200"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(question.questionId)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full transition-all duration-200"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
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
                {editingQuestion ? "Chỉnh sửa" : "Tạo mới"} câu hỏi
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-all duration-200">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Câu hỏi
                  </label>
                </div>
                <input
                  type="text"
                  value={newQuestion.questionText}
                  onChange={(e) => setNewQuestion({...newQuestion, questionText: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Nhập câu hỏi"
                />
                <div className="space-y-6">
                  <h4 className="font-medium">Các câu trả lời:</h4>
                  {newQuestion.answers.map((answer, aIndex) => (
                    <div key={answer.answerId || `new-answer-${aIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-1 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Câu trả lời {aIndex + 1}
                        </label>
                        <input
                          type="text"
                          value={answer.answerText}
                          onChange={(e) => {
                            const updatedAnswers = [...newQuestion.answers];
                            updatedAnswers[aIndex].answerText = e.target.value;
                            setNewQuestion({...newQuestion, answers: updatedAnswers});
                          }}
                          className="w-full p-2 border rounded-lg"
                          placeholder={`Câu trả lời ${aIndex + 1}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại da
                        </label>
                        
                        <input
                          type="text"
                          value={answer.skinTypeId}
                          onChange={(e) => {
                            const updatedAnswers = [...newQuestion.answers];
                            updatedAnswers[aIndex].skinTypeId = e.target.value;
                            setNewQuestion({...newQuestion, answers: updatedAnswers});
                          }}
                          className="w-full p-2 border rounded-lg"
                          placeholder="Nhập loại da (VD: 1, 2, 3...)"
                        />
                        
                        <div className="mt-1 text-xs text-gray-500">
                          <span className="font-medium">Mã loại da:</span> 1-Dầu, 2-Khô, 3-Thường, 4-Hỗn hợp, 5-Nhạy cảm
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Điểm
                        </label>
                        <input
                          type="text"
                          value={answer.point}
                          onChange={(e) => {
                            const updatedAnswers = [...newQuestion.answers];
                            updatedAnswers[aIndex].point = e.target.value;
                            setNewQuestion({...newQuestion, answers: updatedAnswers});
                          }}
                          className="w-full p-2 border rounded-lg"
                          placeholder="Điểm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-6 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveQuestion}
                className="py-2 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:bg-gradient-to-r from-blue-700 to-purple-700 transition-all duration-300"
              >
                {editingQuestion ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizController;