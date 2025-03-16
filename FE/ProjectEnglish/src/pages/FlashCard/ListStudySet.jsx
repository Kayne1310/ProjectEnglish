import { Justify } from "react-bootstrap-icons";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllFlashCard, getALlStudySetService, getALlStudySetServiceByUserId } from "../../service/flashcardService";
import { Modal, Input, Select, Checkbox, Button } from "antd";
import { calculateDaysAgo } from "../../helpers/DateHepler";
import { createStudySet } from "../../service/StudySetService";
const { TextArea } = Input;
const { Option } = Select;
const FlashcardList = () => {
    const location = useLocation();
    const isFlashcardPage = location.pathname.includes("/flashcard"); // Kiểm tra nếu URL chứa "/flashcard"
    const [activeLang, setActiveLang] = useState("all");
    const [studySetByUserID, setStudySetByUserID] = useState([]);
    const [studyset, setStudyset] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [listName, setListName] = useState("");
    const [language, setLanguage] = useState("Tiếng Anh-Mỹ");
    const [isPublic, setIsPublic] = useState(false);
    const [description, setDescription] = useState("");


    const languages = [
        { id: "all", label: "Tất cả", icon: true },
        { id: "english", src: "https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740305084/COUNTRY/e17iowqr2ipaqe0aympq.png", alt: "English" },
        { id: "chinese", src: "https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740305215/COUNTRY/zduntbvenfyewpkondef.jpg", alt: "Chinese" },
        { id: "japanese", src: "https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740305058/COUNTRY/wtbrfljoh73gffepv3jc.png", alt: "Japanese" },
        { id: "french", src: "https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740303925/COUNTRY/l5jaiobfznxhb7poxc8i.png", alt: "French" }
    ];



    // Hiển thị popup
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Đóng popup
    const handleCancel = () => {
        setIsModalVisible(false);
        setListName("");
        setLanguage("Tiếng Anh-Mỹ");
        setIsPublic(false);
        setDescription("");
    };
    const handleCreate = async () => {
        setIsModalVisible(false);
        var res = await createStudySet(listName, language, isPublic, description);
        if (res.returnCode == 1) {
            alert("Tạo list từ thành công");
            fetchFlashcards();
            gellAllListStudybyUser();
        }
        else {
            alert(`Tạo list từ thất bại: ${res.returnMessage}`);
        }
        setListName("");
        setLanguage("Tiếng Anh-Mỹ");
        setIsPublic(false);
        setDescription("");
    };

    //fetch danh sách từ
    const fetchFlashcards = async () => {
        try {

            const studyset = await getALlStudySetService();
            setStudyset(studyset.listStudySetWithCount)
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };
    //fetch danh sách từ của user
    const gellAllListStudybyUser = async () => {
        try {
            const studySetUserId = await getALlStudySetServiceByUserId();
            setStudySetByUserID(studySetUserId.listStudySetWithCount);
        }
        catch (error) {

        }
    }

    useEffect(() => {
        window.scroll(0, 0);


        fetchFlashcards();
        gellAllListStudybyUser();
    }, []);


    return (

        <>

            <section className="about_section layout_padding long_section">
                <div className="container">

                    <div className="mt-10 mb-5 text-third ml-1">
                        <h1 className="text-3xl font-bold text-primary">Flashcard</h1>
                        <p>
                            Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng.
                            Hãy cùng Quizzet tham khảo và tạo những bộ flashcards bạn nhé!
                        </p>
                    </div>
                    <div className="mt-4">
                        <h4 className="text-primary mb-2">List từ đã tạo</h4>
                        <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3 custom-scroll" style={{ maxHeight: isFlashcardPage ? undefined : "350px", overflow: isFlashcardPage ? "visible" : "auto" }}>

                            {/* Card Tạo Mới */}
                            <div className="col" style={{ width: "218px", height: "216px" }}>
                                <Link className="card border shadow-sm p-3 bg-light rounded h-100 text-decoration-none text-dark" onClick={showModal}>
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="30" width="30" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8Z"></path>
                                            <path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8Z"></path>
                                        </svg>
                                        <h5 className="mt-2">Tạo list từ mới</h5>
                                    </div>
                                </Link>
                            </div>

                            {/* Render danh sách từ */}
                            {studySetByUserID.map((list) => (
                                <div className="col custom-scroll " key={list.studySet.id} >
                                    <Link to={`/ListFlashCard/${list.studySet.id}`}
                                       state={{ 
                                        flashcardCount: list.flashcardCount,
                                        // Có thể truyền thêm data khác nếu cần
                                         }}
                                        className="d-block w-100 bg-light rounded shadow-sm p-3 border text-decoration-none transition-all custom-link custom-scroll">
                                        <h5 className="fw-bold text-truncate" title={list.studySet.title}>{list.studySet.title}</h5>
                                        <h6 className="d-flex align-items-center">
                                            <svg className="mr-1" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg ">
                                                <rect width="336" height="336" x="128" y="128" fill="none" strokeLinejoin="round" strokeWidth="32" rx="57" ry="57"></rect>
                                                <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="m383.5 128 .5-24a56.16 56.16 0 0 0-56-56H112a64.19 64.19 0 0 0-64 64v216a56.16 56.16 0 0 0 56 56h24"></path>
                                            </svg>
                                            {list.flashcardCount} từ
                                        </h6>
                                        <p className="text-muted text-truncate fst-italic" title={list.studySet.desc}>{list.studySet.desc}</p>
                                        <div className="d-flex align-items-center">
                                            <p className="mb-0 text-muted fst-italic">Ngôn ngữ: </p>
                                            <img src={list.studySet.imageCountry} alt={list.language} className="ms-2 border " width="25" height="19.25" />
                                        </div>
                                        <div className="d-flex align-items-center mt-2">

                                            <div className="d-flex align-items-center gap-2 mt-2 ">
                                                <div className="rounded-circle overflow-hidden position-relative" style={{ width: "35px", height: "35px" }}>
                                                    <img
                                                        alt="Author"
                                                        loading="lazy"
                                                        className="w-100 h-100 position-absolute object-cover"
                                                        src={list.picture}
                                                    />
                                                </div>
                                                <div>
                                                    <p title={list.userName} className="text-truncate overflow-hidden text-nowrap m-0" style={{ maxWidth: "7rem" }}>{list.userName}</p>
                                                    <div className="d-flex align-items-center text-muted text-xs" title={list.date}>
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M18 8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8ZM16 8V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8H16ZM7 11V13H9V11H7ZM7 14V16H9V14H7ZM7 17V19H9V17H7Z"></path>
                                                        </svg>
                                                        <p className="mb-0 ms-1 text-truncate " style={{ fontSize: "0.8rem" }}>{calculateDaysAgo(list.studySet.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </Link>
                                </div>


                            ))}
                        </div>
                    </div>

                    <h5 className="mt-4 mb-4 text-primary  ">Khám phá từ cộng đồng</h5>

                    <div className="d-flex flex-wrap align-items-center gap-3 py-3">
                        <p className="fw-bold">Lọc theo ngôn ngữ:</p>

                        {languages.map(({ id, label, icon, src, alt }) => (
                            <button
                                key={id}
                                className={`btn d-flex align-items-center justify-content-center rounded-pill px-4 py-2 ${activeLang === id ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                style={{ width: "9rem", height: "2.5rem" }}
                                onClick={() => setActiveLang(id)}
                            >
                                {icon ? (
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" className="me-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path>
                                    </svg>
                                ) : (
                                    <img src={src} alt={alt} width="25" height="19.25px" className="border" />
                                )}
                                {label && label}
                            </button>
                        ))}
                    </div>
                    {/* Popup Tạo List */}
                    <Modal
                        title="Tạo list từ"
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        centered // Căn giữa modal theo cả chiều ngang & dọc
                    >
                        <div className="d-flex flex-column align-items-center text-center space-y-2 " style={{ minWidthwidth: "20rem", minHeight: "10rem" }}>
                            <Input
                                placeholder="Tên list từ"
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                                className="w-100 m-2"
                            />
                            <Select
                                value={language}
                                className="w-100 mt-2"
                                onChange={(value) => setLanguage(value)}
                            >
                                <Option value="Tiếng Anh-Mỹ">Tiếng Anh-Mỹ</Option>
                                <Option value="Tiếng Anh-Anh">Tiếng Anh-Anh</Option>
                                <Option value="Vietnam">Tiếng Việt</Option>
                                <Option value="Tiếng Nhật">Tiếng Nhật</Option>
                                <Option value="Tiếng Trung Quốc">Tiếng Trung Quốc</Option>
                            </Select>
                            <TextArea
                                placeholder="Mô tả"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-100 m-3 custom-scroll"
                                style={{
                                    maxHeight: "60px", // Giới hạn chiều cao
                                    overflow: "auto", // Hiện thanh cuộn khi nội dung dài
                                    resize: "none" // Tắt kéo để thay đổi kích thước
                                }}
                            />
                            <div className="d-flex justify-content-left">
                                <Checkbox checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}>Công khai</Checkbox>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <Button onClick={handleCancel} className="me-2">Hủy</Button>
                            <Button type="primary" onClick={handleCreate}> Tạo</Button>
                        </div>
                    </Modal>

                    <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3 custom-scroll"
                        style={{ maxHeight: isFlashcardPage ? undefined : "350px", overflowY: isFlashcardPage ? "visible" : "scroll" }}>
                        {studyset.map((data) => (
                            <div className="col" key={data.studySet.id}>
                                <Link to={`/ListFlashCard/${data.studySet.id}`}
                                   state={{ 
                                    flashcardCount: data.flashcardCount,
                                }}
                                className="d-block w-100 bg-light rounded shadow-sm p-3 border text-decoration-none transition-all custom-link custom-scroll">
                                    <h5 className="fw-bold text-truncate" >{data.studySet.title}</h5>
                                    <h6 className="d-flex align-items-center">
                                        <svg className="mr-1" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="336" height="336" x="128" y="128" fill="none" strokeLinejoin="round" strokeWidth="32" rx="57" ry="57"></rect>
                                            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="m383.5 128 .5-24a56.16 56.16 0 0 0-56-56H112a64.19 64.19 0 0 0-64 64v216a56.16 56.16 0 0 0 56 56h24"></path>
                                        </svg>
                                        {data.flashcardCount} từ
                                    </h6>
                                    <p className="text-muted text-truncate fst-italic" title={data.studySet.desc || "Không có mô tả"}>{data.studySet.desc || "Không có mô tả"}</p>
                                    <div className="d-flex align-items-center">
                                        <p className="mb-0 text-muted fst-italic">Ngôn ngữ: </p>
                                        <img src={data.studySet.imageCountry} alt={data.studySet.language} className="ms-2 border " width="25px" height="19.25px" />
                                    </div>
                                    <div className="d-flex align-items-center mt-2 ">
                                        <div className="rounded-circle overflow-hidden position-relative mr-2" style={{ width: "35px", height: "35px" }}>
                                            <img
                                                alt="Author"

                                                className="w-100 h-100 position-absolute object-cover"
                                                src={data.picture}
                                            />
                                        </div>
                                        <div>
                                            <p title={data.userName} className="text-truncate overflow-hidden text-nowrap m-0" style={{ maxWidth: "7rem" }}>{data.userName}</p>
                                            <div className="d-flex align-items-center text-muted text-xs" title={data.studySet.createdAt}>
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18 8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8ZM16 8V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8H16ZM7 11V13H9V11H7ZM7 14V16H9V14H7ZM7 17V19H9V17H7Z"></path>
                                                </svg>
                                                <p className="mb-0 ms-1 text-truncate" style={{ fontSize: "0.8rem" }}> {calculateDaysAgo(data.studySet.createdAt)} </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>


                </div>
            </section>
        </>
    );
};

export default FlashcardList;
