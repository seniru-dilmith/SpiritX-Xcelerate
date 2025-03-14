const jwt = require("jsonwebtoken");

const parseCookies = (req) => {
  const list = {};
  const rc = req.headers.cookie;

  if (rc) {
    rc.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      list[parts.shift().trim()] = decodeURI(parts.join("="));
    });
  }

  return list;
};

const isAuthenticated = (req, res, next) => {
  const cookies = parseCookies(req);
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
  isAuthenticated,
};
