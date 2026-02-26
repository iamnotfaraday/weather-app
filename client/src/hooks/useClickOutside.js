import { useEffect } from 'react'

export function useClickOutside(ref, handler, excludedRefs = []) {
  useEffect(() => {
    const listener = (e) => {
      const isClickedOutside = 
        !ref.current?.contains(e.target) &&
        !excludedRefs.some(r => r.current?.contains(e.target))
      
      if (isClickedOutside) handler()
    }
    
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler, ...excludedRefs])
}