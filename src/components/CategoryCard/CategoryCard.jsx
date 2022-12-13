import React from 'react'

const CategoryCard = ({category}) => {
  return (
    <div class="sm:w-5/6 lg:w-5/6 xl:w-5/6 mt-20 px-3 py-4  border-b-4 border-red-500 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800  dark:hover:bg-gray-700">
        <div className='flex items-center justify-between'>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{category}</h5>
            <button type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-1.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Purple</button>    
        </div>
        <p class="font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>         
    </div>    
  )
}

export default CategoryCard