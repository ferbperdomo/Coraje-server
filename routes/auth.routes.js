const express = require("express")
const bcrypt = require('bcryptjs')
const User = require("../models/User.model")
const jwt = require('jsonwebtoken')
const { isAuthenticated } = require('../middlewares/jwt.middleware')
const router = express.Router()
const saltRounds = 10

router.post('/signup', (req, res, next) => {
    const { email, password, username, description, profileImg, role } = req.body

    if (email === '' || password === '' || username === '') {
        res.status(400).json({ message: "Introduce e-mail, username y contraseña." })
        return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Introduce un correo electrónico válido.' })
        return
    }

    if (password.length < 8) {
        res.status(400).json({ message: 'La contraseña debe contener al menos 8 caracteres.' })
        return
    }

    User
        .findOne({ email })
        .then((foundUser) => {
            if (foundUser) {
                res.status(400).json({ message: "El correo electrónico ya está registrado." })
                return
            }

            const salt = bcrypt.genSaltSync(saltRounds)
            const hashedPassword = bcrypt.hashSync(password, salt)

            return User.create({ email, password: hashedPassword, username, description, profileImg, role })
        })
        .then((createdUser) => {
            const { email, username, _id } = createdUser

            const user = { email, username, _id }

            res.status(201).json({ user })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" })
        })

})

router.post('/login', (req, res, next) => {

    const { email, password } = req.body

    if (email === '' || password === '') {
        res.status(400).json({ message: 'Indica tu email y contraseña.' })
        return
    }

    User
        .findOne({ email })
        .then((foundUser) => {

            if (!foundUser) {
                res.status(401).json(({ message: 'Usuarix no encontradx.' }))
                return
            }

            if (bcrypt.compareSync(password, foundUser.password)) {

                const { _id, username, role } = foundUser

                const payload = { _id, username, role }

                const authToken = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: '6h' }
                )

                res.status(200).json(({ authToken }))

            } else {
                res.status(401).json(({ message: 'No podemos autenticar estx usuarix.' }))
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(({ message: 'Internal Server Error' }))
        })
})

router.get('/verify', isAuthenticated, (req, res, next) => {
    res.status(200).json(req.payload)
})

module.exports = router
