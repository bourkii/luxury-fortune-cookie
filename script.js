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

const STORAGE_KEY = "luxury-fortune-history";

const cookieButton = document.getElementById("fortuneCookie");
const cookiePanel = document.getElementById("cookiePanel");
const fortuneCard = document.getElementById("fortuneCard");
const fortuneText = document.getElementById("fortuneText");
const anotherFortuneButton = document.getElementById("anotherFortune");
const confettiLayer = document.getElementById("confettiLayer");

let usedFortuneIds = loadUsedFortuneIds();
let isOpening = false;

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function loadUsedFortuneIds() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Unable to read fortune history from localStorage.", error);
    return [];
  }
}

function saveUsedFortuneIds() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usedFortuneIds));
  } catch (error) {
    console.warn("Unable to save fortune history to localStorage.", error);
  }
}

function getNextFortune() {
  let available = fortunes.filter((fortune) => !usedFortuneIds.includes(fortune.id));

  if (!available.length) {
    usedFortuneIds = [];
    saveUsedFortuneIds();
    available = [...fortunes];
  }

  const shuffled = shuffleArray(available);
  const chosen = shuffled[0];

  usedFortuneIds.push(chosen.id);
  saveUsedFortuneIds();

  return chosen.text;
}

function createConfetti() {
  confettiLayer.innerHTML = "";

  const colors = ["#b89b5e", "#f5f0e6", "#17352a", "#641f2a", "#d9c18d"];
  const pieces = 26;

  for (let index = 0; index < pieces; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";

    const angle = (Math.PI * 2 * index) / pieces;
    const radius = 90 + Math.random() * 110;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius + 60;
    const spin = (Math.random() * 500 - 250).toFixed(0);
    const duration = (1.6 + Math.random() * 1.4).toFixed(2);

    piece.style.setProperty("--x", `${x}px`);
    piece.style.setProperty("--y", `${y}px`);
    piece.style.setProperty("--spin", `${spin}deg`);
    piece.style.setProperty("--duration", `${duration}s`);
    piece.style.background = colors[index % colors.length];
    piece.style.transform = `translate3d(0, 0, 0) rotate(${Math.random() * 360}deg)`;

    confettiLayer.appendChild(piece);
  }
}

function showFortuneMessage(message) {
  fortuneText.textContent = message;
  fortuneCard.classList.remove("hidden");
  fortuneCard.classList.add("is-visible");
}

function hideFortuneMessage() {
  fortuneCard.classList.remove("is-visible");
  fortuneCard.classList.add("hidden");
}

function resetToCookie() {
  cookieButton.classList.remove("is-opening");
  cookieButton.classList.remove("hidden");
  cookiePanel.classList.remove("is-hidden");
  anotherFortuneButton.classList.add("hidden");
  hideFortuneMessage();
  isOpening = false;
}

function openFortuneCookie() {
  if (isOpening) return;

  isOpening = true;
  cookieButton.classList.add("is-opening");
  createConfetti();

  const fortuneMessage = getNextFortune();

  window.setTimeout(() => {
    cookiePanel.classList.add("is-hidden");
    cookieButton.classList.add("hidden");
    showFortuneMessage(fortuneMessage);
    anotherFortuneButton.classList.remove("hidden");
  }, 650);

  window.setTimeout(() => {
    cookieButton.classList.remove("is-opening");
  }, 1250);
}

cookieButton.addEventListener("click", openFortuneCookie);

anotherFortuneButton.addEventListener("click", () => {
  anotherFortuneButton.classList.add("hidden");
  hideFortuneMessage();
  cookiePanel.classList.remove("is-hidden");
  cookieButton.classList.remove("hidden");
  cookieButton.classList.remove("is-opening");
  isOpening = false;
  openFortuneCookie();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    if (document.activeElement === cookieButton && !cookieButton.classList.contains("hidden")) {
      event.preventDefault();
      openFortuneCookie();
    }

    if (document.activeElement === anotherFortuneButton && !anotherFortuneButton.classList.contains("hidden")) {
      event.preventDefault();
      anotherFortuneButton.click();
    }
  }
});

window.addEventListener("load", () => {
  fortuneText.textContent = "Something beautiful is waiting for you today.";
});

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  cookieButton.style.animation = "none";
}

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
reducedMotionQuery.addEventListener?.("change", () => {
  cookieButton.style.animation = reducedMotionQuery.matches ? "none" : "float-cookie 5.2s ease-in-out infinite";
});

resetToCookie();

if (usedFortuneIds.length >= fortunes.length) {
  usedFortuneIds = [];
  saveUsedFortuneIds();
}

if (!fortuneCard.classList.contains("hidden")) {
  fortuneCard.classList.add("hidden");
}

if (cookieButton.classList.contains("hidden")) {
  cookieButton.classList.remove("hidden");
}

if (anotherFortuneButton.classList.contains("hidden") === false) {
  anotherFortuneButton.classList.add("hidden");
}

console.info("Luxury fortune cookie loaded successfully.");

























































































































































































































































































"path":"script.js"}]} oneTime use not allowed? Need check use of push_files schema maybe only branch, files message owner repo. I passed owner/repo absent? Wait I omitted owner, repo in JSON? I did pass branch/files only. Because instructions on push_files require owner and repo. I didn't include. Did tool accept maybe not because call valid? It likely failed? Need verify. It said 