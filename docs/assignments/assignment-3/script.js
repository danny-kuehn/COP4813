(() => {
  const form = document.getElementById("contactForm");
  const confirmSection = document.getElementById("confirmSection");
  const confirmList = document.getElementById("confirmList");
  const editBtn = document.getElementById("editBtn");
  const sendBtn = document.getElementById("sendBtn");
  const errorSummary = document.getElementById("errorSummary");

  // Create simple CAPTCHA (random addition 1..9)
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const captchaTotal = a + b;
  const captchaLabel = document.getElementById("captchaLabel");
  captchaLabel.textContent = `Security check: What is ${a} + ${b}?`;

  // Helpers
  const setError = (name, message) => {
    const p =
      document.querySelector(`.error[data-for="${name}"]`) ||
      document.querySelector(`.error[data-for="${name}"]`);
    if (p) p.textContent = message || "";
  };

  const gatherValues = () => {
    const formData = new FormData(form);
    return {
      firstName: formData.get("firstName")?.trim(),
      lastName: formData.get("lastName")?.trim(),
      address: formData.get("address")?.trim(),
      city: formData.get("city")?.trim(),
      state: formData.get("state"),
      zip: formData.get("zip")?.trim(),
      phone: formData.get("phone")?.trim(),
      email: formData.get("email")?.trim(),
      birthdate: formData.get("birthdate"),
      message: formData.get("message")?.trim(),
      captchaAnswer: formData.get("captchaAnswer")?.trim(),
    };
  };

  const isFutureDate = (yyyy_mm_dd) => {
    if (!yyyy_mm_dd) return true;
    const today = new Date();
    const d = new Date(yyyy_mm_dd + "T00:00:00");
    // Strip time from today
    today.setHours(0, 0, 0, 0);
    return d.getTime() > today.getTime();
  };

  // Phone input mask: (000) 000-0000
  const phoneInput = document.getElementById("phone");
  phoneInput.addEventListener("input", (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    let out = "";
    if (digits.length > 0) out = "(" + digits.slice(0, 3);
    if (digits.length >= 4) out += ") " + digits.slice(3, 6);
    if (digits.length >= 7) out += "-" + digits.slice(6, 10);
    e.target.value = out;
  });

  const validate = () => {
    const v = gatherValues();
    let valid = true;
    const messages = [];

    // Reset per-field errors
    [
      "firstName",
      "lastName",
      "address",
      "city",
      "state",
      "zip",
      "phone",
      "email",
      "birthdate",
      "message",
      "captcha",
    ].forEach((k) => setError(k, ""));
    errorSummary.hidden = true;
    errorSummary.textContent = "";

    // Name
    if (!v.firstName) {
      valid = false;
      setError("firstName", "First name is required.");
      messages.push("First name is required.");
    }
    if (!v.lastName) {
      valid = false;
      setError("lastName", "Last name is required.");
      messages.push("Last name is required.");
    }

    // Address
    if (!v.address || v.address.length < 3 || !/\d+/.test(v.address)) {
      valid = false;
      setError(
        "address",
        'Enter a valid street address with a number, e.g., "123 Main St".',
      );
      messages.push("Street address is invalid.");
    }
    if (!v.city) {
      valid = false;
      setError("city", "City is required.");
      messages.push("City is required.");
    }
    if (!v.state) {
      valid = false;
      setError("state", "Select a state.");
      messages.push("State is required.");
    }
    if (!/^\d{5}(-\d{4})?$/.test(v.zip || "")) {
      valid = false;
      setError("zip", "Enter a 5-digit ZIP or ZIP+4.");
      messages.push("ZIP code is invalid.");
    }

    // Phone
    const phoneDigits = (v.phone || "").replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      valid = false;
      setError("phone", "Enter a 10-digit phone number, e.g., (555) 555-1234.");
      messages.push("Phone number is invalid.");
    }

    // Email
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email || "");
    if (!emailOk) {
      valid = false;
      setError("email", "Enter a valid email address.");
      messages.push("Email is invalid.");
    }

    // Birthdate
    if (!v.birthdate) {
      valid = false;
      setError("birthdate", "Birth date is required.");
      messages.push("Birth date is required.");
    } else if (isFutureDate(v.birthdate)) {
      valid = false;
      setError("birthdate", "Birth date cannot be in the future.");
      messages.push("Birth date cannot be in the future.");
    }

    // Message
    if (!v.message) {
      valid = false;
      setError("message", "Message is required.");
      messages.push("Message is required.");
    }

    // CAPTCHA
    if (parseInt(v.captchaAnswer, 10) !== captchaTotal) {
      valid = false;
      setError("captcha", "Incorrect answer. Try again.");
      messages.push("Security check answer is incorrect.");
    }

    if (!valid) {
      errorSummary.hidden = false;
      errorSummary.innerHTML =
        "<strong>Please fix the following:</strong><ul>" +
        messages.map((m) => `<li>${m}</li>`).join("") +
        "</ul>";
    }

    return valid;
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${m}/${d}/${y}`;
  };

  const showConfirm = () => {
    const v = gatherValues();
    const rows = [
      ["First name", v.firstName],
      ["Last name", v.lastName],
      ["Address", `${v.address}, ${v.city}, ${v.state} ${v.zip}`],
      ["Phone", v.phone],
      ["Email", v.email],
      ["Birth date", formatDate(v.birthdate)],
      ["Message", v.message],
    ];

    confirmList.innerHTML = rows
      .map(([dt, dd]) => {
        const safe = (dd || "")
          .toString()
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>");
        return `<dt>${dt}</dt><dd>${safe}</dd>`;
      })
      .join("");

    document.getElementById("contact-form-section").hidden = true;
    confirmSection.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showForm = () => {
    confirmSection.hidden = true;
    document.getElementById("contact-form-section").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validate()) {
      showConfirm();
    }
  });

  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showForm();
  });

  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const v = gatherValues();

    const lines = [
      `${v.firstName} ${v.lastName}`,
      `${v.address}, ${v.city}, ${v.state} ${v.zip}`,
      v.phone,
      v.email,
      formatDate(v.birthdate),
      "",
      v.message || "",
    ];

    const subject = encodeURIComponent(
      `New Contact – ${v.firstName} ${v.lastName}`.trim(),
    );

    const body = encodeURIComponent(lines.join("\n"));
    const mailto = `mailto:daniel@kuehn.foo?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  });
})();
