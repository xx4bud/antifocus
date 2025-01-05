import React from 'react'
import CampaignsList from './campaigns-list'
import CategoriesList from './categories-list'
import ProductList from './product-list'

export default function HomeClient() {
  return (
    <div className='flex flex-col m-3 w-full h-full '>
        <CampaignsList/>
        <CategoriesList/>
        <ProductList/>
    </div>
  )
}
