interface SendMessageResponse {
  response: string;
  metadata?: any;
}

export const sendMessage = async (
  message: string,
  chatbotId: string,
  leadId?: string
): Promise<SendMessageResponse> => {
  const params = new URLSearchParams({
    chatbot_id: chatbotId,
    message: message,
    channel: 'web'
  });
  
  if (leadId) {
    params.append('lead_id', leadId);
  }

  const response = await fetch(
    `https://web-production-700a.up.railway.app/api/v1/send-message?${params.toString()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
};