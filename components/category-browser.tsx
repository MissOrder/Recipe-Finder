"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: string
  name: string
  icon: string
  count: number
}

interface CategoryBrowserProps {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
}

export function CategoryBrowser({ categories, selectedCategory, onCategorySelect }: CategoryBrowserProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Browse Categories</h3>
        <div className="space-y-2">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onCategorySelect(category.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-orange-100 border-2 border-orange-300"
                  : "hover:bg-gray-50 border-2 border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium capitalize">{category.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </div>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
