import React from 'react'
import Slider from "react-slick";




const TestimonialData = [
  {
    "id": 1,
    "name": "Maria",
    "text": "I bought the Sky Beauty Illuminating Face Serum and I'm thrilled with the results! My skin is brighter and the dark spots have faded.  Sky Beauty's products are really effective!",
    "img": "https://picsum.photos/101/101"
  },
  {
    "id": 2,
    "name": "Giovanni",
    "text": "The Sky Beauty Regenerating Night Cream is fantastic! I wake up with my skin soft and hydrated. I recommend it to everyone! Sky Beauty has become my go-to brand.",
    "img": "https://picsum.photos/102/102"
  },
  {
    "id": 3,
    "name": "Sofia",
    "text": "The Sky Beauty Purifying Face Mask is a real lifesaver for my oily skin. I use it once a week and my pores are less visible. I love Sky Beauty!",
    "img": "https://picsum.photos/104/104"
  },
  {
    "id": 5,
    "name": "Luca",
    "text": "The Sky Beauty Refreshing Face Toner is perfect to complete my cleansing routine. It leaves my skin fresh and toned.  Sky Beauty products are now a staple in my routine.",
    "img": "https://picsum.photos/103/103"
  }
]

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
            What our customers are saying
          </p>
          <h1 data-aos="fade-up" className="text-4xl font-bold text-[#6BBCFE]">
            Testimonials
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-500">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit
            asperiores modi Sit asperiores modi
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

  )
}

export default Testimonials;
