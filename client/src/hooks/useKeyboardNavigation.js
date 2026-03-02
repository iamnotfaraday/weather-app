import { useState, useCallback, useEffect } from "react"

export function useKeyboardNavigation(items, onSelect, onClose, showHistory) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const handleKeyDown = useCallback((e) => {
    // 只有面板展开时才处理导航键
    console.log("handKeyDown 判断是否处理");
    if (!showHistory || !items || items.length === 0) {
      console.log("handleKeyDown 判断不处理");
      return ;
    }

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
        // 面板展开时，Enter 只选择，不搜索
        if (highlightedIndex >= 0) {
          e.preventDefault()
          onSelect(items[highlightedIndex])
        } else {
          console.log("highlightedIndex < 0, enter无效, 这里调皮的用户通过先输入内容在搜索框, 然后再点击外部关闭了历史面板, 然后再点击搜索框使其聚焦打开面板, 但这里是可以enter的, 因为有了值, 但是用户却没有通过键鼠动作给hightlightedINdex赋值, 但其实这里应该执行搜索对吧");
        }
        break

      case 'Escape':
        onClose()
        break

      default:
        break
    }
  }, [items, highlightedIndex, onSelect, onClose, showHistory])

  // 面板关闭时重置高亮
  useEffect(() => {
    if (!showHistory) {
      setHighlightedIndex(-1)
    }
  }, [showHistory])

  return { highlightedIndex, setHighlightedIndex, handleKeyDown }
}