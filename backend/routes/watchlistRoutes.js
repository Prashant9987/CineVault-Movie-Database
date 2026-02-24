const express = require('express');
const router = express.Router();
const {
  getWatchlist,
  addToWatchlist,
  updateWatchlistEntry,
  removeFromWatchlist,
} = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All watchlist routes require auth

router.get('/', getWatchlist);
router.post('/', addToWatchlist);
router.put('/:id', updateWatchlistEntry);
router.delete('/:id', removeFromWatchlist);

module.exports = router;
