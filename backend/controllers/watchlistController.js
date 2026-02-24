const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');

// GET /api/watchlist - Get user's watchlist
const getWatchlist = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const watchlist = await Watchlist.find(filter).populate('movie');
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/watchlist - Add movie to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { movieId, status, notes } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const existing = await Watchlist.findOne({ user: req.user._id, movie: movieId });
    if (existing) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    const entry = await Watchlist.create({
      user: req.user._id,
      movie: movieId,
      status: status || 'want_to_watch',
      notes,
    });

    await entry.populate('movie');
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/watchlist/:id - Update watchlist entry
const updateWatchlistEntry = async (req, res) => {
  try {
    const entry = await Watchlist.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('movie');

    if (!entry) return res.status(404).json({ message: 'Watchlist entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/watchlist/:id - Remove from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const entry = await Watchlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!entry) return res.status(404).json({ message: 'Watchlist entry not found' });
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getWatchlist, addToWatchlist, updateWatchlistEntry, removeFromWatchlist };
