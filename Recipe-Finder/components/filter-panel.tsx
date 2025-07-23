"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterPanelProps {
  filters: {
    dietary: string[]
    cookTime: string
    difficulty: string
    sortBy: string
  }
  onFiltersChange: (filters: any) => void
}

const dietaryOptions = ["vegetarian", "vegan", "gluten-free", "dairy-free", "keto", "paleo", "low-carb", "high-protein"]

const difficultyOptions = [
  { value: "all", label: "All Levels" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
]

const cookTimeOptions = [
  { value: "all", label: "Any Time" },
  { value: "15", label: "Under 15 min" },
  { value: "30", label: "Under 30 min" },
  { value: "60", label: "Under 1 hour" },
]

const sortOptions = [
  { value: "popularity", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "cookTime", label: "Quickest First" },
]

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const updateFilters = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleDietary = (diet: string) => {
    const newDietary = filters.dietary.includes(diet)
      ? filters.dietary.filter((d) => d !== diet)
      : [...filters.dietary, diet]
    updateFilters("dietary", newDietary)
  }

  const clearAllFilters = () => {
    onFiltersChange({
      dietary: [],
      cookTime: "all",
      difficulty: "all",
      sortBy: "popularity",
    })
  }

  const hasActiveFilters = filters.dietary.length > 0 || filters.cookTime !== "all" || filters.difficulty !== "all"

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-orange-600 hover:text-orange-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sort By */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilters("sortBy", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cook Time */}
          <div>
            <label className="text-sm font-medium mb-2 block">Cook Time</label>
            <Select value={filters.cookTime} onValueChange={(value) => updateFilters("cookTime", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cookTimeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm font-medium mb-2 block">Difficulty</label>
            <Select value={filters.difficulty} onValueChange={(value) => updateFilters("difficulty", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Dietary Preferences
              {filters.dietary.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filters.dietary.length}
                </Badge>
              )}
            </label>
            <div className="space-y-2">
              {dietaryOptions.map((diet) => (
                <div key={diet} className="flex items-center space-x-2">
                  <Checkbox
                    id={diet}
                    checked={filters.dietary.includes(diet)}
                    onCheckedChange={() => toggleDietary(diet)}
                  />
                  <label htmlFor={diet} className="text-sm capitalize cursor-pointer flex-1">
                    {diet}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
