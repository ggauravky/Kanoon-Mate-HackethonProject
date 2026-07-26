import { motion } from 'framer-motion'

export default function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => setSelectedCategory('')}
        className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
          selectedCategory === ''
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
      >
        All Categories
      </button>

      {categories.map((category) => {
        const isSelected = selectedCategory === category
        return (
          <motion.button
            key={category}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelectedCategory(category)}
            className={`shrink-0 rounded-2xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {category}
          </motion.button>
        )
      })}
    </div>
  )
}
