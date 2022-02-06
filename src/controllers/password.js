// Hash and salt password from user
import bcrypt from 'bcrypt'
import PasswordValidator from 'password-validator'
import createError from 'http-errors'

const passwordSchema = new PasswordValidator()
passwordSchema.is().min(8)
passwordSchema.is().max(100)
passwordSchema.has().uppercase()
passwordSchema.has().lowercase()
passwordSchema.has().digits()

export class Password {
  async hashPassword(req, res, next) {
    try {
      const password = req.body.password
      if (!password) {
        return next()
      }
  
      if (!passwordSchema.validate(password)) {
        createError(403, 'Your password must be at least 8 characters, max 100 chars and includes one lowercase, one uppercase, one digit.' )
      }
      req.body.password = await bcrypt.hash(password, 12)
      next()
    } catch (e) {
      next(e)
    }
  }
}
