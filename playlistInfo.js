const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  id: Number,
  name: String,
  songs: Array,
}, {
  collection: 'Playlist' 
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;