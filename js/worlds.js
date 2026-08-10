/**
 * Phoenixi Studios - Worlds Page Catalog Loader
 */
document.addEventListener('DOMContentLoaded', function() {
  const worldsContainer = document.getElementById('worlds-list-container');
  if (!worldsContainer) return;

  fetch('/data/worlds.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load worlds data');
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        worldsContainer.innerHTML = '';
        data.forEach((world, index) => {
          const card = document.createElement('a');
          card.className = 'world-card';
          card.href = world.url || '#';
          card.id = `world-card-${world.id || index}`;

          const title = document.createElement('div');
          title.className = 'world-card-title';
          title.textContent = world.name;

          const tagline = document.createElement('div');
          tagline.className = 'world-card-tagline';
          tagline.textContent = world.tagline || '';

          const desc = document.createElement('div');
          desc.className = 'world-card-desc';
          desc.textContent = world.description || '';

          card.appendChild(title);
          if (world.tagline) card.appendChild(tagline);
          if (world.description) card.appendChild(desc);

          if (world.url && world.url !== '#') {
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
          }

          worldsContainer.appendChild(card);
        });
      }
    })
    .catch(error => {
      console.warn('Using fallback Worlds markup:', error);
    });
});
