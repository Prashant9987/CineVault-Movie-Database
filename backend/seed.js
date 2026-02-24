const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const User = require('./models/User');

dotenv.config();

const sampleMovies = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    releaseYear: 2010,
    duration: 148,
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    rating: 8.8,
    ratingCount: 2400000,
    totalRatings: 2400000 * 8.8,
    posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    imdbId: 'tt1375666',
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: ['Action', 'Crime', 'Drama'],
    releaseYear: 2008,
    duration: 152,
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    rating: 9.0,
    ratingCount: 2800000,
    totalRatings: 2800000 * 9.0,
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    imdbId: 'tt0468569',
  },
  {
    title: 'Interstellar',
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    releaseYear: 2014,
    duration: 169,
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    rating: 8.6,
    ratingCount: 1900000,
    totalRatings: 1900000 * 8.6,
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    imdbId: 'tt0816692',
  },
  {
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    genre: ['Comedy', 'Drama', 'Thriller'],
    releaseYear: 2019,
    duration: 132,
    director: 'Bong Joon-ho',
    cast: ['Kang-ho Song', 'Sun-kyun Lee', 'Yeo-jeong Cho'],
    language: 'Korean',
    country: 'South Korea',
    rating: 8.5,
    ratingCount: 850000,
    totalRatings: 850000 * 8.5,
    posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    imdbId: 'tt6751668',
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    genre: ['Drama'],
    releaseYear: 1994,
    duration: 142,
    director: 'Frank Darabont',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    rating: 9.3,
    ratingCount: 2700000,
    totalRatings: 2700000 * 9.3,
    posterUrl: 'https://image.tmdb.org/t/p/w500/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg',
    imdbId: 'tt0111161',
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    genre: ['Crime', 'Drama'],
    releaseYear: 1994,
    duration: 154,
    director: 'Quentin Tarantino',
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
    rating: 8.9,
    ratingCount: 2100000,
    totalRatings: 2100000 * 8.9,
    posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    imdbId: 'tt0110912',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Movie.deleteMany({});
    await User.deleteMany({});

    await Movie.insertMany(sampleMovies);
    console.log('✅ Sample movies inserted');

    // Create admin user
    await User.create({
      name: 'Admin',
      email: 'admin@cinevault.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin user created (admin@cinevault.com / admin123)');

    console.log('🎬 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDB();
