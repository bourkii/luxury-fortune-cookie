document.addEventListener("DOMContentLoaded", async () => {
  const STORAGE_KEY = "luxury-fortune-history";
  const cookieButton = document.getElementById("fortuneCookie");
  const cookiePanel = document.getElementById("cookiePanel");
  const fortuneCard = document.getElementById("fortuneCard");
  const fortuneText = document.getElementById("fortuneText");
  const anotherFortuneButton = document.getElementById("anotherFortune");
  const confettiLayer = document.getElementById("confettiLayer");

  if (!cookieButton || !cookiePanel || !fortuneCard || !fortuneText || !anotherFortuneButton || !confettiLayer) {
    console.error("Required fortune-cookie elements are missing.");
    return;
  }

  cookieButton.disabled = true;
  let fortunes;
  try {
    const response = await fetch("fortunes.json");
    if (!response.ok) {
      throw new Error(`Unable to load fortunes: ${response.status} ${response.statusText}`);
    }

    fortunes = await response.json();
    if (
      !Array.isArray(fortunes) ||
      fortunes.length === 0 ||
      fortunes.some((fortune) =>
        !fortune ||
        !Number.isInteger(fortune.id) ||
        typeof fortune.text !== "string" ||
        !fortune.text.trim()
      ) ||
      new Set(fortunes.map((fortune) => fortune.id)).size !== fortunes.length
    ) {
      throw new Error("Fortunes must be a non-empty array with unique integer IDs and non-empty text.");
    }
  } catch (error) {
    console.error("Unable to initialize fortune messages.", error);
    return;
  }

  let usedFortuneIds = loadUsedFortunes();
  let isOpening = false;

  function loadUsedFortunes() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Unable to read saved fortunes.", error);
      return [];
    }
  }

  function saveUsedFortunes() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usedFortuneIds));
    } catch (error) {
      console.warn("Unable to save fortunes.", error);
    }
  }

  function shuffleArray(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function getNextFortune() {
    let available = fortunes.filter((fortune) => !usedFortuneIds.includes(fortune.id));

    if (available.length === 0) {
      usedFortuneIds = [];
      saveUsedFortunes();
      available = [...fortunes];
    }

    const chosen = shuffleArray(available)[0];
    usedFortuneIds.push(chosen.id);
    saveUsedFortunes();
    return chosen.text;
  }

  function createConfetti() {
    confettiLayer.innerHTML = "";

    const colors = ["#b89b5e", "#f5f0e6", "#17352a", "#641f2a", "#d9c18d"];
    const totalPieces = 28;

    for (let index = 0; index < totalPieces; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";

      const angle = (Math.PI * 2 * index) / totalPieces;
      const radius = 90 + Math.random() * 110;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius + 50;
      const spin = (Math.random() * 500 - 250).toFixed(0);
      const duration = (1.6 + Math.random() * 1.5).toFixed(2);

      piece.style.setProperty("--x", `${x}px`);
      piece.style.setProperty("--y", `${y}px`);
      piece.style.setProperty("--spin", `${spin}deg`);
      piece.style.setProperty("--duration", `${duration}s`);
      piece.style.background = colors[index % colors.length];

      confettiLayer.appendChild(piece);
    }
  }

  function showCookie() {
    cookiePanel.classList.remove("is-hidden");
    cookieButton.classList.remove("hidden");
    cookieButton.disabled = false;
  }

  function hideCookie() {
    cookiePanel.classList.add("is-hidden");
    cookieButton.classList.add("hidden");
    cookieButton.disabled = true;
  }

  function showFortune(message) {
    fortuneText.textContent = message;
    fortuneCard.classList.remove("hidden");
    fortuneCard.classList.add("is-visible");
  }

  function hideFortune() {
    fortuneCard.classList.remove("is-visible");
    fortuneCard.classList.add("hidden");
  }

  function openFortuneCookie() {
    if (isOpening) return;
    isOpening = true;

    // Remove and re-add class to restart animation
    cookieButton.classList.remove("is-opening");
    // Force browser reflow to trigger animation restart
    void cookieButton.offsetWidth;
    cookieButton.classList.add("is-opening");

    createConfetti();
    const fortuneMessage = getNextFortune();

    setTimeout(() => {
      hideCookie();
      showFortune(fortuneMessage);
      anotherFortuneButton.classList.remove("hidden");
      anotherFortuneButton.disabled = false;
    }, 650);

    setTimeout(() => {
      cookieButton.classList.remove("is-opening");
      isOpening = false;
    }, 1250);
  }

  function resetForNewCycle() {
    anotherFortuneButton.classList.add("hidden");
    anotherFortuneButton.disabled = true;
    hideFortune();
    showCookie();
    isOpening = false;
    cookieButton.classList.remove("is-opening");
  }

  // Main click handler for cookie
  cookieButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openFortuneCookie();
  });

  // Click handler for another fortune button
  anotherFortuneButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    resetForNewCycle();
    setTimeout(() => {
      openFortuneCookie();
    }, 100);
  });

  // Keyboard support
  window.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && !cookieButton.classList.contains("hidden") && !isOpening) {
      event.preventDefault();
      openFortuneCookie();
    }

    if ((event.key === "Enter" || event.key === " ") && !anotherFortuneButton.classList.contains("hidden")) {
      event.preventDefault();
      anotherFortuneButton.click();
    }
  });

  // Initialize on page load
  function initialize() {
    hideFortune();
    anotherFortuneButton.classList.add("hidden");
    anotherFortuneButton.disabled = true;
    showCookie();
    isOpening = false;
    cookieButton.classList.remove("is-opening");

    if (usedFortuneIds.length >= fortunes.length) {
      usedFortuneIds = [];
      saveUsedFortunes();
    }
  }

  initialize();
});
