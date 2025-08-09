const disposableDomains = require('disposable-email-domains');
const hibp = require('hibp');

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  const domain = email.split('@')[1].toLowerCase();
  if (disposableDomains.includes(domain)) return false;
  return true;
}

function isValidPassword(password) {
  const minLength = 8;
  const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;
  return password.length >= minLength && complexityRegex.test(password);
}

function isValidName(name) {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/; // Letters and spaces, length 2-50
  return name && nameRegex.test(name);
}

async function isPasswordPwned(password) {
  const count = await hibp.pwnedPassword(password);
  return count > 0;
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isPasswordPwned
};