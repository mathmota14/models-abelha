document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector(".gallery-grid");
  const sectionTitle = document.querySelector(".section-title");
  const loadMoreContainer = document.querySelector(".load-more-container");
  const loadMoreBtn = document.querySelector(".btn-load-more");

  const dialog = document.getElementById("image-dialog");
  const dialogImg = document.getElementById("dialog-img");
  const closeBtn = document.getElementById("close-dialog");

  let models = [];
  let currentIndex = 0;

  try {
    const response = await fetch("models.json");
    if (!response.ok) throw new Error("JSON response was not ok");

    models = await response.json();
    models.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error("Error loading models:", error);
  }

  if (sectionTitle) {
    sectionTitle.textContent = `MEUS TRABALHOS (${models.length})`;
  }

  // Display error message if models don't load
  if (models.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p style="font-size: 1.5rem; font-weight: bold;">
          Não foi possível carregar os modelos
        </p>
      </div>
    `;
    return;
  }

  // Function that generate cards
  function createModelCard(model, index) {
    const card = document.createElement("div");
    card.className = "model-card";

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-bg-effect"></div>
        <img src="${model.image}" class="card-icon card-icon-full">
        <div class="card-badge">
          #${(index + 1).toString().padStart(2, "0")}
        </div>
      </div>
      <div class="card-footer">
        <h4 class="card-title">${model.title}</h4>
      </div>
    `;

    // When card is clicked, update dialog image first then open it
    card.addEventListener("click", () => {
      const tempImg = new Image();

      tempImg.onload = () => {
        dialogImg.src = model.image;
        dialog.showModal();
      };

      tempImg.src = model.image;
    });

    return card;
  }

  // Closes if user clicked on backdrop or on the button
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target === closeBtn) {
      dialog.close();
    }
  });

  // Function to determine how many items to load based on the screen width
  function getItemsPerLoad() {
    const width = window.innerWidth;
    if (width >= 1024) {
      return 16;
    } else if (width >= 768) {
      return 12;
    } else {
      return 6;
    }
  }

  // Function to load more items
  function loadMoreItems() {
    const itemsPerLoad = getItemsPerLoad();
    const endIndex = Math.min(currentIndex + itemsPerLoad, models.length);

    for (let i = currentIndex; i < endIndex; i++) {
      const card = createModelCard(models[i], i);
      grid.appendChild(card);
    }

    currentIndex = endIndex;

    if (currentIndex >= models.length) {
      loadMoreContainer.classList.add("hidden");
    }
  }

  // Loads the first items
  loadMoreItems();

  if (currentIndex < models.length) {
    loadMoreContainer.classList.remove("hidden");
  }

  loadMoreBtn.addEventListener("click", () => {
    loadMoreItems();
  });
});
