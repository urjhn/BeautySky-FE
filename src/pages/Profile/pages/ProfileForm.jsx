import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Card, message, Spin, Select } from "antd";
import { useAuth } from "../../../context/AuthContext";
import { useUsersContext } from "../../../context/UserContext";
import Swal from "sweetalert2"; // Import SweetAlert
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useNotifications } from "../../../context/NotificationContext";

const { Title } = Typography;

const ProfileForm = () => {
  const { user: authUser, updateAuthUser } = useAuth();
  const { users, fetchUsers, updateUser } = useUsersContext();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [fullAddress, setFullAddress] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      await fetchUsers();
      setIsLoading(false);
    };

    if (users.length === 0) {
      loadUsers();
    } else {
      setIsLoading(false); // Nếu users đã có sẵn thì không cần load lại
    }
  }, [fetchUsers, users.length]);

  useEffect(() => {
    if (authUser && users.length > 0) {
      const foundUser = users.find(
        (u) => u.email?.toLowerCase() === authUser.email?.toLowerCase()
      );

      // Cập nhật form chỉ khi có thay đổi user
      if (
        foundUser &&
        JSON.stringify(foundUser) !== JSON.stringify(currentUser)
      ) {
        setCurrentUser(foundUser);
        form.setFieldsValue(foundUser);
        setIsLoading(false);
      }
    }
  }, [authUser, users, form, currentUser]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        if (!response.ok) {
          throw new Error("Không thể kết nối với API tỉnh thành");
        }
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
        message.error("Không thể tải danh sách tỉnh thành");
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      try {
        setLoadingDistricts(true);
        const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`);
        if (!response.ok) {
          throw new Error("Không thể kết nối với API quận huyện");
        }
        const data = await response.json();
        setDistricts(data.districts || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quận huyện:", error);
        message.error("Không thể tải danh sách quận huyện");
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      return;
    }

    const fetchWards = async () => {
      try {
        setLoadingWards(true);
        const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`);
        if (!response.ok) {
          throw new Error("Không thể kết nối với API xã phường");
        }
        const data = await response.json();
        setWards(data.wards || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách xã phường:", error);
        message.error("Không thể tải danh sách xã phường");
        setWards([]);
      } finally {
        setLoadingWards(false);
      }
    };

    fetchWards();
  }, [selectedDistrict]);

  useEffect(() => {
    if (currentUser && users.length > 0) {
      const foundUser = users.find(
        (u) => u.email?.toLowerCase() === authUser.email?.toLowerCase()
      );

      if (
        foundUser &&
        JSON.stringify(foundUser) !== JSON.stringify(currentUser)
      ) {
        setCurrentUser(foundUser);
        form.setFieldsValue(foundUser);
        
        // Nếu có địa chỉ, phân tích thành các thành phần
        if (foundUser.address) {
          setFullAddress(foundUser.address);
        }
        
        setIsLoading(false);
      }
    }
  }, [authUser, users, form, currentUser]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    form.setFieldsValue(currentUser);
  };

  const handleProvinceChange = (value, option) => {
    setSelectedProvince(option.key);
    setSelectedDistrict(null);
    form.setFieldsValue({ district: undefined, ward: undefined });
    updateFullAddress(option.children, "", "");
  };

  const handleDistrictChange = (value, option) => {
    setSelectedDistrict(option.key);
    form.setFieldsValue({ ward: undefined });
    updateFullAddress(null, option.children, "");
  };

  const handleWardChange = (value, option) => {
    updateFullAddress(null, null, option.children);
  };

  const updateFullAddress = (province, district, ward) => {
    let newAddress = "";
    
    const currentProvince = province || form.getFieldValue("province");
    const currentDistrict = district || form.getFieldValue("district");
    const currentWard = ward || form.getFieldValue("ward");
    
    if (currentWard) newAddress += currentWard;
    if (currentDistrict) newAddress += newAddress ? `, ${currentDistrict}` : currentDistrict;
    if (currentProvince) newAddress += newAddress ? `, ${currentProvince}` : currentProvince;
    
    setFullAddress(newAddress);
    form.setFieldsValue({ address: newAddress });
  };

  const handleFormSubmit = async (values) => {
    try {
      // Hiển thị hộp thoại xác nhận
      const confirmResult = await Swal.fire({
        title: "Xác nhận thay đổi?",
        text: "Bạn có chắc chắn muốn cập nhật thông tin cá nhân?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
        reverseButtons: true,
      });

      if (confirmResult.isConfirmed) {
        // Hiển thị loading khi đang xử lý
        Swal.fire({
          title: "Vui lòng chờ...",
          html: "Đang cập nhật thông tin",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const payload = {
          userName: values.userName,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          address: values.address,
        };

        const apiResult = await updateUser(currentUser.userId, payload);

        if (apiResult?.success) {
          // Đóng loading
          Swal.close();

          // Thông báo thành công
          await Swal.fire({
            title: "Thành công!",
            text: "Thông tin đã được cập nhật",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
          addNotification("Bạn đã cập nhật thông tin thành công! 🎉");

          setCurrentUser((prev) => ({ ...prev, ...payload }));
          updateAuthUser({ ...authUser, ...payload });
          setIsEditing(false);
        } else {
          Swal.close();
          // Thông báo lỗi từ server
          await Swal.fire({
            title: "Lỗi!",
            text: apiResult?.error?.message || "Cập nhật thất bại",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      }
    } catch (error) {
      Swal.close();
      console.error("Error:", error);
      // Thông báo lỗi không xác định
      await Swal.fire({
        title: "Lỗi hệ thống!",
        text: "Đã xảy ra lỗi không mong muốn",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-[80px] sm:pt-[92px] lg:pt-[100px] px-4">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen pt-[80px] sm:pt-[92px] lg:pt-[100px] px-4 text-center">
        <p className="text-gray-500">Không thể tải thông tin người dùng. Vui lòng thử lại sau.</p>
        <Button type="primary" onClick={fetchUsers} className="mt-4">
          Tải lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[80px] sm:pt-[92px] lg:pt-[100px] pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Title
          level={3}
          className="text-center text-[#0272cd] font-bold mb-6 sm:mb-8 relative text-xl sm:text-2xl lg:text-3xl"
        >
          <span className="relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1 after:bg-[#6BBCFE] after:rounded-full">
            Thông Tin Cá Nhân
          </span>
        </Title>

        <Card
          className="shadow-lg hover:shadow-xl transition-shadow duration-300 
                     rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 
                     bg-white overflow-hidden relative"
          style={{
            background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#6BBCFE] opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#0272cd] opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-xl space-y-4 sm:space-y-6 relative z-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Form Items với styling mới */}
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Tên tài khoản</span>
                }
                name="userName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên tài khoản!" },
                ]}
              >
                <Input
                  disabled={!isEditing}
                  className={`rounded-lg ${
                    !isEditing
                      ? "bg-gray-50"
                      : "hover:border-[#6BBCFE] focus:border-[#0272cd]"
                  }`}
                />
              </Form.Item>

              {/* Tên người dùng */}
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
                    Tên người dùng
                  </span>
                }
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên người dùng!" },
                ]}
              >
                <Input
                  disabled={!isEditing}
                  className={`rounded-lg ${
                    !isEditing
                      ? "bg-gray-50"
                      : "hover:border-[#6BBCFE] focus:border-[#0272cd]"
                  }`}
                />
              </Form.Item>

              {/* Email */}
              <Form.Item
                label={<span className="text-gray-700 font-medium">Email</span>}
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                ]}
              >
                <Input
                  disabled={!isEditing}
                  className={`rounded-lg ${
                    !isEditing
                      ? "bg-gray-50"
                      : "hover:border-[#6BBCFE] focus:border-[#0272cd]"
                  }`}
                />
              </Form.Item>

              {/* Số điện thoại */}
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Số điện thoại</span>
                }
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input
                  disabled={!isEditing}
                  className={`rounded-lg ${
                    !isEditing
                      ? "bg-gray-50"
                      : "hover:border-[#6BBCFE] focus:border-[#0272cd]"
                  }`}
                />
              </Form.Item>

              {/* Địa chỉ hiện tại - Luôn hiển thị */}
              <Form.Item
                label={<span className="text-gray-700 font-medium">Địa chỉ hiện tại</span>}
                name="address"
              >
                <Input
                  disabled={true}
                  className="rounded-lg bg-gray-50"
                />
              </Form.Item>

              {/* Chỉ hiển thị các trường địa chỉ và địa chỉ đầy đủ khi đang chỉnh sửa */}
              {isEditing && (
                <>
                  {/* Tỉnh/Thành phố */}
                  <Form.Item
                    label={<span className="text-gray-700 font-medium">Tỉnh/Thành phố</span>}
                    name="province"
                    rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
                  >
                    <Select
                      placeholder="Chọn tỉnh/thành phố"
                      onChange={handleProvinceChange}
                      className="rounded-lg hover:border-[#6BBCFE] focus:border-[#0272cd]"
                      loading={loadingProvinces}
                      showSearch
                      optionFilterProp="children"
                    >
                      {provinces.map((province) => (
                        <Select.Option key={province.code} value={province.name}>
                          {province.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Quận/Huyện */}
                  <Form.Item
                    label={<span className="text-gray-700 font-medium">Quận/Huyện</span>}
                    name="district"
                    rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
                  >
                    <Select
                      disabled={!selectedProvince}
                      loading={loadingDistricts}
                      placeholder={selectedProvince ? "Chọn quận/huyện" : "Vui lòng chọn tỉnh/thành phố trước"}
                      onChange={handleDistrictChange}
                      className="rounded-lg hover:border-[#6BBCFE] focus:border-[#0272cd]"
                      showSearch
                      optionFilterProp="children"
                    >
                      {districts.map((district) => (
                        <Select.Option key={district.code} value={district.name}>
                          {district.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Xã/Phường */}
                  <Form.Item
                    label={<span className="text-gray-700 font-medium">Xã/Phường</span>}
                    name="ward"
                    rules={[{ required: true, message: "Vui lòng chọn xã/phường!" }]}
                  >
                    <Select
                      disabled={!selectedDistrict}
                      loading={loadingWards}
                      placeholder={selectedDistrict ? "Chọn xã/phường" : "Vui lòng chọn quận/huyện trước"}
                      onChange={handleWardChange}
                      className="rounded-lg hover:border-[#6BBCFE] focus:border-[#0272cd]"
                      showSearch
                      optionFilterProp="children"
                    >
                      {wards.map((ward) => (
                        <Select.Option key={ward.code} value={ward.name}>
                          {ward.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Địa chỉ đầy đủ - Chỉ hiển thị khi đang chỉnh sửa và đã chọn đủ thông tin */}
                  {fullAddress && (
                    <Form.Item
                      label={<span className="text-gray-700 font-medium">Địa chỉ mới</span>}
                      className="col-span-2"
                    >
                      <Input
                        disabled
                        value={fullAddress}
                        className="rounded-lg bg-gray-50 text-blue-600 font-medium"
                      />
                    </Form.Item>
                  )}
                </>
              )}

              {/* Trạng thái */}
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Trạng thái</span>
                }
              >
                <Input
                  disabled
                  value={currentUser.isActive ? "Hoạt động" : "Không hoạt động"}
                  className={`rounded-lg ${
                    currentUser.isActive
                      ? "text-green-600 bg-green-50 border-green-200"
                      : "text-red-600 bg-red-50 border-red-200"
                  }`}
                />
              </Form.Item>
            </div>

            {/* Buttons với responsive padding và margin */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
              {!isEditing ? (
                <Button
                  type="primary"
                  onClick={handleEditClick}
                  icon={<EditOutlined />}
                  className="bg-gradient-to-r from-[#6BBCFE] to-[#0272cd] hover:from-[#0272cd] hover:to-[#025aa3] transition-all duration-300 text-base sm:text-lg font-semibold px-4 sm:px-8 py-3 sm:py-5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto"
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleCancelClick}
                    icon={<CloseOutlined />}
                    className="border-gray-400 px-4 sm:px-8 py-3 text-gray-600 hover:bg-gray-100 transition-all duration-300 rounded-lg transform hover:-translate-y-0.5 w-full sm:w-auto order-2 sm:order-1"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    className="bg-gradient-to-r from-[#6BBCFE] to-[#0272cd] hover:from-[#0272cd] hover:to-[#025aa3] text-white px-4 sm:px-8 py-3 font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto order-1 sm:order-2"
                  >
                    Lưu thay đổi
                  </Button>
                </>
              )}
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ProfileForm;
