import { verify } from 'jsonwebtoken'

export default (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            return res.status(403).json({
                status: 'fail',
                message: 'A valid token is required to access this route'
            })
        }

        const token = req.headers.authorization.split(' ')
        const verifyJwt = verify(
            req.headers.authorization.split(' ')[1],
            process.env.JWT_KEY,
            { algorithms: 'HS256' }
          );

        if(token[0] != 'Bearer' || !verifyJwt) {
            return res.status(403).json({
                status: 'fail',
                message: 'Token invalid'
            })
        }

        next()
    } catch(err) {
        return res.status(403).json({
            status: 'fail',
            message: err.message
        })
    }
}