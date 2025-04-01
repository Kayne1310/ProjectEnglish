// // useQuizData.js (Custom Hook mới)
// import { useState, useEffect } from "react";
// import { getQuestionbyQuizId, getFlashcards } from "../../service/quizService";

// export const useQuizData = (type, id) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         let response;
//         if (type === "quiz") {
//           response = await getQuestionbyQuizId(id);
//           setData(response || []);
//         } else if (type === "flashcard") {
//           response = await getFlashcards(id);
//           const formattedFlashcards = response.map((item) => ({
//             question: item.questionInfo[0]?.description || "Không có câu hỏi",
//             answer: item.description || "Không có câu trả lời",
//           }));
//           setData(formattedFlashcards);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [type, id]);

//   return { data, loading, error };
// };