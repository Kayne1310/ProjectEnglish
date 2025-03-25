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


export const speak = (text, voiceType = "UK English Male") => {
    return new Promise((resolve, reject) => {
        try {
            if (!responsiveVoice) {
                throw new Error("ResponsiveVoice not loaded");
            }

            responsiveVoice.speak(text, voiceType, {
                pitch: 1,
                rate: 0.9,
                volume: 1,
                onend: () => resolve(),
                onerror: (error) => reject(error)
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Hàm dừng phát âm
export const stopSpeak = () => {
    if (responsiveVoice) {
        responsiveVoice.cancel();
    }
};