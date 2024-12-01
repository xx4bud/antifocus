import { Card } from '@/components/ui/card';
import React from 'react';
import { SectionsOne, SectionsTwo } from './sections-item';

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

export default function SectionsList() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <Card className="w-full overflow-hidden p-2 shadow-none">
        <SectionsOne products={products} />
      </Card>
      <Card className="w-full overflow-hidden p-2 shadow-none">
        <SectionsTwo products={products} />
      </Card>
    </div>
  );
}
