import React, { createContext, useState, useEffect } from 'react'
import api from '../api/api'

export const FoodContext = createContext()

export const FoodProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [menuRes, catRes] = await Promise.all([
        api.get('/menu'),
        api.get('/categories')
      ])
      
      setMenuItems(menuRes.data)
      setCategories(catRes.data)
    } catch (err) {
      console.error("Data fetch error:", err)
      setError(err.response?.data?.message || err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  return (
    <FoodContext.Provider value={{ menuItems, categories, isLoading, error, refreshData: fetchData }}>
      {children}
    </FoodContext.Provider>
  )

}
