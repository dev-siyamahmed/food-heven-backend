import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token with only userID in payload
 * This is part of the dynamic authentication upgrade which moves role checking to the database
 * @param jwtPayload Object containing userId and additional optional fields
 * @param secretKey JWT secret key
 * @param expiresIn Token expiration time
 * @returns Signed JWT token
 */
export const createToken = (
  jwtPayload: { userId: string },
  secretKey: string,
  expiresIn: string,
) => {
  // Only include userId in token, not role (will be checked from DB)
  return jwt.sign(jwtPayload, secretKey, {
    expiresIn,
  });
};

/**
 * Legacy token generation function that includes role
 * @deprecated Use createToken instead, which only includes userId
 */
export const createLegacyToken = (
  jwtPayload: { userEmail: string; role: string; userId: string },
  secretKey: string,
  expiresIn: string,
) => {
  console.warn('WARNING: Using legacy token generation with role included in token. Consider using createToken instead.');
  return jwt.sign(jwtPayload, secretKey, {
    expiresIn,
  });
};
