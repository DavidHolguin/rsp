export const sendMessage = async (
  message: string,
  chatbotId: string,
  leadId: string,
  agencyId: string
) => {
  const response = await fetch(
    `https://web-production-700a.up.railway.app/api/v1/send-message?chatbot_id=${chatbotId}&message=${encodeURIComponent(
      message
    )}&channel=web&agency_id=${agencyId}&lead_id=${leadId}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error sending message");
  }

  return response.json();
};