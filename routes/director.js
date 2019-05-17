const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

// Models
const Director = require('../models/Director');

//Get Directors
router.get('/', (req, res) => {
    const promise = Director.aggregate([
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'director_movies'
            }
        },
        {
            $unwind: {
                path: '$director_movies',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    _id: '$id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$director_movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies',
            }
        }
    ]);
    promise.then((data) => {
        res.json(data);
    })
})

//Get Director Details
router.get('/:director_id', (req, res) => {
    const promise = Director.aggregate([
        {
            $match: {
                '_id': mongoose.Types.ObjectId(req.params.director_id)
            }
        },
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'director_movies'
            }
        },
        {
            $unwind: {
                path: '$director_movies',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    _id: '$id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$director_movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies',
            }
        }
    ]);
    promise.then((data) => {
        res.json(data);
    })
})

// Update Director Detail
router.put('/:director_id', (req, res) => {
    //res.send(req.params)
    const Id = req.params.director_id;
    Director.findByIdAndUpdate(
        Id,
        req.body,
        {
            new: true
        }
    ).then((director) => {
        res.json(director)
    }).catch((err) => {
        res.json('Güncelleme yapılamadı')
    })
})

// Remove Director
router.delete('/:director_id', (req, res) => {
    const Id = req.params.director_id;
    Director.findByIdAndRemove(Id).then((director) => {
        res.json(director)
    }).catch((err) => {
        res.json('Güncelleme yapılamadı')
    })
})

//Add Directors
router.post('/new', (req, res) => {
    const director = new Director(req.body);

    director.save().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({
            message: 'Director was not added'
        })
    })
})

module.exports = router;
