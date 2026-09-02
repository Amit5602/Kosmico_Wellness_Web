const asyncHandler = require('../utils/asyncHandler');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const authService = require('../services/authService');
const User = require('../models/User');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Relaxed for local dev
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  
  // Auto-login after register
  const { user: safeUser, accessToken, refreshToken } = await authService.loginUser(req.body.email, req.body.password, req.ip);
  
  res.cookie('jwt', refreshToken, cookieOptions);
  
  res.status(201).json(new ApiResponse(201, { user: safeUser, accessToken }, 'User registered successfully'));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(email, password, req.ip);
  
  res.cookie('jwt', refreshToken, cookieOptions);
  
  res.status(200).json(new ApiResponse(200, { user, accessToken }, 'Logged in successfully'));
});

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.jwt;
  
  if (!refreshToken) {
    throw new ApiError(401, 'No refresh token provided');
  }
  
  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAuthToken(refreshToken, req.ip);
  
  res.cookie('jwt', newRefreshToken, cookieOptions);
  
  res.status(200).json(new ApiResponse(200, { accessToken }, 'Token refreshed'));
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.jwt;
  if (refreshToken) {
    await authService.logoutUser(refreshToken);
  }
  
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, 'User data retrieved'));
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};
