const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
      enum: [
        'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
        'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
        'Romance', 'Sci-Fi', 'Thriller', 'Western', 'Biography',
      ],
    },
    releaseYear: {
      type: Number,
      required: true,
      min: 1888,
      max: new Date().getFullYear() + 5,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    director: {
      type: String,
      required: true,
      trim: true,
    },
    cast: [{ type: String, trim: true }],
    language: {
      type: String,
      default: 'English',
    },
    country: {
      type: String,
      default: 'USA',
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    posterUrl: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    imdbId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Auto-compute average rating before saving
movieSchema.methods.updateRating = function (newRating) {
  this.totalRatings += newRating;
  this.ratingCount += 1;
  this.rating = parseFloat((this.totalRatings / this.ratingCount).toFixed(1));
};

// Text search index
movieSchema.index({ title: 'text', description: 'text', director: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
