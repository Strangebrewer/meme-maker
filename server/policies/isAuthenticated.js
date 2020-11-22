import { passport } from '../passport';

export default function (req, res, next) {
    passport.authenticate('jwt', function(err, user) {
        if (err || !user) {
            res.status(403).json({
                error: 'You are not authorized to access this resource.'
            });
        } else {
            req.user = user;
            req.org = user.organization;
            next();
        }
    })(req, res, next);
}
