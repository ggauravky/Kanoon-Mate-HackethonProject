/**
 * Generates experience years (2 to 25) and total cases handled
 */
export const getRandomExperience = () => {
  const experience = Math.floor(Math.random() * 24) + 2 // 2 to 25
  const casesPerYear = Math.floor(Math.random() * 20) + 15
  const totalCasesHandled = experience * casesPerYear
  return { experience, totalCasesHandled }
}
