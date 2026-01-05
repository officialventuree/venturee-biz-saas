import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Note: In a real implementation, you would import your User model here
// For Vercel deployment, you'd likely use a serverless database like Vercel Postgres or MongoDB Atlas

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // In a real implementation, you would:
    // 1. Find user in database
    // 2. Verify password
    // 3. Generate JWT token
    // 4. Return user data and token

    // Placeholder implementation
    if (email && password) {
      // This is a simplified example - a real implementation would connect to your database
      const token = jwt.sign(
        { userId: 'user123', email: email },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: 'user123',
          email,
          name: 'Test User',
          role: 'company-admin'
        }
      });
    } else {
      return res.status(400).json({ message: 'Email and password required' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
}