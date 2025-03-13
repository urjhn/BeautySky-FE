import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";

const QuizController = () => {
  const [qaSets, setQaSets] = useState([
    {
      id: 1,
      name: "Basic Mathematics",
      questions: [
        {
          id: 1,
          text: "What is 2 + 2?",
          answers: ["4", "3", "5", "6"]
        }
      ]
    },
    {
      id: 2,
      name: "Science Fundamentals",
      questions: [
        {
          id: 1,
          text: "What is H2O?",
          answers: ["Water", "Air", "Fire", "Earth"]
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSet, setEditingSet] = useState(null);
  const [newSet, setNewSet] = useState({
    name: "",
    questions: [{ id: 1, text: "", answers: ["", "", "", ""] }]
  });

  const itemsPerPage = 5;

  const filteredSets = qaSets.filter((set) =>
    set.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSaveSet = () => {
    if (!newSet.name.trim()) {
      alert("Please enter a set name");
      return;
    }

    if (editingSet) {
      setQaSets(qaSets.map((set) => (set.id === editingSet.id ? { ...newSet, id: editingSet.id } : set)));
    } else {
      setQaSets([...qaSets, { ...newSet, id: qaSets.length + 1 }]);
    }

    setIsModalOpen(false);
    setNewSet({ name: "", questions: [{ id: 1, text: "", answers: ["", "", "", ""] }] });
    setEditingSet(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this set?")) {
      setQaSets(qaSets.filter((set) => set.id !== id));
    }
  };

  const handleEdit = (set) => {
    setEditingSet(set);
    setNewSet(set);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8">
      <header className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-lg">
          <FiSearch className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Q&A Management</h1>
      </header>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-90">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search question sets..."
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
            <FiPlus className="w-5 h-5" /> Add New Q&A Set
          </button>
        </div>

        {displayedSets.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="text-gray-600 text-xl mb-4 font-semibold">No Q&A sets found</p>
            <p className="text-gray-400">Create your first Q&A set to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Set Name</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Questions</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Answers/Question</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedSets.map((set) => (
                  <tr key={set.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-8 py-5 font-medium">{set.name}</td>
                    <td className="px-8 py-5">{set.questions.length}</td>
                    <td className="px-8 py-5">{set.questions[0]?.answers.length || 0}</td>
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
                {editingSet ? "Edit" : "Create"} Q&A Set
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-all duration-200">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Set Name</label>
                <input
                  type="text"
                  value={newSet.name}
                  onChange={(e) => setNewSet({ ...newSet, name: e.target.value })}
                  className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter set name"
                />
              </div>

              {newSet.questions.map((question, qIndex) => (
                <div key={question.id} className="space-y-4 p-4 border rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question {qIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => {
                        const updatedQuestions = [...newSet.questions];
                        updatedQuestions[qIndex].text = e.target.value;
                        setNewSet({ ...newSet, questions: updatedQuestions });
                      }}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter question"
                    />
                  </div>

                  <div className="space-y-2">
                    {question.answers.map((answer, aIndex) => (
                      <input
                        key={aIndex}
                        type="text"
                        value={answer}
                        onChange={(e) => {
                          const updatedQuestions = [...newSet.questions];
                          updatedQuestions[qIndex].answers[aIndex] = e.target.value;
                          setNewSet({ ...newSet, questions: updatedQuestions });
                        }}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Answer ${aIndex + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddQuestion}
                className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Add Question
              </button>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveSet}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Set
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizController;