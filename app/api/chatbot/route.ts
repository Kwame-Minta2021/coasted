import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAcRqcSCjDbRFCxJR99QF2Jk4082WyoBcU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

// Site knowledge base for context
const SITE_CONTEXT = `
You are an AI assistant for Coasted Code, a hybrid AI, Robotics & Coding School serving students aged 6-17. You have comprehensive knowledge about the platform and can help students navigate, learn, and succeed.

PLATFORM OVERVIEW:
- Coasted Code offers live online classes (Google Meet), in-person labs, and on-demand content
- Serves students aged 6-17 with age-appropriate curriculum
- Focus on practical, hands-on learning with real-world applications
- Comprehensive learning management system with progress tracking
- Hybrid learning approach combining online and offline experiences

STUDENT PORTAL FEATURES:
1. Overview Dashboard (/student) - Central hub showing:
   - Progress statistics and completion rates
   - Recent activity and achievements
   - Upcoming deadlines and assignments
   - Quick access to important features

2. Course Modules (/student/modules) - Interactive learning:
   - Structured coding lessons with step-by-step guidance
   - Hands-on exercises and coding challenges
   - Progress tracking for each module
   - Video content and interactive tutorials
   - Real-time feedback and hints

3. Projects (/student/projects) - Practical application:
   - Beginner, intermediate, and advanced project levels
   - Real-world coding projects and applications
   - Portfolio building opportunities
   - Peer collaboration and sharing
   - Instructor feedback and grading

4. Assignments (/student/assignments) - Academic tasks:
   - Course-specific assignments and homework
   - Submission system with file uploads
   - Due date tracking and reminders
   - Grading and feedback system
   - Progress monitoring

5. Messages (/student/messages) - Communication:
   - Direct messaging with instructors
   - Peer-to-peer communication
   - Announcements and updates
   - Help requests and support
   - Real-time notifications

6. Guidance (/student/guidance) - Learning support:
   - Screen time management tools
   - Focus session timers and productivity tools
   - Learning resources and study guides
   - Time management and organization tips
   - Mental health and wellness resources

7. Account Settings (/student/account) - Personalization:
   - Profile management and updates
   - Theme preferences (light, dark, system)
   - Notification settings
   - Privacy and security settings
   - Password management

8. Schedule (/student/schedule) - Time management:
   - Upcoming classes and events
   - Assignment due dates
   - Personal study schedule
   - Calendar integration
   - Reminder system

TECHNICAL FEATURES:
- Real-time progress tracking and analytics
- Interactive coding environment with syntax highlighting
- File upload and submission system
- Video streaming and playback
- Real-time messaging and notifications
- Screen time monitoring and management
- Focus session timers with productivity tracking
- Theme switching with system preference detection
- Mobile-responsive design for learning anywhere
- Offline capability for downloaded content

LEARNING METHODOLOGY:
- Project-based learning approach
- Hands-on coding exercises and challenges
- Peer collaboration and code sharing
- Instructor mentorship and guidance
- Self-paced learning with structured milestones
- Gamification elements for engagement
- Real-world application focus
- Age-appropriate curriculum progression

NAVIGATION & USER EXPERIENCE:
- Intuitive sidebar navigation in student portal
- Breadcrumb navigation for deep pages
- Search functionality across content
- Quick access buttons and shortcuts
- Mobile-optimized interface
- Keyboard shortcuts for power users
- Accessibility features and screen reader support

ACCOUNT & SECURITY:
- Secure authentication via Supabase
- Profile management with avatar uploads
- Privacy controls and data protection
- Two-factor authentication support
- Session management and security
- GDPR compliance and data handling

COMMON STUDENT QUESTIONS & ANSWERS:

Q: How do I access my course materials?
A: Navigate to "Course Modules" in the sidebar. You'll see all available modules organized by difficulty and topic. Click on any module to start learning.

Q: How do I submit an assignment?
A: Go to "Assignments" section, find your assignment, and click "Submit Assignment". You can upload files, add comments, and track your submission status.

Q: How can I track my progress?
A: Check the Overview dashboard for overall stats, or visit individual sections (Modules, Projects, Assignments) to see detailed progress and completion rates.

Q: How do I communicate with my instructor?
A: Use the "Messages" section to send direct messages to your instructors. You can also ask questions during live classes or office hours.

Q: How do I change my theme?
A: Go to Account Settings > Appearance and select your preferred theme (Light, Dark, or System). Changes apply immediately.

Q: How does screen time management work?
A: Visit the Guidance section to set daily limits, track your device usage, and get tips for healthy screen time habits.

Q: What are focus sessions?
A: Focus sessions are timed study periods (25-50 minutes) to help you concentrate. Access them in the Guidance section to improve productivity.

Q: How do I change my password?
A: Go to Account Settings > Security > Change Password. You'll need your current password and will be logged out after the change.

Q: How do I access live classes?
A: Check your Schedule for upcoming live classes. You'll receive meeting links via email and in-app notifications.

Q: What if I'm stuck on a coding problem?
A: Use the hint system in modules, ask in the Messages section, or join office hours. Don't hesitate to ask for help!

Q: How do I download content for offline learning?
A: Most modules support offline viewing. Look for the download icon next to content you want to access offline.

RESPONSE GUIDELINES:
- Be encouraging, supportive, and student-friendly
- Provide clear, step-by-step instructions
- Reference specific page locations and navigation paths
- Encourage problem-solving and independent learning
- Use age-appropriate language and examples
- Provide actionable advice and next steps
- If unsure about platform specifics, suggest contacting an instructor
- Maintain a positive, motivating tone
- Use emojis sparingly but appropriately
- Always consider the student's current page context
- Offer multiple solutions when possible
- Encourage asking follow-up questions
`;

// Helper function to generate fallback responses when AI is unavailable
function generateFallbackResponse(message: string, pageContext?: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Common question patterns and responses
  if (lowerMessage.includes('login') || lowerMessage.includes('sign in')) {
    return "To log in to your Coasted Code account, go to the login page and enter your email and password. If you're having trouble, you can reset your password or contact our support team for assistance.";
  }
  
  if (lowerMessage.includes('course') || lowerMessage.includes('module')) {
    return "You can access your course materials by navigating to the 'Course Modules' section in your student dashboard. There you'll find all your lessons, exercises, and progress tracking.";
  }
  
  if (lowerMessage.includes('assignment') || lowerMessage.includes('homework')) {
    return "Check the 'Assignments' section in your dashboard to view and submit your assignments. Make sure to check the due dates and submission requirements.";
  }
  
  if (lowerMessage.includes('progress') || lowerMessage.includes('grade')) {
    return "Your progress and grades can be viewed in the Overview dashboard. You can also check individual sections like Modules, Projects, and Assignments for detailed progress tracking.";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "For immediate help, you can contact our support team through the Messages section or visit our FAQ. You can also reach out to your instructors directly.";
  }
  
  if (lowerMessage.includes('schedule') || lowerMessage.includes('class')) {
    return "Check the 'Schedule' section to see your upcoming classes, live sessions, and important deadlines. You'll receive notifications for upcoming events.";
  }
  
  if (lowerMessage.includes('password') || lowerMessage.includes('account')) {
    return "To manage your account settings, go to 'Account Settings' in your dashboard. You can change your password, update your profile, and manage your preferences there.";
  }
  
  if (lowerMessage.includes('payment') || lowerMessage.includes('enroll') || lowerMessage.includes('fee')) {
    return "For enrollment and payment information, visit our enrollment page or contact our support team. We offer flexible payment options and age-appropriate pricing for students aged 6-17.";
  }
  
  if (lowerMessage.includes('instructor') || lowerMessage.includes('teacher')) {
    return "You can communicate with your instructors through the Messages section. They're available to help with questions, provide feedback, and guide your learning journey.";
  }
  
  if (lowerMessage.includes('project') || lowerMessage.includes('coding')) {
    return "Check the 'Projects' section to work on hands-on coding projects. You'll find beginner, intermediate, and advanced projects to build your skills and create a portfolio.";
  }
  
  // Default helpful response
  return "I'm currently experiencing some technical difficulties, but I'm still here to help! You can:\n\n• Browse your course materials in the Modules section\n• Check your assignments and progress\n• Contact our support team directly\n• Try asking your question again in a few moments\n\nI'll be back online soon! 😊";
}

// Helper function to retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (attempt === maxRetries - 1) throw error;
      
      // Only retry on 429 (quota exceeded) or 503 (service unavailable) errors
      if (error.status === 429 || error.status === 503) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [], pageContext, currentPath } = await request.json();
    
    console.log('Chatbot API - Received request:', { 
      message: message?.substring(0, 100), 
      historyLength: conversationHistory.length,
      pageContext,
      currentPath
    });

    if (!message || typeof message !== 'string') {
      console.log('Chatbot API - Invalid message format');
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Prepare conversation context
    const conversationContext = conversationHistory
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Create enhanced prompt with page context
    const fullPrompt = `${SITE_CONTEXT}

CURRENT PAGE CONTEXT:
${pageContext || 'General application page'}

CURRENT PATH: ${currentPath || 'Unknown'}

CONVERSATION HISTORY:
${conversationContext}

CURRENT QUESTION: ${message}

Please provide a helpful response as the Coasted Code AI assistant. Be encouraging and provide specific guidance about the platform when relevant. Consider the student's current page context when giving advice.`;

    // Call Gemini API with retry logic
    console.log('Chatbot API - Calling Gemini API...', {
      url: GEMINI_API_URL,
      hasApiKey: !!GEMINI_API_KEY,
      apiKeyPrefix: GEMINI_API_KEY?.substring(0, 10) + '...'
    });
    
    const response = await retryWithBackoff(async () => {
      return await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });
    });

    console.log('Chatbot API - Gemini response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Chatbot API - Gemini API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      
      // Provide a fallback response for common errors
      if (response.status === 404) {
        return NextResponse.json({ 
          success: false,
          error: 'AI service temporarily unavailable. Please try again later or contact support.',
          fallback: true
        }, { status: 503 });
      }
      
      // Handle quota exceeded (429) errors
      if (response.status === 429) {
        // Try to provide a helpful fallback response based on the user's question
        const fallbackResponse = generateFallbackResponse(message, pageContext);
        
        return NextResponse.json({ 
          success: true,
          response: fallbackResponse,
          fallback: true,
          quotaExceeded: true,
          timestamp: new Date().toISOString()
        });
      }
      
      return NextResponse.json({ 
        success: false,
        error: `API Error: ${response.status} - ${errorData}` 
      }, { status: 500 });
    }

    const data = await response.json();
    console.log('Chatbot API - Gemini response data:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Chatbot API - Invalid Gemini API response:', data);
      return NextResponse.json({ 
        success: false,
        error: 'Invalid response from AI' 
      }, { status: 500 });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    console.log('Chatbot API - Generated response:', aiResponse?.substring(0, 100));

    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({ 
      success: false,
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}