const REGEX_ONLY_NUMBER = /^\d+$/;

// Shuffle characters in a string
String.prototype.shuffle = function () {
  var arr = this.split("");

  arr.sort(function () {
    return 0.5 - Math.random();
  });
  return arr.join("");
};

const passwordEl = document.getElementById("password");
const copyEl = document.getElementById("copy");
const generateEl = document.getElementById("generate");

let uppercase = false;
let lowercase = false;
let numbers = false;
let symbols = false;

// Check if user input valid number, not a word or symbol
const checkValidPasswordLength = (str) => {
  if (str.match(REGEX_ONLY_NUMBER) != null) {
    return true;
  }
  return false;
};

const getPasswordLength = () => {
  const passLength = window.prompt(
    "Enter your password length (Min 8 - Max 128)"
  );

  if (!checkValidPasswordLength(passLength)) {
    window.alert("Password length must be a number");
    return null;
  }

  if (!passLength || passLength > 128 || passLength < 8) {
    window.alert(
      "Password length must have more than 8 and less than 128 characters"
    );
    return null;
  }

  return passLength;
};

const getRandomLower = () => {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97); // Start with letter "a" = 97
};

const getRandomUpper = () => {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65); // Start with letter "A" = 65
};

const getRandomNumber = () => {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48); // Start with number "0" = 48
};

const getRandomSymbol = () => {
  const symbols = '~!@#$%^&*()_+{}":?><;.,';
  return symbols[Math.floor(Math.random() * symbols.length)];
};

const randomFunctions = {
  lower: getRandomLower,
  upper: getRandomUpper,
  symbol: getRandomSymbol,
  number: getRandomNumber,
};

copyEl.addEventListener("click", () => {
  const textarea = document.createElement("textarea"),
    password = passwordEl.innerText;

  if (!password) return;

  textarea.value = password;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  window.alert("Password copied to clipboard!");
});

const generatePassword = (length, conditions) => {
  let generatedPassword = "";

  const filteredConditions = conditions.filter(
    (cond) => Object.values(cond)[0]
  );

  for (let i = 0; i < length; i++) {
    filteredConditions.forEach((cond) => {
      const funcName = Object.keys(cond)[0];
      generatedPassword += randomFunctions[funcName]();
    });
  }

  return generatedPassword.slice(0, length).shuffle();
};

generateEl.addEventListener("click", () => {
  const confirmAlert = window.confirm(
    "There will be some series alerts showing up to verify. Agree?"
  );

  if (!confirmAlert) {
    return;
  }

  const passwordLength = getPasswordLength();

  if (!passwordLength) {
    return;
  }

  lowercase = window.confirm("Include at least one lowercase letter?");
  uppercase = window.confirm("Include at least one uppercase letter?");
  numbers = window.confirm("Include at least one number?");
  symbols = window.confirm("Include at least one symbol?");

  if (
    lowercase === false &&
    uppercase === false &&
    numbers === false &&
    symbols === false
  ) {
    return window.alert(
      "Must choose one of the password condition to generate"
    );
  }

  const conditions = [
    { upper: uppercase },
    { lower: lowercase },
    { number: numbers },
    { symbol: symbols },
  ];

  const result = generatePassword(passwordLength, conditions);

  passwordEl.innerText = result;
});
