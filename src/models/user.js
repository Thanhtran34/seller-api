/**
 * Mongoose model users.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

/**
 * Create a schema for users.
 *
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'email is required',
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'email is invalid'],
    index: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [6, 'Your password must be at least 6 characters long'],
    maxlength: [30, 'Your password cannot exceed 30 characters'],
    match: [/[!@#$%^&*(),.?":{}|<>-]/, 'Your password must contain at least one special character: /[!@#$%^&*(),.?":{}|<>)']
  }
}, {
  timestamps: true,
  versionKey: false
})

/**
 * Auto generate a salt and hash password before storing using bcrypt.
 *
 * @param {string} canditatePassword - the user's password.
 * @returns {string} hashed password.
 */
userSchema.methods.comparePassword = function (canditatePassword) {
  return bcrypt.compare(canditatePassword, this.password)
}

/**
 * Authenticates if the user exists in database and check the password.
 *
 * @param {string} username - The username trying to login.
 * @param {string} password - The plain text password to authenticate.
 *
 * @returns {object} Returns the logged in user.
 */
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password') || user.isNew) {
    const hashPwd = await bcrypt.hash(user.password, 12)
    user.password = hashPwd
  }
  next()
})

/**
 * Create a model using the schema.
 *
 */
export const User = mongoose.model('User', userSchema)
