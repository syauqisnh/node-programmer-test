import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            status: 108,
            message: 'Token tidak tidak valid atau kadaluwarsa.',
            data: null
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 108,
                message: 'Token tidak tidak valid atau kadaluwarsa.',
                data: null
            });
        }
        
        req.user = user;
        next();
    });
};

export { authenticate };
