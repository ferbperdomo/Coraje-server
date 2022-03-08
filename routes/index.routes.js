const router = require("express").Router()

router.use('/auth', require('./auth.routes'))
router.use('/user', require('./user.routes'))
router.use('/places', require('./places.routes'))
router.use('/upload', require('./upload.routes'))
router.use('/review', require('./review.routes'))

module.exports = router
