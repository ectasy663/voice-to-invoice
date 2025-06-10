// Mock voice transcription function
export const mockTranscribeVoice = async (_audioBlob: Blob): Promise<string> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock invoice text
  const mockInvoiceText = `Invoice #2025-001
Date: ${new Date().toLocaleDateString()}
Client: John Doe Inc.
Items:
- Consulting Services (5 hours @ $100/hour) = $500
- Software License Fee = $200
- Project Setup Fee = $150
Total Due: $850`;
  
  return mockInvoiceText;
};

// Check if browser supports media recording
export const checkMediaRecordingSupport = (): boolean => {
  try {
    return !!(
      navigator.mediaDevices && 
      typeof navigator.mediaDevices.getUserMedia === 'function' && 
      window.MediaRecorder &&
      typeof window.MediaRecorder === 'function'
    );
  } catch {
    return false;
  }
};

// Request microphone permission
export const requestMicrophonePermission = async (): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return stream;
  } catch (error) {
    console.error('Error accessing microphone:', error);
    return null;
  }
};

// Generate and download invoice as text file (mock PDF generation)
export const generateInvoicePDF = async (invoiceText: string): Promise<void> => {
  // Simulate PDF generation delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create a blob with the invoice text
  const blob = new Blob([invoiceText], { type: 'text/plain' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${Date.now()}.txt`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};

// Format invoice text for better display
export const formatInvoiceText = (text: string): string => {
  return text.replace(/\n/g, '<br>');
};
