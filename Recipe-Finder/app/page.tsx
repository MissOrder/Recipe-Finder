"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Heart, ShoppingCart, Clock, ChefHat, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecipeCard } from "@/components/recipe-card"
import { RecipeModal } from "@/components/recipe-modal"
import { FilterPanel } from "@/components/filter-panel"
import { CategoryBrowser } from "@/components/category-browser"
import { ShoppingList } from "@/components/shopping-list"
import { FavoritesList } from "@/components/favorites-list"
import { mockRecipes, categories } from "@/lib/mock-data"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Recipe } from "@/types/recipe"

export default function RecipeFinderApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filteredRecipes, setFilteredRecipes] = useState(mockRecipes)
  const [favorites, setFavorites] = useLocalStorage<string[]>("recipe-favorites", [])
  const [shoppingList, setShoppingList] = useLocalStorage<string[]>("shopping-list", [])
  const [activeTab, setActiveTab] = useState("discover")
  const [filters, setFilters] = useState({
    dietary: [] as string[],
    cookTime: "all",
    difficulty: "all",
    sortBy: "popularity",
  })

  useEffect(() => {
    let filtered = mockRecipes

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((recipe) => recipe.category === selectedCategory)
    }

    // Dietary filters
    if (filters.dietary.length > 0) {
      filtered = filtered.filter((recipe) => filters.dietary.every((diet) => recipe.dietary.includes(diet)))
    }

    // Cook time filter
    if (filters.cookTime !== "all") {
      const maxTime = Number.parseInt(filters.cookTime)
      filtered = filtered.filter((recipe) => recipe.cookTime <= maxTime)
    }

    // Difficulty filter
    if (filters.difficulty !== "all") {
      filtered = filtered.filter((recipe) => recipe.difficulty === filters.difficulty)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "cookTime":
          return a.cookTime - b.cookTime
        case "rating":
          return b.rating - a.rating
        case "popularity":
        default:
          return b.rating * b.servings - a.rating * a.servings
      }
    })

    setFilteredRecipes(filtered)
  }, [searchQuery, selectedCategory, filters])

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) => (prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]))
  }

  const addToShoppingList = (ingredients: string[]) => {
    setShoppingList((prev) => [...new Set([...prev, ...ingredients])])
  }

  const favoriteRecipes = mockRecipes.filter((recipe) => favorites.includes(recipe.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-orange-100"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <ChefHat className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                RecipeFinder
              </h1>
            </motion.div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:flex">
                {filteredRecipes.length} recipes
              </Badge>
              <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="relative">
                <Filter className="h-4 w-4" />
                {(filters.dietary.length > 0 || filters.cookTime !== "all" || filters.difficulty !== "all") && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full" />
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 relative"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search recipes, ingredients, or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg border-orange-200 focus:border-orange-400"
            />
          </motion.div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block w-80 space-y-6"
          >
            <CategoryBrowser
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />

            <AnimatePresence>
              {showFilters && <FilterPanel filters={filters} onFiltersChange={setFilters} />}
            </AnimatePresence>
          </motion.aside>

          {/* Main Content */}
          <main className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="discover" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Discover
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites ({favorites.length})
                </TabsTrigger>
                <TabsTrigger value="shopping" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Shopping ({shoppingList.length})
                </TabsTrigger>
                <TabsTrigger value="categories" className="lg:hidden flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Browse
                </TabsTrigger>
              </TabsList>

              <TabsContent value="discover" className="space-y-6">
                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                >
                  <Card>
                    <CardContent className="p-4 text-center">
                      <ChefHat className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{mockRecipes.length}</div>
                      <div className="text-sm text-gray-600">Total Recipes</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{favorites.length}</div>
                      <div className="text-sm text-gray-600">Favorites</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {Math.round(filteredRecipes.reduce((acc, r) => acc + r.cookTime, 0) / filteredRecipes.length)}m
                      </div>
                      <div className="text-sm text-gray-600">Avg Cook Time</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {(filteredRecipes.reduce((acc, r) => acc + r.rating, 0) / filteredRecipes.length).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Recipe Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredRecipes.map((recipe, index) => (
                      <motion.div
                        key={recipe.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                      >
                        <RecipeCard
                          recipe={recipe}
                          isFavorite={favorites.includes(recipe.id)}
                          onToggleFavorite={() => toggleFavorite(recipe.id)}
                          onClick={() => setSelectedRecipe(recipe)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {filteredRecipes.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="favorites">
                <FavoritesList
                  recipes={favoriteRecipes}
                  onRecipeClick={setSelectedRecipe}
                  onToggleFavorite={toggleFavorite}
                />
              </TabsContent>

              <TabsContent value="shopping">
                <ShoppingList items={shoppingList} onUpdateItems={setShoppingList} />
              </TabsContent>

              <TabsContent value="categories" className="lg:hidden">
                <CategoryBrowser
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                />
                {showFilters && (
                  <div className="mt-6">
                    <FilterPanel filters={filters} onFiltersChange={setFilters} />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            isFavorite={favorites.includes(selectedRecipe.id)}
            onClose={() => setSelectedRecipe(null)}
            onToggleFavorite={() => toggleFavorite(selectedRecipe.id)}
            onAddToShoppingList={addToShoppingList}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
