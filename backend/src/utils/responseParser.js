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

  const docType = typeof parsed.documentType === 'string' && parsed.documentType.trim()
    ? parsed.documentType.trim()
    : 'Legal Document';

  return {
    documentType: docType,
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

    // ─── PHASE 30 AI LEGAL GUIDANCE CENTER FIELDS ──────────────────────────────
    emergencyWarning: parsed.emergencyWarning && typeof parsed.emergencyWarning === 'object'
      ? {
          detected: Boolean(parsed.emergencyWarning.detected),
          warningMessage: typeof parsed.emergencyWarning.warningMessage === 'string' ? parsed.emergencyWarning.warningMessage.trim() : 'Urgent legal matter requiring immediate attention.',
        }
      : {
          detected: sanitizedRisk === 'High',
          warningMessage: sanitizedRisk === 'High' ? 'This matter involves high risk or strict statutory response deadlines. Immediate legal consultation is strongly advised.' : '',
        },

    actionPlan: Array.isArray(parsed.actionPlan) && parsed.actionPlan.length > 0
      ? parsed.actionPlan.map((item, idx) => ({
          step: typeof item.step === 'number' ? item.step : idx + 1,
          title: item && typeof item.title === 'string' ? item.title.trim() : `Step ${idx + 1}`,
          description: item && typeof item.description === 'string' ? item.description.trim() : '',
          priority: ['High', 'Medium', 'Low'].includes(item?.priority) ? item.priority : 'Medium',
          estimatedTime: item && typeof item.estimatedTime === 'string' ? item.estimatedTime.trim() : 'Within 24-48 Hours',
          isMandatory: typeof item?.isMandatory === 'boolean' ? item.isMandatory : true,
        }))
      : defaultActionPlan(docType),

    requiredDocuments: Array.isArray(parsed.requiredDocuments) && parsed.requiredDocuments.length > 0
      ? parsed.requiredDocuments.map((item) => ({
          name: item && typeof item.name === 'string' ? item.name.trim() : 'Identity Proof',
          reason: item && typeof item.reason === 'string' ? item.reason.trim() : 'For legal identity verification',
          type: ['Mandatory', 'Optional', 'Conditional'].includes(item?.type) ? item.type : 'Mandatory',
          whyUseful: item && typeof item.whyUseful === 'string' ? item.whyUseful.trim() : 'Establishes legal locus standi in dispute proceedings.',
        }))
      : defaultRequiredDocuments(docType),

    evidenceChecklist: Array.isArray(parsed.evidenceChecklist) && parsed.evidenceChecklist.length > 0
      ? parsed.evidenceChecklist.map((item) => ({
          name: item && typeof item.name === 'string' ? item.name.trim() : 'Payment Receipt / Email',
          type: ['Digital', 'Physical', 'Witness'].includes(item?.type) ? item.type : 'Digital',
          instructions: item && typeof item.instructions === 'string' ? item.instructions.trim() : 'Safely preserve original files and certified printouts.',
        }))
      : defaultEvidenceChecklist(docType),

    contactAuthorities: Array.isArray(parsed.contactAuthorities) && parsed.contactAuthorities.length > 0
      ? parsed.contactAuthorities.map((item) => ({
          name: item && typeof item.name === 'string' ? item.name.trim() : defaultAuthority(docType),
          reason: item && typeof item.reason === 'string' ? item.reason.trim() : 'For statutory filing and formal complaints.',
          purpose: item && typeof item.purpose === 'string' ? item.purpose.trim() : 'Statutory enforcement and official record creation.',
          whenToContact: item && typeof item.whenToContact === 'string' ? item.whenToContact.trim() : 'Within 7 days of notice date.',
        }))
      : defaultContactAuthorities(docType),

    deadlines: Array.isArray(parsed.deadlines) && parsed.deadlines.length > 0
      ? parsed.deadlines.map((d) => ({
          deadline: d && typeof d.deadline === 'string' ? d.deadline.trim() : 'Within 15 Days',
          reason: d && typeof d.reason === 'string' ? d.reason.trim() : 'Statutory notice response period under Indian laws.',
          priority: ['High', 'Medium', 'Low'].includes(d?.priority) ? d.priority : 'High',
        }))
      : defaultDeadlines(docType),

    mistakesToAvoid: Array.isArray(parsed.mistakesToAvoid) && parsed.mistakesToAvoid.length > 0
      ? parsed.mistakesToAvoid.map((m) => ({
          mistake: m && typeof m.mistake === 'string' ? m.mistake.trim() : 'Do not destroy physical or digital evidence',
          consequence: m && typeof m.consequence === 'string' ? m.consequence.trim() : 'May compromise evidentiary strength in judicial proceedings.',
        }))
      : defaultMistakesToAvoid(docType),

    helpfulSuggestions: Array.isArray(parsed.helpfulSuggestions) && parsed.helpfulSuggestions.length > 0
      ? parsed.helpfulSuggestions.map((s) => ({
          tip: s && typeof s.tip === 'string' ? s.tip.trim() : 'Maintain a chronological log of all communications',
          category: s && typeof s.category === 'string' ? s.category.trim() : 'Documentation',
        }))
      : defaultHelpfulSuggestions(docType),

    lawyerRecommendation: parsed.lawyerRecommendation && typeof parsed.lawyerRecommendation === 'object'
      ? {
          urgency: ['Immediately', 'Within a Few Days', 'Optional', 'Not Necessary Yet'].includes(parsed.lawyerRecommendation.urgency)
            ? parsed.lawyerRecommendation.urgency
            : 'Within a Few Days',
          reason: typeof parsed.lawyerRecommendation.reason === 'string'
            ? parsed.lawyerRecommendation.reason.trim()
            : 'Consulting an advocate ensures all written responses comply with procedural evidence laws.',
        }
      : defaultLawyerRecommendation(docType, sanitizedRisk),

    recommendedAdvocateType: typeof parsed.recommendedAdvocateType === 'string' && parsed.recommendedAdvocateType.trim()
      ? parsed.recommendedAdvocateType.trim()
      : defaultAdvocateType(docType),
  };
};

function defaultActionPlan(docType) {
  return [
    { step: 1, title: `Read the ${docType} Carefully`, description: 'Verify all names, dates, addresses, and monetary figures mentioned.', priority: 'High', estimatedTime: 'Immediate', isMandatory: true },
    { step: 2, title: 'Obtain Certified Copies', description: 'Ensure you have physical and digital backup copies of the document.', priority: 'High', estimatedTime: 'Within 24 Hours', isMandatory: true },
    { step: 3, title: 'Collect & Organize Evidence', description: 'Gather all related invoices, bank statements, emails, and chat records.', priority: 'High', estimatedTime: '1-2 Days', isMandatory: fontMandatory(docType) },
    { step: 4, title: 'Check Statutory Limitation Deadlines', description: 'Determine notice period and court limitation windows.', priority: 'Medium', estimatedTime: 'Within 3 Days', isMandatory: false },
    { step: 5, title: 'Consult Specialized Legal Counsel', description: 'Schedule consultation with a verified advocate specializing in this matter.', priority: 'Medium', estimatedTime: 'Within 5 Days', isMandatory: false },
  ];
}

function fontMandatory(docType) {
  return docType.toLowerCase().includes('fir') || docType.toLowerCase().includes('notice');
}

function defaultRequiredDocuments(docType) {
  return [
    { name: 'Identity Proof (Aadhaar / PAN Card)', reason: 'Identity verification in legal proceedings', type: 'Mandatory', whyUseful: 'Required for power of attorney and court filing verification.' },
    { name: 'Address Proof (Voter ID / Utility Bill)', reason: 'Establish territorial jurisdiction', type: 'Mandatory', whyUseful: 'Determines appropriate court or police station jurisdiction.' },
    { name: `Original ${docType}`, reason: 'Primary document under Indian Evidence Law', type: 'Mandatory', whyUseful: 'Admissible as primary evidence in court.' },
    { name: 'Bank Transaction & Payment Receipts', reason: 'Proof of monetary consideration', type: 'Conditional', whyUseful: 'Proves transaction execution and consideration paid.' },
  ];
}

function defaultEvidenceChecklist(docType) {
  return [
    { name: 'Email & WhatsApp Communications', type: 'Digital', instructions: 'Export full chat backup PDF and preserve email header information.' },
    { name: 'Bank Account Statements', type: 'Digital', instructions: 'Obtain bank-stamped transaction statement highlighting payments.' },
    { name: 'Witness Statements & Contacts', type: 'Witness', instructions: 'Write down names, contact numbers, and brief incident summaries.' },
  ];
}

function defaultContactAuthorities(docType) {
  return [
    { name: defaultAuthority(docType), reason: 'Statutory filing jurisdiction', purpose: 'To record official complaint or submit legal reply.', whenToContact: 'Within statutory notice period (7-15 days)' },
  ];
}

function defaultDeadlines(docType) {
  return [
    { deadline: 'Within 15 Days', reason: 'Standard statutory notice reply window under Indian civil/criminal procedural acts.', priority: 'High' },
    { deadline: 'Within 30 Days', reason: 'Limitation period for filing statutory appeals or consumer complaints.', priority: 'Medium' },
  ];
}

function defaultMistakesToAvoid(docType) {
  return [
    { mistake: 'Do not destroy physical or digital evidence', consequence: 'Compromises evidentiary strength under Bharatiya Sakshya Adhiniyam.' },
    { mistake: 'Do not ignore statutory legal notices', consequence: 'May lead to ex-parte court orders or adverse inferences against you.' },
    { mistake: 'Do not sign unverified settlement documents', consequence: 'Binds you legally to terms that may waive your statutory rights.' },
  ];
}

function defaultHelpfulSuggestions(docType) {
  return [
    { tip: 'Keep digital PDF backups on secure cloud storage', category: 'Documentation' },
    { tip: 'Send all legal responses via Speed Post with Proof of Delivery (RPAD)', category: 'Communication' },
    { tip: 'Maintain a chronological date-wise log of all events', category: 'Evidence' },
  ];
}

function defaultLawyerRecommendation(docType, riskLevel) {
  return {
    urgency: riskLevel === 'High' ? 'Immediately' : 'Within a Few Days',
    reason: 'Consulting an advocate ensures all written responses comply with procedural law and protect your statutory remedies.',
  };
}

function defaultAuthority(docType) {
  const d = docType.toLowerCase();
  if (d.includes('rent') || d.includes('property') || d.includes('deed')) return 'Rent Control Court / Sub-Registrar Office';
  if (d.includes('notice') || d.includes('cheque') || d.includes('fir') || d.includes('police')) return 'Police Station / Judicial Magistrate Court';
  if (d.includes('consumer') || d.includes('refund')) return 'District Consumer Disputes Redressal Commission';
  if (d.includes('employment') || d.includes('salary')) return 'Labour Commissioner / Labour Court';
  return 'District Civil Court / Statutory Legal Authority';
}

function defaultAdvocateType(docType) {
  const d = docType.toLowerCase();
  if (d.includes('rent') || d.includes('property') || d.includes('deed')) return 'Property Lawyer';
  if (d.includes('notice') || d.includes('cheque') || d.includes('fir')) return 'Criminal Lawyer';
  if (d.includes('consumer') || d.includes('refund')) return 'Consumer Lawyer';
  if (d.includes('employment') || d.includes('salary')) return 'Employment Lawyer';
  if (d.includes('divorce') || d.includes('custody')) return 'Family Lawyer';
  return 'Civil Lawyer';
}
