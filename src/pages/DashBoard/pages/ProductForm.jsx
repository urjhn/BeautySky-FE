import React, { useState, useEffect } from "react";
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
  Switch,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

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
      // Set initial form values based on the item being edited
      form.setFieldsValue({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        description: item.description || "",
        ingredient: item.ingredient || "",
        categoryId: item.categoryId,
        skinTypeId: item.skinTypeId,
        isActive: item.isActive ?? true,
      });

      // Initialize preview images if editing an existing product
      if (item.productsImages && item.productsImages.length > 0) {
        const existingImages = item.productsImages.map((img, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: "done",
          url: img.imageUrl,
          imageUrl: img.imageUrl,
        }));

        setFileList(existingImages);
      }
    } else {
      // Reset form when no item is provided (for add mode)
      form.resetFields();
      setFileList([]);
    }
  }, [item, form]);

  const onFinish = (values) => {
    // Create a FormData instance for the API call
    const formData = new FormData();

    // Add all form fields to FormData
    formData.append("productName", values.productName);
    formData.append("price", values.price);
    formData.append("quantity", values.quantity);
    formData.append("description", values.description || "");
    formData.append("ingredient", values.ingredient || "");
    formData.append("categoryId", values.categoryId);
    formData.append("skinTypeId", values.skinTypeId);
    formData.append("isActive", values.isActive ?? true);

    // Add the image file if it exists
    // Only add the first file in the list (as your backend seems to handle one image)
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("File", fileList[0].originFileObj);

      // Add image description if needed
      formData.append(
        "imageDescription",
        values.productName || "Product Image"
      );
    }

    // Submit the form with the FormData
    onSubmit(formData);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    // Limit to only one file in this example, remove this if you want multiple files
    const limitedFileList = newFileList.slice(-1);
    setFileList(limitedFileList);
  };

  return (
    <div className="p-4 md:p-6 max-h-[80vh] overflow-y-auto bg-gray-50">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-3 md:space-y-4"
        initialValues={{
          description: "",
          ingredient: "",
          isActive: true,
        }}
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
          label="Trạng thái hoạt động"
          name="isActive"
          valuePropName="checked"
        >
          <Switch
            checkedChildren="Hoạt động"
            unCheckedChildren="Không hoạt động"
            defaultChecked={true}
            className="bg-gray-300"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-700 font-medium">Hình ảnh</span>}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={(file) => {
              // Only allow images
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("Bạn chỉ có thể tải lên tập tin hình ảnh!");
              }

              // Return false to stop auto upload behavior
              return false;
            }}
            onPreview={(file) => {
              const preview = file.url || file.thumbUrl;
              if (preview) {
                const image = new Image();
                image.src = preview;
                const imgWindow = window.open(preview);
                if (imgWindow) {
                  imgWindow.document.write(image.outerHTML);
                }
              }
            }}
          >
            {fileList.length < 1 && (
              <div className="flex flex-col items-center justify-center text-gray-500 hover:text-indigo-600">
                <PlusOutlined className="text-xl mb-1" />
                <div className="text-sm">Tải ảnh lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item className="border-t border-gray-200 pt-4 mb-0 flex justify-end">
          <Space>
            <Button
              onClick={onCancel}
              disabled={loading}
              className="text-gray-700 border-gray-300 hover:text-gray-900 hover:border-gray-400"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              className={`${
                isAddMode
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } border-0`}
            >
              {isAddMode ? "Thêm mới" : "Lưu thay đổi"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductForm;
