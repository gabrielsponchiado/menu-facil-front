"use client";

interface CategoryFiltersProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export function CategoryFilters({ categories, activeCategory, setActiveCategory }: CategoryFiltersProps) {
  return (
    <div className="px-6 mb-8 mt-4">
      <div className="grid grid-cols-4 gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`py-3 px-2 rounded-lg text-xs font-medium transition-all ${
              activeCategory === cat 
              ? "bg-blue-500 text-white" 
              : "bg-[#1c1c1e] text-zinc-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
