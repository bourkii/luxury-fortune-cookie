const fortunes = [
  { id: 1, text: "Something beautiful is waiting for you today." },
  { id: 2, text: "A quiet confidence will carry you further than noise ever could." },
  { id: 3, text: "A small kindness will return to you in a remarkable way." },
  { id: 4, text: "The next right step is already taking shape, even if it is still hidden." },
  { id: 5, text: "An unexpected invitation will bring a lovely shift in your rhythm." },
  { id: 6, text: "Your patience is a form of wisdom, and it is working in your favor." },
  { id: 7, text: "A meaningful conversation is closer than you think." },
  { id: 8, text: "The gentlest path is not the least courageous one." },
  { id: 9, text: "A beautiful surprise will arrive with perfect timing." },
  { id: 10, text: "Your future holds a tender kind of brilliance." },
  { id: 11, text: "You are allowed to move with ease and still be deliberate." },
  { id: 12, text: "A sincere connection will bloom from an ordinary moment." },
  { id: 13, text: "A lovely chapter begins when you trust your instincts." },
  { id: 14, text: "The world is making room for your next beautiful decision." },
  { id: 15, text: "Your good fortune favors the steady heart." },
  { id: 16, text: "A modest act of courage will open a larger door." },
  { id: 17, text: "You will find what you are looking for in the place you least expect." },
  { id: 18, text: "Grace is returning to you in a more natural rhythm." },
  { id: 19, text: "A beloved old dream is beginning to feel newly possible." },
  { id: 20, text: "The right opportunity will arrive with calm certainty." },
  { id: 21, text: "Your life is becoming more aligned with your truest self." },
  { id: 22, text: "A delightful detail will remind you that beauty is already near." },
  { id: 23, text: "A little daring will bring a generous reward." },
  { id: 24, text: "The next chapter opens with elegance, not haste." },
  { id: 25, text: "A brief pause will reveal the answer you have been waiting for." },
  { id: 26, text: "You are closer to a meaningful change than you know." },
  { id: 27, text: "A memorable moment is quietly gathering itself around you." },
  { id: 28, text: "What feels uncertain today is preparing to become a blessing." },
  { id: 29, text: "A warm, honest joy is heading in your direction." },
  { id: 30, text: "Your life already contains more beauty than you can see from here." }
];

document.addEventListener("DOMContentLoaded", () => {
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
