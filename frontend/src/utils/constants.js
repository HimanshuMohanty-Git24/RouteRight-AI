export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const STEPS = {
  understanding: 'Understanding',
  searching: 'Searching', 
  validating: 'Validating',
  optimizing: 'Optimizing',
  finalizing: 'Finalizing'
};

export const STEP_MESSAGES = {
  understanding: 'Understanding your request...',
  searching: 'Searching for places...',
  validating: 'Validating options...',
  optimizing: 'Optimizing your route...',
  finalizing: 'Finalizing your plan...',
  complete: 'Your plan is ready!'
};

export const CATEGORY_ICONS = {
  grocery: '🛒',
  pharmacy: '💊',
  gas: '⛽',
  coffee: '☕',
  restaurant: '🍽️',
  bank: '🏦',
  hardware: '🔨',
  shopping: '🛍️',
  default: '📍'
};