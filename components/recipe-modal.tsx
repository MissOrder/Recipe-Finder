"use client"

import { motion } from "framer-motion"
import { X, Heart, Clock, Users, Star, ChefHat, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Recipe } from "@/types/recipe"
import { useState } from "react"

interface RecipeModalProps {
  recipe: Recipe
  isFavorite: boolean
  onClose: () => void
  onToggleFavorite: () => void
  onAddToShoppingList: (ingredients: string[]) => void
}

export function RecipeModal({ recipe, isFavorite, onClose, onToggleFavorite, onAddToShoppingList }: RecipeModalProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set())

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedIngredients(newChecked)
  }

  const toggleStep = (index: number) => {
    const newChecked = new Set(checkedSteps)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedSteps(newChecked)
  }

  const handleAddToShoppingList = () => {
    const ingredientNames = recipe.ingredients.map((ing) => `${ing.amount} ${ing.unit} ${ing.name}`)
    onAddToShoppingList(ingredientNames)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="w-full h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{recipe.title}</h1>
                <div className="flex items-center space-x-4 text-white/90">
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
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ChefHat className="h-4 w-4" />
                    <span className="capitalize">{recipe.difficulty}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onToggleFavorite}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleAddToShoppingList}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to List
                </Button>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(90vh-16rem)]">
          <div className="p-6 space-y-6">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="capitalize">
                {recipe.cuisine}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {recipe.category}
              </Badge>
              {recipe.dietary.map((diet) => (
                <Badge key={diet} variant="secondary">
                  {diet}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">{recipe.description}</p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Ingredients */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Ingredients</span>
                    <Badge variant="outline">{recipe.ingredients.length} items</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleIngredient(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          checkedIngredients.has(index) ? "bg-green-500 border-green-500" : "border-gray-300"
                        }`}
                      >
                        {checkedIngredients.has(index) && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span
                        className={`flex-1 ${
                          checkedIngredients.has(index) ? "line-through text-gray-500" : "text-gray-900"
                        }`}
                      >
                        <span className="font-medium">
                          {ingredient.amount} {ingredient.unit}
                        </span>{" "}
                        {ingredient.name}
                      </span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Instructions</span>
                    <Badge variant="outline">{recipe.instructions.length} steps</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recipe.instructions.map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleStep(index)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          checkedSteps.has(index) ? "bg-green-500 text-white" : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {checkedSteps.has(index) ? <Check className="h-4 w-4" /> : index + 1}
                      </div>
                      <p
                        className={`flex-1 leading-relaxed ${
                          checkedSteps.has(index) ? "line-through text-gray-500" : "text-gray-900"
                        }`}
                      >
                        {step}
                      </p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Nutrition Info */}
            {recipe.nutrition && (
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{recipe.nutrition.calories}</div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{recipe.nutrition.protein}g</div>
                      <div className="text-sm text-gray-600">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{recipe.nutrition.carbs}g</div>
                      <div className="text-sm text-gray-600">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{recipe.nutrition.fat}g</div>
                      <div className="text-sm text-gray-600">Fat</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  )
}
