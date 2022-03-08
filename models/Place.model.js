const { Schema, model } = require("mongoose")

const placeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Introduce el nombre de tu establecimiento.']
        },
        type: {
            type: String,
            required: [true, 'Introduce el tipo de tu establecimiento.']
        },
        url: {
            type: String,
            unique: true,
            required: [true, 'Introduce la URL de tu establecimiento.']
        },
        image: {
            type: String,
            required: [true, 'Introduce una imagen de tu establecimiento.']
        },
        description: {
            type: String,
            required: [true, 'Introduce la descripción de tu establecimiento.']
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        location: {
            type: {
                type: String,
            },
            coordinates: [Number],
            // require: true,
            // unique: true,
        },
    },
    {
        timestamps: true,
    }
);

const Place = model("Place", placeSchema)

module.exports = Place