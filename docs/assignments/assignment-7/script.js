const dealBtn = document.getElementById("deal-btn");
const gameArea = document.getElementById("game-area");
const discardPile = document.getElementById("discard-pile");
const eventMsg = document.getElementById("event-message");

const suits = ["S", "H", "C", "D"];
const deck = [];
for (const s of suits) {
  for (let i = 1; i <= 13; i++) {
    deck.push(`img/${s}${i}.svg`);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

dealBtn.addEventListener("click", () => {
  gameArea.innerHTML = "";
  const hand = shuffle([...deck]).slice(0, 5);
  hand.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "card-img";
    img.draggable = true;
    img.dataset.index = i;

    img.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", i);
      e.dataTransfer.effectAllowed = "move";
    });

    gameArea.appendChild(img);
  });

  eventMsg.textContent = "Cards dealt!";
});

discardPile.addEventListener("dragover", (e) => {
  e.preventDefault();
  discardPile.classList.add("drag-over");
});
discardPile.addEventListener("dragleave", () => {
  discardPile.classList.remove("drag-over");
});
discardPile.addEventListener("drop", (e) => {
  e.preventDefault();
  discardPile.classList.remove("drag-over");

  const index = e.dataTransfer.getData("text/plain");
  const card = gameArea.querySelector(`[data-index="${index}"]`);
  if (card) {
    card.remove();
    eventMsg.textContent = "Card discarded (event triggered).";
  }
});

// ===== Mobile touch support =====
let draggedCard = null;

gameArea.addEventListener("touchstart", handleTouchStart, { passive: false });
gameArea.addEventListener("touchmove", handleTouchMove, { passive: false });
gameArea.addEventListener("touchend", handleTouchEnd, { passive: false });

function handleTouchStart(e) {
  const target = e.target.closest(".card-img");
  if (!target) return;
  draggedCard = target;
  draggedCard.style.position = "absolute";
  draggedCard.style.zIndex = 1000;
}

function handleTouchMove(e) {
  if (!draggedCard) return;
  const touch = e.touches[0];
  draggedCard.style.left = `${touch.pageX - 40}px`;
  draggedCard.style.top = `${touch.pageY - 60}px`;
  e.preventDefault();
}

function handleTouchEnd(e) {
  if (!draggedCard) return;
  const touch = e.changedTouches[0];
  const pileRect = discardPile.getBoundingClientRect();

  if (
    touch.clientX > pileRect.left &&
    touch.clientX < pileRect.right &&
    touch.clientY > pileRect.top &&
    touch.clientY < pileRect.bottom
  ) {
    draggedCard.remove();
    eventMsg.textContent = "Card discarded (event triggered).";
  }

  draggedCard.style.position = "";
  draggedCard.style.left = "";
  draggedCard.style.top = "";
  draggedCard.style.zIndex = "";
  draggedCard = null;
}
