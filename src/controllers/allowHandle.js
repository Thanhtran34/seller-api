// Add and handle allow methods to response object

  export const addAllow = allow => (req, res, next) => {
    req.allow = allow
    next()
  }

  export const handleAllow= (req, res, next) => {
    try {
      if (req.method === 'OPTIONS') {
        return res
          .status(204)
          .setHeader('Content-Type', 'application/json')
          .header('Access-Control-Allow-Methods', req.allow)
          .send()
      }
      if (req.allow && !req.allow.includes(req.method)) {
        return res
          .status(405)
          .setHeader('Content-Type', 'application/json')
          .header('Allow', req.allow)
          .send()
      }
      next()
    } catch (e) {
      next(e)
    }
  }
