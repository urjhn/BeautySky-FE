export const NavbarMenu = [
  {
    id: 1,
    title: "Trang chính",
    link: "/#",
  },
  {
    id: 2,
    title: "Sản phẩm",
    submenu: [
      {
        title: "Loại da",
        items: [
          { name: "Da khô", link: "/product?skinType=dry" },
          { name: "Da thường", link: "/product?skinType=normal" },
          { name: "Da dầu", link: "/product?skinType=oily" },
          { name: "Da hỗn hợp", link: "/product?skinType=combination" },
          { name: "Da trung tính", link: "/product?skinType=neutral" },
        ],
      },
      {
        title: "Loại sản phẩm",
        items: [
          { name: "Tẩy trang", link: "/product?category=cleansing" },
          { name: "Sữa rửa mặt", link: "/product?category=face-wash" },
          { name: "Toner", link: "/product?category=toner" },
          { name: "Serum", link: "/product?category=serum" },
          { name: "Kem trị mụn", link: "/product?category=acne-cream" },
          { name: "Kem chống nắng", link: "/product?category=sunscreen" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Blogs",
    link: "/blog",
  },
  {
    id: 4,
    title: "Liên lạc",
    link: "/contact",
  },
  {
    id: 5,
    title: "Dashboard",
    link: "/dashboard",
  },
];
