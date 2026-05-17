import nodemailer from 'nodemailer'

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export const sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter()
    const mailOptions = {
      from: `"Sweet Movement 🍦" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Sweet Movement',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border-radius: 12px; border: 1px solid #eee; text-align: center;">
          <img src="http://localhost:5000/public/logo.png" alt="Sweet Movement Logo" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 3px solid #F97316;" />
          <h2 style="color: #F97316; margin-top: 0;">🍦 Sweet Movement</h2>
          <p style="text-align: left;">Hi <strong>${name}</strong>,</p>
          <p style="text-align: left;">Your One-Time Password (OTP) is:</p>
          <div style="background: #FFF3E8; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #F97316; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p style="text-align: left;">This OTP is valid for <strong>10 minutes</strong>.</p>
          <p style="text-align: left;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    }
    await transporter.sendMail(mailOptions)
    console.log(`OTP email sent to ${email}`)
  } catch (error) {
    console.error('Email send error:', error.message)
    throw new Error('Failed to send OTP email: ' + error.message)
  }
}

export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter()
    const mailOptions = {
      from: `"Sweet Movement 🍦" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Sweet Movement! 🍦',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border-radius: 12px; border: 1px solid #eee; text-align: center;">
          <img src="http://localhost:5000/public/logo.png" alt="Sweet Movement Logo" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 3px solid #F97316;" />
          <h2 style="color: #F97316; margin-top: 0;">🍦 Welcome to Sweet Movement!</h2>
          <p style="text-align: left;">Hi <strong>${name}</strong>,</p>
          <p style="text-align: left;">Your account has been verified successfully!</p>
          <p style="text-align: left;">You can now browse our delicious ice cream flavors and place orders.</p>
        </div>
      `,
    }
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Welcome email error:', error.message)
  }
}

export const sendVendorApplicationEmail = async (email, name) => {
  try {
    const transporter = createTransporter()
    const mailOptions = {
      from: `"Sweet Movement 🍦" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank You for Applying to be a Vendor!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border-radius: 12px; border: 1px solid #eee; text-align: center;">
          <img src="http://localhost:5000/public/logo.png" alt="Sweet Movement Logo" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 3px solid #F97316;" />
          <h2 style="color: #F97316; margin-top: 0;">🍦 Vendor Application Received</h2>
          <p style="text-align: left;">Hi <strong>${name}</strong>,</p>
          <p style="text-align: left;">Thank you for connecting with us! We have received your request to become a vendor.</p>
          <p style="text-align: left;">Our admin team will review your application soon. Once approved, you will receive a verification code here.</p>
        </div>
      `,
    }
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Vendor application email error:', error.message)
  }
}

export const sendVendorVerificationCodeEmail = async (email, name, code) => {
  try {
    const transporter = createTransporter()
    const mailOptions = {
      from: `"Sweet Movement 🍦" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Vendor Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border-radius: 12px; border: 1px solid #eee; text-align: center;">
          <img src="http://localhost:5000/public/logo.png" alt="Sweet Movement Logo" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 3px solid #F97316;" />
          <h2 style="color: #F97316; margin-top: 0;">🍦 Vendor Application Approved!</h2>
          <p style="text-align: left;">Hi <strong>${name}</strong>,</p>
          <p style="text-align: left;">Congratulations! Your request to become a vendor has been approved.</p>
          <p style="text-align: left;">Please use the following verification code to activate your vendor account:</p>
          <div style="background: #FFF3E8; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #F97316; letter-spacing: 8px; margin: 0;">${code}</h1>
          </div>
          <p style="text-align: left;">Log in to your account and enter this code to get started!</p>
        </div>
      `,
    }
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Vendor verification email error:', error.message)
  }
}

export const sendVendorCancellationEmail = async (email, name) => {
  try {
    const transporter = createTransporter()
    const mailOptions = {
      from: `"Sweet Movement 🍦" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Vendor Application Cancelled',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border-radius: 12px; border: 1px solid #eee; text-align: center;">
          <img src="http://localhost:5000/public/logo.png" alt="Sweet Movement Logo" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 3px solid #F97316;" />
          <h2 style="color: #F97316; margin-top: 0;">🍦 Application Cancelled</h2>
          <p style="text-align: left;">Hi <strong>${name}</strong>,</p>
          <p style="text-align: left;">This email is to confirm that your vendor application has been successfully cancelled.</p>
          <p style="text-align: left;">If you change your mind in the future, you can always apply again from your account settings.</p>
        </div>
      `,
    }
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Vendor cancellation email error:', error.message)
  }
}