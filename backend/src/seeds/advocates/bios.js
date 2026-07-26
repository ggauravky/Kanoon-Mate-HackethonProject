/**
 * Dynamic, non-repetitive bio templates per legal specialization
 */
export const BIO_TEMPLATES = {
  'Property Lawyer': [
    'Specialist in title verification, sale deed execution, land acquisition disputes, and tenant litigation across High Courts and District Courts.',
    'Senior property advocate with extensive experience handling RERA compliance, partition suits, boundary disputes, and real estate litigation.',
    'Focusing on property title clearance, lease agreement drafting, ancestral land disputes, and builder-buyer arbitration.',
  ],
  'Family Lawyer': [
    'Dedicated family law practitioner assisting clients with mutual consent divorce, child custody arrangements, and family settlement deeds.',
    'Expert in domestic violence protection orders, maintenance claims, adoption procedures, and pre-litigation family mediation.',
    'Handling complex matrimonial disputes, alimony settlements, and estate inheritance matters with compassion and legal expertise.',
  ],
  'Divorce Lawyer': [
    'High Court advocate specializing in Section 13B mutual divorce, contested divorce grounds, alimony calculation, and emergency custody orders.',
    'Focused matrimonial litigator with proven track record in cross-border divorce, restitution of conjugal rights, and annulment proceedings.',
  ],
  'Criminal Lawyer': [
    'Lead defense counsel specializing in Section 138 Cheque Bounce litigation, BNSS anticipatory bail applications, and criminal notices.',
    'Experienced criminal litigator handling economic offenses, cyber crime defense, FIR quashing proceedings, and High Court criminal appeals.',
  ],
  'Corporate Lawyer': [
    'Corporate counsel advising tech startups and enterprises on NDAs, commercial contracts, shareholder agreements, and regulatory compliance.',
    'Specialized corporate lawyer with expertise in joint ventures, M&A due diligence, employment contracts, and corporate governance.',
  ],
  'Consumer Lawyer': [
    'Consumer forum authority representing citizens against e-commerce fraud, defective goods, insurance claim rejections, and medical negligence.',
    'Dedicated consumer protection practitioner helping citizens secure full refunds, compensation, and statutory relief under Consumer Protection Act 2019.',
  ],
  'Cyber Crime Lawyer': [
    'Cyber crime legal advisor assisting victims of online financial fraud, identity theft, phishing scams, and digital privacy violations.',
    'Expert in IT Act compliance, cyber forensics legal defense, data breach notifications, and social media defamation litigation.',
  ],
  'Employment Lawyer': [
    'Employment law specialist advising professionals on severance disputes, non-compete enforceability, POSH workplace harassment, and wage claims.',
    'Labour advocate representing employee associations and corporates in employment contract disputes and industrial tribunal proceedings.',
  ],
}

export const generateBio = (primaryPractice, experience, city) => {
  const templates = BIO_TEMPLATES[primaryPractice] || [
    `Senior litigation advocate in ${city} with ${experience}+ years of legal experience providing strategic legal advice and court representation.`,
    `Dedicated practitioner in ${city} specializing in ${primaryPractice.toLowerCase()} matters, document drafting, and dispute resolution.`,
  ]

  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)]
  return `${selectedTemplate} Practicing in ${city} with over ${experience} years of courtroom experience.`
}
