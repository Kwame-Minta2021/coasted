import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'coasted-code-admin-secret-key-2024'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

export interface AdminTokenPayload {
  adminId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export async function verifyAdminToken(request: NextRequest): Promise<AdminTokenPayload | null> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload
    
    if (decoded.role !== 'admin') {
      return null
    }

    return decoded
  } catch (error) {
    console.error('Admin token verification failed:', error)
    return null
  }
}

export function generateAdminToken(admin: AdminUser): string {
  return jwt.sign(
    { 
      adminId: admin.id, 
      email: admin.email, 
      role: admin.role 
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  )
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function createAdminSession(admin: AdminUser) {
  const token = generateAdminToken(admin)
  
  return {
    success: true,
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  }
}
