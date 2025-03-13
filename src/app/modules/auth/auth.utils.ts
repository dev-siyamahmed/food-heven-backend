import jwt from 'jsonwebtoken';
export const createToken = (
  jwtPayload: { userEmail: string; role: string; userId: string },
  secretKey: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secretKey, {
    expiresIn,
  });
};
