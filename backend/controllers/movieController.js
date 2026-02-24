const Movie = require('../models/Movie');

// GET /api/movies - Get all movies with filters, search, pagination
const getMovies = async (req, res) => {
  try {
    const {
      search,
      genre,
      year,
      minRating,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }
    if (genre) {
      filter.genre = { $in: genre.split(',') };
    }
    if (year) {
      filter.releaseYear = Number(year);
    }
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const skip = (Number(page) - 1) * Number(limit);

    const [movies, total] = await Promise.all([
      Movie.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit)),
      Movie.countDocuments(filter),
    ]);

    res.json({
      movies,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalMovies: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/movies/:id - Get single movie
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/movies - Create movie (admin)
const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/movies/:id - Update movie (admin)
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/movies/:id - Delete movie (admin)
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/movies/:id/rate - Rate a movie
const rateMovie = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({ message: 'Rating must be between 1 and 10' });
    }
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    movie.updateRating(Number(rating));
    await movie.save();
    res.json({ message: 'Rating submitted', newRating: movie.rating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/movies/genres/list - Get all available genres
const getGenres = async (req, res) => {
  try {
    const genres = await Movie.distinct('genre');
    res.json(genres.sort());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie, rateMovie, getGenres };
