export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // req.user is populated by authMiddleware
        if (!req.user || !req.user.role || !roles.includes(req.user.role.name)) {
            return res.status(403).json({ 
                message: `Role ${req.user?.role?.name || 'Unknown'} is not authorized to access this route` 
            });
        }
        next();
    }
}
