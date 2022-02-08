// Controller to add and handle allow methods to response object

export class ResponseController {
  addAllow(allow, req, res, next) {
    req.allow = allow
    next()
  }

  handleAllow(req, res, next) {
    try {
      if (req.method === 'OPTIONS') {
        return res
          .status(204)
          .header('Access-Control-Allow-Methods', req.allow)
          .send()
      }
      if (req.allow && !req.allow.includes(req.method)) {
        return res
          .status(405)
          .header('Allow', req.allow)
          .send()
      }
      next()
    } catch (e) {
      next(e)
    }
  }
}