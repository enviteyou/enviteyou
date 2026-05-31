import React from 'react'
const CATEGORIES = [
  "All",
  "Hindu Weddings",
  "Christian Weddings",
  "Sikh Weddings",
  "Muslim Weddings",
  "South-Indian Weddings",
  "Save the date",
];
function Category({ activeCategory = "All", onCategoryChange }) {
  return (
    <div className="mx-auto w-full max-w-6xl border-t border-black/10 px-5 py-6 md:px-10">
      <p className="text-left text-sm font-medium text-black/60 md:text-center">Select Category</p>
      <div className="mt-4 flex flex-wrap justify-start gap-2 md:justify-center md:gap-3">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange?.(category)}
              className={`inline-flex w-fit shrink-0 whitespace-nowrap rounded px-4 py-2 text-sm font-medium transition duration-300 md:px-5 md:py-2.5 md:text-base ${isActive
                  ? "bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                  : "bg-white text-black/85 shadow-[0_10px_24px_rgba(0,0,0,0.06)] ring-1 ring-black/8 hover:-translate-y-0.5 hover:ring-black/15"
                }`}
            >
              {category}

            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Category