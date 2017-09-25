module.exports = function addLoginStatus(req, res, next) {
  if (req.session.user_id) {
    res.setHeader("x-logged-in", "true");
  } else {
    res.setHeader("x-logged-in", "false");
  }
  next();
};