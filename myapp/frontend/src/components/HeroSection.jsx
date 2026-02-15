// src/components/HeroSection.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade, Parallax } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/parallax";

export default function HeroSection() {
  const slides = [
    {
      title: "Discover New Worlds",
      desc: "Explore hand-picked book recommendations tailored just for you.",
      img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    },
    {
      title: "Expand Your Knowledge",
      desc: "The best non-fiction books to inspire growth and wisdom.",
      img: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    },
    {
      title: "Get Lost in Stories",
      desc: "Dive into captivating novels and timeless classics.",
      img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
    },
  ];

  return (
    <section className="relative w-full h-screen">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade, Parallax]}
        effect="fade"
        loop={true}
        speed={1200}
        parallax={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {/* Background with Zoom Animation */}
            <div
              className="h-screen w-full bg-cover bg-center relative animate-zoomBg"
              style={{ backgroundImage: `url(${slide.img})` }}
              data-swiper-parallax="-20%"
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>

              {/* Animated Text */}
              <div className="relative z-10 flex items-center justify-center h-full text-center px-6">
                <div className="space-y-6">
                  <h1
                    className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg animate-fadeDown"
                    data-swiper-parallax="-300"
                  >
                    {slide.title}
                  </h1>
                  <p
                    className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto animate-fadeUp"
                    data-swiper-parallax="-200"
                  >
                    {slide.desc}
                  </p>
                  <button
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition transform duration-300 animate-pulseBtn"
                    data-swiper-parallax="-100"
                  >
                    Explore Now
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes zoomBg {
          from {
            transform: scale(1.1);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-zoomBg {
          animation: zoomBg 5s ease-in-out infinite alternate;
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeDown {
          animation: fadeDown 1s ease forwards;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeUp {
          animation: fadeUp 1.2s ease forwards;
        }

        @keyframes pulseBtn {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulseBtn {
          animation: pulseBtn 2s infinite;
        }
      `}</style>
    </section>
  );
}
