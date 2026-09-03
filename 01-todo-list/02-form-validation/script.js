const form = document.getElementById("signup-form");
const submitBtn = document.getElementById("submit-btn");
const successMsg = document.getElementById("success-msg");

const nameInput = document.getElementById("name");
const emailInput= document.getElementById("email");
const passwordInput = document.getElementById("confirm-password");
const confirmInput = document.getElementById("confirm-password");

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const password = document.getElementById("password-error");
const confirmError = document.getElementById("confirm-password-error");

const fieldState = {
    name: false,
    email: false,
    password: false,
    confirmpassword: false,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldValid(input, errorEl){
    input.classList.remove("invalid");
    input.classList.add("valid");
    errorEl.textContent = "";
}

function setFieldInvalid(input, errorEl, message){
    input.classList.remove("valid");
    input.classList.add("invalid");
    errorEl.textContent = message;
}

function validateName() {
    const value = nameInput.value.trim();
    if (value.length < 3){
        setFieldInvalid(nameInput, nameError, "Name must be at least 3 characters");
        fieldState.name = false;
    } else {
        setFieldValid(nameInput, nameError);
        fieldState.name = true;
    }
    updateSubmitState();
}

function validateEmail() {
    const value = emailInput.value.trim();
    if (!EMAIL_REGEX.test(value)) {
        setFieldInvalid(emailInput, emailError, "Enter a valid email address");
        fieldState.email = false;
    } else {
        setFieldValid(emailInput, emailError);
        fieldState.email = true;
    }
    updateSubmitState();
}

function validatePassword() {
    const value = passwordInput.value;
    const hashNumber = /\d/.test(value);

    if(value.length < 8) {
        setFieldInvalid(passwordInput, passwordError, "Password must be at least 8 characters");
        fieldState.password = false;
    } else if (!hasNumber) {
        setFieldInvalid(passwordInput, passwordError, "Password must include at least one number");
        fieldState.password = false;
    } else {
        setFieldValid(passwordInput, passwordError);
        fieldState.password = true;
    }
    updateSubmitState();

    if (confirmInput.value) validateConfirmPassword();
}

function validateConfirmPassword() {
  const value = confirmInput.value;
  if (value !== passwordInput.value || value === "") {
    setFieldInvalid(confirmInput, confirmError, "Passwords do not match");
    fieldState.confirmPassword = false;
  } else {
    setFieldValid(confirmInput, confirmError);
    fieldState.confirmPassword = true;
  }
  updateSubmitState();
}


form.addEventListener("submit", (e) => {
  e.preventDefault(); // no backend — prevent page reload
 
  // Safety net: re-validate everything on submit too
  validateName();
  validateEmail();
  validatePassword();
  validateConfirmPassword();
 
  const allValid = Object.values(fieldState).every((v) => v === true);
  if (!allValid) return;
 
  successMsg.textContent = "Account created successfully!";
  form.reset();
 
  // Reset visual states since form.reset() clears values but not our classes
  [nameInput, emailInput, passwordInput, confirmInput].forEach((input) => {
    input.classList.remove("valid", "invalid");
  });
  [nameError, emailError, passwordError, confirmError].forEach((el) => {
    el.textContent = "";
  });
 
  Object.keys(fieldState).forEach((key) => (fieldState[key] = false));
  updateSubmitState();
});

// Handle browser autofill, which doesn't always trigger 'input' events
window.addEventListener("pageshow", () => {
  if (nameInput.value) validateName();
  if (emailInput.value) validateEmail();
  if (passwordInput.value) validatePassword();
  if (confirmInput.value) validateConfirmPassword();
});
 