import passport from "passport";
import local from "passport-local"
import GitHubStrategy from "passport-github2"
import { userService } from "../routers/user.router.js";
import { comparePassword, hashPassword } from "./encript.util.js";


const LocalStrategy = local.Strategy;

const initializePassport = async() => {

    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
        try {
            const user = await userService.getByEmail(username)
            if (user) {
                return done(null, false)
            }
            const newUser = {...req.body, password: hashPassword(password)}
            if (newUser.email === 'adminCoder@coder.com') newUser.rol = 'admin'
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
            if (!user) {
                return done (null, false)
            }
            if (!comparePassword(user, password)) return done(null, false)

            return done(null, user)
        }
        catch (err) {
            return done(`${err}`)
        }
    }))

    passport.use('github', new GitHubStrategy(
			{
				clientID: 'Iv1.4d1ef34ac9f8cd59',
				clientSecret: 'df9868d8077434200676b1e63ad8237d9d795156',
				callbackURL: 'http://localhost:8080/api/users/githubcallback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await userService.getByEmail(profile._json.email);

					if (!user) {
						let newUser = {
							first_name: profile._json.name,
							last_name: '',
							email: profile._json.email,
							password: '',
							img: profile._json.avatar_url,
						};
						user = await userService.createUser(newUser);
						done(null, user);
					} else {
						done(null, user);
					}
				} catch (err) {
					done(err, false);
				}
	}))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await userService.getById(id)
        done(null, user)
    })
}


export default initializePassport