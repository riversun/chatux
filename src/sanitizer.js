/**
 * Sanitize text (= escape HTML tags)
 *
 * There are two possible approaches to sanitization: simply escaping HTML,
 * or allowing HTML to be displayed and using DOMPurify to prevent dangerous HTML.
 * Since there are doubts about whether allowing HTML for user input is necessary
 * for chat in the first place,
 * I will adopt simple escaping as a sanitization method this time.
 * @param text
 * @returns {String}
 */
export default function sanitize(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/`/g, '&#x60;');
}
