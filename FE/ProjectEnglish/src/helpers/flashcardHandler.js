// Hàm xử lý chuyển đổi dữ liệu từ form sang format API
export const prepareFlashcardData = (formData,studySetId) => {
    if (!formData) return null;

    // Hàm xử lý examples thành mảng object
    const parseExamples = (examplesText) => {
        if (!examplesText) return [];

        // Tách thành các block example riêng biệt
        const examples = examplesText
            .trim()
            .split(/\n\s*\n/); // Tách theo khoảng trống giữa các block

        return examples
            .map(block => {
                // Tìm ENG, TRANS, và VIET trong mỗi block
                const engMatch = block.match(/ENG:\s*(.*?)(?=\n|$)/);
                const transMatch = block.match(/TRANS:\s*(.*?)(?=\n|$)/);
                const vietMatch = block.match(/VIET:\s*(.*?)(?=\n|$)/);

                // Chỉ trả về object nếu có đủ ít nhất en và vi
                if (engMatch && vietMatch) {
                    return {
                        en: engMatch[1].trim(),
                        trans: transMatch ? transMatch[1].trim() : '',
                        vi: vietMatch[1].trim()
                    };
                }
                return null;
            })
            .filter(example => example !== null); // Lọc bỏ các kết quả null
    };

    // Trả về object đã được format theo cấu trúc API
    return {
        title: formData.title || '',
        define: formData.define || '',
        typeOfWord: formData.typeOfWord || '',
        transcription: formData.transcription || '',
        note: formData.note || '',
        status: formData.status || 'Learning',
        exampleVM: parseExamples(formData.examples),
        studySetId: studySetId || '',
    
    };
};