document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("gallery-grid");

  // Load models from JSON file
  let models = [];
  try {
    const response = await fetch("models.json");
    if (!response.ok) throw new Error("Network response was not ok");
    models = await response.json();

    // Sort models alphabetically by title
    models.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error("Error loading models:", error);

    // Display error message if models don't load
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p style="font-size: 1.5rem; font-weight: bold;">
          Não foi possível carregar os modelos
        </p>
      </div>
    `;

    // Update title to indicate error or 0 items
    const sectionTitle = document.querySelector(".section-title");
    if (sectionTitle) {
      sectionTitle.textContent = `MEUS TRABALHOS (0)`;
    }
    return;
  }

  // Update the section title with the correct count
  const sectionTitle = document.querySelector(".section-title");
  if (sectionTitle) {
    sectionTitle.textContent = `MEUS TRABALHOS (${models.length})`;
  }

  // Create modal for viewing
  const modal = document.createElement("div");
  modal.id = "image-modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content-wrapper";

  const modalImage = document.createElement("img");
  modalImage.id = "modal-image";

  const closeButton = document.createElement("button");
  closeButton.className = "modal-close-button";
  closeButton.innerHTML = "✕";

  closeButton.addEventListener("click", (e) => {
    e.stopPropagation();
    modal.style.display = "none";
  });

  modalContent.appendChild(modalImage);
  modalContent.appendChild(closeButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Close modal on background click
  modal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Prevent closing when clicking on the image
  modalContent.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Generate cards
  models.forEach((model, index) => {
    const card = document.createElement("div");
    card.className = "model-card";

    const content = `
            <div class="card-inner">
                <div class="card-bg-effect"></div>
                
                <img src="${model.image}" alt="${
      model.title
    }" class="card-icon card-icon-full">
                
                <div class="card-badge">
                    #${(index + 1).toString().padStart(2, "0")}
                </div>
            </div>
            
            <div class="card-footer">
                <h4 class="card-title">${model.title}</h4>
            </div>
        `;

    card.innerHTML = content;

    // Add click event to open modal
    card.addEventListener("click", () => {
      modalImage.src = model.image;
      modalImage.alt = model.title;
      modal.style.display = "flex";
    });

    grid.appendChild(card);
  });
});
