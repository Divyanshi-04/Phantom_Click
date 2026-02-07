import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PageCard from "./PageCard"

export default function PageGallery({ pages }) {
  const [current, setCurrent] = useState(0)

  if (!pages?.length) return null

  const next = () =>
    setCurrent((prev) => (prev + 1) % pages.length)

  const prev = () =>
    setCurrent((prev) => (prev - 1 + pages.length) % pages.length)

  return (
    <div className="w-full space-y-4">

      {/* ✅ CONTROL BAR */}
      <div className="flex justify-between items-center bg-white rounded-xl shadow px-4 py-3 border">

        {/* Prev */}
        <button
          onClick={prev}
          className="
            flex items-center gap-2
            px-4 py-2
            rounded-lg
            bg-gray-100 hover:bg-gray-200
            transition
          "
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        {/* Counter */}
        <span className="text-sm font-medium text-gray-600">
          Page {current + 1} of {pages.length}
        </span>

        {/* Next */}
        <button
          onClick={next}
          className="
            flex items-center gap-2
            px-4 py-2
            rounded-lg
            bg-gray-100 hover:bg-gray-200
            transition
          "
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

      {/* ✅ SLIDER */}
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {pages.map((page, i) => (
            <div key={i} className="w-full shrink-0">
              <PageCard page={page} index={i} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
