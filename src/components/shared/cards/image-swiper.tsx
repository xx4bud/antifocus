import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useRef } from "react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";

interface SimpleMediaData {
  id: string;
  url: string;
}

interface ImageSwiperProps {
  media: SimpleMediaData[];
  alt: string;
}

export function ImageSwiper({
  media,
  alt,
}: ImageSwiperProps) {
  const swiperRef = useRef<any>(null);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
    }
  }, [swiperRef]);

  return (
    <div
    className="relative aspect-square size-auto"
      onMouseEnter={() =>
        swiperRef.current.swiper.autoplay.start()
      }
      onMouseLeave={() => {
        swiperRef.current.swiper.autoplay.stop();
        swiperRef.current.swiper.slideTo(0);
      }}
    >
      <Swiper
        ref={swiperRef}
        modules={[Autoplay]}
        autoplay={{ delay: 1000 }}
      >
        {media.map((img) => (
          <SwiperSlide key={img.id}>
            <Image
              src={img.url || "/placeholder.svg"}
              alt={alt}
              loading="eager"
              decoding="sync"
              width={400}
              height={400}
              quality={50}
              sizes="(max-width: 768px) 100vw, 400px"
              className="aspect-square h-full w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
