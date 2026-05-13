const form = document.getElementById("applicationForm");
const alertBox = document.getElementById("formAlert");

const MESSAGES = {
  es: {
    firstNameInvalid: "Ingresa un nombre valido (minimo 2 caracteres).",
    lastNameInvalid: "Ingresa un apellido valido (minimo 2 caracteres).",
    emailInvalid: "Ingresa un email valido, por ejemplo nombre@correo.com.",
    phoneInvalid: "Ingresa un telefono valido con al menos 8 digitos.",
    birthDateRequired: "Selecciona tu fecha de nacimiento.",
    birthDateBeforeToday: "La fecha de nacimiento debe ser anterior a hoy.",
    birthDateInvalid: "Fecha de nacimiento invalida.",
    preferredLanguageRequired: "Selecciona el idioma preferido para la atencion.",
    countryRequired: "Selecciona el pais de atencion.",
    clinicRegionRequired: "Selecciona una region o sede.",
    serviceTypeRequired: "Selecciona un servicio de atencion.",
    preferredDateRequired: "Selecciona una fecha preferida de cita.",
    preferredDatePast: "La fecha de cita no puede estar en el pasado.",
    payerTypeRequired: "Selecciona el tipo de cobertura o pago.",
    insuranceProviderRequired: "Para US con seguro, indica la aseguradora (minimo 2 caracteres).",
    policyNumberInvalid: "Para US con seguro, ingresa una poliza valida (6-25 caracteres).",
    healthNotesInvalid: "Describe antecedentes de salud relevantes o escribe 'No aplica'.",
    contactMethodRequired: "Selecciona el canal preferido de contacto.",
    bestTimeRequired: "Selecciona un horario de contacto.",
    consentPrivacyRequired: "Debes aceptar el tratamiento de datos para continuar.",
    consentRemindersRequired: "Debes aceptar recordatorios para completar la aplicacion.",
    formInvalid: "Revisa el formulario: hay campos incompletos o con formato invalido.",
    formSuccess: "Aplicacion enviada correctamente. Nuestro equipo te contactara pronto."
  },
  en: {
    firstNameInvalid: "Enter a valid first name (minimum 2 characters).",
    lastNameInvalid: "Enter a valid last name (minimum 2 characters).",
    emailInvalid: "Enter a valid email, for example name@email.com.",
    phoneInvalid: "Enter a valid phone number with at least 8 digits.",
    birthDateRequired: "Select your date of birth.",
    birthDateBeforeToday: "Date of birth must be earlier than today.",
    birthDateInvalid: "Invalid date of birth.",
    preferredLanguageRequired: "Select the preferred language for care.",
    countryRequired: "Select the country of care.",
    clinicRegionRequired: "Select a region or clinic.",
    serviceTypeRequired: "Select a care service.",
    preferredDateRequired: "Select a preferred appointment date.",
    preferredDatePast: "Appointment date cannot be in the past.",
    payerTypeRequired: "Select a coverage or payment type.",
    insuranceProviderRequired: "For US insured requests, enter the insurance provider (minimum 2 characters).",
    policyNumberInvalid: "For US insured requests, enter a valid policy number (6-25 characters).",
    healthNotesInvalid: "Describe relevant health history or type 'Not applicable'.",
    contactMethodRequired: "Select the preferred contact method.",
    bestTimeRequired: "Select a preferred contact time.",
    consentPrivacyRequired: "You must accept data processing to continue.",
    consentRemindersRequired: "You must accept reminders to complete the application.",
    formInvalid: "Review the form: there are incomplete or invalid fields.",
    formSuccess: "Application submitted successfully. Our team will contact you soon."
  }
};

function getCurrentLanguage() {
  return document.documentElement.lang === "en" ? "en" : "es";
}

function t(key) {
  const lang = getCurrentLanguage();
  return MESSAGES[lang][key] || MESSAGES.es[key] || "";
}

if (form) {
  const stepFieldGroups = [
    ["firstName", "lastName", "email", "phone", "birthDate", "preferredLanguage"],
    ["country", "clinicRegion", "serviceType", "preferredDate"],
    ["payerType", "insuranceProvider", "policyNumber"],
    ["healthNotes", "contactMethod", "bestTime", "consentPrivacy", "consentReminders"]
  ];

  const stepSections = Array.from(form.querySelectorAll("fieldset[data-step-index]"));
  const nextButtons = Array.from(form.querySelectorAll("[data-step-next]"));
  const prevButtons = Array.from(form.querySelectorAll("[data-step-prev]"));
  const submitSection = form.querySelector("[data-submit-section]");
  let currentStep = 0;

  const fields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "birthDate",
    "preferredLanguage",
    "country",
    "clinicRegion",
    "serviceType",
    "preferredDate",
    "payerType",
    "insuranceProvider",
    "policyNumber",
    "healthNotes",
    "contactMethod",
    "bestTime",
    "consentPrivacy",
    "consentReminders"
  ];

  const validators = {
    firstName: (value) =>
      value.trim().length >= 2 ? "" : t("firstNameInvalid"),
    lastName: (value) =>
      value.trim().length >= 2 ? "" : t("lastNameInvalid"),
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ""
        : t("emailInvalid"),
    phone: (value) =>
      /^[+]?[-()\s\d]{8,20}$/.test(value)
        ? ""
        : t("phoneInvalid"),
    birthDate: (value) => {
      if (!value) return t("birthDateRequired");
      const date = new Date(value);
      const today = new Date();
      if (Number.isNaN(date.getTime()) || date >= today) {
        return t("birthDateBeforeToday");
      }
      const age = getAge(date, today);
      return age >= 0 ? "" : t("birthDateInvalid");
    },
    preferredLanguage: (value) =>
      value ? "" : t("preferredLanguageRequired"),
    country: (value) => (value ? "" : t("countryRequired")),
    clinicRegion: (value) => (value ? "" : t("clinicRegionRequired")),
    serviceType: (value) => (value ? "" : t("serviceTypeRequired")),
    preferredDate: (value) => {
      if (!value) return t("preferredDateRequired");
      const selected = new Date(value);
      const today = new Date();
      selected.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return selected >= today ? "" : t("preferredDatePast");
    },
    payerType: (value) => (value ? "" : t("payerTypeRequired")),
    insuranceProvider: (value) => {
      if (!requiresInsurance()) return "";
      return value.trim().length >= 2
        ? ""
        : t("insuranceProviderRequired");
    },
    policyNumber: (value) => {
      if (!requiresInsurance()) return "";
      return /^[A-Za-z0-9-]{6,25}$/.test(value.trim())
        ? ""
        : t("policyNumberInvalid");
    },
    healthNotes: (value) =>
      value.trim().length >= 5
        ? ""
        : t("healthNotesInvalid"),
    contactMethod: (value) =>
      value ? "" : t("contactMethodRequired"),
    bestTime: (value) => (value ? "" : t("bestTimeRequired")),
    consentPrivacy: (checked) =>
      checked ? "" : t("consentPrivacyRequired"),
    consentReminders: (checked) =>
      checked ? "" : t("consentRemindersRequired")
  };

  fields.forEach((fieldName) => {
    const element = document.getElementById(fieldName);
    if (!element) return;

    element.addEventListener("input", () => {
      if (element.getAttribute("aria-invalid") === "true") {
        validateField(fieldName);
      }
    });

    element.addEventListener("blur", () => {
      validateField(fieldName);
    });

    element.addEventListener("change", () => {
      if (fieldName === "country" || fieldName === "payerType") {
        validateField("insuranceProvider");
        validateField("policyNumber");
      }
      validateField(fieldName);
    });
  });

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const stepIndex = Number(button.getAttribute("data-step-next"));
      const result = validateGroupForNavigation(stepIndex);

      if (!result.valid) {
        showAlert("error", t("formInvalid"));
        if (result.firstInvalid) {
          const firstField = document.getElementById(result.firstInvalid);
          if (firstField) firstField.focus();
        }
        return;
      }

      showStep(stepIndex + 1);
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const stepIndex = Number(button.getAttribute("data-step-prev"));
      showStep(stepIndex - 1);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const errors = fields
      .map((fieldName) => ({ fieldName, error: validateField(fieldName) }))
      .filter((result) => result.error);

    if (errors.length > 0) {
      const firstField = document.getElementById(errors[0].fieldName);
      showAlert(
        "error",
        t("formInvalid")
      );
      if (firstField) firstField.focus();
      return;
    }

    showAlert(
      "success",
      t("formSuccess")
    );
    form.reset();

    fields.forEach((fieldName) => clearError(fieldName));
    showStep(0);
  });

  function isFieldValid(fieldName) {
    const element = document.getElementById(fieldName);
    if (!element) return false;

    const isCheckbox = element.type === "checkbox";
    const value = isCheckbox ? element.checked : element.value;
    const validator = validators[fieldName];
    const error = validator ? validator(value) : "";
    return error === "";
  }

  function validateGroup(stepIndex) {
    const group = stepFieldGroups[stepIndex] || [];
    const errors = group
      .map((fieldName) => ({ fieldName, error: validateField(fieldName) }))
      .filter((result) => result.error);

    return {
      valid: errors.length === 0,
      firstInvalid: errors.length > 0 ? errors[0].fieldName : ""
    };
  }

  function validateGroupForNavigation(stepIndex) {
    const group = stepFieldGroups[stepIndex] || [];

    for (let i = 0; i < group.length; i += 1) {
      const fieldName = group[i];
      const element = document.getElementById(fieldName);
      if (!element) continue;

      if ((fieldName === "insuranceProvider" || fieldName === "policyNumber") && !requiresInsurance()) {
        clearError(fieldName);
        continue;
      }

      const isCheckbox = element.type === "checkbox";
      const isEmpty = isCheckbox ? !element.checked : String(element.value || "").trim() === "";

      if (isEmpty) {
        const message = validateField(fieldName);
        return { valid: false, firstInvalid: fieldName, message };
      }

      clearError(fieldName);
    }

    return { valid: true, firstInvalid: "", message: "" };
  }

  function showStep(stepIndex) {
    const target = Math.max(0, Math.min(stepSections.length - 1, stepIndex));
    currentStep = target;

    stepSections.forEach((section, index) => {
      const shouldShow = index === currentStep;
      section.classList.toggle("hidden", !shouldShow);
      section.style.display = shouldShow ? "" : "none";
    });

    if (submitSection) {
      const isLastStep = currentStep === stepSections.length - 1;
      submitSection.classList.toggle("hidden", !isLastStep);
      submitSection.style.display = isLastStep ? "" : "none";
    }
  }

  function validateField(fieldName) {
    const element = document.getElementById(fieldName);
    if (!element) return "";

    const isCheckbox = element.type === "checkbox";
    const value = isCheckbox ? element.checked : element.value;
    const validator = validators[fieldName];
    const error = validator ? validator(value) : "";

    if (error) {
      setError(fieldName, error);
    } else {
      clearError(fieldName);
    }

    return error;
  }

  function setError(fieldName, message) {
    const element = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (!element || !errorElement) return;

    element.setAttribute("aria-invalid", "true");
    element.classList.add("border-red-500", "bg-red-50");
    errorElement.textContent = message;
  }

  function clearError(fieldName) {
    const element = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (!element || !errorElement) return;

    element.removeAttribute("aria-invalid");
    element.classList.remove("border-red-500", "bg-red-50");
    errorElement.textContent = "";
  }

  function showAlert(type, message) {
    alertBox.textContent = message;
    alertBox.classList.remove("hidden", "border-red-300", "bg-red-50", "text-red-800", "border-emerald-300", "bg-emerald-50", "text-emerald-800");

    if (type === "error") {
      alertBox.classList.add("border-red-300", "bg-red-50", "text-red-800");
    } else {
      alertBox.classList.add("border-emerald-300", "bg-emerald-50", "text-emerald-800");
    }
  }

  function requiresInsurance() {
    const country = document.getElementById("country")?.value;
    const payerType = document.getElementById("payerType")?.value;
    return country === "US" && payerType !== "self-pay";
  }

  function getAge(birthDate, today) {
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    return age;
  }

  showStep(0);
}
