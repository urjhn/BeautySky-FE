import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import { FaTrash } from "react-icons/fa";
import { PlusOutlined } from "@ant-design/icons";
import productImagesAPI from "../../../services/productImages";

const ProductForm = ({
  item,
  onSubmit,
  onCancel,
  skinTypes,
  categories,
  isAddMode = false,
  loading = false,
  handleImageUpload,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState([]);

  React.useEffect(() => {
    if (item) {
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
      if (item.productsImages) {
        setFileList(
          item.productsImages.map((url, index) => ({
            uid: `-img-${index}`,
            name: `Image-${index + 1}`,
            status: "done",
            url,
          }))
        );
      }
    } else {
      form.resetFields();
    }
  }, [item, form]);

  const onFinish = (values) => {
    const formData = isAddMode
      ? values
      : { ...values, productId: item?.productId };
    onSubmit(formData);
  };

  const handleFileChange = ({ file, fileList }) => {
    if (file.status === "done") {
      setFileList(
        fileList.map((item) => ({
          ...item,
          url: item.response?.url || item.url, // Cập nhật URL ảnh từ response
        }))
      );
    } else {
      setFileList(fileList);
    }
  };

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto bg-gray-50">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        <Form.Item
          label="Tên sản phẩm"
          name="productName"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input disabled={loading} placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giá"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm!" },
              ]}
            >
              <InputNumber
                className="w-full"
                min={0}
                disabled={loading}
                placeholder="Nhập giá sản phẩm"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số lượng"
              name="quantity"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng sản phẩm!" },
              ]}
            >
              <InputNumber
                className="w-full"
                min={0}
                disabled={loading}
                placeholder="Nhập số lượng sản phẩm"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea
            disabled={loading}
            placeholder="Nhập mô tả sản phẩm"
            rows={3}
          />
        </Form.Item>

        <Form.Item label="Thành phần" name="ingredient">
          <Input.TextArea
            disabled={loading}
            placeholder="Nhập thành phần sản phẩm"
            rows={3}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Danh mục"
              name="categoryId"
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            >
              <Select
                disabled={loading}
                placeholder="Chọn danh mục"
                options={categories.map((category) => ({
                  value: category.categoryId,
                  label: category.categoryName,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Loại da"
              name="skinTypeId"
              rules={[{ required: true, message: "Vui lòng chọn loại da!" }]}
            >
              <Select
                disabled={loading}
                placeholder="Chọn loại da"
                options={skinTypes.map((skinType) => ({
                  value: skinType.skinTypeId,
                  label: skinType.skinTypeName,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Hình ảnh">
          <Upload
            disabled={loading}
            listType="picture-card"
            fileList={fileList}
            onChange={handleFileChange}
            customRequest={handleImageUpload}
            showUploadList
          >
            {fileList.length < 5 && (
              <div>
                <PlusOutlined />
                <div>Thêm ảnh</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <div className="flex justify-end space-x-4">
          <Button onClick={onCancel} disabled={loading}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isAddMode ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProductForm;
