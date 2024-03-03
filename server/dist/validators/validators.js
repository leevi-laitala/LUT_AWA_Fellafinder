"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.pwdValidate = exports.emailValidate = void 0;
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const user_1 = require("../models/user");
if (!process.env.SECRET) {
    process.env.SECRET = "verysecret";
}
passport_1.default.initialize();
passport_1.default.use(new passport_jwt_1.Strategy({
    secretOrKey: process.env.SECRET,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()
}, (token, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.userModel.findById(token.userId).exec();
    return done(null, user);
})));
const emailValidate = (0, express_validator_1.body)("email").trim().isEmail();
exports.emailValidate = emailValidate;
const pwdValidate = (0, express_validator_1.body)("password").isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1
});
exports.pwdValidate = pwdValidate;
function validateToken(req, res, next) {
    passport_1.default.authenticate("jwt", { session: false }, (err, verifiedUser) => {
        if (err || !verifiedUser) {
            return res.status(401).send();
        }
        req.user = verifiedUser;
        next();
    })(req, res, next);
}
exports.validateToken = validateToken;
//# sourceMappingURL=validators.js.map