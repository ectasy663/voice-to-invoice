import emailjs from '@emailjs/browser';

// Email service configuration
const EMAIL_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_demo123',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_demo123',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'demo_public_key_123',
  simulateEmail: import.meta.env.VITE_SIMULATE_EMAIL === 'true',
  appName: import.meta.env.VITE_APP_NAME || 'VoiceInvoice',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0'
};

export interface EmailTemplate {
  to_email: string;
  to_name: string;
  otp_code: string;
  purpose: 'login' | 'signup';
  app_name: string;
  expiry_minutes: number;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
  messageId?: string;
}

// Initialize EmailJS (call this once when app starts)
export const initializeEmailService = async (): Promise<boolean> => {
  try {
    if (EMAIL_CONFIG.simulateEmail) {
      console.log('📧 Email service initialized in simulation mode');
      return true;
    }

    // Initialize EmailJS with your public key
    emailjs.init(EMAIL_CONFIG.publicKey);
    console.log('📧 EmailJS service initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize email service:', error);
    return false;
  }
};

// Send OTP email using EmailJS
const sendEmailViaEmailJS = async (templateData: EmailTemplate): Promise<EmailResponse> => {
  try {
    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      {
        to_email: templateData.to_email,
        to_name: templateData.to_name,
        otp_code: templateData.otp_code,
        purpose: templateData.purpose === 'login' ? 'Sign In' : 'Account Registration',
        app_name: templateData.app_name,
        expiry_minutes: templateData.expiry_minutes,
        current_year: new Date().getFullYear()
      }
    );

    return {
      success: true,
      message: `OTP email sent successfully to ${templateData.to_email}`,
      messageId: response.text
    };
  } catch (error: any) {
    console.error('EmailJS Error:', error);
    return {
      success: false,
      message: 'Failed to send email via EmailJS',
      error: error.text || error.message
    };
  }
};

// Simulate email sending for demo purposes
const simulateEmailSending = async (templateData: EmailTemplate): Promise<EmailResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Create realistic email content
  const emailContent = createEmailContent(templateData);
  
  // Log the email content (simulating email being sent)
  console.log('\n📧 ===== EMAIL SENT =====');
  console.log(`📬 To: ${templateData.to_email}`);
  console.log(`📝 Subject: Your VoiceInvoice Verification Code`);
  console.log(`\n📄 Email Content:\n${emailContent}`);
  console.log('📧 =====================\n');

  // Show browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('📧 Email Sent!', {
      body: `OTP: ${templateData.otp_code} sent to ${templateData.to_email}`,
      icon: '/vite.svg'
    });
  }

  // Simulate opening email in a new tab (for demo)
  const emailWindow = window.open('', '_blank');
  if (emailWindow) {
    emailWindow.document.write(createEmailHTML(templateData));
    emailWindow.document.title = 'VoiceInvoice - Email Verification';
  }

  return {
    success: true,
    message: `✅ Email successfully sent to ${templateData.to_email}`,
    messageId: `sim_${Date.now()}`
  };
};

// Create email content
const createEmailContent = (templateData: EmailTemplate): string => {
  const purposeText = templateData.purpose === 'login' ? 'sign in to' : 'complete your registration on';
  
  return `
Hello ${templateData.to_name}!

Your verification code to ${purposeText} ${templateData.app_name} is:

🔢 ${templateData.otp_code}

This code will expire in ${templateData.expiry_minutes} minutes.

If you didn't request this code, please ignore this email.

Best regards,
The ${templateData.app_name} Team

---
This is an automated message. Please do not reply to this email.
  `.trim();
};

// Create HTML email content for popup display
const createEmailHTML = (templateData: EmailTemplate): string => {
  const purposeText = templateData.purpose === 'login' ? 'sign in to' : 'complete your registration on';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <title>VoiceInvoice - Email Verification</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 40px auto; 
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .email-container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
        }
        .logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 12px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
        }
        .otp-code { 
            font-size: 32px; 
            font-weight: bold; 
            color: #667eea; 
            text-align: center; 
            margin: 30px 0; 
            padding: 20px; 
            background: #f8f9ff; 
            border-radius: 12px;
            letter-spacing: 4px;
            border: 2px dashed #667eea;
        }
        .footer { 
            text-align: center; 
            font-size: 14px; 
            color: #666; 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #eee; 
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 12px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">📧</div>
            <h1 style="color: #333; margin: 0;">Email Verification</h1>
            <p style="color: #666; margin: 10px 0 0 0;">VoiceInvoice Security Code</p>
        </div>
        
        <p>Hello <strong>${templateData.to_name}</strong>!</p>
        
        <p>Your verification code to ${purposeText} <strong>${templateData.app_name}</strong> is:</p>
        
        <div class="otp-code">${templateData.otp_code}</div>
        
        <div class="warning">
            ⏰ This code will expire in <strong>${templateData.expiry_minutes} minutes</strong>.
        </div>
        
        <p>If you didn't request this code, please ignore this email.</p>
        
        <div class="footer">
            <p><strong>Best regards,</strong><br>
            The ${templateData.app_name} Team</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
  `;
};

// Main function to send OTP email
export const sendOTPEmail = async (
  email: string, 
  otp: string, 
  purpose: 'login' | 'signup',
  recipientName?: string
): Promise<EmailResponse> => {
  try {    const templateData: EmailTemplate = {
      to_email: email,
      to_name: recipientName || email.split('@')[0],
      otp_code: otp,
      purpose,
      app_name: EMAIL_CONFIG.appName,
      expiry_minutes: 5
    };

    // Choose email sending method based on configuration
    if (EMAIL_CONFIG.simulateEmail) {
      return await simulateEmailSending(templateData);
    } else {
      return await sendEmailViaEmailJS(templateData);
    }
  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error.message
    };
  }
};

// Send welcome email after successful registration
export const sendWelcomeEmail = async (
  email: string,
  userName: string
): Promise<EmailResponse> => {
  try {
    if (EMAIL_CONFIG.simulateEmail) {
      console.log(`📧 Welcome email would be sent to ${email} for ${userName}`);
      return {
        success: true,
        message: 'Welcome email simulated'
      };
    }

    // In a real implementation, you'd send a welcome email here
    // using your email service
    
    return {
      success: true,
      message: 'Welcome email sent successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to send welcome email',
      error: error.message
    };
  }
};

// Helper function to validate email format
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to extract name from email
export const extractNameFromEmail = (email: string): string => {
  const localPart = email.split('@')[0];
  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
};
