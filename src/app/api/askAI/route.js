export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log(prompt);
    

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-3.1-24b-instruct:free', 
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 5000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate response');
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content;

    if (!result) {
      throw new Error('Empty response from AI');
    }

    // ✅ Convert the result into an array (split by newlines)
    const formattedResult = result.split('\n').filter(line => line.trim() !== '');

    return new Response(
      JSON.stringify({ result: formattedResult }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('OpenRouter Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate response' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
