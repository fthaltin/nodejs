var express = require('express');
var router = express.Router();

// Models
const Movie = require('../models/Movie');

/* Get Movies */
router.get('/', (req, res) => {
    Movie.find({}).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    })
})

// Get Top 5 Movies
router.get('/top5', (req, res) => {
    const promise = Movie.find({}).limit(5).sort({imdb_score: -1});
    promise.then((movie) => {
        res.json(movie)
    }).catch((err) => {
        res.json('Güncelleme yapılamadı')
    })
})

// Get Movies that between two years
router.get('/between/:start_year/:end_year', (req, res) => {
    const {start_year, end_year} = req.params;
    const promise = Movie.find({
        year: {
            $gte: parseInt(start_year),
            $lte: parseInt(end_year)
        }
    });
    promise.then((movie) => {
        res.json(movie)
    }).catch((err) => {
        res.json('Güncelleme yapılamadı')
    })
})

// Get Movie Detail
router.get('/:movie_id', (req, res) => {
    //res.send(req.params)
    Movie.findById(req.params.movie_id).then((movie) => {
        res.json(movie)
    }).catch((err) => {
        res.json('Bu bir hata')
    })
})

// Get Movie Detail
router.get('/:movie_id', (req, res) => {
    //res.send(req.params)
    Movie.findById(req.params.movie_id).then((movie) => {
        res.json(movie)
    }).catch((err) => {
        res.json('Bu bir hata')
    })
})

// Update Movie Detail
router.put('/:movie_id', (req, res) => {
    //res.send(req.params)
    const Id = req.params.movie_id;
    Movie.findByIdAndUpdate(
        Id,
        req.body,
        {
            new: true
        }
    ).then((movie) => {
        res.json(movie)
    }).catch((err) => {
        res.json('Güncelleme yapılamadı')
    })
})

// Remove Movie
router.delete('/:movie_id', (req, res) => {
    //res.send(req.params)
    const Id = req.params.movie_id;
    Movie.findByIdAndRemove(Id, {rawResult: true}).then((movie) => {
        res.json(movie)
    }).catch((err) => {
        res.json('Güncelleme yapılamadı')
    })
})

/* Add Movie */
router.post('/new', function(req, res, next) {
    /* const {title, imdb_score, category, country, year, date} = req.body;
    const movie = new Movie({
        title,
        imdb_score,
        category,
        country,
        year,
        date
    }) */

    const movie = new Movie(req.body);

    /* movie.save((err, data) => {
        if(err)
            res.json(err)
        else 
            res.json(data);
    }) */

    const promise = movie.save();

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    })
});

module.exports = router;
