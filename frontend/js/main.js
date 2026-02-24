// js/main.js - Shared utilities and home page logic

// ─── Toast ────────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ─── Navbar Auth State ─────────────────────────────────────────────
function updateNavbar() {
  const navUser = document.getElementById('navUser');
  if (!navUser) return;
  const user = Auth.getUser();
  if (user) {
    navUser.innerHTML = `
      <span style="font-size:0.85rem;color:var(--text-secondary)">
        <i class="fas fa-user-circle"></i> ${user.name}
      </span>
      <button class="btn btn-outline btn-sm" onclick="Auth.logout()">Logout</button>
    `;
  }
}

// ─── Movie Card Builder ────────────────────────────────────────────
function buildMovieCard(movie) {
  const genres = (movie.genre || []).slice(0, 2).map(g =>
    `<span class="genre-tag">${g}</span>`
  ).join('');

  const poster = movie.posterUrl
    ? `<img class="movie-card-poster" src="${movie.posterUrl}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450/1a1a2e/666?text=No+Image'" />`
    : `<div class="movie-card-poster" style="display:flex;align-items:center;justify-content:center;font-size:3rem;">🎬</div>`;

  return `
    <div class="movie-card" onclick="goToDetail('${movie._id}')">
      ${poster}
      <div class="movie-card-body">
        <div class="movie-card-title" title="${movie.title}">${movie.title}</div>
        <div class="movie-card-meta">
          <span>${movie.releaseYear}</span>
          <span class="movie-rating"><i class="fas fa-star"></i> ${movie.rating?.toFixed(1) || 'N/A'}</span>
        </div>
        <div class="movie-genres">${genres}</div>
      </div>
    </div>
  `;
}

function goToDetail(id) {
  window.location.href = `pages/movie-detail.html?id=${id}`;
}

function handleHeroSearch() {
  const q = document.getElementById('heroSearch')?.value?.trim();
  if (q) window.location.href = `pages/movies.html?search=${encodeURIComponent(q)}`;
}

document.getElementById('heroSearch')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleHeroSearch();
});

// ─── Home Page Init ────────────────────────────────────────────────
async function initHome() {
  updateNavbar();
  await loadGenreFilters();
  await loadTopRated();
  await loadRecent();
}

async function loadGenreFilters() {
  const container = document.getElementById('genreFilter');
  if (!container) return;
  try {
    const genres = await MovieAPI.getGenres();
    const all = document.createElement('button');
    all.className = 'filter-chip active';
    all.textContent = 'All';
    all.onclick = () => { window.location.href = 'pages/movies.html'; };
    container.appendChild(all);
    genres.forEach(g => {
      const chip = document.createElement('button');
      chip.className = 'filter-chip';
      chip.textContent = g;
      chip.onclick = () => { window.location.href = `pages/movies.html?genre=${g}`; };
      container.appendChild(chip);
    });
  } catch (e) { console.error(e); }
}

async function loadTopRated() {
  const grid = document.getElementById('topRatedGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="spinner"></div>';
  try {
    const data = await MovieAPI.getAll({ sortBy: 'rating', order: 'desc', limit: 6 });
    if (!data.movies.length) {
      grid.innerHTML = '<div class="empty-state"><div class="icon">🎬</div><p>No movies yet. Run the seed script!</p></div>';
      return;
    }
    grid.innerHTML = data.movies.map(buildMovieCard).join('');
  } catch (e) {
    grid.innerHTML = '<p style="color:var(--accent)">Failed to load movies. Is the backend running?</p>';
  }
}

async function loadRecent() {
  const grid = document.getElementById('recentGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="spinner"></div>';
  try {
    const data = await MovieAPI.getAll({ sortBy: 'createdAt', order: 'desc', limit: 6 });
    grid.innerHTML = data.movies.map(buildMovieCard).join('');
  } catch (e) { console.error(e); }
}
