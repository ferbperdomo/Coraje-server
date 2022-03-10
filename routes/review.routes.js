const router = require('express').Router()
const Review = require('./../models/Review.model')
const { isAuthenticated } = require('./../middlewares/jwt.middleware')
const { checkRole } = require('./../middlewares/route-guard')

router.post('/:place/create-review', isAuthenticated, (req, res) => {

    const { text, rating } = req.body
    const username = req.payload._id
    console.log('USERNAME SE SUPONE', username)
    const { place } = req.params

    Review
        .create({ username, place, text, rating })
        .then(review => {
            console.log('ESTO ES LA PUÑETERA REVIEW', review)
            res.json(review)
        })
        .catch(err => res.status(500).json(err))
})

router.get('/:place', (req, res) => {

    const { place } = req.params

    Review
        .find({ "place": place })
        .populate('username')
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})

router.get('/:id', (req, res) => {

    const { id } = req.params

    Review
        .findById(id)
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})

router.delete('/:id/delete-review', isAuthenticated, (req, res) => {

    const { id } = req.params

    Review
        .findByIdAndDelete(id)
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})

module.exports = router
