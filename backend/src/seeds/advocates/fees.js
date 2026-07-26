export const ALLOWED_FEES = [500, 750, 1000, 1500, 2000, 2500, 3000, 5000]

/**
 * Returns a realistic fee based on experience years
 */
export const getRandomFee = (experienceYears) => {
  if (experienceYears < 5) return ALLOWED_FEES[Math.floor(Math.random() * 3)] // 500, 750, 1000
  if (experienceYears < 12) return ALLOWED_FEES[Math.floor(Math.random() * 4) + 2] // 1000, 1500, 2000, 2500
  return ALLOWED_FEES[Math.floor(Math.random() * 4) + 4] // 2000, 2500, 3000, 5000
}
