import React, { useEffect, useState } from 'react';
import '../../assets/css/Home/document.css';
import { Link, useParams } from 'react-router-dom';
import { flashcard } from '../../service/quizService';
import { Button, Col, Row } from 'react-bootstrap';

const DocumentItem = () => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [title, setTitle] = useState('');
    const [length, setLength] = useState('');
    useEffect(() => {
        window.scroll(0, 0);
        const fetchData = async () => {
            try {
                const result = await flashcard(id);
                console.log(result);
                setData(result);
                setLength(result.length);
                setTitle(result[0]?.questionInfo[0]?.quizInfo[0]?.name || 'No Question in Document');

            } catch (error) {
                console.error("Error fetching document data:", error);
            }
        };
        fetchData();
    }, [id]);
    return (
        <>
            <section className="light mt-5" >
                <div className="container py-2">
                    <div className="h1 text-center text-dark" id="pageHeaderTitle">Tài liệu : {title}</div>
                    <div className="mb-3">


                        <Row className="align-items-center">
                            {/* Tổng số câu hỏi */}
                            <Col xs={9}>
                                <p>
                                    <span className="text-secondary fw-bold" style={{ fontSize: "20px" }}>
                                        Sum: {length} Question
                                    </span>
                                </p>
                            </Col>

                            {/* Nút luyện tập Flashcard */}
                            <Col xs={3} className="text-end">
                                <Link to={`/listdocument/detaildocument/flashcard/${id}`} variant="primary" className="btn btn-primary d-flex justify-content-center align-items-center gap-2" >
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M331.088 488.95l-101.23-47.053c-6.698-3.122-9.62-11.094-6.503-17.815l71.63-154.11c3.117-6.71 11.1-9.624 17.804-6.508l101.23 47.066c6.71 3.115 9.62 11.088 6.51 17.797l-71.64 154.11c-3.12 6.714-11.098 9.618-17.802 6.514zM86.8 472.134L19.596 316.04c-2.927-6.797.218-14.686 7.004-17.607l33.275-14.328 41.578 156.25c3.99 14.937 19.32 23.84 34.267 19.864l33.14-8.823-64.445 27.752c-6.798 2.92-14.687-.22-17.614-7.017zm28.774-35.535L71.87 272.362c-1.905-7.152 2.362-14.498 9.502-16.398l28.89-7.683-3.475 25.864c-2.06 15.313 8.68 29.423 24.01 31.488l67.774 9.135-27.586 92.934c-2.845 9.578-.313 19.486 5.83 26.472l-44.847 11.926c-7.146 1.906-14.493-2.35-16.393-9.5zm92.055-4.043l-13.603-4.042c-7.1-2.112-11.14-9.565-9.034-16.664l48.364-162.92c2.112-7.1 9.577-11.14 16.658-9.04l41.667 12.38.006-.006.112.035-.118-.03c-4.19 2.76-7.677 6.68-9.937 11.547L210.1 417.944c-2.194 4.733-2.96 9.772-2.47 14.61zm-4.846-131.957l-70.033-9.44c-7.328-.992-12.48-7.743-11.494-15.078l22.695-168.43c.987-7.33 7.75-12.48 15.06-11.496l110.65 14.912c7.322.99 12.48 7.748 11.488 15.07l-13.96 103.622-13.02-3.866c-14.828-4.408-30.412 4.066-34.808 18.878l-16.576 55.828zm253.322-8.668l-7.253-15.94 37.418-16.98 7.23 15.95-37.394 16.97zm-9.353-27.805l-32.792-72.222c11.484-2.738 22.354-7.624 32.026-14.41l32.726 72.133-31.96 14.5zm-83.41-88.155c-41.006-16.174-61.152-62.585-44.977-103.603 16.18-40.993 62.603-61.15 103.603-44.977 41.01 16.18 61.15 62.604 44.982 103.62-16.187 40.995-62.604 61.147-103.61 44.96zm86.378-51.78c12.434-31.488-3.038-67.135-34.55-79.563-31.493-12.427-67.14 3.045-79.58 34.544-12.427 31.5 3.05 67.16 34.557 79.58 31.5 12.43 67.146-3.043 79.574-34.56zm-30.106-16.96c1.96-22.547-12.634-42.758-33.676-48.653 3.86-.732 7.9-.956 12.014-.602 24.27 2.1 42.292 23.492 40.197 47.768-2.078 23.94-22.914 41.79-46.766 40.274 15.366-6.48 26.702-21.03 28.23-38.787z"></path>
                                    </svg>
                                    Luyện tập bằng Flashcard
                                </Link>
                            </Col>
                        </Row>
                    </div>
                    {data.map((res, index) => (
                        <article key={index} className="postcard light green">
                            <div className="postcard__text t-dark">
                                <h1 className="postcard__title green">  Question {index + 1} :    {res.questionInfo[0].description}  </h1>
                                <div className="postcard__subtitle small">
                                    <time datetime="2020-05-25 12:00:00">
                                        <i className="fas fa-calendar-alt mr-2"></i>Mon, May 25th 2020
                                    </time>
                                </div>
                                <div className="postcard__bar"></div>
                                <div className="postcard__preview-txt"> {res.description}</div>

                            </div>
                        </article>
                    ))}
                </div>
            </section>

        </>
    );

}
export default DocumentItem;