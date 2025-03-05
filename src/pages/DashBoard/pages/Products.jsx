import React from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useDataContext } from "../../../context/DataContext";
import {
  Button,
  Table,
  Space,
  Modal,
  Input,
  Form,
  Select,
  InputNumber,
  message,
  Row,
  Col,
  Upload,
} from "antd";
import productApi from "../../../services/product";
import Swal from "sweetalert2";
const { TextArea } = Input;
import { PlusOutlined } from "@ant-design/icons";
import productImagesAPI from "../../../services/productImages";

const Products = () => {
  const { products, skinTypes, categories, setProducts, fetchProduct } =
    useDataContext();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [filter, setFilter] = React.useState("All");
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const productsPerPage = 5;
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
  });

  const handleImageUpload = async (file, fileList, setFieldValue) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ cho phép tải lên hình ảnh");
      return false;
    }

    const newImage = file.originFileObj;
    const reader = new FileReader();

    // Hiển thị preview trước khi upload
    reader.onload = async () => {
      const previewUrl = reader.result;

      // Cập nhật UI trước khi upload ảnh lên server
      setFieldValue("productsImages", [
        ...(fileList || []),
        { imageUrl: previewUrl }, // URL tạm thời để xem trước
      ]);

      // Upload ảnh lên backend và lấy URL từ Amazon S3
      const uploadedImageUrl = await productImagesAPI.uploadproductImages(
        newImage
      );

      if (uploadedImageUrl) {
        // Cập nhật lại state với URL thực tế từ backend
        setFieldValue("productsImages", [
          ...(fileList || []),
          { imageUrl: uploadedImageUrl }, // URL thực từ S3
        ]);
      } else {
        message.error("Tải ảnh lên thất bại!");
      }
    };

    reader.readAsDataURL(newImage);
    return true;
  };

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState(null);

  const filteredProducts = React.useMemo(() => {
    let updatedProducts = [...products];

    if (filter !== "All") {
      updatedProducts = updatedProducts.filter((p) =>
        filter === "Còn hàng" ? p.quantity > 0 : p.quantity === 0
      );
    }

    if (sortOrder) {
      updatedProducts.sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
    }

    return updatedProducts;
  }, [products, filter, sortOrder]);

  const displayedProducts = React.useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      ),
    [currentPage, filteredProducts]
  );
  const handleDelete = async (productId) => {
    console.log("Đang xóa với ID:", productId);


     if (!productId) {
          Swal.fire({
            title: "Lỗi!",
            text: "Không tìm thấy ID sản phẩm",
            icon: "error"
          });
          return;
        }

    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await productApi.deleteProduct(productId);
        if (response.status >= 200 && response.status < 300) {
          setProducts((prev) => prev.filter((p) => p.productId !== productId));
          Swal.fire("Xóa thành công!", "Sản phẩm đã được xóa.", "success");
        } else {
          Swal.fire("Lỗi!", "Không thể xóa sản phẩm.", "error");
        }
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        Swal.fire("Lỗi!", "Đã xảy ra lỗi khi xóa sản phẩm.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveEdit = async (values) => {
    try {
      setLoading(true);

      // Đảm bảo productId có trong editingProduct
      if (!editingProduct || !editingProduct.productId) {
        throw new Error("Missing product ID");
      }

      const dataToSend = {
        ...values,
        productId: editingProduct.productId, // Đảm bảo bạn đang truyền đúng productId
      };

      console.log("Sending data to API:", dataToSend);

      const response = await productApi.editProduct(
        editingProduct.productId,
        dataToSend
      );

      if (response && response.status >= 200 && response.status < 300) {
        const updatedProduct = response.data || response;
        setProducts((prev) =>
          prev.map((p) =>
            p.productId === editingProduct.productId ? updatedProduct : p
          )
        );
        setShowEditModal(false);
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: `Sản phẩm "${values.productName}" đã được cập nhật thành công!`,
        });
        fetchProduct(response);
      } else {
        throw new Error("Edit failed");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Cập nhật sản phẩm bị lỗi, vui lòng thử lại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (values) => {
    try {
      setLoading(true);
      console.log("Adding product with values:", values);

      const response = await productApi.createProduct(values);

      if (
        response &&
        ((response.status >= 200 && response.status < 300) ||
          response.productId)
      ) {
        const newProductData = response.data || response;

        setProducts((prev) => [...prev, newProductData]);
        setShowAddModal(false);
        setNewProduct({
          productId: 0,
          productName: "",
          price: 0,
          quantity: 1000,
          description: "",
          ingredient: "",
          categoryId: 0,
          skinTypeId: 0,
          productsImages: [],
        });

        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: `Sản phẩm "${values.productName}" đã được thêm thành công!`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
        fetchProduct(response);
      } else {
        throw new Error("Add failed");
      }
    } catch (error) {
      console.error("Error adding product:", error);

      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Lỗi thêm sản phẩm, vui lòng thử lại",
        confirmButtonColor: "#d33",
        confirmButtonText: "Thử lại",
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
        render: (productsImages) => {
          const imageUrl =
            productsImages?.length > 0
              ? productsImages[0].imageUrl
              : "/placeholder.jpg"; // Placeholder image if no image available
          return (
            <img
              src={imageUrl}
              alt="Product"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          );
        },
      },
      { title: "Tên", dataIndex: "productName", key: "productName" },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render: (price) => formatCurrency(price),
        sorter: (a, b) => a.price - b.price,
        sortOrder: sortOrder,
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        render: (quantity) => <span className="font-semibold">{quantity}</span>,
      },
      {
        title: "Trạng thái",
        dataIndex: "quantity",
        key: "status",
        render: (quantity) =>
          quantity > 0 ? (
            <span className="text-green-600 font-semibold">Còn hàng</span>
          ) : (
            <span className="text-red-600 font-semibold">Hết hàng</span>
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
            >
              <FaEdit />
            </Button>
            <Button
              type="danger"
              onClick={() => handleDelete(record.productId)}
              disabled={loading}
            >
              <FaTrash />
            </Button>
          </Space>
        ),
      },
    ],
    [loading, sortOrder]
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh sách sản phẩm</h1>
        <Button
          type="primary"
          onClick={() => setShowAddModal(true)}
          disabled={loading}
        >
          <FaPlus className="mr-2" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Space>
          <Select
            className="w-40"
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
            className="w-40"
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

      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <Table
          columns={columns}
          dataSource={displayedProducts}
          pagination={{
            pageSize: productsPerPage,
            total: filteredProducts.length,
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
            style: { marginTop: "1rem" },
          }}
          rowKey="productId"
          loading={loading}
        />
      </div>

      <Modal
        title="Chỉnh sửa sản phẩm"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
        destroyOnClose={true}
        maskClosable={!loading}
        closable={!loading}
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
          />
        )}
      </Modal>

      <Modal
        title="Thêm sản phẩm mới"
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        width="50%"
        destroyOnClose={true}
        maskClosable={!loading}
        closable={!loading}
      >
        <ProductForm
          isAddMode={true}
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddModal(false)}
          skinTypes={skinTypes}
          categories={categories}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

const ProductForm = ({
  item,
  onSubmit,
  onCancel,
  skinTypes,
  categories,
  isAddMode = false,
  loading = false,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (item) {
      // Set initial form values based on the item being edited
      form.setFieldsValue({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        description: item.description,
        ingredient: item.ingredient,
        categoryId: item.categoryId,
        skinTypeId: item.skinTypeId,
        productsImages: item.productsImages,
      });
    } else {
      // Reset form when no item is provided (for add mode)
      form.resetFields();
    }
  }, [item, form]);

  const onFinish = (values) => {
    // Include productId if in edit mode
    const formData = isAddMode
      ? values
      : { ...values, productId: item?.productId };
    console.log("Form submission data:", formData);
    onSubmit(formData);
  };

  const modalBodyStyle = {
    maxHeight: "60vh",
    overflowY: "auto",
    padding: "16px",
  };

  // Add hidden productId field for edit mode
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <h2 className="text-xl font-semibold mb-4">
        {isAddMode ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
      </h2>

      <Form.Item
        label="Tên sản phẩm"
        name="productName"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
      >
        <Input disabled={loading} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} disabled={loading} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} disabled={loading} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Loại sản phẩm"
        name="categoryId"
        rules={[{ required: true, message: "Vui lòng chọn loại sản phẩm!" }]}
      >
        <Select
          options={categories.map((c) => ({
            value: c.categoryId,
            label: c.categoryName,
          }))}
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        label="Loại da"
        name="skinTypeId"
        rules={[{ required: true, message: "Vui lòng chọn loại da!" }]}
      >
        <Select
          options={skinTypes.map((s) => ({
            value: s.skinTypeId,
            label: s.skinTypeName,
          }))}
          disabled={loading}
        />
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <TextArea rows={4} disabled={loading} />
      </Form.Item>

      <Form.Item label="Thành phần" name="ingredient">
        <TextArea rows={2} disabled={loading} />
      </Form.Item>

      {/* Image Upload Field */}
      <Form.Item label="Hình ảnh">
        <Upload
          beforeUpload={(file, fileList) =>
            handleImageUpload(file, fileList, form.setFieldsValue)
          }
          fileList={form.getFieldValue("productsImages")}
          showUploadList={false}
        >
          <Button icon={<PlusOutlined />} disabled={loading}>
            Tải lên hình ảnh
          </Button>
        </Upload>
      </Form.Item>

      <Form.Item style={{ textAlign: "right" }}>
        <Space>
          <Button onClick={onCancel} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            {isAddMode ? "Thêm" : "Lưu"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default Products;
