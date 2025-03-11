import React, { useState, useEffect } from "react";
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
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
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

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp";
    if (!isJpgOrPng) {
      message.error("Chỉ có thể tải lên file JPG/PNG/WEBP!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Hình ảnh phải nhỏ hơn 2MB!");
      return false;
    }
    return true;
  };

  const handleImageUpload = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await productImagesAPI.uploadproductImages(formData);

      if (response && response.imageUrl) {
        onSuccess({ imageUrl: response.imageUrl });
        message.success(`${file.name} đã được tải lên thành công`);
      } else {
        throw new Error("Không nhận được URL ảnh từ API");
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      message.error(`${file.name} tải lên thất bại: ${error.message}`);
      onError(error);
    }
  };

  const handleFileChange = ({ file, fileList }) => {
    if (file.status === "done") {
      setFileList(
        fileList.map((item) => ({
          ...item,
          url: item.response?.imageUrl || item.url,
        }))
      );

      const imageUrls = fileList
        .filter(item => item.status === "done")
        .map(item => item.response?.imageUrl || item.url);

      form.setFieldsValue({
        productsImages: imageUrls
      });
    } else {
      setFileList(fileList);
    }
  };

  const onFinish = (values) => {
    const imageUrls = fileList
      .filter(item => item.status === "done")
      .map(item => item.response?.imageUrl || item.url);

    const formData = isAddMode
      ? { ...values, productsImages: imageUrls }
      : { ...values, productId: item?.productId, productsImages: imageUrls };

    onSubmit(formData);
  };

  return (
    <div className="p-4 md:p-6 max-h-[80vh] overflow-y-auto bg-gray-50">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-3 md:space-y-4"
      >
        <Form.Item
          label="Tên sản phẩm"
          name="productName"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input disabled={loading} placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
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
          <Col xs={24} sm={24} md={12}>
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

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
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
          <Col xs={24} sm={24} md={12}>
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

        <Form.Item
          label="Hình ảnh"
          name="productsImages"
          rules={[{ required: true, message: 'Vui lòng tải lên ít nhất 1 hình ảnh!' }]}
        >
          <Upload
            disabled={loading}
            listType="picture-card"
            fileList={fileList}
            onChange={handleFileChange}
            customRequest={handleImageUpload}
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true,
              showDownloadIcon: false,
            }}
            accept=".jpg,.jpeg,.png,.webp"
            multiple={true}
            maxCount={5}
            beforeUpload={beforeUpload}
          >
            {fileList.length < 5 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Thêm ảnh</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <Button 
            onClick={onCancel} 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="w-full sm:w-auto"
          >
            {isAddMode ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProductForm;
