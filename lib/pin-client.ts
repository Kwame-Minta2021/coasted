/**
 * Validates that a PIN is exactly 6 digits
 */
export function validatePin(pin: string): boolean {
  return /^\d{6}$/.test(pin)
}

/**
 * Generates a random salt for PIN hashing (client-side only)
 */
export function generateSalt(): string {
  const array = new Uint8Array(32)
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array)
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Hashes a PIN with a salt using PBKDF2 (client-side only)
 */
export async function hashPin(pin: string, salt: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    // Use Web Crypto API for client-side
    const encoder = new TextEncoder()
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(pin),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    )
    
    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: 10000,
        hash: 'SHA-512'
      },
      keyMaterial,
      512
    )
    
    return Array.from(new Uint8Array(derivedBits), byte => byte.toString(16).padStart(2, '0')).join('')
  } else {
    // Fallback for environments without Web Crypto API
    console.warn('Web Crypto API not available, using simple hash fallback')
    const encoder = new TextEncoder()
    const data = encoder.encode(pin + salt)
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data[i]
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(16).padStart(16, '0')
  }
}

/**
 * Verifies a PIN against a stored hash and salt (client-side only)
 */
export async function verifyPin(pin: string, hash: string, salt: string): Promise<boolean> {
  const testHash = await hashPin(pin, salt)
  return testHash === hash
}
