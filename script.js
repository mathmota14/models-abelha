document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector(".gallery-grid");
  const sectionTitle = document.querySelector(".section-title");

  const dialog = document.getElementById("image-dialog");
  const dialogImg = document.getElementById("dialog-img");
  const closeBtn = document.getElementById("close-dialog");

  let models = [];

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

  // Generate cards
  models.forEach((model, index) => {
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
    grid.appendChild(card);

    // When card is clicked, update dialog image first then open it
    card.addEventListener("click", () => {
      const tempImg = new Image();

      tempImg.onload = () => {
        dialogImg.src = model.image;
        dialog.showModal();
      };

      tempImg.src = model.image;
    });
  });

  // Closes if user clicked on backdrop or on the button
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target === closeBtn) {
      dialog.close();
    }
  });
});
