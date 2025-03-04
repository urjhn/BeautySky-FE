import { AiFillHome, AiOutlineInfoCircle } from "react-icons/ai";
import {
  FaBoxOpen,
  FaBlogger,
  FaPhoneAlt,
  FaQuestionCircle,
} from "react-icons/fa";

export const NavbarMenu = [
  {
    id: 1,
    title: "Trang chính",
    link: "/#",
    icon: <AiFillHome className="text-xl text-blue-600" />,
  },
  {
    id: 2,
    title: "Giới thiệu",
    link: "/aboutus",
    icon: <AiOutlineInfoCircle className="text-xl text-green-600" />,
  },
  {
    id: 3,
    title: "Sản phẩm",
    link: "/product",
    icon: <FaBoxOpen className="text-xl text-orange-600" />,
  },
  {
    id: 4,
    title: "Blogs",
    link: "/blog",
    icon: <FaBlogger className="text-xl text-red-600" />,
  },
  {
    id: 5,
    title: "Liên lạc",
    link: "/contact",
    icon: <FaPhoneAlt className="text-xl text-purple-600" />,
  },
  {
    id: 6,
    title: "Test Skin Type",
    link: "/quizz",
    icon: <FaQuestionCircle className="text-xl text-pink-600" />,
  },
];
