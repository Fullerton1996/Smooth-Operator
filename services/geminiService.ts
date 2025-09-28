import { Level, AnimationProps } from '../types';

const generateContent = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch('/.netlify/functions/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
            console.error('API Function Error:', errorData);
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Error calling Netlify function:", error);
        return "Sorry, I couldn't get a response from the AI. Please ensure your API key is correctly configured in your Netlify deployment settings and check the browser console for more details.";
    }
};

export const getHint = async (level: Level, userProps: AnimationProps): Promise<string> => {
  const prompt = `
    You are a helpful motion design assistant.
    The user is trying to identify an easing function.
    The goal is to identify the easing function described as: "${level.description}"
    The target easing is: "${level.targetProps.easing}"
    The user has currently selected: "${userProps.easing}"

    Give a single, short hint to guide the user. Focus on the *feeling* or *velocity* of the animation. Don't mention the answer by name.
    For example: "Pay close attention to how the animation begins." or "Does the object seem to slow down before it stops?".
  `;
  return generateContent(prompt);
};

export const getFeedback = async (level: Level, userProps: AnimationProps): Promise<string> => {
  const isCorrect = level.targetProps.easing === userProps.easing;
  const prompt = `
    You are a motion design instructor providing feedback.
    The user is trying to identify an easing function.
    The target was "${level.targetProps.easing}". The user chose "${userProps.easing}".
    The user was ${isCorrect ? 'correct' : 'incorrect'}.

    Provide concise, encouraging feedback in 2-3 sentences.
    - If the user was correct, congratulate them and briefly explain a common use case for the "${level.targetProps.easing}" function.
    - If the user was incorrect, gently correct them. Explain the difference in feeling between their choice ("${userProps.easing}") and the target ("${level.targetProps.easing}").
    Speak like a friendly mentor.
  `;
  return generateContent(prompt);
};
