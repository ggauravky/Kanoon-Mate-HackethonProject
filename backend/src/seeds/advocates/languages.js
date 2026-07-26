import { STATE_CONFIG } from './states.js'

/**
 * Returns region-aware realistic language array for a given state
 */
export const getLanguagesForState = (stateName) => {
  const config = STATE_CONFIG[stateName]
  if (config && config.languages) {
    return config.languages
  }
  return ['English', 'Hindi']
}
