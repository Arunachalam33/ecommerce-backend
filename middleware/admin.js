export default function isAdmin(req, res, next) {
  if (req.user && req.user.is_admin) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: Admins only" });
}