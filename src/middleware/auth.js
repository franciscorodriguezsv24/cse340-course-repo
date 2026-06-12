/**
 * Authentication & authorization middleware.
 *
 * requireLogin — blocks access unless a user is logged in.
 * requireRole  — blocks access unless the logged-in user has a given role.
 *
 * Both rely on req.session.account, which is set at login time.
 */

const requireLogin = (req, res, next) => {
    if (req.session.account) {
        return next();
    }

    req.flash('error', 'Please log in to access that page.');
    res.redirect('/login');
};

const requireRole = (role) => {
    return (req, res, next) => {
        const account = req.session.account;

        if (!account) {
            req.flash('error', 'Please log in to access that page.');
            return res.redirect('/login');
        }

        if (account.role !== role) {
            req.flash('error', 'You do not have permission to access that page.');
            return res.redirect('/dashboard');
        }

        next();
    };
};

export { requireLogin, requireRole };
