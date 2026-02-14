export const checkPermission = (permissionName) => {
    return (req, res, next) => {
        // req.user.role.permissions must be populated
        // Check if user has role and permissions
        if (!req.user || !req.user.role || !req.user.role.permissions) {
             return res.status(403).json({ message: 'Permissions not available' });
        }

        const userPermissions = req.user.role.permissions; 
        const hasPermission = userPermissions.some(p => p.name === permissionName);
        
        if (!hasPermission) {
            return res.status(403).json({ message: `Permission '${permissionName}' required` });
        }
        next();
    }
}
