import React from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

export default function CategoryItem({
  item,
  index,
}: {
  item: any;
  index: number;
}) {
  return (
    <Card className="flex flex-col items-center gap-2 p-4 shadow-none">
      <Image
        src={item.src}
        alt={item.alt}
        width={200}
        height={200}
        className="aspect-square h-auto w-full rounded-full object-cover"
      />
      <span className="text-sm font-medium">{item.alt}</span>
    </Card>
  );
}
