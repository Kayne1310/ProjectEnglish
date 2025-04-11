import { generateContentWithGemini } from '../service/geminiService';

export const handleWordGeneration = async (wordTitle, language) => {
    if (!wordTitle) {
        throw new Error('Vui lòng nhập từ cần tìm kiếm');
    }

    // Xác định ngôn ngữ cho prompt
    const getLanguagePrompt = (lang) => {
        switch (lang?.toLowerCase()) {
            case 'korean':
                return 'Korean word';
            case 'japanese':
                return 'Japanese word';
            case 'chinese':
                return 'Chinese word';
            case 'english':
                return 'English word';
            case 'french':
                return 'French word';
            default:
                return 'word'; // Trường hợp mặc định
        }
    };

    const prompt = `You are master teacher of language, Provide information about 250 words the ${getLanguagePrompt(language)} "${wordTitle}" in the following format:
     - **Definition:** (Vietnamese definition write short and concise)
            Example: "Chó"

            - **Type:** (part of speech in Vietnamese)
            Example: Danh từ (noun)

            - **Phonetic:** / (IPA pronunciation)
            Example: /dɔːɡ/

            - **Examples:** Provide at least three examples in the following format:

            *ENG: (original sentence)
            *TRANS: (IPA pronunciation if available)
            *VIET: (Vietnamese translation)

            Example:
            *ENG: My dog is very playful.
            *TRANS: /maɪ dɔːɡ ɪz ˈveri ˈpleɪfʊl/
            *VIET: Con chó của tôi rất hay nô đùa.

            *ENG: I'm going to walk the dog.
            *TRANS: /aɪm ˈɡoʊɪŋ tuː wɔːk ðə dɔːɡ/
            *VIET: Tôi định dắt chó đi dạo.

            *ENG: He trains dogs for a living.
            *TRANS: /hiː treɪnz dɔːɡz fɔːr ə ˈlɪvɪŋ/
            *VIET: Anh ấy huấn luyện chó để kiếm sống.

            - **Note:** Provide additional information in Vietnamese about usage, variations, related idioms, and contextual meanings.

            Example:
            * "Chó" là một con vật nuôi phổ biến trong nhiều gia đình ở Việt Nam và trên thế giới. Có rất nhiều giống chó khác nhau, mỗi giống có đặc điểm và tính cách riêng.
            * Trong tiếng Việt, từ "chó" đôi khi được dùng trong các thành ngữ, tục ngữ mang ý nghĩa tiêu cực (ví dụ: "đồ chó má," "chó cùng rứt giậu"), nhưng cũng có thể dùng với ý trung lập hoặc tích cực (ví dụ: "trung thành như chó").

            `;

    try {
        const response = await generateContentWithGemini(prompt);
        // console.log(response);
        const text = response.candidates[0].content.parts[0].text;

        // Sử dụng regex để trích xuất thông tin từ text
        const definitionMatch = text.match(/\*\*Definition:\*\* (.*?)(?=\n)/);
        const typeMatch = text.match(/\*\*Type:\*\* (.*?)(?=\n)/);
        const phoneticMatch = text.match(/\*\*Phonetic:\*\* (.*?)(?=\n)/);

        // Xử lý phần Examples: tách các block theo dòng bắt đầu bằng "*ENG:"
        const examplesMatch = text.match(/\*\*Examples:\*\*([\s\S]*?)(?=\n\s*\*\*Note|$)/);
        const examplesText = examplesMatch ? examplesMatch[1].trim() : '';
        let formattedExamples = '';

        if (examplesText) {
            const exampleBlocks = examplesText.split(/\r?\n\s*\*(?=ENG:)/);
            formattedExamples = exampleBlocks
                .map(example => {
                    // Nếu block không bắt đầu bằng "ENG:" thì thêm vào
                  
                    const engMatch = example.match(/ENG:\s*(.*?)(?=\n|$)/)?.[1]?.trim() || '';
                    const transMatch = example.match(/TRANS:\s*(.*?)(?=\n|$)/)?.[1]?.trim() || '';
                    const vietMatch = example.match(/VIET:\s*(.*?)(?=\n|$)/)?.[1]?.trim() || '';

                    if (!engMatch && !vietMatch) return ''; // Bỏ qua nếu không có dữ liệu quan trọng

                    let result = `ENG: ${engMatch}`;
                    if (transMatch) result += `\nTRANS: ${transMatch}`;
                    if (vietMatch) result += `\nVIET: ${vietMatch}`;
                    return result;
                })
                .filter(example => example)
                .join('\n\n');
        }

        // Xử lý note với format mới
        const noteSection = text.match(/\*\*Note:\*\*([\s\S]*?)$/);
        let formattedNote = '';

        if (noteSection) {
            formattedNote = noteSection[1]
                .split(/\*\s+/)  // Tách theo dấu *
                .filter(note => note.trim())
                .map(note => note.trim())
                .join('\n ');  // Thêm bullet points

            // Thêm bullet point cho dòng đầu tiên nếu cần

        }

        return {
            title: wordTitle,
            define: definitionMatch ? definitionMatch[1].trim() : '',
            typeOfWord: typeMatch ? typeMatch[1].trim() : '',
            transcription: phoneticMatch ? phoneticMatch[1].trim() : '',
            examples: formattedExamples,
            note: formattedNote
        };
    } catch (error) {
        console.error('Error in word generation:', error);
        throw new Error('Có lỗi xảy ra khi tạo nội dung');
    }
};



