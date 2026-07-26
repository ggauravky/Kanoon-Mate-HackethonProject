/**
 * Advocate Practice Area Mapping Configuration
 * Maps AI Detected Document Types & Legal Categories to Advocate Practice Areas
 */
export const ADVOCATE_PRACTICE_AREAS = [
  'Family Lawyer',
  'Criminal Lawyer',
  'Property Lawyer',
  'Corporate Lawyer',
  'Civil Lawyer',
  'Tax Lawyer',
  'Consumer Lawyer',
  'Cyber Crime Lawyer',
  'Employment Lawyer',
  'Startup Lawyer',
  'Trademark Lawyer',
  'Intellectual Property Lawyer',
  'Divorce Lawyer',
  'Banking Lawyer',
  'Real Estate Lawyer',
  'Labour Lawyer',
  'Women Rights Lawyer',
  'Child Protection Lawyer',
  'Senior Citizen Legal Advisor',
  'NGO Legal Advisor',
]

export const CATEGORY_TO_ADVOCATE_MAP = {
  // Property & Real Estate
  'Rent Agreement': ['Property Lawyer', 'Real Estate Lawyer', 'Civil Lawyer'],
  'Rental Agreement': ['Property Lawyer', 'Real Estate Lawyer', 'Civil Lawyer'],
  'Property Agreement': ['Property Lawyer', 'Real Estate Lawyer', 'Civil Lawyer'],
  'Sale Deed': ['Property Lawyer', 'Real Estate Lawyer', 'Civil Lawyer'],
  'Land Dispute': ['Property Lawyer', 'Real Estate Lawyer', 'Civil Lawyer'],

  // Criminal & Cheque Bounce
  'Cheque Bounce': ['Criminal Lawyer', 'Banking Lawyer', 'Civil Lawyer'],
  'FIR / BNSS Audit': ['Criminal Lawyer', 'Civil Lawyer'],
  'Bail Application': ['Criminal Lawyer'],
  'Criminal Notice': ['Criminal Lawyer'],

  // Consumer & Banking
  'Consumer Complaint': ['Consumer Lawyer', 'Civil Lawyer'],
  'Consumer Notice': ['Consumer Lawyer', 'Civil Lawyer'],
  'Banking Dispute': ['Banking Lawyer', 'Consumer Lawyer'],

  // Family & Domestic
  'Divorce Notice': ['Divorce Lawyer', 'Family Lawyer', 'Women Rights Lawyer'],
  'Domestic Violence': ['Women Rights Lawyer', 'Family Lawyer', 'Criminal Lawyer'],
  'Maintenance Claim': ['Family Lawyer', 'Divorce Lawyer'],
  'Child Custody': ['Family Lawyer', 'Child Protection Lawyer'],

  // Cyber & Privacy
  'Cyber Complaint': ['Cyber Crime Lawyer', 'Consumer Lawyer'],
  'Online Fraud': ['Cyber Crime Lawyer', 'Banking Lawyer'],
  'Data Privacy Notice': ['Cyber Crime Lawyer', 'Corporate Lawyer'],

  // Corporate, Startup & IP
  'Employment Contract': ['Employment Lawyer', 'Labour Lawyer', 'Corporate Lawyer'],
  'Non-Disclosure Agreement': ['Corporate Lawyer', 'Startup Lawyer', 'Intellectual Property Lawyer'],
  'Trademark Registration': ['Trademark Lawyer', 'Intellectual Property Lawyer'],
  'Startup Agreement': ['Startup Lawyer', 'Corporate Lawyer'],

  // Default Fallback
  'General Legal Document': ['Civil Lawyer', 'Consumer Lawyer'],
}

/**
 * Maps a document's detected category / type to advocate practice areas
 * @param {string} category - Document category or type from AI analysis
 * @returns {string[]} List of matching advocate practice areas
 */
export const getRecommendedPracticeAreas = (category) => {
  if (!category) return ['Civil Lawyer', 'Consumer Lawyer']

  // Exact match
  if (CATEGORY_TO_ADVOCATE_MAP[category]) {
    return CATEGORY_TO_ADVOCATE_MAP[category]
  }

  // Partial substring match
  const catLower = category.toLowerCase()
  for (const [key, areas] of Object.entries(CATEGORY_TO_ADVOCATE_MAP)) {
    if (catLower.includes(key.toLowerCase()) || key.toLowerCase().includes(catLower)) {
      return areas
    }
  }

  // Keyword heuristics
  if (catLower.includes('rent') || catLower.includes('property') || catLower.includes('deed') || catLower.includes('lease')) {
    return ['Property Lawyer', 'Real Estate Lawyer', 'Civil Lawyer']
  }
  if (catLower.includes('divorce') || catLower.includes('family') || catLower.includes('custody')) {
    return ['Family Lawyer', 'Divorce Lawyer']
  }
  if (catLower.includes('cyber') || catLower.includes('fraud') || catLower.includes('online')) {
    return ['Cyber Crime Lawyer', 'Consumer Lawyer']
  }
  if (catLower.includes('consumer') || catLower.includes('complaint')) {
    return ['Consumer Lawyer', 'Civil Lawyer']
  }
  if (catLower.includes('cheque') || catLower.includes('criminal') || catLower.includes('fir')) {
    return ['Criminal Lawyer', 'Banking Lawyer']
  }
  if (catLower.includes('employment') || catLower.includes('job') || catLower.includes('salary')) {
    return ['Employment Lawyer', 'Labour Lawyer']
  }
  if (catLower.includes('trademark') || catLower.includes('copyright') || catLower.includes('patent')) {
    return ['Trademark Lawyer', 'Intellectual Property Lawyer']
  }

  return ['Civil Lawyer', 'Consumer Lawyer']
}
