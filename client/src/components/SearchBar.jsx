import { forwardRef } from "react";

const SearchBar = forwardRef(({ city, onChange, onKeyDown, onFocus, onSearch, loading}, ref) => {
  return (
    < div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-2 transition-shadow hover:shadow-md relative" >
      <div className="flex items-center">
        <input
          type="text"
          ref={ref}
          className="flex-1 px-5 py-4 bg-transparent text-neutral-800 placeholder-neutral-400 focus:outline-none text-lg"
          placeholder="输入城市名称..."
          value={city}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          autoComplete="new-password"
        />
        <button
          onClick={onSearch}
          disabled={loading}
          className="px-6 py-3 bg-neutral-900 text-white rounded-2xl hover:bg-neutral-800 disabled:bg-neutral-300 transition-all duration-300 font-medium text-sm tracking-wide"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </span>
          ) : (
            '查询'
          )}
        </button>
      </div>
    </div >
  )
})

export default SearchBar