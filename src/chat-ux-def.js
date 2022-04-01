// Flag indicating whether or not userInputText should be sanitized
// when displayed on the chat screen (append as DOM element).
export const SANITIZE_USER_INPUT_FOR_DISPLAY = true;

// Flag indicating whether or not EncodeURIComponent should be performed
// for userInputText in order to avoid mixing "&" in the query string
// with "&" in userInputText when sending values via GET
export const SANITIZE_USER_INPUT_FOR_SENDING_VIA_HTTP_METHOD = true;