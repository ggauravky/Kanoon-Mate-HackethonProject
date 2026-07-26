/**
 * Legal AI Prompt Builder for Kanoon-Mate
 * Constructs system and user prompts for Google Gemini API.
 */

export const LEGAL_SYSTEM_INSTRUCTION = `You are Kanoon-Mate, an expert Indian legal assistant specializing in Indian jurisprudence, including:
- Bharatiya Nyaya Sanhita (BNS)
- Bharatiya Nagarik Suraksha Sanhita (BNSS)
- Bharatiya Sakshya Adhiniyam (BSA)
- Constitution of India
- Consumer Protection Act, 2019
- Transfer of Property Act & Registration Laws
- Industrial Relations & Employment Laws
- Negotiable Instruments Act (Section 138, etc.)

Goal: Act as an intelligent legal assistant that guides citizens on "What should I do next?" with practical, actionable, document-specific advice.

Rules:
1. Never give misleading legal advice or guarantee case outcomes.
2. Always maintain an empathetic, plain-language, professional tone.
3. Always recommend consulting a qualified advocate when high risk or action is required.
4. Output MUST be STRICT, VALID JSON ONLY. Do not wrap in extra conversational text outside the JSON object.
`;

/**
 * Builds the analysis prompt for Gemini API.
 * 
 * @param {string} ocrText - The extracted raw text from the document
 * @param {object} metadata - Document title or filename
 * @returns {string} Fully constructed prompt string
 */
export const buildLegalAnalysisPrompt = (ocrText, metadata = {}) => {
  const titleInfo = metadata.title ? `Document Title: "${metadata.title}"\n` : '';

  return `${titleInfo}Analyse the following Indian legal document text extracted via OCR and generate structured insights and an AI Legal Guidance Center.

DOCUMENT TEXT:
"""
${ocrText}
"""

Instructions:
1. Identify document type, primary language, and high-level summary.
2. Provide a simple, plain-language explanation of what this document means for the individual.
3. Extract key obligations, rights, or conditions as keyPoints.
4. List all explicit or implied important dates/deadlines with their description.
5. Identify applicable Indian laws, acts, or specific sections with reasons why they apply.
6. Check for Emergency Warnings (arrest risk, domestic violence, cyber crime, financial fraud, life threat).
7. Generate an ordered AI Legal Action Plan (actionPlan) with step #, title, description, priority (High, Medium, Low), estimated time, and mandatory flag.
8. Generate a Required Supporting Documents Checklist (requiredDocuments) with name, reason, type (Mandatory, Optional, Conditional), and why useful.
9. Generate an Evidence Checklist (evidenceChecklist) with name, type (Digital, Physical, Witness), and preservation instructions.
10. Determine exact Government Authorities/Offices to contact (contactAuthorities) with authority name, reason, purpose, and when to contact.
11. List Important Deadlines (deadlines) with deadline timeframe, reason, and priority.
12. List Common Legal Mistakes to Avoid (mistakesToAvoid) with mistake description and consequence.
13. Generate Helpful Suggestions & Tips (helpfulSuggestions) with tip and category.
14. Determine Lawyer Hiring Recommendation (lawyerRecommendation) with urgency (Immediately, Within a Few Days, Optional, Not Necessary Yet) and detailed reason.
15. Recommend specific Advocate Category (recommendedAdvocateType) e.g. Property Lawyer, Criminal Lawyer, Consumer Lawyer, Family Lawyer, Employment Lawyer.
16. Include a legal disclaimer.

Return ONLY a valid JSON object following this exact schema:
{
  "documentType": "string",
  "language": "string",
  "summary": "string (2-3 concise summary sentences)",
  "simpleExplanation": "string (Plain language breakdown)",
  "keyPoints": ["string"],
  "importantDates": [
    {
      "date": "string",
      "description": "string"
    }
  ],
  "detectedLaws": [
    {
      "act": "string",
      "section": "string",
      "reason": "string"
    }
  ],
  "riskLevel": "Low | Medium | High",
  "questionsYouMayAsk": ["string"],
  "disclaimer": "string",
  "emergencyWarning": {
    "detected": true,
    "warningMessage": "string"
  },
  "actionPlan": [
    {
      "step": 1,
      "title": "string",
      "description": "string",
      "priority": "High | Medium | Low",
      "estimatedTime": "string",
      "isMandatory": true
    }
  ],
  "requiredDocuments": [
    {
      "name": "string",
      "reason": "string",
      "type": "Mandatory | Optional | Conditional",
      "whyUseful": "string"
    }
  ],
  "evidenceChecklist": [
    {
      "name": "string",
      "type": "Digital | Physical | Witness",
      "instructions": "string"
    }
  ],
  "contactAuthorities": [
    {
      "name": "string",
      "reason": "string",
      "purpose": "string",
      "whenToContact": "string"
    }
  ],
  "deadlines": [
    {
      "deadline": "string",
      "reason": "string",
      "priority": "High | Medium | Low"
    }
  ],
  "mistakesToAvoid": [
    {
      "mistake": "string",
      "consequence": "string"
    }
  ],
  "helpfulSuggestions": [
    {
      "tip": "string",
      "category": "Documentation | Communication | Security | Evidence"
    }
  ],
  "lawyerRecommendation": {
    "urgency": "Immediately | Within a Few Days | Optional | Not Necessary Yet",
    "reason": "string"
  },
  "recommendedAdvocateType": "string"
}
`;
};
