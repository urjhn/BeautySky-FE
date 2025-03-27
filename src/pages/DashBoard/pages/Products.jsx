import React from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useDataContext } from "../../../context/DataContext";
import { Button, Table, Space, Modal, Select, Input } from "antd";
import productApi from "../../../services/product";
import Swal from "sweetalert2";
import ProductForm from "./ProductForm";
import productImagesAPI from "../../../services/productImages";

const Products = () => {
  const { products, skinTypes, categories, setProducts, fetchProduct } =
    useDataContext();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [filter, setFilter] = React.useState("All");
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const productsPerPage = 10;
  const [newProduct, setNewProduct] = React.useState({
    productId: 0,
    productName: "",
    price: 0,
    quantity: 1000,
    description: "",
    ingredient: "",
    categoryId: 0,
    skinTypeId: 0,
    productsImages: [],
    isActive: true,
  });

  const handleImageUpload = async ({ File}) => {
     // Tạo đối tượng FormData
     const formData = new FormData();
     formData.append("File", File); // Thêm productsImages vào FormData
   
     try {
       // Gọi API upload ảnh (Sử dụng formData để gửi ảnh)
       const response = await productApi.uploadImage(formData); // Đảm bảo sử dụng formData
   
       // Giả sử server trả về URL của ảnh đã tải lên
       const imageUrl = response.data.imageUrl; // Hoặc cấu trúc phù hợp với API của bạn
   
       // Lưu URL này vào state hoặc xử lý theo nhu cầu của bạn
       setNewProduct(prev => [...prev, imageUrl]); // Cập nhật lại state để lưu URL ảnh
     } catch (error) {
       console.error("Lỗi khi tải ảnh:", error);
     }
   };

  const filteredProducts = React.useMemo(() => {
    let updatedProducts = [...products];

    // Tìm kiếm sản phẩm
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase().trim();
      updatedProducts = updatedProducts.filter((product) => {
        // Tìm theo tên sản phẩm
        if (product.productName && product.productName.toLowerCase().includes(searchLower)) 
          return true;
        
        // Tìm theo giá
        if (product.price && product.price.toString().includes(searchLower)) 
          return true;
        
        // Tìm theo số lượng
        if (product.quantity && product.quantity.toString().includes(searchLower)) 
          return true;
        
        // Tìm theo ID sản phẩm
        if (product.productId && product.productId.toString().includes(searchLower)) 
          return true;
        
        // Tìm theo mô tả
        if (product.description && product.description.toLowerCase().includes(searchLower)) 
          return true;
        
        // Tìm theo thành phần
        if (product.ingredient && product.ingredient.toLowerCase().includes(searchLower)) 
          return true;
        
        // Tìm theo loại da
        const skinType = skinTypes.find(s => s.skinTypeId === product.skinTypeId);
        if (skinType && skinType.skinTypeName && skinType.skinTypeName.toLowerCase().includes(searchLower)) 
          return true;
        
        // Tìm theo danh mục
        const category = categories.find(c => c.categoryId === product.categoryId);
        if (category && category.categoryName && category.categoryName.toLowerCase().includes(searchLower)) 
          return true;
        
        return false;
      });
    }

    // Lọc theo trạng thái
    if (filter !== "All") {
      updatedProducts = updatedProducts.filter((p) =>
        filter === "Còn hàng" ? p.quantity > 0 : p.quantity === 0
      );
    }

    // Sắp xếp theo giá
    if (sortOrder) {
      updatedProducts.sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
    }

    return updatedProducts;
  }, [products, filter, sortOrder, searchTerm, skinTypes, categories]);

  const displayedProducts = React.useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      ),
    [currentPage, filteredProducts]
  );

  const handleDelete = async (productId) => {
    if (!productId) {
      Swal.fire({
        title: "Lỗi!",
        text: "Không tìm thấy ID sản phẩm",
        icon: "error",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn vô hiệu hóa sản phẩm này?",
      text: "Sản phẩm sẽ chuyển sang trạng thái không hoạt động!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Vô hiệu hóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await productApi.deleteProduct(productId);
        
        if (response.status >= 200 && response.status < 300) {
          setProducts(prevProducts => 
            prevProducts.map(product => 
              product.productId === productId 
                ? { ...product, isActive: false }
                : product
            )
          );
          
          Swal.fire({
            title: "Thành công!",
            text: "Sản phẩm đã được vô hiệu hóa.",
            icon: "success",
          });
          
          fetchProduct();
        }
      } catch (error) {
        console.error("Lỗi vô hiệu hóa sản phẩm:", error);
        Swal.fire("Lỗi!", "Đã xảy ra lỗi khi vô hiệu hóa sản phẩm.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReactivate = async (productId) => {
    const confirmResult = await Swal.fire({
      title: "Xác nhận kích hoạt",
      text: "Bạn có chắc chắn muốn kích hoạt lại sản phẩm này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Kích hoạt",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    try {
      setLoading(true);

      if (!productId) {
        throw new Error("Missing product ID");
      }

      const response = await productApi.reactivateProduct(productId);

      if (response && response.status === 200) {
        // Cập nhật state local
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.productId === productId
              ? { ...product, isActive: true }
              : product
          )
        );

        await Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Sản phẩm đã được kích hoạt lại thành công!",
        });

        // Refresh danh sách sản phẩm
        await fetchProduct();
      }
    } catch (error) {
      console.error("Error activating product:", error);

      await Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Kích hoạt sản phẩm thất bại, vui lòng thử lại",
      });
    } finally {
      setLoading(false);
    }
  };

const handleAddProduct = async (formData) => {
  try {
    setLoading(true);
    
    const response = await productApi.createProduct(formData);
    
    if (response && response.status >= 200 && response.status < 300) {
      setShowAddModal(false);
      
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Sản phẩm đã được thêm thành công!",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      
      // Refresh product list
      fetchProduct();
    } else {
      throw new Error("Add failed");
    }
  } catch (error) {
    console.error("Error adding product:", error);
    
    Swal.fire({
      icon: "error",
      title: "Lỗi!",
      text: error.response?.data?.message || "Lỗi thêm sản phẩm, vui lòng thử lại",
      confirmButtonColor: "#d33",
      confirmButtonText: "Thử lại",
    });
  } finally {
    setLoading(false);
  }
};

const handleSaveEdit = async (formData) => {
  try {
    setLoading(true);
    
    if (!editingProduct || !editingProduct.productId) {
      throw new Error("Missing product ID");
    }
    
    // Modified check that only flags true duplicates
const nameExists = products.some(p => 
  p.productName === formData.productName && 
  p.productId !== editingProduct.productId
);
    
    console.log("FormData:", formData);
    console.log("EditingProduct:", editingProduct);
    
    const response = await productApi.editProduct(
      editingProduct.productId,
      formData
    );
    
    if (response && response.status >= 200 && response.status < 300) {
      setShowEditModal(false);
      
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Sản phẩm đã được cập nhật thành công!",
      });
      
      fetchProduct();
    } else {
      throw new Error("Edit failed");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    
    Swal.fire({
      icon: "error",
      title: "Lỗi!",
      text: error.response?.data?.message || "Cập nhật sản phẩm bị lỗi, vui lòng thử lại",
    });
  } finally {
    setLoading(false);
  }
};



  const columns = React.useMemo(
    () => [
      {
        title: "Hình ảnh",
        dataIndex: "productsImages",
        key: "productsImages",
        responsive: ['md'],
        render: (productsImages) => {
          const imageUrl =
            productsImages?.length > 0
              ? productsImages[0].imageUrl
              : "/placeholder.jpg";
          return (
            <img
              src={imageUrl}
              alt="Product"
              className="w-14 h-14 object-cover rounded-lg shadow-sm border border-gray-200"
            />
          );
        },
      },
      {
        title: "Tên",
        dataIndex: "productName",
        key: "productName",
        render: (text) => (
          <span className="font-medium text-gray-800 break-words whitespace-normal">
            {text}
          </span>
        ),
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        responsive: ['sm'],
        render: (price) => (
          <span className="font-medium text-indigo-600 whitespace-nowrap">
            {formatCurrency(price)}
          </span>
        ),
        sorter: (a, b) => a.price - b.price,
        sortOrder,
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        responsive: ['lg'],
        render: (quantity) => (
          <span className="font-semibold text-gray-700 whitespace-nowrap">
            {quantity}
          </span>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "quantity",
        key: "status",
        responsive: ['sm'],
        render: (quantity) =>
          quantity > 0 ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold whitespace-nowrap">
              Còn hàng
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold whitespace-nowrap">
              Hết hàng
            </span>
          ),
      },
      {
        title: "Trạng thái hoạt động",
        dataIndex: "isActive",
        key: "isActive",
        render: (isActive) =>
          isActive ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold whitespace-nowrap">
              Hoạt động
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold whitespace-nowrap">
              Không hoạt động
            </span>
          ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => {
                setEditingProduct(record);
                setShowEditModal(true);
              }}
              disabled={loading}
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 border-blue-500"
            >
              <FaEdit />
            </Button>
            {record.isActive ? (
              <Button
                type="danger"
                onClick={() => handleDelete(record.productId)}
                disabled={loading}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 border-red-500 text-white"
              >
                <FaTrash />
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => handleReactivate(record.productId)}
                disabled={loading}
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 border-green-500 text-white"
              >
                Kích hoạt
              </Button>
            )}
          </Space>
        ),
      },
    ],
    [loading, sortOrder]
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </span>
          Danh sách sản phẩm
        </h1>
        <Button
          type="primary"
          onClick={() => setShowAddModal(true)}
          disabled={loading}
          className="w-full md:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 border-0 h-10 px-5 rounded-lg shadow-md"
        >
          <FaPlus className="mr-2" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 rounded-lg shadow-sm gap-4">
        <div className="text-gray-700 font-medium w-full md:w-auto">
          Tổng số:{" "}
          <span className="text-indigo-600 font-bold">
            {filteredProducts.length}
          </span>{" "}
          sản phẩm
        </div>

        {/* Thêm ô tìm kiếm */}
        <div className="relative w-full md:w-64 mb-4 md:mb-0">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<FaSearch className="text-gray-400" />}
            className="w-full rounded-lg"
            allowClear
          />
        </div>

        <Space className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
          <Select
            className="w-full sm:w-40"
            value={filter}
            onChange={(value) => setFilter(value)}
            options={[
              { value: "All", label: "Tất cả" },
              { value: "Còn hàng", label: "Còn hàng" },
              { value: "Hết hàng", label: "Hết hàng" },
            ]}
            disabled={loading}
          />
          <Select
            className="w-full sm:w-40"
            value={sortOrder || "default"}
            onChange={(value) =>
              setSortOrder(value === "default" ? null : value)
            }
            options={[
              { value: "default", label: "Mặc định" },
              { value: "asc", label: "Giá tăng dần" },
              { value: "desc", label: "Giá giảm dần" },
            ]}
            disabled={loading}
          />
        </Space>
      </div>

      <div className="bg-white p-2 md:p-6 rounded-xl shadow-md overflow-x-auto">
        <Table
          columns={columns}
          dataSource={displayedProducts}
          pagination={{
            pageSize: productsPerPage,
            total: filteredProducts.length,
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
            style: { marginTop: "1rem" },
            className: "bg-gray-50 p-3 rounded-lg",
            responsive: true,
            size: "small",
          }}
          rowKey="productId"
          loading={loading}
          className="border-spacing-y-3"
          rowClassName="hover:bg-gray-50 transition-colors"
          scroll={{ x: true }}
          size="middle"
        />
      </div>

      {/* Edit Modal */}
      <Modal
        title={
          <div className="text-xl font-bold text-gray-800 border-b pb-3">
            Chỉnh sửa sản phẩm
          </div>
        }
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
        destroyOnClose={true}
        maskClosable={!loading}
        closable={!loading}
        width={700}
        bodyStyle={{ padding: 0 }}
        className="rounded-lg overflow-hidden"
      >
        {editingProduct && (
          <ProductForm
            key={editingProduct.productId}
            item={editingProduct}
            onSubmit={handleSaveEdit}
            onCancel={() => setShowEditModal(false)}
            skinTypes={skinTypes}
            categories={categories}
            loading={loading}
            handleImageUpload={handleImageUpload}
          />
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        title={
          <div className="text-xl font-bold text-indigo-800 border-b pb-3">
            + Thêm sản phẩm mới
          </div>
        }
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        width={700}
        destroyOnClose={true}
        maskClosable={!loading}
        closable={!loading}
        bodyStyle={{ padding: 0 }}
        className="rounded-lg overflow-hidden"
      >
        <ProductForm
          isAddMode={true}
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddModal(false)}
          skinTypes={skinTypes}
          categories={categories}
          loading={loading}
          handleImageUpload={handleImageUpload}
          rules={[
            { required: true, message: "Vui lòng nhập tên sản phẩm!" },
            { max: 100, message: "Tên sản phẩm không được vượt quá 100 ký tự" },
          ]}
        />
      </Modal>
    </div>
  );
};

export default Products;
