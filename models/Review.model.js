const { Schema, model } = require("mongoose")

const reviewSchema = new Schema(
    {
        username: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true,
        },
        place: {
            type: Schema.Types.ObjectId,
            ref: 'Place',
            require: true,
        },
        text: {
            type: String,
            require: [true, 'Debes escribir algo!']
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            require: [true, 'Indica una puntuación.']
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
    }
)

const Review = model("Review", reviewSchema)

module.exports = Review