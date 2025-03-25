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
    quizId: 1, // Added quizId to track which quiz set we're working with
    questions: [{ 
      questionId: 0, 
      questionText: "", 
      orderNumber: 1,
      answers: [
        { answerId: 0, answerText: "", skinTypeId: "", point: "" },
        { answerId: 0, answerText: "", skinTypeId: "", point: "" },
        { answerId: 0, answerText: "", skinTypeId: "", point: "" },
        { answerId: 0, answerText: "", skinTypeId: "", point: "" },
        { answerId: 0, answerText: "", skinTypeId: "", point: "" }
      ] 
    }]
  });

  const itemsPerPage = 5;

  useEffect(() => {
    if (questions.length > 0 && answers.length > 0) {
      // Handle grouping questions with null quizId separately
      const groupedQuestions = questions.reduce((acc, question) => {
        // Use the quizId if available, otherwise create a unique identifier
        const quizId = question.quizId !== null ? question.quizId : `standalone-${question.questionId}`;

        if (!acc[quizId]) {
          acc[quizId] = {
            id: quizId,
            isStandalone: question.quizId === null, // Flag to identify standalone questions
            description: question.description || "",
            questions: []
          };
        }

        const questionAnswers = answers.filter(answer => answer.questionId === question.questionId)
          .map(answer => ({
            answerId: answer.answerId,
            answerText: answer.answerText || answer.text || "",
            skinTypeId: answer.skinTypeId || "",
            point: answer.point || ""
          }));

        acc[quizId].questions.push({
          questionId: question.questionId,
          questionText: question.questionText || question.text || "",
          orderNumber: question.orderNumber || 0,
          answers: questionAnswers.length ? questionAnswers : [
            { answerId: 0, answerText: "", skinTypeId: "", point: "" },
            { answerId: 0, answerText: "", skinTypeId: "", point: "" },
            { answerId: 0, answerText: "", skinTypeId: "", point: "" },
            { answerId: 0, answerText: "", skinTypeId: "", point: "" },
            { answerId: 0, answerText: "", skinTypeId: "", point: "" }
          ]
        });

        return acc;
      }, {});

      setQaSets(Object.values(groupedQuestions));
    }
  }, [questions, answers]);

  // Add these modifications to your useEffect for data loading

useEffect(() => {
  // Track if component is mounted
  let isMounted = true;
  // Track if we're showing an error already
  let errorShown = false;
  // Track retry attempt
  let retryCount = 0;
  const maxRetries = 3;
  
  const loadData = async () => {
    try {
      // Add timeout to requests
      const timeoutMs = 10000; // 10 seconds
      
      // Create axios request with timeout
      const questionsPromise = fetchQuestions(timeoutMs);
      
      // Wait for questions first
      await questionsPromise;
      
      // Only fetch answers if questions succeeded and component still mounted
      if (isMounted) {
        await fetchAnswers(timeoutMs);
      }
      
      // Reset retry count on success
      retryCount = 0;
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };
  
  loadData();
  
  // Cleanup function
  return () => {
    isMounted = false;
  };
}, [fetchQuestions, fetchAnswers]);

  // Filter sets based on search term
  const filteredSets = qaSets.filter((set) => {
    const searchLower = searchTerm.toLowerCase().trim();
    
    // Nếu không có từ khóa tìm kiếm, hiển thị tất cả bộ câu hỏi
    if (!searchLower) return true;
    
    // Tìm trong các câu hỏi của bộ
    return set.questions.some(q => {
      // Tìm trong nội dung câu hỏi
      if (q.questionText && q.questionText.toLowerCase().includes(searchLower)) 
        return true;
      
      // Tìm trong ID câu hỏi
      if (q.questionId && q.questionId.toString().includes(searchLower)) 
        return true;
      
      // Tìm trong thứ tự câu hỏi
      if (q.orderNumber && q.orderNumber.toString().includes(searchLower)) 
        return true;
      
      // Tìm trong các câu trả lời
      return q.answers.some(a => {
        // Tìm trong nội dung câu trả lời
        if (a.answerText && a.answerText.toLowerCase().includes(searchLower)) 
          return true;
        
        // Tìm trong loại da
        if (a.skinTypeId && a.skinTypeId.toString().toLowerCase().includes(searchLower)) 
          return true;
        
        // Tìm trong điểm số
        if (a.point && a.point.toString().includes(searchLower)) 
          return true;
        
        // Tìm trong ID câu trả lời
        if (a.answerId && a.answerId.toString().includes(searchLower)) 
          return true;
        
        return false;
      });
    });
  });
  
  const totalPages = Math.ceil(filteredSets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedSets = filteredSets.slice(startIndex, startIndex + itemsPerPage);

  // Helper function to safely handle API responses
  const safelyHandleResponse = (response) => {
    if (!response) {
      throw new Error("No response received");
    }
    // Check if response has data property
    if (response.data) {
      return response.data;
    }
    
    // If response itself is the data
    return response;
  };

  const createQuestionAndAnswers = async (question, quizId) => {
    try {
      if (!question.questionText || question.questionText.trim().length < 3) {
        throw new Error("Nội dung câu hỏi phải có ít nhất 3 ký tự");
      }
      // Lấy orderNumber tối đa cho quizId này
      const allQuestionsResponse = await questionsAPI.getAll();
      const allQuestions = allQuestionsResponse.data;
      
      const quizQuestions = Array.isArray(allQuestions) 
        ? allQuestions.filter(q => q.quizId === quizId)
        : [];
      
      const maxOrder = quizQuestions.length > 0
        ? Math.max(...quizQuestions.map(q => q.orderNumber || 0))
        : 0;
      
      // Tạo câu hỏi mới với orderNumber chính xác
      const newQuestionData = {
        questionText: question.questionText.trim(),
        orderNumber: maxOrder + 1,
        quizId: quizId === null ? null : Number(quizId) // Đảm bảo quizId là số hoặc null
      };
      const newQuestionResponse = await questionsAPI.createQuestions(newQuestionData);
      
    
      // Kiểm tra nếu tạo câu hỏi thành công (status 200)
      if (newQuestionResponse.status === 200) {
        // Gọi API để lấy tất cả câu hỏi
        const allQuestionsResponse = await questionsAPI.getAll();
        const allQuestions = allQuestionsResponse.data;
        
        // Tìm câu hỏi vừa tạo dựa trên nội dung và orderNumber
        // Lấy câu hỏi mới nhất phù hợp với nội dung chúng ta vừa tạo
        // Sắp xếp theo ID giảm dần để lấy câu hỏi mới nhất
        const sortedQuestions = Array.isArray(allQuestions) 
          ? [...allQuestions].sort((a, b) => b.questionId - a.questionId) 
          : [];
        
        const newQuestion = sortedQuestions.find(q => 
          q.questionText.trim() === newQuestionData.questionText.trim()
        );
        
        if (newQuestion && newQuestion.questionId) {
          // Tìm thấy câu hỏi mới
          const questionId = newQuestion.questionId;
          
          // Tiếp tục xử lý answers
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
          console.error("Could not find newly created question");
          throw new Error("Could not find newly created question");
        }
      } else {
        throw new Error("Failed to create question: " + JSON.stringify(newQuestionResponse.data));
      }
    } catch (error) {
      console.error("Error creating question and answers:", error);
       // Hiển thị chi tiết lỗi từ API nếu có
    if (error.response && error.response.data) {
      console.error("API error details:", error.response.data);
      throw new Error(`Lỗi từ API: ${JSON.stringify(error.response.data)}`);
    }
      throw error;
    }
  };

  const handleSaveSet = async () => {
  try {
    // Validation (your existing validation code is good)
    for (const question of newSet.questions) {
      if (!question.questionText || question.questionText.trim() === "") {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Vui lòng nhập nội dung cho tất cả các câu hỏi.',
        });
        return;
      }
      
      const validAnswers = question.answers.filter(a => a.answerText.trim() !== "");
      if (validAnswers.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Mỗi câu hỏi phải có ít nhất một câu trả lời.',
        });
        return;
      }
    }

    if (editingSet) {
      // Update questions and answers instead of deleting and recreating
      for (const question of newSet.questions) {
        if (question.questionId > 0) {
          // Update existing question
          const questionData = {
            questionId: question.questionId,
            questionText: question.questionText.trim(),
            orderNumber: question.orderNumber || 1,
            quizId: editingSet.isStandalone ? null : 
            (typeof editingSet.id === 'number' ? editingSet.id : null)
          };
          
          // Update question
          await questionsAPI.editQuestions(question.questionId, questionData);
          
          // Handle answers - check which ones exist vs which are new
          for (const answer of question.answers) {
            if (answer.answerText.trim() === "") continue;
            
            if (answer.answerId > 0) {
              // Update existing answer
              const answerData = {
                answerId: answer.answerId,
                answerText: answer.answerText.trim(),
                questionId: question.questionId,
                skinTypeId: answer.skinTypeId || "",
                point: answer.point || "0"
              };
              await answersAPI.editAnswers(answer.answerId, answerData);
            } else {
              // Create new answer
              const answerData = {
                answerText: answer.answerText.trim(),
                questionId: question.questionId,
                skinTypeId: answer.skinTypeId || "",
                point: answer.point || "0"
              };
              await answersAPI.createAnswers(answerData);
            }
          }
          
          // Delete removed answers
          const existingAnswers = answers.filter(a => a.questionId === question.questionId);
          const keptAnswerIds = question.answers
            .filter(a => a.answerId > 0 && a.answerText.trim() !== "")
            .map(a => a.answerId);
            
          for (const existingAns of existingAnswers) {
            if (!keptAnswerIds.includes(existingAns.answerId)) {
              await answersAPI.deleteAnswers(existingAns.answerId);
            }
          }
        } else {
          // This is a new question - create it
          await createQuestionAndAnswers(question, editingSet.isStandalone ? null : 
            (typeof editingSet.id === 'number' ? editingSet.id : null));
        }
      }
      
      // Handle deleted questions
      const existingQuestionIds = editingSet.questions.map(q => q.questionId);
      const keptQuestionIds = newSet.questions
        .filter(q => q.questionId > 0)
        .map(q => q.questionId);
        
      for (const existingId of existingQuestionIds) {
        if (!keptQuestionIds.includes(existingId)) {
          // Delete answers first
          const questionAnswers = answers.filter(a => a.questionId === existingId);
          for (const answer of questionAnswers) {
            await answersAPI.deleteAnswers(answer.answerId);
          }
          // Then delete question
          await questionsAPI.deleteQuestions(existingId);
        }
      }
    }  else {
      // Tạo câu hỏi và câu trả lời mới
      const quizIdToUse = newSet.quizId; // Sử dụng quizId từ newSet, không phải null
      for (const question of newSet.questions) {
        await createQuestionAndAnswers(question, quizIdToUse);
      }
    }

    // Close modal and refresh
    setIsModalOpen(false);
    setEditingSet(null);
    await fetchQuestions();
    await fetchAnswers();
    
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
      html: `Đã có lỗi xảy ra khi lưu bộ câu hỏi:<br><pre>${error.message}</pre>`,
    });
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

  const handleEdit = (set) => {
    try {
      if (!set || !set.questions) {
        // If the set or its questions are not valid, show an error
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể chỉnh sửa bộ câu hỏi. Bộ câu hỏi không hợp lệ.',
        });
        return;
      }
  
      // Set the editing set and initialize the new set structure
      setEditingSet(set);
      setNewSet({
        quizId: set.isStandalone ? null : (typeof set.id === 'number' ? set.id : null),
        questions: set.questions.map(q => ({
          questionId: q.questionId,
          questionText: q.questionText,
          orderNumber: q.orderNumber,
          answers: q.answers.length ? q.answers.map(a => ({
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
        }))
      });
  
      
  
      // Open modal for editing
      setIsModalOpen(true);
  
    } catch (error) {
      // Handle any errors that occur while setting the state
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: `Không thể chỉnh sửa bộ câu hỏi. Đã có lỗi xảy ra: ${error.message}`,
      });
    }
  };
  
  
  const handleAddNewQA = () => {
    setIsModalOpen(true);
    setEditingSet(null);
    
    // Sử dụng giá trị quizId phù hợp (có thể là 1 hoặc null)
    setNewSet({ 
      quizId: 1, // Hoặc null tùy vào yêu cầu của bạn
      questions: [{ 
        questionId: 0, 
        questionText: "", 
        orderNumber: 1,
        answers: [  
          { answerId: 0, answerText: "", skinTypeId: "", point: "" },
          { answerId: 0, answerText: "", skinTypeId: "", point: "" },
          { answerId: 0, answerText: "", skinTypeId: "", point: "" },
          { answerId: 0, answerText: "", skinTypeId: "", point: "" },
          { answerId: 0, answerText: "", skinTypeId: "", point: "" }
        ] 
      }] 
    });
  };

  const handleAddQuestion = () => {
    const updatedQuestions = [...newSet.questions];
    const newOrderNumber = updatedQuestions.length + 1; // Tính toán orderNumber mới
    updatedQuestions.push({
        questionId: 0,
        questionText: "",
        orderNumber: newOrderNumber, // Đặt orderNumber mới
        answers: [
            { answerId: 0, answerText: "", skinTypeId: "", point: "" },
            { answerId: 0, answerText: "", skinTypeId: "", point: "" },
            { answerId: 0, answerText: "", skinTypeId: "", point: "" },
            { answerId: 0, answerText: "", skinTypeId: "", point: "" },
            { answerId: 0, answerText: "", skinTypeId: "", point: "" }
        ]
    });
    setNewSet({ ...newSet, questions: updatedQuestions });
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 md:p-8">
      <header className="text-center mb-8 md:mb-12">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-lg">
          <FiSearch className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Quản lý Q&A
        </h1>
      </header>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-4 md:p-8 backdrop-blur-sm bg-opacity-90">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-12 pr-4 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddNewQA}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-xl flex items-center justify-center gap-2 md:gap-3 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5" /> 
            <span>Thêm mới Q&A</span>
          </button>
        </div>

        <div className="md:hidden">
          {displayedSets.map((set) =>
            set.questions.map((question, qIndex) => (
              <div
                key={question.questionId}
                className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    #{question.orderNumber}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(set)}
                      className="text-blue-600 p-2 hover:bg-blue-50 rounded-full"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(question.questionId)}
                      className="text-red-600 p-2 hover:bg-red-50 rounded-full"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-medium text-gray-800 mb-3">
                  {question.questionText}
                </h3>

                <div className="space-y-2">
                  {question.answers.map((answer, i) => (
                    answer.answerText && (
                      <div
                        key={answer.answerId || i}
                        className="bg-gray-50 p-3 rounded-lg"
                      >
                        <p className="text-sm text-gray-700">{answer.answerText}</p>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>Loại da: {answer.skinTypeId || "N/A"}</span>
                          <span>Điểm: {answer.point || "0"}</span>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100">
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
              {displayedSets.map((set) => (
                set.questions.map((question, qIndex) => (
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
                          onClick={() => handleEdit(set)}
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
                ))
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 md:mt-8 flex justify-center gap-2 md:gap-3 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow"
              }`}
              disabled={currentPage === 1}
            >
              ‹
            </button>

            {[...Array(totalPages)].map((_, i) => {
              if (
                i + 1 === 1 ||
                i + 1 === totalPages ||
                (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              }
              if (i + 1 === currentPage - 2 || i + 1 === currentPage + 2) {
                return (
                  <span key={i} className="px-1 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow"
              }`}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
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
              {newSet.questions.map((question, qIndex) => (
                <div key={question.questionId || `new-${qIndex}`} className="space-y-4 p-4 border rounded-lg">
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
                    value={question.questionText}
                    onChange={(e) => {
                      const updatedQuestions = [...newSet.questions];
                      updatedQuestions[qIndex].questionText = e.target.value;
                      setNewSet({ ...newSet, questions: updatedQuestions });
                    }}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Nhập câu hỏi"
                  />
                  <div className="space-y-6">
                    <h4 className="font-medium">Các câu trả lời:</h4>
                    {question.answers.map((answer, aIndex) => (
                      <div key={answer.answerId || `new-answer-${aIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-1 md:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Câu trả lời {aIndex + 1}
                          </label>
                          <input
                            type="text"
                            value={answer.answerText}
                            onChange={(e) => {
                              const updatedQuestions = [...newSet.questions];
                              updatedQuestions[qIndex].answers[aIndex].answerText = e.target.value;
                              setNewSet({ ...newSet, questions: updatedQuestions });
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
                              const updatedQuestions = [...newSet.questions];
                              updatedQuestions[qIndex].answers[aIndex].skinTypeId = e.target.value;
                              setNewSet({ ...newSet, questions: updatedQuestions });
                            }}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Loại da"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Điểm
                          </label>
                          <input
                            type="text"
                            value={answer.point}
                            onChange={(e) => {
                              const updatedQuestions = [...newSet.questions];
                              updatedQuestions[qIndex].answers[aIndex].point = e.target.value;
                              setNewSet({ ...newSet, questions: updatedQuestions });
                            }}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Điểm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
           <button
            onClick={handleAddQuestion} // Thay vì handleAddNewQA
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