// Authentication controller
import jwt from "jsonwebtoken";
import createError from "http-errors";
import PasswordValidator from "password-validator";
import { Publisher } from "../models/publisher.js";
import { LinkController } from "./linkController.js";

export class AccountController {
  validatePassword(res, req, next) {
    try {
      const passwordSchema = new PasswordValidator();
      passwordSchema.is().min(8)
      passwordSchema.is().max(100)
      passwordSchema.has().uppercase()
      passwordSchema.has().lowercase()
      passwordSchema.has().digits()
      if (!passwordSchema.validate(password)) {
        createError(403,"Your password must be at least 8 characters, max 100 chars and includes one lowercase, one uppercase, one digit.")
      }
      next()
    } catch (error) {
      next(error)
    }
  }

  async register(req, res, next) {
    try {
      const user = await Publisher.insert({
        name: req.body.name,
        email: req.body.email,
        area: req.body.area,
        password: req.body.password,
      });

      jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: 600,
      });

      res
        .status(200)
        .header("Cache-Control", "no-store")
        .header("Pragma", "no-cache")
        .json({ id: user.id });
    } catch (error) {
      next(createError(409, "Email already exists"));
    }
  }

  async login(req, res, next) {
    try {
      const user = await Publisher.authenticate(
        req.body.email,
        req.body.password
      );

      const payload = {
        sub: user.email,
        id: user.id,
      };

      // Create the access token with the shorter lifespan.
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: 600,
      });

      res
        .status(200)
        .header("Cache-Control", "no-store")
        .header("Pragma", "no-cache")
        .json({
          access_token: accessToken,
          tokenType: "Bearer",
          expiresIn: 600,
          _links: LinkController.createLinkForPublisher(user),
        });
    } catch (error) {
      // Authentication failed.
      next(createError(401));
    }
  }
}
