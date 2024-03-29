import { body, ValidationChain, validationResult, ValidationError } from "express-validator";
import jwt, { JwtPayload } from "jsonwebtoken";
import passport, { DoneCallback } from "passport";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import dotenv from "dotenv";
import { userModel, userSchema } from "../models/user";

// Use default secret is none provided
if (!process.env.SECRET) {
    process.env.SECRET = "verysecret";
}

passport.initialize();
passport.use(new Strategy(
    {
        secretOrKey: process.env.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
        const user = await userModel.findById(token.userId).exec();
        return done(null, user);
    }
));

interface RequestUser extends Request {
    user: JwtPayload
}

// Validators for email and password
// - Only allow valid email
// - Only allow min 8char pwd with minimum of one uppercase, lowercase, 
//   number and symbol
const emailValidate: ValidationChain = body("email").trim().isEmail();
const pwdValidate: ValidationChain = body("password").isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1
});

// Check if user is authenticated
function validateToken(req: RequestUser, res, next) {
    passport.authenticate("jwt", 
        { session: false }, 
        (err, verifiedUser) => {
            if (err || !verifiedUser) { return res.status(401).send(); }
            req.user = verifiedUser;
            next();
        }
    )(req, res, next);
}

export { emailValidate, pwdValidate, validateToken };
