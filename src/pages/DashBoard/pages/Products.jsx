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
} from "antd";
import productApi from "../../../services/product";
const { TextArea } = Input;

const Products = () => {
  const { products, skinTypes, categories, setProducts } = useDataContext();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [filter, setFilter] = React.useState("All");
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const productsPerPage = 5;
  const [newProduct, setNewProduct] = React.useState({
    productName: "",
    price: 0,
    quantity: 0,
    description: "",
    ingredient: "",
    categoryId: 1,
    skinTypeId: 1,
  });
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
    try {
      const response = await productApi.deleteProduct(productId);
      if (response.status >= 200 && response.status < 300) {
        setProducts((prev) => prev.filter((p) => p.productId !== productId));
        message.success(`Product delete successfully`);
      } else {
        message.error(`Failed to delete product`);
      }
    } catch (error) {
      console.error(`Error delete product:`, error);
      message.error(`Failed to delete product`);
    }
  };
  //chua lam
  const handleSaveEdit = async (values) => {
    try {
      const response = await productApi.editProduct(values.productId, values);
      if (response.status >= 200 && response.status < 300) {
        setProducts((prev) =>
          prev.map((p) => (p.productId === values.productId ? values : p))
        );
        setShowEditModal(false);
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        throw new Error("Cập nhật sản phẩm bị lỗi");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Cập nhật sản phẩm bị lỗi");
    }
  };

  const handleAddProduct = async (values) => {
    try {
      const response = await productApi.createProduct(values);
      console.log(response);
      setProducts((prev) => [...prev, response]);
      setShowAddModal(false);
      setNewProduct({
        productName: "",
        price: 0,
        quantity: 1000,
        description: "",
        ingredient: "",
        categoryId: 1,
        skinTypeId: 1,
      });
      message.success("Thêm sản phẩm thành công!");
    } catch (error) {
      console.error("Error adding product:", error);
      message.error("Lỗi thêm sản phẩm");
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image, record) => (
        <img
          src={image}
          alt={record.productName}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
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
          >
            <FaEdit />
          </Button>
          <Button type="danger" onClick={() => handleDelete(record.productId)}>
            <FaTrash />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh sách sản phẩm</h1>
        <Button type="primary" onClick={() => setShowAddModal(true)}>
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
            onChange: (page) => setCurrentPage(page),
            style: { marginTop: "1rem" },
          }}
          rowKey="productId"
        />
      </div>

      <Modal
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
        destroyOnClose={true} // Reset form khi đóng modal
      >
        {editingProduct && (
          <ProductForm
            key={editingProduct.productId} // Đảm bảo form re-render khi chỉnh sản phẩm mới
            item={editingProduct}
            onSubmit={async (values) => {
              await handleSaveEdit(values); // Gọi API để cập nhật sản phẩm
            }}
            onCancel={() => setShowEditModal(false)}
            skinTypes={skinTypes}
            categories={categories}
          />
        )}
      </Modal>

      <Modal
        title=""
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        width="50%" // Reduced to half the screen width
      >
        <ProductForm
          isAddMode={true}
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddModal(false)}
          skinTypes={skinTypes}
          categories={categories}
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
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (item) form.setFieldsValue(item);
  }, [item, form]);

  const onFinish = (values) => {
    console.log(values);
    onSubmit(values);
    form.resetFields();
  };

  const modalBodyStyle = {
    maxHeight: "60vh", // Set a maximum height for the scrollable area
    overflowY: "auto", // Enable vertical scrolling
    padding: "16px", // Add padding for better readability
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <h2 className="text-xl font-semibold mb-4">
        {isAddMode ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
      </h2>
      <div style={modalBodyStyle}>
        <Form.Item
          label="Tên sản phẩm"
          name="productName"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giá"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value >= 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Giá phải là số dương!");
                  },
                }),
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                min={0} // Prevent negative values
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số lượng"
              name="quantity"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value >= 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Số lượng phải là số dương!");
                  },
                }),
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                min={0} // Prevent negative values
              />
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
          />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Thành phần" name="ingredient">
          <TextArea rows={2} />
        </Form.Item>
      </div>
      <Form.Item style={{ textAlign: "right" }}>
        <Space>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            {isAddMode ? "Thêm" : "Lưu"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default Products;
