const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { ApiError } = require('../utils/apiResponse');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthService {
  generateAccessToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    });
  }

  generateRefreshTokenString() {
    return crypto.randomBytes(40).toString('hex');
  }

  async registerUser(data) {
    const { name, email, password } = data;
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      // Intentionally vague or identical to prevent enumeration?
      // Actually standard e-commerce usually tells you if email exists on registration
      throw new ApiError(400, 'User already exists');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password, // Will be hashed by pre-save hook
      role: 'user',
    });

    return user;
  }

  async loginUser(email, password, ip) {
    // Select passwordHash specifically because it's hidden by default
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    
    if (!user || !(await user.matchPassword(password))) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    if (!user.isActive) {
      throw new ApiError(403, 'Account is disabled');
    }

    const accessToken = this.generateAccessToken(user._id);
    const refreshTokenString = this.generateRefreshTokenString();
    
    // Set expiry to 7 days
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const refreshTokenRecord = await RefreshToken.create({
      user: user._id,
      token: RefreshToken.hashToken(refreshTokenString),
      expiresAt,
      createdByIp: ip,
    });

    // Strip password
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return { user: safeUser, accessToken, refreshToken: refreshTokenString };
  }

  async refreshAuthToken(rawToken, ip) {
    const hashedToken = RefreshToken.hashToken(rawToken);
    
    const refreshTokenRecord = await RefreshToken.findOne({ token: hashedToken }).populate('user');
    
    if (!refreshTokenRecord || !refreshTokenRecord.isActive) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = refreshTokenRecord.user;
    if (!user || !user.isActive) {
      throw new ApiError(401, 'User inactive');
    }

    // Revoke old token
    refreshTokenRecord.revokedAt = new Date();
    
    // Issue new token
    const newRefreshTokenString = this.generateRefreshTokenString();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const newRefreshTokenRecord = await RefreshToken.create({
      user: user._id,
      token: RefreshToken.hashToken(newRefreshTokenString),
      expiresAt,
      createdByIp: ip,
    });
    
    refreshTokenRecord.replacedByToken = newRefreshTokenRecord.token;
    await refreshTokenRecord.save();

    const accessToken = this.generateAccessToken(user._id);

    return { accessToken, refreshToken: newRefreshTokenString };
  }

  async logoutUser(rawToken) {
    if (!rawToken) return;
    const hashedToken = RefreshToken.hashToken(rawToken);
    await RefreshToken.findOneAndUpdate(
      { token: hashedToken },
      { revokedAt: new Date() }
    );
  }
}

module.exports = new AuthService();
