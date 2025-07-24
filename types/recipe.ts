export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  cuisine: string
  category: string
  cookTime: number
  servings: number
  difficulty: "easy" | "medium" | "hard"
  rating: number
  dietary: string[]
  ingredients: {
    name: string
    amount: string
    unit: string
  }[]
  instructions: string[]
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}
