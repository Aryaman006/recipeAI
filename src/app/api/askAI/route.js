export async function POST(req) {
  try {
    const { prompt } = await req.json();


    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "mistralai/devstral-small:free",
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 5000,
      }),
    });

    console.log(response);
    
    const rawText = await response.text(); // Always get the raw response first

    if (!response.ok) {
      console.error('OpenRouter error response:', rawText); // Log raw HTML or error
      throw new Error(`Failed to generate response from OpenRouter`);
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', rawText);
      throw new Error('Invalid JSON response from OpenRouter');
    }

    const result = data.choices?.[0]?.message?.content;

    if (!result) {
      throw new Error('Empty response from AI');
    }

    const formattedResult = result.split('\n').filter(line => line.trim() !== '');

    return new Response(JSON.stringify({ result: formattedResult }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('OpenRouter Error:', error.message);
    return new Response(JSON.stringify({ error: error.message || 'Failed to generate response' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
