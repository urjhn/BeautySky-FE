import React from "react";
import Slider from "react-slick";

const TestimonialData = [
  {
    id: 1,
    name: "Maria",
    text: "Tôi đã mua Serum Dưỡng Da Sky Beauty và rất hài lòng với kết quả! Làn da của tôi sáng hơn và các vết thâm đã mờ đi. Sản phẩm của Sky Beauty thực sự hiệu quả!",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Giovanni",
    text: "Kem Dưỡng Ban Đêm Sky Beauty thật tuyệt vời! Tôi thức dậy với làn da mềm mại và đủ ẩm. Tôi khuyên mọi người nên dùng! Sky Beauty đã trở thành thương hiệu yêu thích của tôi.",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Sofia",
    text: "Mặt Nạ Làm Sạch Sky Beauty thực sự là cứu tinh cho làn da dầu của tôi. Tôi sử dụng mỗi tuần một lần và lỗ chân lông đã thu nhỏ đáng kể. Tôi rất thích Sky Beauty!",
    img: "https://picsum.photos/104/104",
  },
  {
    id: 5,
    name: "Luca",
    text: "Toner Làm Sạch Sky Beauty là sản phẩm hoàn hảo để hoàn thiện quy trình làm sạch da của tôi. Nó giúp da tôi luôn tươi mát và săn chắc. Sky Beauty đã trở thành sản phẩm không thể thiếu trong quy trình chăm sóc da của tôi.",
    img: "https://picsum.photos/103/103",
  },
];

const Testimonials = () => {
  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div>
        {/* header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-BLACK">
            Khách hàng của chúng tôi nói gì
          </p>
          <h1 data-aos="fade-up" className="text-4xl font-bold text-[#6BBCFE]">
            Đánh giá từ khách hàng
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-500">
            Những trải nghiệm thực tế từ những khách hàng yêu thích sản phẩm của
            chúng tôi.
          </p>
        </div>
        {/* Testimonial cards */}
        <div data-aos="zoom-in">
          <Slider {...settings}>
            {TestimonialData.map((data) => (
              <div className="my-6">
                <div
                  key={data.id}
                  className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl dark:bg-sky-100 bg-[#6BBCFE]/10 relative"
                >
                  <div className="mb-4">
                    <img
                      src={data.img}
                      alt=""
                      className="rounded-full w-20 h-20"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500">{data.text}</p>
                      <h1 className="text-xl font-bold text-black/80 dark:text-light">
                        {data.name}
                      </h1>
                    </div>
                  </div>
                  <p className="text-black/20 text-9xl font-serif absolute top-0 right-0">
                    ,,
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default Testimonials;
