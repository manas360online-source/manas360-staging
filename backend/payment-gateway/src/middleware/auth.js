
module.exports = {
    authMiddleware: (req, res, next) => {
        // Mock Auth: In production, verify JWT/Session here
        req.user = { id: req.body.user_id || "demo_user" };
        next();
    }
};
