export const ALL_PRACTICE_AREAS = [
  'Property Lawyer',
  'Family Lawyer',
  'Divorce Lawyer',
  'Civil Lawyer',
  'Criminal Lawyer',
  'Consumer Lawyer',
  'Cyber Crime Lawyer',
  'Employment Lawyer',
  'Labour Lawyer',
  'Corporate Lawyer',
  'Startup Lawyer',
  'Trademark Lawyer',
  'Intellectual Property Lawyer',
  'Tax Lawyer',
  'Banking Lawyer',
  'Real Estate Lawyer',
  'Women Rights Lawyer',
  'Child Protection Lawyer',
  'NGO Legal Advisor',
  'Senior Citizen Legal Advisor',
  'Environmental Lawyer',
  'Immigration Lawyer',
  'Constitutional Lawyer',
]

/**
 * Returns a primary practice area and 1-2 complementary practice areas
 */
export const getPracticeAreaCombination = (primaryIndex) => {
  const primary = ALL_PRACTICE_AREAS[primaryIndex % ALL_PRACTICE_AREAS.length]

  const complementaryMap = {
    'Property Lawyer': ['Real Estate Lawyer', 'Civil Lawyer'],
    'Family Lawyer': ['Divorce Lawyer', 'Women Rights Lawyer'],
    'Divorce Lawyer': ['Family Lawyer', 'Child Protection Lawyer'],
    'Civil Lawyer': ['Property Lawyer', 'Consumer Lawyer'],
    'Criminal Lawyer': ['Banking Lawyer', 'Cyber Crime Lawyer'],
    'Consumer Lawyer': ['Cyber Crime Lawyer', 'Civil Lawyer'],
    'Cyber Crime Lawyer': ['Banking Lawyer', 'Consumer Lawyer'],
    'Employment Lawyer': ['Labour Lawyer', 'Corporate Lawyer'],
    'Labour Lawyer': ['Employment Lawyer', 'Civil Lawyer'],
    'Corporate Lawyer': ['Startup Lawyer', 'Intellectual Property Lawyer'],
    'Startup Lawyer': ['Trademark Lawyer', 'Corporate Lawyer'],
    'Trademark Lawyer': ['Intellectual Property Lawyer', 'Corporate Lawyer'],
    'Intellectual Property Lawyer': ['Trademark Lawyer', 'Startup Lawyer'],
    'Tax Lawyer': ['Corporate Lawyer', 'Banking Lawyer'],
    'Banking Lawyer': ['Criminal Lawyer', 'Tax Lawyer'],
    'Real Estate Lawyer': ['Property Lawyer', 'Civil Lawyer'],
    'Women Rights Lawyer': ['Family Lawyer', 'Divorce Lawyer'],
    'Child Protection Lawyer': ['Family Lawyer', 'NGO Legal Advisor'],
    'NGO Legal Advisor': ['Environmental Lawyer', 'Constitutional Lawyer'],
    'Senior Citizen Legal Advisor': ['Property Lawyer', 'Family Lawyer'],
    'Environmental Lawyer': ['NGO Legal Advisor', 'Constitutional Lawyer'],
    'Immigration Lawyer': ['Corporate Lawyer', 'Civil Lawyer'],
    'Constitutional Lawyer': ['Civil Lawyer', 'Environmental Lawyer'],
  }

  const secondaries = complementaryMap[primary] || ['Civil Lawyer']
  return Array.from(new Set([primary, ...secondaries]))
}
