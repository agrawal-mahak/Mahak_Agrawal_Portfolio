/* Site Preloader Progress Simulation & Window Load Fade */
const preloader = document.getElementById("sitePreloader");
const preloaderBar = document.getElementById("preloaderBar");
const preloaderStatus = document.getElementById("preloaderStatus");

if (preloader && preloaderBar) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 12;
    if (progress >= 90) {
      progress = 90;
      clearInterval(interval);
    }
    preloaderBar.style.width = `${progress}%`;
  }, 100);

  window.addEventListener("load", () => {
    clearInterval(interval);
    preloaderBar.style.width = "100%";
    if (preloaderStatus) preloaderStatus.textContent = "Workspace Ready!";
    setTimeout(() => {
      preloader.classList.add("fade-out");
    }, 350);
  });
}

/* Image Skeleton Loader Helper */
function handleImageLoaded(imgEl) {
  if (!imgEl) return;
  imgEl.classList.add("loaded");
  const wrapper = imgEl.closest(".img-loader-wrapper");
  if (wrapper) wrapper.classList.add("done");
}
window.handleImageLoaded = handleImageLoaded;

// Auto-check images that finished loading before script parsed
function checkImagesOnLoad() {
  document.querySelectorAll(".img-loader-wrapper img").forEach((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      handleImageLoaded(img);
    } else {
      img.addEventListener("load", () => handleImageLoaded(img));
    }
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkImagesOnLoad);
} else {
  checkImagesOnLoad();
}

/* Particle Background Canvas */
const canvas = document.getElementById("particleCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
if (canvas) {
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.color = Math.random() > 0.5 ? "#00C9A7" : "#0077B5";
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 40; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* Typing Text Animation */
const phrases = [
  "Full Stack Developer (MERN)",
  "Frontend Engineer (React & Next.js)",
  "Building Scalable Enterprise ERPs",
  "REST API & Microservices Developer",
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typingEl = document.getElementById("typingText");

function typeLoop() {
  if (!typingEl) return;
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typingEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
  }

  let typeSpeed = isDeleting ? 40 : 80;

  if (!isDeleting && charIdx === current.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    typeSpeed = 500;
  }

  setTimeout(typeLoop, typeSpeed);
}
if (typingEl) typeLoop();

/* Theme Toggle Handler (Desktop & Mobile Drawer) */
const themeToggleBtn = document.getElementById("themeToggle");
const mobileThemeToggleBtn = document.getElementById("mobileThemeToggle");
const mobileThemeIcon = document.getElementById("mobileThemeIcon");
const mobileThemeText = document.getElementById("mobileThemeText");

function toggleThemeMode() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);

  if (themeToggleBtn) {
    themeToggleBtn.innerHTML =
      newTheme === "dark"
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun" style="color:#F59E0B;"></i>';
  }
  if (mobileThemeIcon && mobileThemeText) {
    mobileThemeIcon.className =
      newTheme === "dark" ? "fas fa-moon" : "fas fa-sun";
    mobileThemeIcon.style.color = newTheme === "dark" ? "" : "#F59E0B";
    mobileThemeText.textContent =
      newTheme === "dark" ? "Theme (Dark)" : "Theme (Light)";
  }
}

if (themeToggleBtn)
  themeToggleBtn.addEventListener("click", toggleThemeMode);
if (mobileThemeToggleBtn)
  mobileThemeToggleBtn.addEventListener("click", toggleThemeMode);

/* Mobile Menu Toggle & Lock Scroll */
const mobileToggle = document.getElementById("mobileToggle");
const navLinks = document.getElementById("navLinks");
const menuIcon = document.getElementById("menuIcon");

if (mobileToggle && navLinks) {
  mobileToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    if (navLinks.classList.contains("active")) {
      if (menuIcon) {
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-times");
      }
    } else {
      if (menuIcon) {
        menuIcon.classList.remove("fa-times");
        menuIcon.classList.add("fa-bars");
      }
    }
  });
}

// Close mobile nav on link click & set active link
const spySections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

navAnchors.forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks) navLinks.classList.remove("active");
    if (menuIcon) {
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");
    }
    navAnchors.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

function syncActiveNavOnScroll() {
  let currentId = "";
  const scrollPosition = window.scrollY + 250;

  spySections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      currentId = section.getAttribute("id");
    }
  });

  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 60
  ) {
    currentId = "contact";
  }

  if (currentId) {
    navAnchors.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
}

window.addEventListener("scroll", syncActiveNavOnScroll, {
  passive: true,
});
window.addEventListener("resize", syncActiveNavOnScroll, {
  passive: true,
});
setTimeout(syncActiveNavOnScroll, 100);

/* Project Category Filtering */
function filterProjects(category) {
  const cards = document.querySelectorAll(".project-card");
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((btn) => btn.classList.remove("active"));
  if (window.event && window.event.target) {
    window.event.target.classList.add("active");
  }

  cards.forEach((card) => {
    if (
      category === "all" ||
      card.getAttribute("data-category") === category
    ) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

/* Skill Category Filter Tabs */
const skillTabBtns = document.querySelectorAll(".skill-tab-btn");
const skillCategoryCards = document.querySelectorAll(".skill-category-card");

skillTabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    skillTabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.getAttribute("data-category");

    skillCategoryCards.forEach((card) => {
      if (category === "all" || card.getAttribute("data-category") === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

/* Skill Live Search Filter */
const skillSearchInput = document.getElementById("skillSearch");
if (skillSearchInput) {
  skillSearchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const skillItems = document.querySelectorAll(".skill-item");

    skillItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });
}

/* Coffee Calculator Interaction */
const coffeeSlider = document.getElementById("coffeeSlider");
const coffeeCups = document.getElementById("coffeeCups");
const linesOfCode = document.getElementById("linesOfCode");
const bugsSlain = document.getElementById("bugsSlain");

if (coffeeSlider && coffeeCups && linesOfCode && bugsSlain) {
  coffeeSlider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    coffeeCups.textContent = `${val} ☕`;
    linesOfCode.textContent = (val * 250).toLocaleString();
    bugsSlain.textContent = val * 4;
  });
}

/* Toast Notification Helper */
function showToast(msg = "Copied to clipboard!") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

/* Copy Email Toast */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copied to clipboard!");
  });
}

/* Real-Time & On-Blur Contact Form Input Validation */
const senderName = document.getElementById("senderName");
const senderEmail = document.getElementById("senderEmail");
const senderPhone = document.getElementById("senderPhone");
const senderMessage = document.getElementById("senderMessage");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const messageError = document.getElementById("messageError");

function showError(input, errorEl, msg) {
  if (!input || !errorEl) return;
  input.classList.add("input-error");
  errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
  errorEl.classList.add("visible");
}

function clearError(input, errorEl) {
  if (!input || !errorEl) return;
  input.classList.remove("input-error");
  errorEl.innerHTML = "";
  errorEl.classList.remove("visible");
}

function validateName() {
  if (!senderName) return true;
  const val = senderName.value.trim();
  if (!val) {
    showError(senderName, nameError, "Name is required.");
    return false;
  }
  clearError(senderName, nameError);
  return true;
}

function validateEmail() {
  if (!senderEmail) return true;
  const val = senderEmail.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val) {
    showError(senderEmail, emailError, "Email address is required.");
    return false;
  } else if (!emailRegex.test(val)) {
    showError(
      senderEmail,
      emailError,
      "Please enter a valid email address (e.g. sarah@company.com).",
    );
    return false;
  }
  clearError(senderEmail, emailError);
  return true;
}

function validatePhone() {
  if (!senderPhone) return true;
  const val = senderPhone.value.trim();
  if (!val) {
    clearError(senderPhone, phoneError);
    return true; // Optional field
  }
  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  if (val.length < 7 || !phoneRegex.test(val)) {
    showError(
      senderPhone,
      phoneError,
      "Please enter a valid phone number (e.g. +91 98765 43210).",
    );
    return false;
  }
  clearError(senderPhone, phoneError);
  return true;
}

function validateMessage() {
  if (!senderMessage) return true;
  const val = senderMessage.value.trim();
  if (!val) {
    showError(senderMessage, messageError, "Message cannot be empty.");
    return false;
  } else if (val.length < 5) {
    showError(
      senderMessage,
      messageError,
      "Message must be at least 5 characters long.",
    );
    return false;
  }
  clearError(senderMessage, messageError);
  return true;
}

if (senderName) {
  senderName.addEventListener("blur", validateName);
  senderName.addEventListener("input", () => {
    if (senderName.classList.contains("input-error")) validateName();
  });
}
if (senderEmail) {
  senderEmail.addEventListener("blur", validateEmail);
  senderEmail.addEventListener("input", () => {
    if (senderEmail.classList.contains("input-error")) validateEmail();
  });
}
if (senderPhone) {
  senderPhone.addEventListener("blur", validatePhone);
  senderPhone.addEventListener("input", () => {
    if (senderPhone.classList.contains("input-error")) validatePhone();
  });
}
if (senderMessage) {
  senderMessage.addEventListener("blur", validateMessage);
  senderMessage.addEventListener("input", () => {
    if (senderMessage.classList.contains("input-error"))
      validateMessage();
  });
}

/* Direct Email Contact Form Handler (FormSubmit AJAX API with FormData & Activation Detection) */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isMessageValid = validateMessage();

    if (
      !isNameValid ||
      !isEmailValid ||
      !isPhoneValid ||
      !isMessageValid
    ) {
      return;
    }

    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalBtnContent = btn.innerHTML;

    const formData = new FormData(form);

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/agrawalmahak7@gmail.com",
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        },
      );

      const data = await response.json();

      if (
        response.ok &&
        (data.success === "true" || data.success === true)
      ) {
        showToast("🚀 Message sent directly to Mahak's Inbox!");
        form.reset();
      } else if (
        data.message &&
        data.message.toLowerCase().includes("activate")
      ) {
        alert(
          'FormSubmit Activation Required:\n\nFormSubmit sent an activation email to agrawalmahak7@gmail.com. Please check your Gmail inbox (or Spam folder) and click "Activate Form" once to start receiving messages!',
        );
      } else {
        form.submit();
      }
    } catch (err) {
      form.submit();
    } finally {
      btn.innerHTML = originalBtnContent;
      btn.disabled = false;
    }
  });
}

/* Interactive Terminal CLI */
const terminalFab = document.getElementById("terminalFab");
const terminalModal = document.getElementById("terminalModal");
const terminalInput = document.getElementById("terminalInput");
const terminalBody = document.getElementById("terminalBody");

if (terminalFab && terminalModal && terminalInput) {
  terminalFab.addEventListener("click", () => {
    terminalModal.classList.toggle("active");
    if (terminalModal.classList.contains("active")) {
      terminalInput.focus();
    }
  });
}

function closeTerminal() {
  if (terminalModal) terminalModal.classList.remove("active");
}

if (terminalInput && terminalBody) {
  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmd = terminalInput.value.trim().toLowerCase();
      terminalInput.value = "";

      const line = document.createElement("div");
      line.style.margin = "4px 0";
      line.innerHTML = `<span style="color:#00C9A7;">guest@mahak:~$</span> ${cmd}`;
      terminalBody.appendChild(line);

      const response = document.createElement("div");
      response.style.color = "#F1F5F9";
      response.style.marginBottom = "12px";

      switch (cmd) {
        case "help":
          response.innerHTML = `Available commands:<br>- <span style="color:#F59E0B">skills</span>: List top technical skills<br>- <span style="color:#F59E0B">experience</span>: View career experience summary<br>- <span style="color:#F59E0B">projects</span>: View key project titles<br>- <span style="color:#F59E0B">contact</span>: Show email & social links<br>- <span style="color:#F59E0B">hire</span>: Why hire Mahak?<br>- <span style="color:#F59E0B">clear</span>: Clear terminal`;
          break;
        case "skills":
          response.innerHTML = `React.js, Next.js, Redux Toolkit, Node.js, Express.js, TypeScript, JavaScript (ES6+), MongoDB, MySQL, Docker, Kubernetes, Material UI, Tailwind CSS.`;
          break;
        case "experience":
          response.innerHTML = `1. Smart Marine Teknoloji (Frontend Engineer): Built 15+ ERP modules, reduced data pipeline speeds 8s->2s.<br>2. Chawla Auto Components (Intern): Built e-commerce frontend & sales analytics dashboards.`;
          break;
        case "projects":
          response.innerHTML = `1. Smart Marine ERP System<br>2. Marine Supply Chain Analytics<br>3. StudyNotion EdTech Platform<br>4. TaskFlow Project Management<br>5. E-Shop E-Commerce Suite`;
          break;
        case "contact":
          response.innerHTML = `Email: agrawalmahak7@gmail.com<br>LinkedIn: linkedin.com/in/mahak-agrawal-372a41236/<br>GitHub: github.com/agrawal-mahak`;
          break;
        case "hire":
          response.innerHTML = `<span style="color:#10B981;">95% Sprint delivery rate, 2+ years exp, zero critical bugs in prod, full stack proficiency across React + Node!</span>`;
          break;
        case "clear":
          terminalBody.innerHTML = "";
          return;
        default:
          response.innerHTML = `Command not recognized '${cmd}'. Type <span style="color:#F59E0B;">'help'</span> for a list of commands.`;
      }

      terminalBody.appendChild(response);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });
}

function openResumeModal() {
  window.open(
    "https://drive.google.com/file/d/1FjpOu3j_ke-Tiw4ofGkiV73xrnn1YdWl/view",
    "_blank",
  );
}

/* High-Performance Smooth Interactive Custom Cursor System */
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
const cursorGlow = document.getElementById("cursorGlow");

if (window.innerWidth >= 992 && cursorDot && cursorRing) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let ringX = mouseX;
  let ringY = mouseY;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    if (cursorGlow) {
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const interactiveSelector =
    "a, button, input, textarea, select, .btn, .card, .project-card, .editor-tab, .filter-tab-btn, .skill-card, .tech-pill, .stat-card";

  document.body.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursorRing.classList.add("cursor-hover");
      cursorDot.classList.add("cursor-hover");
    }
  });

  document.body.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursorRing.classList.remove("cursor-hover");
      cursorDot.classList.remove("cursor-hover");
    }
  });

  window.addEventListener("mousedown", () => {
    cursorRing.classList.add("cursor-active");
  });
  window.addEventListener("mouseup", () => {
    cursorRing.classList.remove("cursor-active");
  });

  document.addEventListener("mouseleave", () => {
    cursorDot.style.opacity = "0";
    cursorRing.style.opacity = "0";
    if (cursorGlow) cursorGlow.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursorDot.style.opacity = "1";
    cursorRing.style.opacity = "1";
    if (cursorGlow) cursorGlow.style.opacity = "1";
  });
}

/* React.js Frontend Code Playground Snippets */
const codeSnippets = {
  datagrid: `<span class="syn-cm">// ERPDataGrid.jsx - High-Performance Enterprise Data Grid with Debounced Search & Memoization</span>\n<span class="syn-kw">import</span> React, { useState, useMemo, useCallback } <span class="syn-kw">from</span> <span class="syn-str">'react'</span>;\n<span class="syn-kw">import</span> { useERPState } <span class="syn-kw">from</span> <span class="syn-str">'../hooks/useERPState'</span>;\n<span class="syn-kw">import</span> { useDebounce } <span class="syn-kw">from</span> <span class="syn-str">'../hooks/useDebounce'</span>;\n\n<span class="syn-kw">export const</span> <span class="syn-fn">ERPDataGrid</span> = ({ category = <span class="syn-str">'all'</span> }) => {\n    <span class="syn-kw">const</span> { items, isLoading, page, totalRecords, fetchNextPage } = <span class="syn-fn">useERPState</span>({ category });\n    <span class="syn-kw">const</span> [searchQuery, setSearchQuery] = <span class="syn-fn">useState</span>(<span class="syn-str">''</span>);\n\n    <span class="syn-cm">// Debounce search query to prevent unnecessary re-renders on 10,000+ items</span>\n    <span class="syn-kw">const</span> debouncedSearch = <span class="syn-fn">useDebounce</span>(searchQuery, <span class="syn-num">300</span>);\n\n    <span class="syn-kw">const</span> filteredItems = <span class="syn-fn">useMemo</span>(() => {\n        <span class="syn-kw">if</span> (!debouncedSearch.trim()) <span class="syn-kw">return</span> items;\n        <span class="syn-kw">const</span> term = debouncedSearch.toLowerCase();\n        <span class="syn-kw">return</span> items.<span class="syn-fn">filter</span>((row) => \n            row.skuCode.toLowerCase().<span class="syn-fn">includes</span>(term) || \n            row.title.toLowerCase().<span class="syn-fn">includes</span>(term)\n        );\n    }, [items, debouncedSearch]);\n\n    <span class="syn-kw">const</span> handleSearchChange = <span class="syn-fn">useCallback</span>((e) => {\n        <span class="syn-fn">setSearchQuery</span>(e.target.value);\n    }, []);\n\n    <span class="syn-kw">return</span> (\n        &lt;<span class="syn-kw">div</span> className=<span class="syn-str">"erp-grid-container"</span>&gt;\n            &lt;<span class="syn-kw">header</span> className=<span class="syn-str">"erp-grid-toolbar"</span>&gt;\n                &lt;<span class="syn-kw">input</span> \n                    type=<span class="syn-str">"search"</span> \n                    className=<span class="syn-str">"erp-search-input"</span> \n                    placeholder=<span class="syn-str">"Filter 10,000+ ERP inventory records..."</span> \n                    value={searchQuery} \n                    onChange={handleSearchChange} \n                /&gt;\n                &lt;<span class="syn-kw">span</span> className=<span class="syn-str">"record-counter"</span>&gt;Total: {filteredItems.length} items&lt;/<span class="syn-kw">span</span>&gt;\n            &lt;/<span class="syn-kw">header</span>&gt;\n\n            {isLoading ? (\n                &lt;<span class="syn-kw">div</span> className=<span class="syn-str">"grid-skeleton-loader"</span>&gt;Loading ERP pipeline...&lt;/<span class="syn-kw">div</span>&gt;\n            ) : (\n                &lt;<span class="syn-kw">table</span> className=<span class="syn-str">"erp-table"</span>&gt;\n                    &lt;<span class="syn-kw">thead</span>&gt;\n                        &lt;<span class="syn-kw">tr</span>&gt;\n                            &lt;<span class="syn-kw">th</span>&gt;SKU Code&lt;/<span class="syn-kw">th</span>&gt;\n                            &lt;<span class="syn-kw">th</span>&gt;Item Name&lt;/<span class="syn-kw">th</span>&gt;\n                            &lt;<span class="syn-kw">th</span>&gt;Stock Status&lt;/<span class="syn-kw">th</span>&gt;\n                        &lt;/<span class="syn-kw">tr</span>&gt;\n                    &lt;/<span class="syn-kw">thead</span>&gt;\n                    &lt;<span class="syn-kw">tbody</span>&gt;\n                        {filteredItems.<span class="syn-fn">map</span>((row) =&gt; (\n                            &lt;<span class="syn-kw">tr</span> key={row.id}&gt;\n                                &lt;<span class="syn-kw">td</span>&gt;&lt;<span class="syn-kw">code</span>&gt;{row.skuCode}&lt;/<span class="syn-kw">code</span>&gt;&lt;/<span class="syn-kw">td</span>&gt;\n                                &lt;<span class="syn-kw">td</span>&gt;{row.title}&lt;/<span class="syn-kw">td</span>&gt;\n                                &lt;<span class="syn-kw">td</span>&gt;&lt;<span class="syn-kw">span</span> className=<span class="syn-str">"stock-badge"</span>&gt;{row.stockQuantity} in stock&lt;/<span class="syn-kw">span</span>&gt;&lt;/<span class="syn-kw">td</span>&gt;\n                            &lt;/<span class="syn-kw">tr</span>&gt;\n                        ))}\n                    &lt;/<span class="syn-kw">tbody</span>&gt;\n                &lt;/<span class="syn-kw">table</span>&gt;\n            )}\n        &lt;/<span class="syn-kw">div</span>&gt;\n    );\n};`,
  redux: `<span class="syn-cm">// useERPState.js - Custom React Hook for Redux Toolkit State Management & Pagination</span>\n<span class="syn-kw">import</span> { useSelector, useDispatch } <span class="syn-kw">from</span> <span class="syn-str">'react-redux'</span>;\n<span class="syn-kw">import</span> { useCallback, useEffect } <span class="syn-kw">from</span> <span class="syn-str">'react'</span>;\n<span class="syn-kw">import</span> { fetchInventoryPage, selectERPData } <span class="syn-kw">from</span> <span class="syn-str">'../store/slices/inventorySlice'</span>;\n\n<span class="syn-kw">export const</span> <span class="syn-fn">useERPState</span> = ({ category = <span class="syn-str">'all'</span>, pageSize = <span class="syn-num">50</span> } = {}) => {\n    <span class="syn-kw">const</span> dispatch = <span class="syn-fn">useDispatch</span>();\n    <span class="syn-kw">const</span> { items, isLoading, page, totalRecords, error } = <span class="syn-fn">useSelector</span>(selectERPData);\n\n    <span class="syn-kw">const</span> fetchNextPage = <span class="syn-fn">useCallback</span>(() => {\n        <span class="syn-kw">if</span> (!isLoading && items.length &lt; totalRecords) {\n            dispatch(<span class="syn-fn">fetchInventoryPage</span>({ page: page + <span class="syn-num">1</span>, limit: pageSize, category }));\n        }\n    }, [dispatch, isLoading, items.length, totalRecords, page, pageSize, category]);\n\n    <span class="syn-fn">useEffect</span>(() => {\n        <span class="syn-kw">if</span> (items.length === <span class="syn-num">0</span>) {\n            dispatch(<span class="syn-fn">fetchInventoryPage</span>({ page: <span class="syn-num">1</span>, limit: pageSize, category }));\n        }\n    }, [dispatch, items.length, pageSize, category]);\n\n    <span class="syn-kw">return</span> { items, isLoading, page, totalRecords, error, fetchNextPage };\n};`,
  context: `<span class="syn-cm">// ThemeContext.jsx - Accessible React Context API Theme Provider with System Preference Fallback</span>\n<span class="syn-kw">import</span> React, { createContext, useContext, useState, useEffect, useCallback } <span class="syn-kw">from</span> <span class="syn-str">'react'</span>;\n\n<span class="syn-kw">const</span> ThemeContext = <span class="syn-fn">createContext</span>(undefined);\n\n<span class="syn-kw">export const</span> <span class="syn-fn">ThemeProvider</span> = ({ children }) => {\n    <span class="syn-kw">const</span> [theme, setTheme] = <span class="syn-fn">useState</span>(() => {\n        <span class="syn-kw">const</span> savedTheme = localStorage.<span class="syn-fn">getItem</span>(<span class="syn-str">'theme'</span>);\n        <span class="syn-kw">if</span> (savedTheme) <span class="syn-kw">return</span> savedTheme;\n        <span class="syn-kw">return</span> window.<span class="syn-fn">matchMedia</span>(<span class="syn-str">'(prefers-color-scheme: dark)'</span>).matches ? <span class="syn-str">'dark'</span> : <span class="syn-str">'light'</span>;\n    });\n\n    <span class="syn-fn">useEffect</span>(() => {\n        <span class="syn-kw">const</span> root = document.documentElement;\n        root.<span class="syn-fn">setAttribute</span>(<span class="syn-str">'data-theme'</span>, theme);\n        localStorage.<span class="syn-fn">setItem</span>(<span class="syn-str">'theme'</span>, theme);\n    }, [theme]);\n\n    <span class="syn-kw">const</span> toggleTheme = <span class="syn-fn">useCallback</span>(() => {\n        <span class="syn-fn">setTheme</span>((prevTheme) => (prevTheme === <span class="syn-str">'dark'</span> ? <span class="syn-str">'light'</span> : <span class="syn-str">'dark'</span>));\n    }, []);\n\n    <span class="syn-kw">return</span> (\n        &lt;<span class="syn-kw">ThemeContext.Provider</span> value={{ theme, toggleTheme }}&gt;\n            {children}\n        &lt;/<span class="syn-kw">ThemeContext.Provider</span>&gt;\n    );\n};\n\n<span class="syn-kw">export const</span> <span class="syn-fn">useTheme</span> = () => {\n    <span class="syn-kw">const</span> context = <span class="syn-fn">useContext</span>(ThemeContext);\n    <span class="syn-kw">if</span> (!context) {\n        <span class="syn-kw">throw new</span> <span class="syn-fn">Error</span>(<span class="syn-str">'useTheme must be used within a ThemeProvider'</span>);\n    }\n    <span class="syn-kw">return</span> context;\n};`,
  ts: `<span class="syn-cm">// erpTypes.ts - Enterprise TypeScript Schema & Strict Type Definitions</span>\n<span class="syn-kw">export enum</span> StockStatus {\n    IN_STOCK = <span class="syn-str">'IN_STOCK'</span>,\n    LOW_STOCK = <span class="syn-str">'LOW_STOCK'</span>,\n    OUT_OF_STOCK = <span class="syn-str">'OUT_OF_STOCK'</span>,\n}\n\n<span class="syn-kw">export interface</span> InventoryItem {\n    id: <span class="syn-kw">string</span>;\n    skuCode: <span class="syn-kw">string</span>;\n    title: <span class="syn-kw">string</span>;\n    category: <span class="syn-kw">string</span>;\n    price: <span class="syn-kw">number</span>;\n    stockQuantity: <span class="syn-kw">number</span>;\n    status: StockStatus;\n    lastUpdated: <span class="syn-kw">string</span>;\n}\n\n<span class="syn-kw">export interface</span> PaginatedResponse&lt;<span class="syn-fn">T</span>&gt; {\n    data: <span class="syn-fn">T</span>[];\n    page: <span class="syn-kw">number</span>;\n    limit: <span class="syn-kw">number</span>;\n    totalRecords: <span class="syn-kw">number</span>;\n    hasMore: <span class="syn-kw">boolean</span>;\n}\n\n<span class="syn-kw">export type</span> ERPDataState = {\n    items: InventoryItem[];\n    isLoading: <span class="syn-kw">boolean</span>;\n    error: <span class="syn-kw">string</span> | <span class="syn-kw">null</span>;\n    page: <span class="syn-kw">number</span>;\n    totalRecords: <span class="syn-kw">number</span>;\n};`,
};

function switchCodeTab(tabKey) {
  document
    .querySelectorAll(".editor-tab")
    .forEach((btn) => btn.classList.remove("active"));
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add("active");
  }
  const codeBlock = document.getElementById("codeBlock");
  if (codeBlock && codeSnippets[tabKey]) {
    codeBlock.innerHTML = codeSnippets[tabKey];
  }
}

function copyCurrentCodeSnippet() {
  const codeBlock = document.getElementById("codeBlock");
  if (codeBlock) {
    const plainText = codeBlock.innerText;
    navigator.clipboard.writeText(plainText).then(() => {
      showToast("📋 Code snippet copied to clipboard!");
    });
  }
}

/* Project Modal Quick View */
function openProjectModal(title, desc, category, repoUrl) {
  const modal = document.getElementById("projectModal");
  const content = document.getElementById("projectModalContent");
  if (!modal || !content) return;

  content.innerHTML = `
          <div style="font-size: 2.2rem; margin-bottom: 10px;">🚀</div>
          <h3 style="font-size: 1.5rem; color: var(--accent-cyan); margin-bottom: 10px;">${title}</h3>
          <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px;">${desc}</p>
          <div style="margin-bottom: 20px;">
              <span class="tech-pill">${category}</span>
              <span class="tech-pill">Enterprise Production</span>
          </div>
          <a href="${repoUrl}" target="_blank" class="btn btn-primary" style="display: inline-flex; gap: 8px;">
              <i class="fab fa-github"></i> Inspect GitHub Repository
          </a>
      `;
  modal.classList.add("active");
}

function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  if (modal) modal.classList.remove("active");
}

/* Location Map Modal Functions */
function openLocationMapModal() {
  const modal = document.getElementById("locationMapModal");
  if (modal) modal.classList.add("active");
}

function closeLocationMapModal() {
  const modal = document.getElementById("locationMapModal");
  if (modal) modal.classList.remove("active");
}

window.openLocationMapModal = openLocationMapModal;
window.closeLocationMapModal = closeLocationMapModal;
