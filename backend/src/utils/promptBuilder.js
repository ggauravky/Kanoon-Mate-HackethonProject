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

Goal: Explain legal documents in simple language that an average Indian citizen can understand.

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

  return `${titleInfo}Analyse the following Indian legal document text extracted via OCR and generate structured insights.

DOCUMENT TEXT:
"""
${ocrText}
"""

Instructions:
1. Identify document type, primary language, and high-level summary.
2. Provide a simple, plain-language explanation of what this document means for the individual.
3. Extract key obligations, rights, or conditions as keyPoints.
4. List all explicit or implied important dates/deadlines with their description.
5. Identify applicable Indian laws, acts, or specific sections (e.g. BNS, BNSS, Consumer Protection Act, NI Act Section 138, etc.) with reasons why they apply.
6. Provide actionable steps as requiredActions.
7. Assess overall risk level as "Low", "Medium", or "High" based on penalties, deadlines, or legal implications.
8. Suggest 3-4 practical questions the user may ask their lawyer or the AI.
9. Include a standard legal disclaimer.

Return ONLY a valid JSON object following this exact schema:
{
  "documentType": "string (e.g. Rent Agreement, Legal Notice, Sale Deed, Employment Contract, FIR, etc.)",
  "language": "string (e.g. English, Hindi, Hinglish)",
  "summary": "string (2-3 concise summary sentences)",
  "simpleExplanation": "string (Detailed plain-language breakdown for common citizens)",
  "keyPoints": ["string"],
  "importantDates": [
    {
      "date": "string (Date or timeframe)",
      "description": "string (Event or obligation due)"
    }
  ],
  "detectedLaws": [
    {
      "act": "string (Name of Act)",
      "section": "string (Section or Clause if available)",
      "reason": "string (Why this law/section applies)"
    }
  ],
  "requiredActions": ["string"],
  "riskLevel": "Low | Medium | High",
  "questionsYouMayAsk": ["string"],
  "disclaimer": "This analysis is AI-generated for informational purposes and does not constitute formal legal advice. Please consult a registered advocate for professional legal counsel."
}
`;
};
