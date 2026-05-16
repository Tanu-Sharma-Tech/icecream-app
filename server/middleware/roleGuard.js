export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next()
    }
    return res.status(403).json({ success: false, message: 'Admin access only' })
  }
  
  export const vendorOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'vendor' || req.user.role === 'admin')) {
      return next()
    }
    return res.status(403).json({ success: false, message: 'Vendor access only' })
  }
  
  export const adminOrVendor = (req, res, next) => {
  if (req.user && ['admin', 'vendor'].includes(req.user.role)) {
    return next()
  }
  return res.status(403).json({ success: false, message: 'Not authorized' })
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user?.role} is not authorized to access this route`
      })
    }
    next()
  }
}