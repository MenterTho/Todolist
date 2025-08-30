import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { success: false, message: "Too many login attempts, please try again later" },
});

export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3,
  message: { success: false, message: "Too many password reset requests, please try again later" },
});
export const refreshTokenRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many refresh token attempts, please try again later" },
});