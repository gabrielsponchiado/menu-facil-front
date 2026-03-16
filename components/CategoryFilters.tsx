"use client";

interface CategoryFiltersProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export function CategoryFilters({ categories, activeCategory, setActiveCategory }: CategoryFiltersProps) {
  const firstRow = categories.slice(0, 3);
  const secondRow = categories.slice(3);

  return (
    <div className="px-6 mb-8 mt-4 space-y-3">
      {/* primeira linha */}
      <div className="grid grid-cols-3 gap-3">
        {firstRow.map((cat) => (
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

      {/* segunda linha */}
      {secondRow.length > 0 && (
        <div className="flex justify-center gap-3">
          {secondRow.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`py-3 px-2 rounded-lg text-xs font-medium transition-all w-[calc(33.333%-6px)] ${
                activeCategory === cat
                  ? "bg-blue-500 text-white"
                  : "bg-[#1c1c1e] text-zinc-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}