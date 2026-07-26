/**
 * Utility functions to clean, sanitize, and format extracted raw text from PDF/OCR engines.
 */

/**
 * Cleans extracted raw text by normalizing line breaks, stripping control characters,
 * removing excessive whitespace, and collapsing redundant newlines.
 * 
 * @param {string} rawText - Raw text extracted from PDF or OCR engine
 * @returns {string} Cleaned, formatted text
 */
export const cleanText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return '';
  }

  return rawText
    // Normalize line breaks (\r\n and \r to \n)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Strip non-printable ASCII control characters (preserving \n, \t, and standard chars)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Collapse multiple horizontal spaces and tabs to a single space
    .replace(/[ \t]+/g, ' ')
    // Trim leading/trailing whitespace on each individual line
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    // Collapse 3 or more consecutive newlines into 2 newlines (clean paragraph separation)
    .replace(/\n{3,}/g, '\n\n')
    // Final trim of start/end whitespace
    .trim();
};

/**
 * Calculates metrics (character count and word count) for cleaned text.
 * 
 * @param {string} text 
 * @returns {{ characterCount: number, wordCount: number }}
 */
export const getTextStats = (text) => {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return { characterCount: 0, wordCount: 0 };
  }

  const cleaned = text.trim();
  const characterCount = cleaned.length;
  const words = cleaned.match(/\S+/g);
  const wordCount = words ? words.length : 0;

  return {
    characterCount,
    wordCount,
  };
};