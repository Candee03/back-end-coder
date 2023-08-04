import passport from "passport";
import local from "passport-local"
import GitHubStrategy from "passport-github2"
import { userService } from "../user/user.controller.js";
import { comparePassword } from "./encript.util.js";
import { cartService } from "../cart/cart.controller.js";
import { UserRegisterDTO, UserSafeDTO } from "../user/user.DTO.js";
import config from '../config/env.js'
import {Strategy, ExtractJwt} from "passport-jwt";


const LocalStrategy = local.Strategy;
const JWTStrategy = Strategy
const jwtExtract = ExtractJwt

const initializePassport = async() => {

    passport.use('jwt', new JWTStrategy({
		jwtFromRequest: jwtExtract.fromExtractors([cookieExtractor]),
		secretOrKey: config.secretKey,
		},async (payload, done) => {
			try {
				return done(null, payload);
			} catch (err) {
				return done(err);
			}
		})
	)

    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
        try {
            const user = await userService.getByEmail(username)
            if (user) {
                return done(null, false)
            }
            const cartId = await cartService.createCart()
            const newUser = new UserRegisterDTO(req.body, password, cartId._id)
            const result = await userService.createUser(newUser)
            return done(null, result)
        }
        catch (err) {
            return done(`${err}`)
        }
    }))

    passport.use('login', new LocalStrategy(
        {usernameField: 'email'}, async (username, password, done) => {
        const user = await userService.getByEmail(username)
        try {
            if (!user) return done (null, false)
            if (!comparePassword(user, password)) return done(null, false)
            return done(null, new UserSafeDTO(user))
        }
        catch (err) {
            return done(`${err}`)
        }
    }))

    passport.use('github', new GitHubStrategy(
			{
                clientID: `${config.client_id}`,
				clientSecret: `df9868d8077434200676b1e63ad8237d9d795156`,
				callbackURL: `${config.callback_url}`,
			},
			async (accessToken, refreshToken, profile, done) => {
                try {
					let user = await userService.getByEmail(profile._json.email);
					if (!user) {
                        const cartId = await cartService.createCart()
						let userObjet = {
							first_name: profile._json.name,
							email: profile._json.email,
							img: profile._json.avatar_url,
						};
                        const newUser = new UserRegisterDTO(userObjet, '', cartId._id)
                        user = await userService.createUser(newUser)
                        return done(null, user)
					}
					done(null, user);
				} catch (err) {
					done(err, false);
				}
	}))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await userService.getById(id)
        done(null, new UserSafeDTO(user))
    })
}

const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies['token'];
	}
	return token;
};

export default initializePassport