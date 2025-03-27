import React, { useEffect, useState } from "react";
import reviewsAPI from "../../../services/reviews";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import ReactPaginate from "react-paginate";
import "tailwindcss/tailwind.css";

const ProductReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 5;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getAll();
      const sortedReviews = response.data.sort((a, b) => 
        new Date(b.reviewDate) - new Date(a.reviewDate)
      );
      setReviews(sortedReviews);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch reviews", "error");
    }
  };

  const handleDeleteReview = async (review) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: `Bạn sắp ẩn đánh giá cho sản phẩm ${review.productName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Vâng, ẩn ngay!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await reviewsAPI.deleteReviews(review.reviewId);
          
          setReviews(prevReviews => 
            prevReviews.filter(r => r.reviewId !== review.reviewId)
          );
          
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Đánh giá đã được ẩn",
            showConfirmButton: false,
            timer: 1500
          });
        } catch (error) {
          console.error("Error deleting review:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: typeof error === 'string' ? error : "Có lỗi xảy ra khi ẩn đánh giá",
          });
        }
      }
    });
  };

  const filteredReviews = reviews
    .filter((review) =>
      Object.values(review).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const pageCount = Math.ceil(filteredReviews.length / reviewsPerPage);
  const offset = currentPage * reviewsPerPage;
  const currentReviews = filteredReviews.slice(offset, offset + reviewsPerPage);

  return (
    <div className="w-full mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl rounded-xl p-8 md:p-6 sm:p-4">
      <h2 className="text-3xl md:text-2xl sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-center mb-6">
        Quản lý đánh giá sản phẩm
      </h2>
      
      <div className="flex items-center mb-6 bg-white p-3 rounded-lg shadow-md">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Tìm kiếm đánh giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="ml-4 text-sm text-gray-500">
          {filteredReviews.length} đánh giá được tìm thấy
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 text-lg">Không tìm thấy đánh giá nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <th className="p-4 text-left font-semibold">ID</th>
                <th className="p-4 text-left font-semibold">Tên sản phẩm</th>
                <th className="p-4 text-left font-semibold">Người dùng</th>
                <th className="p-4 text-left font-semibold">Đánh giá</th>
                <th className="p-4 text-left font-semibold">Bình luận</th>
                <th className="p-4 text-left font-semibold">Ngày tạo</th>
                <th className="p-4 text-center font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.map((review, index) => (
                <tr
                  key={review.id}
                  className={`border-b hover:bg-indigo-50 transition-all duration-200 md:table-row flex flex-col ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="p-4 md:table-cell flex justify-between md:block before:content-['ID:'] before:font-bold before:md:hidden">
                    <span className="font-medium text-gray-700">#{review.reviewId}</span>
                  </td>
                  <td className="p-4 md:table-cell flex justify-between md:block before:content-['Sản_phẩm:'] before:font-bold before:md:hidden">
                    <span className="font-medium text-indigo-600">{review.productName}</span>
                  </td>
                  <td className="p-4 md:table-cell flex justify-between md:block before:content-['Người_dùng:'] before:font-bold before:md:hidden">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {review.userName}
                    </span>
                  </td>
                  <td className="p-4 md:table-cell flex justify-between md:block before:content-['Đánh_giá:'] before:font-bold before:md:hidden">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-gray-700">{review.rating}</span>
                    </div>
                  </td>
                  <td className="p-4 md:table-cell flex justify-between md:block before:content-['Bình_luận:'] before:font-bold before:md:hidden">
                    <span className="text-gray-700 line-clamp-2">{review.comment}</span>
                  </td>
                  <td className="p-4 md:table-cell flex justify-between md:block before:content-['Ngày:'] before:font-bold before:md:hidden">
                    <span className="text-gray-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4 md:table-cell flex justify-center">
                    <button
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 w-full md:w-auto flex items-center justify-center"
                      onClick={() => handleDeleteReview(review)}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13.875 18.825A10 10 0 1 0 12 20v-1.5m0 0l3-3m-3 3l-3-3" 
                        />
                      </svg>
                      Ẩn
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6">
        <ReactPaginate
          previousLabel={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }
          nextLabel={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          }
          pageCount={pageCount}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          containerClassName="flex justify-center items-center space-x-2 mt-4 flex-wrap gap-y-2"
          pageClassName="px-3 py-1 border rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white transition-all duration-300"
          activeClassName="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500"
          previousClassName="px-3 py-1 border rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-300 flex items-center"
          nextClassName="px-3 py-1 border rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-300 flex items-center"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default ProductReviews;
