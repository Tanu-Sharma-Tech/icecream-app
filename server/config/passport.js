// import passport from 'passport'
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
// import User from '../models/User.js'

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID:     process.env.GOOGLE_CLIENT_ID, 
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL:  '/api/auth/google/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if user already exists
//         let user = await User.findOne({ email: profile.emails[0].value })

//         if (user) {
//           // Update auth provider if needed
//           if (user.authProvider !== 'google') {
//             user.authProvider = 'google'
//             await user.save({ validateBeforeSave: false })
//           }
//           return done(null, user)
//         }

//         // Create new user from Google profile
//         user = await User.create({
//           name:         profile.displayName,
//           email:        profile.emails[0].value,
//           profileImage: profile.photos[0]?.value || '',
//           authProvider: 'google',
//           isVerified:   true,
//           role:         'user',
//         })

//         return done(null, user)
//       } catch (error) {
//         return done(error, null)
//       }
//     }
//   )
// )

// export default passport

// Google OAuth will be configured in a later step
// Skipping for now to avoid clientID error

export default {}