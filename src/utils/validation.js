/**
 * Input validation utilities
 */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateString = (str, minLength = 1, maxLength = 5000) => {
  return typeof str === 'string' && str.length >= minLength && str.length <= maxLength;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateString
};
