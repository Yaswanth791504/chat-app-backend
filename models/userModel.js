/* eslint-disable no-undef */
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "user must have a name"],
    },
    email: {
      type: String,
      required: [true, "user must have a email"],
      unique: [true, "{VALUE} is already registered"],
    },
    password: {
      type: String,
      required: [true, "user must have a password"],
      min: {
        value: 8,
        message:
          "user must atleast register with 8 charecter, But got {VALUE} instead",
      },
      select: false,
    },
    passwordConfirmation: {
      type: String,
      required: [true, "please enter your password again"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "check your password",
      },
    },
    friends: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
    },
    profileImage: {
      type: String,
      default: "",
    },
    backgroundImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirmation = undefined;
  next();
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
