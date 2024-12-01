import React from 'react';
import BannersList from './_components/banners-list';
import CategoryList from './_components/category-list';
import ProductsList from './_components/products-list';
import SectionsList from './_components/sections-list';

export default function MainPage() {
  return (
    <div className="flex h-full w-full flex-col gap-2 sm:gap-4">
      {/* Banner */}
      <BannersList />

      {/* Categories */}
      <CategoryList />

      {/* Sections */}
      <SectionsList />

      {/* Products */}
      <ProductsList />
    </div>
  );
}
