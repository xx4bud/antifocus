import { Card } from '@/components/ui/card';
import React from 'react';
import ProductsItem from './products-item';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

const products = [
  {
    id: 1,
    image:
      'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    name: 'Jam Tangan Mewah dengan Desain Modern dan Fitur Canggih yang Sangat Populer',
    price: 100000,
  },
  {
    id: 2,
    image:
      'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    name: 'Iphone 15 Pro Max 128GB dengan Fitur Kamera yang Canggih dan Baterai yang Tahan Lama',
    price: 100000,
  },
  {
    id: 3,
    image:
      'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    name: 'Mouse Gaming Logitech G502 Hero dengan Sensor yang Akurat dan Tombol yang Responsif',
    price: 100000,
  },
  {
    id: 4,
    image:
      'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    name: 'Keyboard Gaming Logitech G915 dengan Fitur Wireless dan Tombol yang Customizable',
    price: 100000,
  },
  {
    id: 5,
    image:
      'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    name: 'Mouse Gaming Logitech G502 Hero dengan Sensor yang Akurat dan Tombol yang Responsif',
    price: 100000,
  },
  {
    id: 6,
    image:
      'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    name: 'Baju Gaming Logitech G502 Hero dengan Desain yang Keren dan Nyaman Dipakai',
    price: 100000,
  },
  {
    id: 7,
    image:
      'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    name: 'Kabel USB Type C 100W dengan Kemampuan Pengisian yang Cepat dan Aman',
    price: 100000,
  },
  {
    id: 8,
    image:
      'https://cdn.pixabay.com/photo/2023/02/08/06/29/fashion-7775824_640.jpg',
    name: 'Case Hp Type C 100W dengan Desain yang Keren dan Kemampuan Pengisian yang Cepat',
    price: 100000,
  },
];

const SectionsOne = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Flash Sale</h1>
        <div className="-mr-1 ms-auto flex items-center gap-1">
          <span className="-mr-1 text-sm text-muted-foreground">View All</span>
          <ChevronRight className="size-5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1" key={products[0].id}>
        <Card className="overflow-hidden shadow-none">
          <Image
            src={products[0].image}
            alt={products[0].name}
            className="aspect-[4/5] h-auto w-full object-cover"
            width={200}
            height={250}
          />
        </Card>
        <Card className="overflow-hidden shadow-none">
          <Image
            src={products[1].image}
            alt={products[1].name}
            className="aspect-[4/5] h-auto w-full object-cover"
            width={200}
            height={250}
          />
        </Card>
      </div>
    </div>
  );
};

const SectionsTwo = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Best Seller</h1>
        <div className="-mr-1 ms-auto flex items-center gap-1">
          <span className="-mr-1 text-sm text-muted-foreground">View All</span>
          <ChevronRight className="size-5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1" key={products[0].id}>
        <Card className="overflow-hidden shadow-none">
          <Image
            src={products[2].image}
            alt={products[2].name}
            className="aspect-[4/5] h-auto w-full object-cover"
            width={200}
            height={250}
          />  
        </Card>
        <Card className="overflow-hidden shadow-none">
          <Image
            src={products[3].image}
            alt={products[3].name}
            className="aspect-[4/5] h-auto w-full object-cover"
            width={200}
            height={250}
          />
        </Card>
      </div>
    </div>
  );
};

export default function SectionsList() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <Card className="w-full overflow-hidden p-2 shadow-none">
        <SectionsOne />
      </Card>
      <Card className="w-full overflow-hidden p-2 shadow-none">
        <SectionsTwo />
      </Card>
    </div>
  );
}
