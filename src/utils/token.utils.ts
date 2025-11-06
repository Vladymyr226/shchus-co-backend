import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const generateToken = (id: number): string => {
  return jwt.sign({ id: id }, process.env.SECRET as jwt.Secret, { expiresIn: '100d' })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.SECRET as jwt.Secret);
};

// Генерация JWT токена для сброса пароля с сроком действия 3 минуты
export const generateResetPasswordToken = (userId: number): string => {
  return jwt.sign(
    { userId, type: 'reset-password' },
    process.env.SECRET as jwt.Secret,
    { expiresIn: '3m' } // 3 минуты
  )
}

// Верификация JWT токена для сброса пароля
export const verifyResetPasswordToken = (token: string): { userId: number; type: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET as jwt.Secret) as { userId: number; type: string }
    
    // Проверяем, что это токен для сброса пароля
    if (decoded.type !== 'reset-password') {
      return null
    }
    
    return decoded
  } catch (error) {
    // Токен истек или невалиден
    return null
  }
}
