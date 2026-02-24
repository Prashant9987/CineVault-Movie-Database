// js/movies.js
let currentPage = 1;
let currentGenre = '';
let editingMovieId = null;

async function initMoviesPage() {
  updateNavbar();

  // Show Add button for admins
  const user = Auth.getUser();
  if (user?.role === 'admin') {
    document.getElementById('adminAddBtn').style.display = 'flex';
  }

  // Populate year dropdown
  const yearSelect = document.getElementById('yearSelect');
  const year = new Date().getFullYear();
  for (let y = year; y >= 1950; y--) {
    yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
  }

  // Load genres
  await loadGenreChips();

  // Parse URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get('search')) document.getElementById('searchInput').value = params.get('search');
  if (params.get('genre')) currentGenre = params.get('genre');

  // Event listeners
  document.getElementById('searchInput').addEventListener('input', debounce(() => { currentPage=1; loadMovies(); }, 400));
  document.getElementById('sortSelect').addEventListener('change', () => { currentPage=1; loadMovies(); });
  document.getElementById('yearSelect').addEventListener('change', () => { currentPage=1; loadMovies(); });

  await loadMovies();
}

function debounce(fn, delay) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

async function loadGenreChips() {
  const container = document.getElementById('genreFilter');
  try {
    const genres = await MovieAPI.getGenres();
    const chips = [{ label: 'All', value: '' }, ...genres.map(g => ({ label: g, value: g }))];
    container.innerHTML = chips.map(g => `
      <button class="filter-chip ${currentGenre === g.value ? 'active' : ''}"
        onclick="setGenre('${g.value}')">${g.label}</button>
    `).join('');
  } catch (e) {}
}

function setGenre(genre) {
  currentGenre = genre;
  currentPage = 1;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  loadMovies();
}

async function loadMovies() {
  const grid = document.getElementById('movieGrid');
  const count = document.getElementById('resultsCount');
  grid.innerHTML = '<div class="spinner"></div>';

  const [sortBy, order] = document.getElementById('sortSelect').value.split('-');
  const search = document.getElementById('searchInput').value.trim();
  const year = document.getElementById('yearSelect').value;

  const params = { page: currentPage, limit: 12, sortBy, order };
  if (search) params.search = search;
  if (currentGenre) params.genre = currentGenre;
  if (year) params.year = year;

  try {
    const data = await MovieAPI.getAll(params);
    count.textContent = `${data.totalMovies} movie${data.totalMovies !== 1 ? 's' : ''} found`;

    if (!data.movies.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="icon">🔍</div>
          <p>No movies match your filters.</p>
        </div>`;
      document.getElementById('pagination').innerHTML = '';
      return;
    }

    const user = Auth.getUser();
    grid.innerHTML = data.movies.map(m => buildMovieCardWithAdmin(m, user)).join('');
    buildPagination(data.currentPage, data.totalPages);
  } catch (e) {
    grid.innerHTML = '<p style="color:var(--accent);grid-column:1/-1">Failed to load movies.</p>';
  }
}

function buildMovieCardWithAdmin(movie, user) {
  const base = buildMovieCard(movie);
  if (user?.role !== 'admin') return base;
  // Inject admin actions overlay
  return base.replace('</div>\n    </div>', `
    </div>
    <div style="display:flex;gap:0.4rem;padding:0 0.85rem 0.85rem;">
      <button class="btn btn-ghost btn-sm" style="font-size:0.75rem;" onclick="event.stopPropagation();openEditModal('${movie._id}')">
        <i class="fas fa-edit"></i> Edit
      </button>
      <button class="btn btn-danger btn-sm" style="font-size:0.75rem;" onclick="event.stopPropagation();deleteMovie('${movie._id}')">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </div>
  </div>`);
}

function buildPagination(current, total) {
  const container = document.getElementById('pagination');
  if (total <= 1) { container.innerHTML = ''; return; }
  let html = '';
  if (current > 1) html += `<button class="page-btn" onclick="goPage(${current-1})"><i class="fas fa-chevron-left"></i></button>`;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 1) {
      html += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
    } else if (Math.abs(i - current) === 2) {
      html += `<span style="color:var(--text-muted)">…</span>`;
    }
  }
  if (current < total) html += `<button class="page-btn" onclick="goPage(${current+1})"><i class="fas fa-chevron-right"></i></button>`;
  container.innerHTML = html;
}

function goPage(page) { currentPage = page; loadMovies(); window.scrollTo(0, 0); }

// ─── Admin Modal ───────────────────────────────────────────────────
function openAddModal() {
  editingMovieId = null;
  document.getElementById('modalTitle').textContent = 'Add Movie';
  document.getElementById('movieForm').reset();
  document.getElementById('movieModal').style.display = 'flex';
}

async function openEditModal(id) {
  editingMovieId = id;
  document.getElementById('modalTitle').textContent = 'Edit Movie';
  document.getElementById('movieModal').style.display = 'flex';
  try {
    const movie = await MovieAPI.getById(id);
    document.getElementById('fTitle').value = movie.title;
    document.getElementById('fDesc').value = movie.description;
    document.getElementById('fYear').value = movie.releaseYear;
    document.getElementById('fDuration').value = movie.duration;
    document.getElementById('fDirector').value = movie.director;
    document.getElementById('fCast').value = (movie.cast || []).join(', ');
    document.getElementById('fGenre').value = (movie.genre || []).join(', ');
    document.getElementById('fPoster').value = movie.posterUrl || '';
  } catch(e) { showToast('Failed to load movie', 'error'); }
}

function closeModal() {
  document.getElementById('movieModal').style.display = 'none';
}

async function submitMovieForm(e) {
  e.preventDefault();
  const data = {
    title: document.getElementById('fTitle').value,
    description: document.getElementById('fDesc').value,
    releaseYear: Number(document.getElementById('fYear').value),
    duration: Number(document.getElementById('fDuration').value),
    director: document.getElementById('fDirector').value,
    cast: document.getElementById('fCast').value.split(',').map(s => s.trim()).filter(Boolean),
    genre: document.getElementById('fGenre').value.split(',').map(s => s.trim()).filter(Boolean),
    posterUrl: document.getElementById('fPoster').value,
  };
  try {
    if (editingMovieId) {
      await MovieAPI.update(editingMovieId, data);
      showToast('Movie updated!', 'success');
    } else {
      await MovieAPI.create(data);
      showToast('Movie added!', 'success');
    }
    closeModal();
    loadMovies();
  } catch(e) { showToast(e.message, 'error'); }
}

async function deleteMovie(id) {
  if (!confirm('Delete this movie?')) return;
  try {
    await MovieAPI.delete(id);
    showToast('Movie deleted', 'success');
    loadMovies();
  } catch(e) { showToast(e.message, 'error'); }
}
