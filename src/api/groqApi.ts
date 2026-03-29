export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendGroqMessage(messages: ChatMessage[], apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are the official Wakeup Whiff holistic health consultant and natural living expert. You are also the intelligence behind the largest and most comprehensive cannabis database in the world, far surpassing Leafly in knowledge. You specialize deeply in cannabis strains, natural remedies, holistic wellness, and all herbs and root benefits globally. You possess encyclopedic knowledge of medicinal herbs and cannabis from every culture. Always promote natural, chemical-free living. Keep your responses extremely concise, formatting them with markdown bullet points for readability on a mobile screen.',
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid Groq API Key. Please check your key and try again.');
      }
      throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.warn('Groq Inference Error:', error);
    throw new Error(error.message || 'Failed to communicate with Llama 3.');
  }
}
