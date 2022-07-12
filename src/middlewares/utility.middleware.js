const parseCookies = (req, res, next) => {
  const cookies = req.headers.cookie;

  req.cookies = cookies.split('; ').reduce((prev, cookie) => {
    const [ key, value ] = cookie.split('=');

    return {
      ...prev,
      [key]: value
    }
  }, {})

  next();
}

module.exports = {
  parseCookies
}