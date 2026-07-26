/**
 * Generates realistic rating floats (between 4.2 and 5.0) and review counts
 */
export const getRandomRatingAndReviews = () => {
  // Generate random float between 4.2 and 5.0 rounded to 1 decimal place
  const rawRating = 4.2 + Math.random() * 0.8
  const rating = Math.round(rawRating * 10) / 10

  const totalReviews = Math.floor(Math.random() * 90) + 12
  return { rating, totalReviews }
}
