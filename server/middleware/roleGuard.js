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