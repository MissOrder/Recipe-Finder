"use client"

import { motion } from "framer-motion"
import { Heart, Clock, Users, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Recipe } from "@/types/recipe"

interface FavoritesListProps {
  recipes: Recipe[]
  onRecipeClick: (recipe: Recipe) => void
  onToggleFavorite: (recipeId: string) => void
}

export function FavoritesList({ recipes, onRecipeClick, onToggleFavorite }: FavoritesListProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
        <p className="text-gray-500">Start exploring recipes and save your favorites!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Favorites</h2>
        <Badge variant="secondary">{recipes.length} recipes</Badge>
      </div>

      <div className="grid gap-4">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="flex">
                  <img
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.title}
                    className="w-32 h-32 object-cover"
                    onClick={() => onRecipeClick(recipe)}
                  />
                  <div className="flex-1 p-4" onClick={() => onRecipeClick(recipe)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 hover:text-orange-600 transition-colors">
                          {recipe.title}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize mb-2">
                          {recipe.cuisine} • {recipe.category}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{recipe.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{recipe.cookTime}m</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{recipe.servings}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {recipe.dietary.slice(0, 3).map((diet) => (
                            <Badge key={diet} variant="outline" className="text-xs">
                              {diet}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleFavorite(recipe.id)
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Heart className="h-5 w-5 fill-current" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
