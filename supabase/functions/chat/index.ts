import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string
  chatbotId: string
  leadId: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get request body
    const { message, chatbotId, leadId } = await req.json() as ChatRequest

    // Validate required parameters
    if (!message || !chatbotId || !leadId) {
      console.error('Missing required parameters:', { message, chatbotId, leadId })
      throw new Error('Missing required parameters')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Log incoming message
    const { error: messageError } = await supabaseClient
      .from('chat_messages')
      .insert({
        chatbot_id: chatbotId,
        lead_id: leadId,
        message: message,
        is_bot: false
      })

    if (messageError) {
      console.error('Error logging message:', messageError)
      throw messageError
    }

    // Get chatbot configuration
    const { data: chatbot, error: chatbotError } = await supabaseClient
      .from('chatbots')
      .select('*')
      .eq('id', chatbotId)
      .single()

    if (chatbotError) {
      console.error('Error fetching chatbot:', chatbotError)
      throw chatbotError
    }

    // For now, just echo back a simple response
    // TODO: Implement actual chatbot logic using chatbot.configuration
    const response = {
      message: `I received your message: "${message}". How can I help you further?`,
      metadata: {
        chatbotName: chatbot.name,
        timestamp: new Date().toISOString()
      }
    }

    // Log bot response
    const { error: botMessageError } = await supabaseClient
      .from('chat_messages')
      .insert({
        chatbot_id: chatbotId,
        lead_id: leadId,
        message: response.message,
        is_bot: true,
        metadata: response.metadata
      })

    if (botMessageError) {
      console.error('Error logging bot message:', botMessageError)
      throw botMessageError
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: String(error)
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})