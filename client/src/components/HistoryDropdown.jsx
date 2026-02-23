import { forwardRef } from "react"

const HistoryDropdown = forwardRef(({ history, onClearHistory, onHistoryClick, onHighlightedIndex, 
  onDeleteHistory, highlightedIndex, showHistory, className}, ref) => {
  if(showHistory == false) return null;
  if (!history || history.length == 0) return null;

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${className}`}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 bg-neutral-50/50">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">搜索历史</span>
        <button
          type="button"
          onClick={onClearHistory}
          className="text-xs text-neutral-400 hover:text-red-500 transition-colors font-medium"
        >
          清空
        </button>
      </div>
      <ul className="max-h-48 overflow-y-auto">
        {history.map((item, index) => (
          <li
            key={item}
            className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${index === highlightedIndex
              ? 'bg-neutral-100'
              : 'hover:bg-neutral-50'
              }`}
            onClick={() => onHistoryClick(item)}
            onMouseEnter={() => onHighlightedIndex(index)}
          >
            <span className="text-neutral-400 text-sm">🕐</span>
            <span className="flex-1 text-neutral-700 text-sm font-medium">{item}</span>
            <button
              type="button"
              onClick={(e) => onDeleteHistory(e, item)}
              className="w-6 h-6 flex items-center justify-center rounded-full text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-all text-xs"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
})

export default HistoryDropdown