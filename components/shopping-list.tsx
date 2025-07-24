"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Plus, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ShoppingListProps {
  items: string[]
  onUpdateItems: (items: string[]) => void
}

export function ShoppingList({ items, onUpdateItems }: ShoppingListProps) {
  const [newItem, setNewItem] = useState("")
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  const addItem = () => {
    if (newItem.trim()) {
      onUpdateItems([...items, newItem.trim()])
      setNewItem("")
    }
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onUpdateItems(newItems)

    // Update checked items indices
    const newChecked = new Set<number>()
    checkedItems.forEach((checkedIndex) => {
      if (checkedIndex < index) {
        newChecked.add(checkedIndex)
      } else if (checkedIndex > index) {
        newChecked.add(checkedIndex - 1)
      }
    })
    setCheckedItems(newChecked)
  }

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedItems(newChecked)
  }

  const clearCompleted = () => {
    const newItems = items.filter((_, index) => !checkedItems.has(index))
    onUpdateItems(newItems)
    setCheckedItems(new Set())
  }

  const completedCount = checkedItems.size

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Shopping List</span>
              <Badge variant="outline">{items.length} items</Badge>
            </CardTitle>
            {completedCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearCompleted}
                className="text-green-600 hover:text-green-700 bg-transparent"
              >
                Clear Completed ({completedCount})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new item */}
          <div className="flex space-x-2">
            <Input
              placeholder="Add ingredient..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem()}
              className="flex-1"
            />
            <Button onClick={addItem} disabled={!newItem.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Shopping list items */}
          <div className="space-y-2">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={`${item}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      checkedItems.has(index)
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {checkedItems.has(index) && <Check className="h-3 w-3 text-white" />}
                  </button>

                  <span
                    className={`flex-1 transition-all ${
                      checkedItems.has(index) ? "line-through text-gray-500" : "text-gray-900"
                    }`}
                  >
                    {item}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Your shopping list is empty</p>
              <p className="text-sm">Add ingredients from recipes or manually</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
