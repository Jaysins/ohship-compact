/**
 * Countries, states, and cities data
 * Using country-state-city package for comprehensive global coverage
 */

import { Country as CSCCountry, State as CSCState, City as CSCCity } from 'country-state-city'

export interface Country {
  code: string
  name: string
  states?: State[]
}

export interface State {
  code: string
  name: string
  countryCode: string
  cities?: City[]
}

export interface City {
  name: string
  stateCode: string
  countryCode: string
}

/**
 * Get all countries
 */
export const getAllCountries = (): Country[] => {
  return CSCCountry.getAllCountries().map(country => ({
    code: country.isoCode,
    name: country.name,
  }))
}

/**
 * Get states for a specific country
 */
export const getStatesOfCountry = (countryCode: string): State[] => {
  return CSCState.getStatesOfCountry(countryCode).map(state => ({
    code: state.isoCode,
    name: state.name,
    countryCode: state.countryCode,
  }))
}

/**
 * Get cities for a specific state in a country
 */
export const getCitiesOfState = (countryCode: string, stateCode: string): City[] => {
  return CSCCity.getCitiesOfState(countryCode, stateCode).map(city => ({
    name: city.name,
    stateCode: city.stateCode,
    countryCode: city.countryCode,
  }))
}

/**
 * Get a specific country by code
 */
export const getCountryByCode = (countryCode: string): Country | null => {
  const country = CSCCountry.getCountryByCode(countryCode)
  if (!country) return null

  return {
    code: country.isoCode,
    name: country.name,
  }
}

/**
 * Get a specific state by code
 */
export const getStateByCode = (countryCode: string, stateCode: string): State | null => {
  const state = CSCState.getStateByCodeAndCountry(stateCode, countryCode)
  if (!state) return null

  return {
    code: state.isoCode,
    name: state.name,
    countryCode: state.countryCode,
  }
}

/**
 * Legacy COUNTRIES array for backward compatibility
 * Returns a limited set of countries with their states
 */
export const COUNTRIES: Country[] = getAllCountries()

export const CURRENCIES = [
  { code: 'NGN', name: 'Nigerian Naira (₦)' },
  { code: 'USD', name: 'US Dollar ($)' },
  { code: 'GBP', name: 'British Pound (£)' },
  { code: 'EUR', name: 'Euro (€)' },
]

export const PACKAGE_TYPES = [
  { value: 'envelope', label: 'Envelope' },
  { value: 'box', label: 'Box' },
  { value: 'pallet', label: 'Pallet' },
  { value: 'tube', label: 'Tube' },
  { value: 'pak', label: 'Pak' },
    { value: 'other', label: 'Other' },

] as const
