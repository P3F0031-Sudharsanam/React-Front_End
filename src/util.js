import { jwtDecode } from "jwt-decode";
import moment from "moment";
// import { getEncoding, encodingForModel } from "js-tiktoken";

export function isLetterOrDigit(char) {
  return /^[a-zA-Z0-9]+$/.test(char);
}

export function isUpperCase(char) {
  return /[A-Z]/.test(char);
}

export function isNumber(char) {
  return /[0-9]/.test(char);
}

export function compareCaseIds(propertyName) {
  return (a, b) => {
    const aDigits = parseInt((a[propertyName] || "").match(/\d+$/)[0]);
    const bDigits = parseInt((b[propertyName] || "").match(/\d+$/)[0]);
    return aDigits - bDigits;
  };
}

export function filterValuesStr(data, propertyName) {
  return data.reduce((acc, item) => {
    if (!acc.some((option) => option.value === item[propertyName])) {
      acc.push({ text: item[propertyName], value: item[propertyName] });
    }
    return acc;
  }, []);
}

export function filterValuesBoolActiveAndInactive(data, propertyName) {
  return data.reduce((acc, data) => {
    let value = data[propertyName] ? "Active" : "Inactive";
    if (!acc.some((option) => option.value === value)) {
      acc.push({ text: value, value: value });
    }
    return acc;
  }, []);
}

export function filterValuesBoolPassedAndFailed(data, propertyName) {
  let values = data.reduce((acc, data) => {
    let value = data[propertyName] ? "Passed" : "Failed";
    if (!acc.some((option) => option.value === value)) {
      acc.push({ text: value, value: value });
    }
    return acc;
  }, []);
  return values;
}

export function filterValuesDate(data, propertyName) {
  return data.reduce((acc, item) => {
    const date = new Date(item[propertyName]);
    const value = moment(date).format("L");
    if (!acc.some((option) => option.value === value)) {
      acc.push({ text: value, value: value });
    }
    return acc;
  }, []);
}

export function generateRandomPassword() {
  const length = 10;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  let hasSpecialChar = false;
  let hasUpperCase = false;
  let hasNumber = false;
  for (let i = 0; i < length; i++) {
    const char = charset.charAt(Math.floor(Math.random() * charset.length));
    if (!hasSpecialChar && !isLetterOrDigit(char) && !isUpperCase(char)) {
      hasSpecialChar = true;
    }
    if (!hasUpperCase && isUpperCase(char)) {
      hasUpperCase = true;
    }
    if (!hasNumber && isNumber(char)) {
      hasNumber = true;
    }
    password += char;
  }
  if (!hasSpecialChar || !hasUpperCase || !hasNumber) {
    // If the generated password does not meet the requirements, generate a new password recursively
    return generateRandomPassword();
  }
  return password;
}

export function decodeJWTString(accessToken) {
  const decodedToken = jwtDecode(accessToken);
  const userInfo = {
    username: decodedToken["cognito:username"],
    email: decodedToken.email,
    name: decodedToken.name,
    customAttributes: {},
  };

  // Extract custom attributes from the token payload
  for (const [key, value] of Object.entries(decodedToken)) {
    if (key.startsWith("custom:")) {
      userInfo.customAttributes[key.substring(7)] = value;
    }
  }

  return userInfo;
}
