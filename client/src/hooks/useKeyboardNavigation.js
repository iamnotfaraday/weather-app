import { useState, useCallback } from 'react'

export function useKeyboardNavigation(items, onSelect, onClose) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const handleKeyDown = useCallback((e) => {
    if (!items || items.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : prev
        )
        break

      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : prev
        )
        break

      case 'Enter':
        if (highlightedIndex >= 0) {
          e.preventDefault()
          onSelect(items[highlightedIndex])
        }
        break

      case 'Escape':
        onClose()
        break

      default:
        break
    }
  }, [items, highlightedIndex, onSelect, onClose])

  return { highlightedIndex, setHighlightedIndex, handleKeyDown }
}