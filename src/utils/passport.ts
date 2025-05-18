import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import logger from "../config/logger";
import UserService from "../services/UserServices";
import UserController from "../controllers/UserController";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (_accessToken, _refreshToken, profile, done) => {
            logger.trace("GoogleStrategy.callback");
            logger.info(`${JSON.stringify(profile)} [profile]`)

            let user = await UserController.getForGProfile(profile);

            delete user.hash;

            logger.debug(`Getting user data ${JSON.stringify(user)}`);

            done(null, user);
        }
    )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await UserService.findById(id);
    done(null, user);
});

export default passport;