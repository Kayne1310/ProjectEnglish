// import { Justify } from "react-bootstrap-icons";
// import { Link } from "react-router-dom";
// import '../../assets/css/Home/flashcard.css';
// import { useEffect, useState } from "react";
// import { getAllFlashCard } from "../../service/flashcardService";
// const FlashcardList = () => {

//     const [flashcard, setAllFlashCard] = useState([]);
//     useEffect(() => {
//         window.scroll(0,0);
//         const fetchFlashcards = async () => {
//             try {
//                 const data = await getAllFlashCard();
//                 setAllFlashCard(data);
//             } catch (error) {
//                 console.error('Error fetching quizzes:', error);
//             }
//         };

//         fetchFlashcards();
//     }, []);


//     return (

//         <>

//             <section className="about_section layout_padding long_section">
//                 <div className="container">
//                     <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3" style={{ overflowY: "scroll", maxHeight: "300px" }}>
//                         {flashcard.map((data, index) => (
//                             <div className="row m-1">
//                                 <Link
//                                     to={`/flashcard/${data.quiz_id}`}
//                                     className=" d-block w-100 bg-light rounded shadow-sm p-3 border text-decoration-none transition-all custom-link"
//                                     style={{ height: "210px", width: "210px", display: "flex", flexDirection: "colum", Justify: "space-between", }}
//                                 >
//                                     {/* Title */}
//                                     <h1 className="fw-bold text-truncate fs-5" title="Hán ngữ2 bài 16: 你常去图书馆吗？(Bạn thường xuyên đến thư viện không?)">
//                                        {data.name}
//                                     </h1>

//                                     <svg
//                                         stroke="currentColor"
//                                         fill="currentColor"
//                                         strokeWidth="0"
//                                         viewBox="0 0 512 512"
//                                         height="1em"
//                                         width="1em"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="mr-1"

//                                     >
//                                         <rect width="336" height="336" x="128" y="128" fill="none" strokeLinejoin="round" strokeWidth="32" rx="57" ry="57"></rect>
//                                         <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="m383.5 128 .5-24a56.16 56.16 0 0 0-56-56H112a64.19 64.19 0 0 0-64 64v216a56.16 56.16 0 0 0 56 56h24"></path>
//                                     </svg>
//                                     53 từ


//                                     {/* Description */}
//                                     <p className="text-muted fst-italic text-truncate" style={{ height: "20px" }} title="">
//                                         Không có mô tả
//                                     </p>

//                                     {/* Language */}
//                                     <div className="d-flex align-items-center gap-2">
//                                         <p className="text-muted fst-italic m-0">Ngôn ngữ: </p>
//                                         <img alt="Chinese Flag" loading="lazy" width="25" height="25" className="rounded border border-secondary" src={data.countryImg} />
//                                     </div>

//                                     {/* Author */}
//                                     <div className="d-flex align-items-center gap-2 mt-2 ">
//                                         <div className="rounded-circle overflow-hidden position-relative" style={{ width: "35px", height: "35px" }}>
//                                             <img
//                                                 alt="Author"
//                                                 loading="lazy"
//                                                 className="w-100 h-100 position-absolute object-cover"
//                                                 src="https://lh3.googleusercontent.com/a/ACg8ocLI_caRo780a3u1g_0U1fN63zlGYag1EGzcmk29WuL57WCYh2E=s96-c"
//                                             />
//                                         </div>
//                                         <div>
//                                             <p title="Diệp&amp;Khoa" className="text-truncate m-0">Kayne</p>
//                                         </div>
//                                     </div>

//                                 </Link>
//                             </div>
//                         ))}


//                     </div>

//                 </div>
//             </section>
//         </>
//     );
// };

// export default FlashcardList;
