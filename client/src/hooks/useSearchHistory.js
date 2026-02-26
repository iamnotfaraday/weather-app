import { useState, useEffect } from 'react'

const MAX_HISTORY = 5

export function useSearchHistory(storageKey = 'search_history') {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : []
  })

  const addToHistory = (city) => {
    const trimmed = city.trim()
    if (!trimmed) return
    
    setHistory(prev => {
      const newHistory = [trimmed, ...prev.filter(item => item !== trimmed)].slice(0, MAX_HISTORY)
      localStorage.setItem(storageKey, JSON.stringify(newHistory))
      return newHistory
    })
  }

  const deleteHistory = (item) => {
    setHistory(prev => {
      const newHistory = prev.filter(h => h !== item)
      localStorage.setItem(storageKey, JSON.stringify(newHistory))
      return newHistory
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(storageKey)
  }

  return { history, addToHistory, deleteHistory, clearHistory }
}