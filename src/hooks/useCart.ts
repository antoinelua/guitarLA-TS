import { useEffect, useState, useMemo } from "react"
import { db } from '../data/db.js'
import type { CartItem, Guitar } from "../types/types.ts"

const useCart = () => {

    const initialCart = (): CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEMS = 5
    const MIN_ITEMS = 0

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item: Guitar) {
        const itemExists = cart.findIndex((guitar) => guitar.id === item.id)
        if (itemExists >= 0) {
            if (cart[itemExists].quantity >= MAX_ITEMS) return
            const updatedCart = [...cart]
            updatedCart[itemExists].quantity++
            setCart(updatedCart)
        } else {
            const newItem: CartItem = { ...item, quantity: 1 }
            setCart([...cart, newItem])
        }
    }

    function removeFromCart(id: Guitar['id']) {
        setCart((prevCart) => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id: Guitar['id']) {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })

        setCart(updatedCart)
    }

    function decreseQuantity(id: Guitar['id']) {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity > MIN_ITEMS) { // Verificar si la cantidad es mayor que 1
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })

        setCart(updatedCart)
    }


    function clearCart() {
        setCart([])
    }


    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }

}

export default useCart