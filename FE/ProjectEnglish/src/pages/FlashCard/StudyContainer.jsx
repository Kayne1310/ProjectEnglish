// // StudyContainer.js
// import React, { useState } from "react";
// import Flashcard from "./FlashCard";
// import QuizletForm from "./Quizz.jsx";
// import "../..//assets/css/FlashCardQuiz/StudyContainer.css"; // CSS đồng nhất cho layout

// const StudyContainer = () => {
//   const [mode, setMode] = useState("flashcard"); // Mặc định là Flashcard

//   return (
//     <div className="w-full h-[90%] flex items-center justify-center flex-col gap-5">
//       <div className="w-full flex flex-col md:flex-row gap-5 items-start">
//         {/* Phần trung tâm - Form chính */}
//         <div className="w-full flex flex-col gap-5">
//           {mode === "flashcard" ? <Flashcard /> : <QuizletForm />}
          
//         </div>

//         {/* Sidebar bên phải */}
//         <div className="w-full md:w-auto flex flex-col gap-4">
//           {/* Phát âm giọng UK, US (chỉ hiển thị khi ở chế độ Flashcard) */}
//           {mode === "flashcard" && (
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M10.5 3.75a.75.75 0 0 0-1.264-.546L5.203 7H2.667a.75.75 0 0 0-.7.48A6.985 6.985 0 0 0 1.5 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h2.535l4.033 3.796a.75.75 0 0 0 1.264-.546V3.75ZM16.45 5.05a.75.75 0 0 0-1.06 1.061 5.5 5.5 0 0 1 0 7.778.75.75 0 0 0 1.06 1.06 7 7 0 0 0 0-9.899Z" />
//                   <path d="M14.329 7.172a.75.75 0 0 0-1.061 1.06 2.5 2.5 0 0 1 0 3.536.75.75 0 0 0 1.06 1.06 4 4 0 0 0 0-5.656Z" />
//                 </svg>
//                 <span>Phát âm giọng UK, US</span>
//               </div>
//               <button
//                 type="button"
//                 role="switch"
//                 aria-checked="true"
//                 className="ant-switch css-apn68 ant-switch-checked"
//               >
//                 <div className="ant-switch-handle"></div>
//                 <span className="ant-switch-inner">
//                   <span className="ant-switch-inner-checked">UK</span>
//                   <span className="ant-switch-inner-unchecked"></span>
//                 </span>
//               </button>
//             </div>
//           )}

//           {/* Cài đặt Random */}
//           <div className="space-y-2">
//             <h2 className="font-medium" style={{ fontSize: "medium" }}>
//               Cài đặt Random
//             </h2>
//             <div className="bg-gray-100 p-4 rounded-lg space-y-3">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-600">Random câu hỏi</span>
//                   <button
//                     type="button"
//                     role="switch"
//                     aria-checked="false"
//                     className="ant-switch bg-gray-300 css-apn68"
//                   >
//                     <div className="ant-switch-handle"></div>
//                     <span className="ant-switch-inner">
//                       <span className="ant-switch-inner-checked"></span>
//                       <span className="ant-switch-inner-unchecked"></span>
//                     </span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Chế độ học */}
//           <div className="space-y-2">
//             <h2 className="font-medium" style={{ fontSize: "medium" }}>
//               Chế độ học
//             </h2>
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => setMode("flashcard")}
//                 className={`px-4 py-2 rounded-lg transition-colors ${
//                   mode === "flashcard" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 Flashcard
//               </button>
//               <button
//                 onClick={() => setMode("quiz")}
//                 className={`px-4 py-2 rounded-lg transition-colors ${
//                   mode === "quiz" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 Quiz
//               </button>
//               {/* Có thể thêm Listening sau nếu cần */}
//             </div>
//           </div>

//           {/* Tiến trình */}
//           <div className="space-y-2">
//             <h2 className="font-medium" style={{ fontSize: "medium" }}>
//               Tiến trình
//             </h2>
//             <div className="bg-gray-100 p-4 rounded-lg">
//               <div className="flex justify-between mb-2">
//                 <span>Đã học:</span>
//                 <span>0</span>
//               </div>
//               <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
//                 <div className="h-full bg-primary" style={{ width: "0%" }}></div>
//               </div>
//             </div>
//           </div>

//           {/* Phím tắt */}
//           <div className="space-y-2">
//             <h2 className="font-medium" style={{ fontSize: "medium" }}>
//               Phím tắt
//             </h2>
//             <div className="bg-gray-100 p-4 rounded-lg space-y-3">
//               <div className="flex items-center gap-2">
//                 <kbd className="px-2 py-1 bg-white rounded shadow text-sm">→</kbd>
//                 <span className="text-gray-600">Tiến tới</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <kbd className="px-2 py-1 bg-white rounded shadow text-sm">←</kbd>
//                 <span className="text-gray-600">Lùi lại</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <kbd className="px-2 py-1 bg-white rounded shadow text-sm">Space</kbd>
//                 <span className="text-gray-600">Lật thẻ</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudyContainer;