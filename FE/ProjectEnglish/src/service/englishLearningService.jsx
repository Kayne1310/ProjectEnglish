// src/service/englishLearningContext.js
const LEARNING_CONTEXT_KEY = 'english_learning_context';

export const saveLearningContext = (context) => {
    try {
        localStorage.setItem(LEARNING_CONTEXT_KEY, JSON.stringify({
            ...context,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('Error saving learning context:', error);
    }
};

export const loadLearningContext = () => {
    try {
        const data = localStorage.getItem(LEARNING_CONTEXT_KEY);
        if (!data) return null;

        const context = JSON.parse(data);
        // Kiểm tra xem context có quá cũ không (7 ngày)
        const isExpired = Date.now() - context.timestamp > 7 * 24 * 60 * 60 * 1000;
        
        if (isExpired) {
            clearLearningContext();
            return null;
        }

        return context;
    } catch (error) {
        console.error('Error loading learning context:', error);
        return null;
    }
};

export const clearLearningContext = () => {
    localStorage.removeItem(LEARNING_CONTEXT_KEY);
};

export const updateLearningProgress = (context, newData) => {
    const updatedContext = {
        ...context,
        learningProgress: {
            ...context?.learningProgress,
            ...newData
        },
        lastUpdated: Date.now()
    };
    saveLearningContext(updatedContext);
    return updatedContext;
};