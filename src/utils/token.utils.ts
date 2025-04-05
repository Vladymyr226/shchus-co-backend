import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const generateToken = (id: number): string => {
  return jwt.sign({ id: id }, process.env.SECRET as jwt.Secret, { expiresIn: '100d' })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.SECRET as jwt.Secret);
};
