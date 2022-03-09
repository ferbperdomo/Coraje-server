const { Schema, model } = require("mongoose")

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Necesitas un nombre de usuarix.']
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Necesitas un e-mail.']
    },
    password: {
      type: String,
      required: [true, 'Necesitas una contraseña.']
    },
    profileImg: {
      type: String,
      default: 'https://i.stack.imgur.com/l60Hf.png'
    },
    description: {
      type: String,
      default: 'No existe descripción.'
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "OWNER"],
      default: 'USER'
    },
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    favPlaces: [{
      type: Schema.Types.ObjectId,
      ref: 'Place',
    }]
  },
  {
    timestamps: true,
  }
)

const User = model("User", userSchema)

module.exports = User