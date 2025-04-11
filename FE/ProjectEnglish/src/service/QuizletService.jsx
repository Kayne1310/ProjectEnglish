import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const flashcard = async (quizId) => {
    try {
        const response = await axios.get(`${API_URL}/QuizAnswer/correct-answers?`, {
            params: { quizId: quizId }
        });

        return response.data;

    } catch (error) {
        throw error;
    }
}

const createQuiz = async (quizData) => {
    try {
        // Tạo FormData để gửi dữ liệu multipart/form-data
        const formData = new FormData();

        // Thêm Quiz data
        formData.append('Quiz.name', quizData.name);
        formData.append('Quiz.description', quizData.description);
        if (quizData.image) {
            formData.append('Quiz.image', quizData.image); // image là file object
        }
        formData.append('Quiz.difficulty', quizData.difficulty);
        formData.append('Quiz.countryName', quizData.countryName);

        const response = await axios.post(`${API_URL}/Quiz/add_quiz`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // withCredentials: true, // Nếu backend yêu cầu cookie/auth
            }
        );

        // console.log("Full API Response:", response); 

        if (!response || !response.data) {
            console.error("Error: response.data is undefined!");
            return null;
        }

        return response.data; 
    } catch (error) {
        console.error("Create quiz failed:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

const updateQuiz = async (quizData) => { 
    try {
        const formData = new FormData();

        // Thêm các trường vào formData, bao gồm quiz_id
        formData.append('quiz_id', quizData.quiz_id || ''); 
        formData.append('name', quizData.name || ''); 
        formData.append('description', quizData.description || '');
        if (quizData.image) {
            formData.append('image', quizData.image);
        }
        formData.append('difficulty', quizData.difficulty || ''); 
        formData.append('countryName', quizData.countryName || '');

        const response = await axios.put(`${API_URL}/Quiz/update_quiz`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // console.log("Full API Response for Update:", response.data);

        if (!response || !response.data) {
            console.error("Error: response.data is undefined!");
            return null;
        }

        return response.data;
    } catch (error) {
        console.error("Update quiz failed:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};
 
const deleteQuizWithQuestionsAndAnswers = async (quizId) => {
    try {
      // Tạo FormData object để gửi dữ liệu dưới dạng multipart/form-data
      const formData = new FormData();
      formData.append('quiz_id', quizId);

      const response = await axios.delete(
        `${API_URL}/Quiz/delete_quiz_question_answers`,
        {
          headers: {
            'Accept': '*/*',
            'Content-Type': 'multipart/form-data',
          },
          data: formData, // Gửi FormData trong phần body
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error deleting quiz with questions and answers:', error);
      throw error; 
    }
  };

export { flashcard, createQuiz, updateQuiz, deleteQuizWithQuestionsAndAnswers }