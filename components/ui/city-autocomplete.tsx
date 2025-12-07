import React, { useState, useRef, useEffect } from 'react'
import { Input } from './input'
import type { City } from '@/lib/data/countries'

interface CityAutocompleteProps {
  label: string
  value: string
  onChange: (value: string) => void
  cities: City[]
  placeholder?: string
  disabled?: boolean
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  label,
  value,
  onChange,
  cities,
  placeholder = "Enter city",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Filter cities whenever value or cities change
  useEffect(() => {
    if (value && value.length > 0) {
      const filtered = cities
        .filter(city =>
          city.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 50) // Limit to 50 suggestions for performance
      setFilteredCities(filtered)
      // Only open if this input is focused
      if (isFocused && filtered.length > 0) {
        setIsOpen(true)
      }
    } else {
      setFilteredCities([])
      setIsOpen(false)
    }
  }, [value, cities, isFocused])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (cityName: string) => {
    onChange(cityName.toLowerCase())
    setIsOpen(false)
    setIsFocused(false)
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (filteredCities.length > 0) {
      setIsOpen(true)
    }
  }

  const handleBlur = () => {
    // Delay to allow click on dropdown item
    setTimeout(() => {
      setIsFocused(false)
      setIsOpen(false)
    }, 200)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />

      {isOpen && filteredCities.length > 0 && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            City suggestions ({filteredCities.length})
          </div>
          <ul className="py-1">
            {filteredCities.map((city, idx) => (
              <li
                key={idx}
                onClick={() => handleSelect(city.name)}
                className="px-4 py-2.5 text-base text-slate-700 hover:bg-primary/10 hover:text-primary cursor-pointer dark:text-slate-200 dark:hover:bg-primary/20 dark:hover:text-primary transition-colors"
              >
                {city.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {cities.length > 0 && !disabled && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Start typing to see city suggestions
        </p>
      )}
    </div>
  )
}
