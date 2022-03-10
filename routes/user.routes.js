const { isAuthenticated } = require('./../middlewares/jwt.middleware')
const { checkRole, isSameUser } = require('./../middlewares/route-guard')
const router = require('express').Router()
const User = require("../models/User.model")

router.get('/', isAuthenticated, (req, res) => {

    User
        .find()
        .select('username profileImg description')
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})

router.get('/filtered-users/:usersearch', isAuthenticated, (req, res) => {

    const { usersearch } = req.params

    User
        .find({ "username": { "$regex": usersearch, "$options": "i" } })
        .select('username profileImg description')
        .then(filteredUsers => res.json(filteredUsers))
        .catch(err => res.status(500).json(err))
})

router.get('/:id', isAuthenticated, (req, res) => {
    const { id } = req.params

    User
        .findById(id)
        .populate("favPlaces")
        .populate("friends")
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})

router.put('/:id', isAuthenticated, (req, res) => {

    const { id } = req.params
    const { username, email, profileImg, description } = req.body

    User
        .findByIdAndUpdate(id, { username, email, profileImg, description }, { new: true })
        .then(newUser => res.json(newUser))
        .catch(err => res.status(500).json(err))
})

router.put('/:id/add-friend', isAuthenticated, (req, res) => {

    const myUserId = req.payload._id
    const { id } = req.params

    User
        .findByIdAndUpdate(myUserId, { $addToSet: { friends: id } }, { new: true })
        .then(() => {
            return User.findByIdAndUpdate(id, { $addToSet: { friends: myUserId } }, { new: true })
        })
        .then(data => res.json(data))
        .catch(err => res.status(500).json(err))
})

router.put('/:id/remove-friend', isAuthenticated, (req, res) => {
    const myUserId = req.payload._id
    const { id } = req.params

    User
        .findByIdAndUpdate(myUserId, { $pull: { friends: id } }, { new: true })
        .then(() => {
            return User.findByIdAndUpdate(id, { $pull: { friends: myUserId } }, { new: true })
        })
        .then(data => res.json(data))
        .catch(err => res.status(500).json(err))
})

router.put('/:id/add-place', isAuthenticated, (req, res) => {

    const myUserId = req.payload._id
    const { id } = req.params

    User
        .findByIdAndUpdate(myUserId, { $addToSet: { favPlaces: id } }, { new: true })
        .then(data => res.json(data.favPlaces))
        .catch(err => res.status(500).json(err))
})

router.put('/:id/remove-place', isAuthenticated, (req, res) => {

    const myUserId = req.payload._id
    const { id } = req.params

    User
        .findByIdAndUpdate(myUserId, { $pull: { favPlaces: id } }, { new: true })
        .then(data => res.json(data))
        .catch(err => res.status(500).json(err))
})

router.delete('/:id/delete-user', isAuthenticated, checkRole('ADMIN'), (req, res) => {

    const { id } = req.params

    User
        .find({ friends: id })
        .then(users => {
            let promiseArr = users.map(user => User.findByIdAndUpdate(user._id, { $pull: { friends: id } }, { new: true }))
            return Promise.all(promiseArr)
        })
        .then(() => User.findByIdAndDelete(id, { new: true }))
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})

module.exports = router

