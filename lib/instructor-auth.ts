import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'coasted-code-instructor-secret-key-2024'

export interface Instructor {
  id: string
  email: string
  name: string
  bio?: string
  specialization?: string[]
  profile_image?: string
  timezone?: string
  status: string
}

export interface InstructorTokenPayload {
  instructorId: string
  email: string
  iat?: number
  exp?: number
}

export async function verifyInstructorToken(request: NextRequest): Promise<InstructorTokenPayload | null> {
  try {
    const authHeader = request.headers.get('authorization')
    console.log('Auth header present:', !!authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header found')
      return null
    }

    const token = authHeader.substring(7)
    console.log('Token length:', token.length)
    console.log('JWT_SECRET used:', JWT_SECRET === 'coasted-code-instructor-secret-key-2024' ? 'Default secret' : 'Custom secret')
    
    const decoded = jwt.verify(token, JWT_SECRET) as InstructorTokenPayload
    console.log('Token decoded successfully:', { instructorId: decoded.instructorId, email: decoded.email })
    
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('Instructor token has expired')
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log('Invalid instructor token')
    } else {
      console.error('Instructor token verification failed:', error)
    }
    return null
  }
}

export function generateInstructorToken(instructor: Instructor): string {
  return jwt.sign(
    { 
      instructorId: instructor.id, 
      email: instructor.email
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Extended to 7 days for better development experience
  )
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function createInstructorSession(instructor: Instructor) {
  const token = generateInstructorToken(instructor)
  
  return {
    success: true,
    token,
    instructor: {
      id: instructor.id,
      email: instructor.email,
      name: instructor.name,
      bio: instructor.bio,
      specialization: instructor.specialization,
      profile_image: instructor.profile_image,
      timezone: instructor.timezone,
      status: instructor.status
    }
  }
}
