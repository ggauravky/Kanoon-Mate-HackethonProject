import { emergencyHelplines, legalResources } from '../data/legalHubData'

const FAVORITES_KEY = 'kanoon_mate_legal_hub_favorites'

/**
 * Get saved favorite legal resource IDs from localStorage
 */
export function getFavoriteResourceIds() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Toggle favorite status of a legal resource ID
 */
export function toggleFavoriteResource(resourceId) {
  try {
    const current = getFavoriteResourceIds()
    let updated = []
    if (current.includes(resourceId)) {
      updated = current.filter((id) => id !== resourceId)
    } else {
      updated = [...current, resourceId]
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
    return updated
  } catch {
    return []
  }
}

/**
 * Helper to query and filter legal resources by category, query string, or favorites
 */
export function queryLegalResources({
  searchQuery = '',
  category = 'All',
  city = 'All',
  onlyFavorites = false,
} = {}) {
  const favorites = getFavoriteResourceIds()

  return legalResources.filter((item) => {
    // 1. Favorite check
    if (onlyFavorites && !favorites.includes(item.id)) {
      return false
    }

    // 2. Category check
    if (category !== 'All' && item.category !== category && item.type !== category) {
      return false
    }

    // 3. City check
    if (city !== 'All' && item.city !== city && item.state !== city) {
      return false
    }

    // 4. Search text match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = item.title.toLowerCase().includes(q)
      const matchCity = item.city.toLowerCase().includes(q)
      const matchServices = item.services.some((s) => s.toLowerCase().includes(q))
      const matchDesc = item.category.toLowerCase().includes(q)

      return matchTitle || matchCity || matchServices || matchDesc
    }

    return true
  })
}

export { emergencyHelplines }
