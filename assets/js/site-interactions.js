document.addEventListener("DOMContentLoaded", () => {
  const bootText = document.querySelector(".js-boot-text");

  if (bootText && bootText.dataset.phrases) {
    const phrases = bootText.dataset.phrases
      .split("|")
      .map((phrase) => phrase.trim())
      .filter(Boolean);

    let phraseIndex = 0;

    window.setInterval(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      bootText.textContent = phrases[phraseIndex];
    }, 2600);
  }

  const board = document.querySelector("[data-interactive-board]");

  if (!board) {
    return;
  }

  const cards = Array.from(board.querySelectorAll(".js-signal-card"));
  const buttons = Array.from(board.querySelectorAll("[data-filter]"));
  const inspectorTitle = board.querySelector(".js-inspector-title");
  const inspectorDate = board.querySelector(".js-inspector-date");
  const inspectorSummary = board.querySelector(".js-inspector-summary");
  const inspectorLink = board.querySelector(".js-inspector-link");

  const selectCard = (card) => {
    cards.forEach((item) => item.classList.remove("is-selected"));
    card.classList.add("is-selected");

    if (inspectorTitle) {
      inspectorTitle.textContent = card.dataset.title || "";
    }

    if (inspectorDate) {
      inspectorDate.textContent = card.dataset.date || "";
    }

    if (inspectorSummary) {
      inspectorSummary.textContent = card.dataset.summary || "";
    }

    if (inspectorLink) {
      inspectorLink.href = card.dataset.link || "#";
      inspectorLink.textContent = card.dataset.cta || "Open entry";
    }
  };

  const applyFilter = (filter) => {
    let firstVisibleCard = null;

    cards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !matches);

      if (matches && !firstVisibleCard) {
        firstVisibleCard = card;
      }
    });

    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === filter);
    });

    if (firstVisibleCard) {
      selectCard(firstVisibleCard);
    }
  };

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => selectCard(card));
    card.addEventListener("focus", () => selectCard(card));
    card.addEventListener("click", () => selectCard(card));
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter || "all"));
  });

  applyFilter("all");
});
