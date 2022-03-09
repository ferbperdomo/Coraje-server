const router = require('express').Router()
const Place = require('./../models/Place.model')
const User = require('./../models/User.model')
const { isAuthenticated } = require('./../middlewares/jwt.middleware')
const { checkRole } = require('./../middlewares/route-guard')

// Get all places
router.get('/', (req, res) => {

    Place
        .find()
        .select('name type location')
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})

// Get single place
router.get('/:id', (req, res) => {

    const { id } = req.params

    Place
        .findById(id)
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})

// Create a place
router.post('/save-place', isAuthenticated, checkRole('OWNER', 'ADMIN'), (req, res) => {

    const { name, type, url, image, description, lat, lng } = req.body
    const owner = req.payload._id
    const location = {
        type: "Point",
        coordinates: [lat, lng]
    }

    Place
        .create({ name, type, url, image, description, owner, location })
        .then(place => res.json(place))
        .catch(err => res.status(500).json(err))
})

// Update a place
router.put('/:id/update-place', isAuthenticated, checkRole('ADMIN', 'OWNER'), (req, res) => {

    const { name, type, url, image, description, lat, lng } = req.body
    const { id } = req.params
    const owner = req.payload._id
    const location = {
        type: "Point",
        coordinates: [lat, lng]
    }

    Place
        .findByIdAndUpdate(id, { name, type, url, image, description, owner, location }, { new: true })
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})

// Delete place
router.delete('/:id/delete-place', isAuthenticated, checkRole('OWNER', 'ADMIN'), (req, res) => {

    const { id } = req.params

    User
        .find({ favPlaces: id })
        .then(users => {
            let promiseArr = users.map(user => User.findByIdAndUpdate(user._id, { $pull: { favPlaces: id } }, { new: true }))
            return Promise.all(promiseArr)
        })
        .then(() => Place.findByIdAndDelete(id, { new: true }))
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})



module.exports = router