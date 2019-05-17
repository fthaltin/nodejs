const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title: {
        type: String,
        required: [true, '`{PATH}` alanı zorunludur'],
        maxlength: 20,
        minlength: 3
    },
    category: String,
    country: String,
    year: Number,
    imdb_score: {
        type: Number,
        min: 0,
        max: 10
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    director_id: Schema.Types.ObjectId
})

module.exports = mongoose.model('movie', MovieSchema);