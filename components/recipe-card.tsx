"use client"

import { motion } from "framer-motion"
import { Heart, Clock, Users, Star, ChefHat } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Recipe } from "@/types/recipe"

interface RecipeCardProps {
  recipe: Recipe
  isFavorite: boolean
  onToggleFavorite: () => void
  onClick: () => void
}

export function RecipeCard({ recipe, isFavorite, onToggleFavorite, onClick }: RecipeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
        <div className="relative">
          <motion.img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            onClick={onClick}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
          >
            <Heart className={`h-4 w-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
          </Button>

          {/* Difficulty Badge */}
          <Badge variant="secondary" className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm text-white border-0">
            <ChefHat className="h-3 w-3 mr-1" />
            {recipe.difficulty}
          </Badge>

          {/* Rating */}
          <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-white">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{recipe.rating}</span>
          </div>
        </div>

        <CardContent className="p-4" onClick={onClick}>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-orange-600 transition-colors">
                {recipe.title}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {recipe.cuisine} • {recipe.category}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.cookTime}m</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>

            {/* Dietary Tags */}
            <div className="flex flex-wrap gap-1">
              {recipe.dietary.slice(0, 3).map((diet) => (
                <Badge key={diet} variant="outline" className="text-xs">
                  {diet}
                </Badge>
              ))}
              {recipe.dietary.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{recipe.dietary.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
