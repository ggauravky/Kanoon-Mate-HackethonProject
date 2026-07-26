/**
 * Safe JSON Parser and Schema Sanitizer for AI Analysis Responses
 */

/**
 * Strips markdown code blocks (```json ... ```) from Gemini AI response strings.
 * 
 * @param {string} rawText 
 * @returns {string} Clean JSON string
 */
export const extractJsonFromText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return '';
  }

  let cleaned = rawText.trim();

  // Strip markdown code fences if present
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');

  // Extract the first '{' to the last '}'
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  return cleaned.trim();
};

/**
 * Parses and validates the structured AI analysis result.
 * Ensures default fallbacks for missing array fields or invalid enums.
 * 
 * @param {string} rawText - Raw string from Gemini API
 * @returns {object} Validated structured analysis object
 */
export const parseAndValidateAIResponse = (rawText) => {
  const jsonString = extractJsonFromText(rawText);

  if (!jsonString) {
    throw new Error('AI response did not contain a valid JSON payload');
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new Error(`Failed to parse AI response as JSON: ${err.message}`);
  }

  // Validate and sanitize against expected schema
  const riskLevels = ['Low', 'Medium', 'High'];
  const sanitizedRisk = riskLevels.includes(parsed.riskLevel) ? parsed.riskLevel : 'Medium';

  return {
    documentType: typeof parsed.documentType === 'string' && parsed.documentType.trim()
      ? parsed.documentType.trim()
      : 'Legal Document',
    language: typeof parsed.language === 'string' && parsed.language.trim()
      ? parsed.language.trim()
      : 'English',
    summary: typeof parsed.summary === 'string'
      ? parsed.summary.trim()
      : 'Summary unavailable.',
    simpleExplanation: typeof parsed.simpleExplanation === 'string'
      ? parsed.simpleExplanation.trim()
      : 'Detailed explanation unavailable.',
    keyPoints: Array.isArray(parsed.keyPoints)
      ? parsed.keyPoints.filter((k) => typeof k === 'string' && k.trim()).map((k) => k.trim())
      : [],
    importantDates: Array.isArray(parsed.importantDates)
      ? parsed.importantDates.map((item) => ({
          date: item && typeof item.date === 'string' ? item.date.trim() : 'N/A',
          description: item && typeof item.description === 'string' ? item.description.trim() : '',
        }))
      : [],
    detectedLaws: Array.isArray(parsed.detectedLaws)
      ? parsed.detectedLaws.map((law) => ({
          act: law && typeof law.act === 'string' ? law.act.trim() : 'Indian Law',
          section: law && typeof law.section === 'string' ? law.section.trim() : '',
          reason: law && typeof law.reason === 'string' ? law.reason.trim() : '',
        }))
      : [],
    requiredActions: Array.isArray(parsed.requiredActions)
      ? parsed.requiredActions.filter((a) => typeof a === 'string' && a.trim()).map((a) => a.trim())
      : [],
    riskLevel: sanitizedRisk,
    questionsYouMayAsk: Array.isArray(parsed.questionsYouMayAsk)
      ? parsed.questionsYouMayAsk.filter((q) => typeof q === 'string' && q.trim()).map((q) => q.trim())
      : [
          'What are my legal options?',
          'What happens if I miss the deadline?',
          'Should I respond to this document immediately?',
        ],
    disclaimer: typeof parsed.disclaimer === 'string' && parsed.disclaimer.trim()
      ? parsed.disclaimer.trim()
      : 'This analysis is AI-generated for informational purposes and does not constitute formal legal advice. Please consult a registered advocate.',
  };
};
