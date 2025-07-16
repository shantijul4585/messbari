import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Swiper core styles
import "swiper/css/pagination";
import { Pagination,Autoplay  } from "swiper/modules"; // optional

const MEMBERS = [
  [401, ["Toha", "Nishan"]],
  [402, ["Rana", "Shahadat"]],
  [403, ["Nuhash", "Murtuza"]],
  [404, ["Nurul", "Nishad"]],
  [405, ["Helal", "Jahid"]],
  [406, ["Mistu"]],
  [407, ["Nashim", "Afzal"]],
];

export default function Home() {
  return (
    <div className="p-6 space-y-6">

      {/* 🔁 Image Slider */}
     <Swiper
  pagination={{ clickable: true }}
  autoplay={{ delay: 2000, disableOnInteraction: false }} // ⏱ 2 second
  modules={[Pagination, Autoplay]} // 👈 include Autoplay
  className="rounded-xl shadow overflow-hidden"
  spaceBetween={10}
  slidesPerView={1}
>
  <SwiperSlide>
    <img
      src="https://i.postimg.cc/4xqF4FhT/slider2-1-1920x900.jpg"
      alt="Slide 1"
      className="w-full h-80 "
    />
  </SwiperSlide>
  <SwiperSlide>
    <img
      src="https://i.postimg.cc/Qx78xcvv/Untitled-design-1.png"
      alt="Slide 2"
      className="w-full h-80 "
    />
  </SwiperSlide>
  <SwiperSlide>
    <img
      src="https://i.postimg.cc/NfnT2hGL/slider6-1920x900.jpg"
      alt="Slide 3"
      className="w-full h-80 "
    />
  </SwiperSlide>
</Swiper>
      {/* 🏠 Welcome Section */}
      <div className="text-center bg-gray-50 rounded-xl shadow p-4">
        <h2 className="heading-lg">Welcome, Messbari Family!</h2>
        <p className="text-muted">
          Everything you need—rooms, rent, meals & expenses—at a glance.
        </p>
      </div>

      {/* 👥 Members Summary */}
      <div className="text-center text-lg font-bold bg-gray-50 text-blue-600 rounded-xl shadow p-4">
        <h1>Total Members: 13</h1>
      </div>

      {/* 🏠 Room & Members List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
        {MEMBERS.map(([room, names]) => (
          <div
            key={room}
            className="text-center bg-gray-50 rounded-xl shadow p-4"
          >
            <p className="text-lg font-bold text-blue-600">
              {names.join(" & ")}
            </p>
            <p className="text-sm text-muted">Room: {room}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
