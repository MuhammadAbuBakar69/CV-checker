export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { resumeContent, jobTitle } = body;

    // Get API key from environment variable
    // In React Router v7, server-side env vars are accessed via process.env
    const apiKey = process.env.OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('OPENAI_API_KEY not found in environment variables');
      console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('OPENAI')));
      return Response.json(
        { error: 'OpenAI API key not configured on server. Please add OPENAI_API_KEY to your .env file and restart the server.' },
        { status: 500 }
      );
    }

    // Call OpenAI API from server-side
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `You are an expert ATS (Applicant Tracking System) and resume analyzer. Analyze the following resume for the position: "${jobTitle}".

Resume Content:
${resumeContent}

Provide your analysis in the following JSON format:
{
  "score": <number between 0-100>,
  "feedback": "<brief feedback about the resume quality and improvements>"
}

Be honest and constructive in your feedback.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error status:', response.status);
      console.error('OpenAI API error details:', error);
      
      let errorMessage = 'Failed to analyze resume';
      
      if (response.status === 401) {
        errorMessage = 'Invalid OpenAI API key. Please check your API key in .env file and make sure it is valid and not revoked.';
      } else if (response.status === 429) {
        errorMessage = 'OpenAI API rate limit exceeded. Please try again later.';
      } else if (response.status === 500) {
        errorMessage = 'OpenAI API server error. Please try again later.';
      }
      
      return Response.json(
        { error: errorMessage, details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    const result = JSON.parse(content);

    return Response.json({
      newScore: result.score,
      feedback: result.feedback
    });

  } catch (error) {
    console.error('Error in analyze API:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
