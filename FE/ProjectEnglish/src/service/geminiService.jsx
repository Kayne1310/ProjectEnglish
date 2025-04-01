const GEMINI_API_KEY = import.meta.env.VITE_API_KEY_GEMINI; // Thay thế bằng API key của bạn
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const generateContentWithGemini = async (prompt) => {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
};


export const generatedataWithGemini = async (prompt, learningContext = null) => {
    try {
        let enhancedPrompt = '';

        if (learningContext) {
            const { level, topics, recentMistakes, strengths } = learningContext;

            enhancedPrompt = `
As an English language tutor, consider the following context:
Student's Level: ${level || 'Beginner'}
Recent Topics: ${topics?.join(', ') || 'General English'}
Common Mistakes: ${recentMistakes?.join(', ') || 'None recorded'}
Strengths: ${strengths?.join(', ') || 'Still learning'}

Current conversation:
${learningContext.messages?.slice(-5).map(m =>
                `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`
            ).join('\n')}

Student's message: ${prompt}

Instructions:
1. Respond in clear, natural English
2. If the student makes a mistake, correct it gently and explain why
3. Use vocabulary appropriate for their level
4. Provide examples and encourage practice
5. Keep responses concise but informative
6. If appropriate, include:
   - Pronunciation tips (IPA)
   - Related vocabulary
   - Grammar explanations
   - Cultural context
7. End with a question or prompt to encourage further conversation

Response:`;
        } else {
            enhancedPrompt = `
As an English language tutor, help the student with the following:
${prompt}

Please provide:
1. A clear, natural response
2. Gentle corrections if needed
3. Relevant examples
4. A follow-up question

Response:`;
        }

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: enhancedPrompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
};


export const speak = (text, voiceType = "UK English Male") => {
    return new Promise((resolve, reject) => {
        try {
            if (!responsiveVoice) {
                throw new Error("ResponsiveVoice not loaded");
            }

            responsiveVoice.speak(text, voiceType, {
                pitch: 1,
                rate: 1.05,
                volume: 1,
                onend: () => resolve(),
                onerror: (error) => reject(error)
            });
        } catch (error) {
            reject(error);
        }
    });
};


export const saveMessages = (messages) => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
};

export const loadMessages = () => {
    const history = localStorage.getItem('chat_history');
    return history ? JSON.parse(history) : [];
};

export const clearHistory = () => {
    localStorage.removeItem('chat_history');
};


// Hàm dừng phát âm
export const stopSpeak = () => {
    if (responsiveVoice) {
        responsiveVoice.cancel();
    }
};