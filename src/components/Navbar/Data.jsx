import { AiFillHome, AiOutlineInfoCircle } from "react-icons/ai";
import {
  FaProductHunt,
  FaBlogger,
  FaPhone,
  FaQuestion,
  FaTachometerAlt,
} from "react-icons/fa";

export const NavbarMenu = [
  {
    id: 1,
    title: "Trang chính",
    link: "/#",
    icon: <AiFillHome />,
  },
  {
    id: 2,
    title: "Giới thiệu",
    link: "/aboutus",
    icon: <AiOutlineInfoCircle />,
  },
  {
    id: 3,
    title: "Sản phẩm",
    link: "/product",
    icon: <FaProductHunt />,
  },
  {
    id: 4,
    title: "Blogs",
    link: "/blog",
    icon: <FaBlogger />,
  },
  {
    id: 5,
    title: "Liên lạc",
    link: "/contact",
    icon: <FaPhone />,
  },
  {
    id: 6,
    title: "Test Skin Type",
    link: "/quizz",
    icon: <FaQuestion />,
  },
];

// export const skinTypeOptions = [
//   { value: "All", label: "Tất cả" },
//   { value: "Oily_Skin", label: "Da dầu" },
//   { value: "Dry_Skin", label: "Da khô" },
//   { value: "Normal_Skin", label: "Da thường" },
//   { value: "Combination_Skin", label: "Da hỗn hợp" }
// ];

// export const categoryOptions = [
//   { value: "All", label: "Tất cả" },
//   { value: "Makeup_Remover", label: "Tẩy trang" },
//   { value: "Cleanser", label: "Sữa rửa mặt" },
//   { value: "Toner", label: "Toner" },
//   { value: "Serum", label: "Serum" },
//   { value: "Acne_Treatment", label: "Kem trị mụn" },
//   { value: "Sunscreen", label: "Kem chống nắng" }
// ];
