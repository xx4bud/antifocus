import Image from 'next/image';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import CategoryItem from './category-item';

const category = [
  {
    id: 1,
    src: 'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    alt: 'Category 1',
  },
  {
    id: 2,
    src: 'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    alt: 'Category 2',
  },
  {
    id: 3,
    src: 'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    alt: 'Category 3',
  },
  {
    id: 4,
    src: 'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    alt: 'Category 4',
  },
  {
    id: 5,
    src: 'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    alt: 'Category 5',
  },
  {
    id: 6,
    src: 'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    alt: 'Category 6',
  },
  {
    id: 7,
    src: 'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    alt: 'Category 7',
  },
  {
    id: 8,
    src: 'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    alt: 'Category 8',
  },
];

export default function CategoryList() {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full overflow-hidden rounded-lg">
      <CarouselContent>
        {category.map((item, index) => (
          <CarouselItem
            key={index}
            className="lg:basis-1/8 basis-1/3 overflow-hidden rounded-lg px-1 sm:basis-1/4 md:basis-1/6">
            <CategoryItem item={item} index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
