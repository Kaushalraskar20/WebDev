// Middleware to protect routes — redirect to login if not authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

module.exports = isAuthenticated;
