const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: Number
});

const Url = mongoose.model('Url', urlSchema);

exports.UrlModel = Url;