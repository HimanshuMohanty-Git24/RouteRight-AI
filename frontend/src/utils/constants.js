export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const STEPS = {
  decomposing: 'Understanding',
  searching: 'Searching',
  validating: 'Validating',
  optimizing: 'Optimizing',
  formatting: 'Finalizing'
}

export const STEP_MESSAGES = {
    decomposing: 'Understanding your errands...',
    searching: 'Finding nearby places...',
    validating: 'Filtering best locations...',
    optimizing: 'Calculating the best route...',
    formatting: 'Putting it all together...'
}

export const CATEGORY_ICONS = {
  grocery: '🛒',
  pharmacy: '💊',
  bank: '🏦',
  gas: '⛽',
  coffee: '☕',
  restaurant: '🍽️',
  shopping: '🛍️',
  hardware: '🛠️',
  "post office": '🏤',
  default: '📍'
}