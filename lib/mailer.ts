import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true'

if (!host || !port || !user || !pass) {
  // Do not throw at import time in case some routes don't need mail
  console.warn('SMTP not fully configured: set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE')
}

export function getTransport() {
  if (!host || !port || !user || !pass) {
    throw new Error('SMTP is not configured')
  }
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

export async function sendMail(options: { to: string; subject: string; html: string; text?: string; from?: string }) {
  const transporter = getTransport()
  const from = options.from || `Coasted Code <${process.env.SMTP_USER || 'noreply@coasted-code.com'}>`
  await transporter.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  })
}


