import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_RhLLvbC1_3fGbuRPt9p9kvBHdDgV7VrLs')

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const schoolName = formData.get('school') as string
    const contactName = formData.get('contact') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const configJson = formData.get('config_json') as string
    const estimateMonthly = formData.get('estimate_monthly') as string
    const estimateTotal = formData.get('estimate_total') as string
    const mentorCount = formData.get('mentor_count') as string
    const kits = formData.get('kits') as string
    const summary = formData.get('summary') as string
    const kind = formData.get('kind') as string || 'school_proposal'

    // Validate required fields
    if (!schoolName || !contactName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Parse configuration
    let config = {}
    try {
      config = JSON.parse(configJson || '{}')
    } catch (e) {
      console.error('Failed to parse config JSON:', e)
    }

    // Create email content
    const emailSubject = `New ${kind === 'school_proposal' ? 'School Proposal' : 'Partner'} Request - ${schoolName}`
    
    const emailBody = `
New ${kind === 'school_proposal' ? 'School Proposal' : 'Partner'} Request

School Information:
- School Name: ${schoolName}
- Contact Person: ${contactName}
- Email: ${email}
- Phone: ${phone || 'Not provided'}

Program Configuration:
${summary || 'No summary provided'}

Estimated Costs:
- Monthly: GHS ${estimateMonthly || 'Not calculated'}
- Total: GHS ${estimateTotal || 'Not calculated'}
- Mentors Needed: ${mentorCount || 'Not calculated'}
- Robotics Kits: ${kits || 'Not calculated'}

Full Configuration:
${JSON.stringify(config, null, 2)}

---
This request was submitted from the Coasted Code website.
Please respond to ${email} within 24 hours.
    `.trim()

    // Send email to Coasted Code team
    try {
      await resend.emails.send({
        from: 'Coasted Code <noreply@coastedcode.org>',
        to: 'coastedcode@gmail.com',
        subject: emailSubject,
        text: emailBody,
        replyTo: email
      })
      console.log('✅ Email sent to coastedcode@gmail.com successfully')
    } catch (emailError) {
      console.error('❌ Failed to send email to coastedcode@gmail.com:', emailError)
      // Continue with confirmation email even if this fails
    }

    // Also send a confirmation email to the requester
    const confirmationSubject = 'Your Coasted Code Proposal Request - We\'ll be in touch soon!'
    const confirmationBody = `
Dear ${contactName},

Thank you for your interest in Coasted Code for ${schoolName}!

We have received your proposal request and our team will review your requirements carefully. You can expect to hear from us within 24 hours with a detailed proposal tailored to your needs.

Request Summary:
${summary || 'No summary provided'}

Estimated Investment:
- Monthly: GHS ${estimateMonthly || 'To be determined'}
- Total: GHS ${estimateTotal || 'To be determined'}

What happens next:
1. Our team will review your requirements
2. We'll create a customized proposal
3. We'll schedule a call to discuss details
4. We'll provide a detailed implementation plan

If you have any urgent questions, please don't hesitate to reach out to us at coastedcode@gmail.com.

Best regards,
The Coasted Code Team
    `.trim()

    try {
      await resend.emails.send({
        from: 'Coasted Code <noreply@coastedcode.org>',
        to: email,
        subject: confirmationSubject,
        text: confirmationBody,
        replyTo: 'coastedcode@gmail.com'
      })
      console.log('✅ Confirmation email sent to requester successfully')
    } catch (confirmationError) {
      console.error('❌ Failed to send confirmation email:', confirmationError)
      // Still return success even if confirmation email fails
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Proposal request submitted successfully. We\'ll be in touch within 24 hours.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Partner API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
