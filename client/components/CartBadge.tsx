"use client"
import useCartStore from "@/store/useCartStore"
import { ShoppingCart } from "lucide-react"

const CartBadge = () => {
  const { items, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()

  return (
    <div className="relative inline-block">
      {/* Cart Icon */}
     <ShoppingCart/>
      
      {/* Badge */}
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-5">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </div>
  )
}

export default CartBadge