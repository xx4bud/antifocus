'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';

const banners = [
  {
    id: 1,
    src: 'https://cdn.pixabay.com/photo/2024/11/08/09/45/facade-9182972_1280.jpg',
    alt: 'banner 1',
  },
  {
    id: 2,
    src: 'https://cdn.pixabay.com/photo/2022/12/20/12/10/santa-7667744_640.jpg',
    alt: 'banner 2',
  },
];

export default function BannersList() {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full overflow-hidden rounded-lg">
      <CarouselContent>
        {banners.map((item, index) => (
          <CarouselItem key={index} className="w-full px-1">
            <Image
              src={item.src}
              alt={item.alt}
              width={1152}
              height={240}
              className="h-60 w-full rounded-lg object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
