// import React from 'react';
import './Flashcardcanh.css'; // Import file CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import b2 from "../../assets/image/b2.jpg";
import covn from '../../assets/image/covn.jpg'
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { createFlashCardWithStudySet, deleteFlashCardWithStudySet, getListFlashCardByStudySetId, updateFlashCardWithStudySet } from '../../service/flashcardService';
import { calculateDaysAgo } from '../../helpers/DateHepler';
import { AuthContext } from '../../components/layout/context/authContext';
import { Modal, Input, Select, Checkbox, Button } from "antd";
import { handleWordGeneration } from '../../helpers/wordGenerationHandler';
import { prepareFlashcardData } from '../../helpers/flashcardHandler';
import { updateStudySet, deleteStudySet } from '../../service/StudySetService';
const { TextArea } = Input;




const Flashcardcanh = () => {
    const location = useLocation();
    const flashcardCount = location.state?.flashcardCount;
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const { userInfor } = useContext(AuthContext);
    const [flashcards, setFlashcards] = useState([]);
    const { id } = useParams(); // Get studySet ID from URL
    const [studySet, setStudySet] = useState(null);
    const navigate = useNavigate();
    // const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState(null);
    const [PictureUrl, setPictureUrl] = useState(null);
    //ai generate word
        const [wordData, setWordData] = useState({
            id: '',
            title: '',
            define: '',
            typeOfWord: '',
            transcription: '',
            examples: '',
            note: '',
    
        });
    //edit study set
    const [editData, setEditData] = useState({
        id:"",
        userId:"",
        title: "",
        language: "",
        desc: "",
        Public: false,
    });
    const [deleteType, setDeleteType] = useState(''); // 'flashcard' hoặc 'studyset'
    const fetchFlashcards = async () => {
        try {
            const data = await getListFlashCardByStudySetId(id);

            // Access the data property from response

            console.log("data", data);
            setFlashcards(data.listFlashcards);
            setStudySet(data.studySet);
            setUserName(data.username);
            setPictureUrl(data.pictureUrl);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    };

    useEffect(() => {
        window.scroll(0, 0);
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            new bootstrap.Modal(modal);
        });

        // Thêm event listener cho modal
        const addWordModal = document.getElementById('addWordModal');
        if (addWordModal) {
            addWordModal.addEventListener('hidden.bs.modal', handleResetForm);
        }

        fetchFlashcards();

        // Cleanup function
        return () => {
            if (addWordModal) {
                addWordModal.removeEventListener('hidden.bs.modal', handleResetForm);
            }
        };
    }, [id]);


    // Thêm hàm xử lý
    const handleEditClick = () => {
        setEditData({
            id: studySet.id,
            userId: studySet.userId,
            title: studySet.title,
            language: studySet.language,
            desc: studySet.desc,
            public: studySet.public,
        });
        console.log("editData", editData);
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleEditStudySetSubmit = async () => {
        // Xử lý cập nhật studyset
        try {
            // Gọi API cập nhật ở đây
            const response = await updateStudySet(editData);
            if(response.returnCode == 1){
                alert("Cập nhật thành công");
                setIsEditModalVisible(false);
                fetchFlashcards();
            }
            else{
                alert("Cập nhật thất bại");
            }
        } catch (error) {
            console.error('Error updating studyset:', error);
        }
    };




    // State loading khi gọi API
    const [isLoading, setIsLoading] = useState(false);

    // Hàm xử lý khi người dùng thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setWordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Hàm xử lý khi click vào nút AI Generate
    const handleAIGenerate = async () => {
        setIsLoading(true);
        try {
            const generatedData = await handleWordGeneration(wordData.title, studySet.language);
            setWordData(prev => ({
                ...prev,
                ...generatedData
            }));
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm reset form
    const handleResetForm = () => {
        setWordData({
            title: '',
            define: '',
            typeOfWord: '',
            transcription: '',
            examples: '',
            note: '',
            id: ''
        });
        setIsEditMode(false);
    };

//handle practice
    const handlePractice = () => {
        // Chuyển sang trang FlashCard với state chứa data studySet và flashcards
        navigate(`/flashcard/practice/${studySet.id}`, {
            state: {
                flashcards: flashcards.map(card => ({
                    question: card.title ,
                    answer: card.define,
                    examples: card.exampleVM,
                    transcription: card.transcription
                }))
            }
        });
    };

    // Hàm xử lý khi submit form
    const handleSubmit = async () => {
        if (!wordData.title || !wordData.define) {
            alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
            return;
        }

        setIsLoading(true);
        try {
            // Chuẩn bị dữ liệu theo format API
            const preparedData = prepareFlashcardData(wordData, id);
            if (isEditMode) {

                // Khi edit: gửi kèm id
                const updateData = {
                    id: wordData.id, // Id chỉ cần khi edit
                    title: wordData.title,
                    define: wordData.define,
                    typeOfWord: wordData.typeOfWord,
                    transcription: wordData.transcription,
                    note: wordData.note,
                    status: 'Learning',
                    exampleVM: preparedData.exampleVM

                };
                console.log('updateData', updateData);
                const response = await updateFlashCardWithStudySet(updateData);
                console.log('Updated flashcard:', response);
                if (response.returnCode == 1) {
                    alert("Update Sucessful");
                    document.getElementById('addWordModal').querySelector('[data-bs-dismiss="modal"]').click();
                    fetchFlashcards();
                }
                else {
                    alert("Update Failed");
                }
            }
            else {

                const response = await createFlashCardWithStudySet(preparedData);
                console.log('Created flashcard:', response);
                // Reset form
                setWordData({
                    title: '',
                    define: '',
                    typeOfWord: '',
                    transcription: '',
                    examples: '',
                    note: ''
                });
                document.getElementById('addWordModal').querySelector('[data-bs-dismiss="modal"]').click();

                // Refresh danh sách flashcard
                handleResetForm();
                fetchFlashcards();
            }


        } catch (error) {
            console.error('Error creating flashcard:', error);
            alert(isEditMode ? 'Có lỗi xảy ra khi cập nhật flashcard' : 'Có lỗi xảy ra khi tạo flashcard');
        } finally {
            setIsLoading(false);
        }
    };

    //handle edit flashcard
    const handleEditFlashCard = (data) => {
        setWordData({
            id: data.id,
            title: data.title,
            define: data.define,
            typeOfWord: data.typeOfWord,
            transcription: data.transcription,
            note: data.note,
            // Format examples thành text theo định dạng yêu cầu
            examples: data.exampleVM?.map(example => (
                `ENG: ${example.en}\nTRANS: ${example.trans}\nVIET: ${example.vi}`
            )).join('\n\n') || ''
        });

        // Set mode là edit
        setIsEditMode(true);


    };

   
   //handle delete flashcard
    const handleDeleteFlashCard = (data) => {
        setWordData({
            id: data.id,
        });
        setDeleteType('flashcard');
        setIsDeleteModalVisible(true);
    };

    // Thêm handler cho delete study set
    const handleDeleteStudySet = () => {
        setDeleteType('studyset');
        setIsDeleteModalVisible(true);
    };

    //handle cancel delete flashcard
    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };
    //handle delete submit flashcard
    const handleDeleteSubmit = async () => {
        setIsDeleteModalVisible(false);
        try {
            if (deleteType === 'flashcard') {
                const response = await deleteFlashCardWithStudySet(wordData.id);
                if(response.returnCode == 1){
                    alert("Xóa từ thành công");
                    fetchFlashcards();
                } else {
                    alert("Xóa từ thất bại");
                }
            } else if (deleteType === 'studyset') {
                const response = await deleteStudySet(studySet.id);
                if(response.returnCode == 1){
                    alert("Xóa study set thành công");
                    window.location.href = '/flashcard';
                } else {
                    alert("Xóa study set thất bại");
                }
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert(`Có lỗi xảy ra khi xóa ${deleteType === 'flashcard' ? 'từ' : 'study set'}`);
        }
    };

    return (
        <div className="container  " style={{ minHeight: "800px" }}>

            {/* Container Fluid */}
            {studySet && (
                <>
                    <a href="#" className="flashcardcanh-btn-back text-decoration-none">Quay lại</a>
                    <div className="d-flex justify-content-between align-items-center">

                        <h2 className="flashcardcanh-header-title fs-1" style={{ color: "rgb(33 135 213", }}>Flashcard: {studySet.title}</h2>
                        {studySet.userId === userInfor.userId && (
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                                <div className="d-flex gap-2 align-items-center" style={{ height: "36px" }}>
                                    <button className="btn btn-primary h-100 rounded"
                                        onClick={handleEditClick}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-primary h-100 rounded" data-bs-toggle="modal" data-bs-target="#addWordModal">
                                        <i className="bi bi-plus-lg"></i>
                                    </button>
                                    <button className="btn btn-primary d-flex align-items-center gap-1 rounded" style={{minWidth:"5rem",maxHeight:"3rem"}}>
                                        <i className="bi bi-grid"></i> Thêm nhiều
                                    </button>
                                </div>
                                <div>
                                    <button className="btn btn-danger d-flex align-items-center gap-1" 
                                        onClick={handleDeleteStudySet}>
                                        <i className="bi bi-trash"></i> Xóa
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="fs-3 font-italic" style={{ color: "rgb(126 154 210)", }}>{studySet.desc}</p>
                    <p >
                        Ngôn ngữ :
                        <img
                            style={{
                                width: '30px',
                                height: '20px',
                                marginRight: '10px',
                                verticalAlign: 'middle',
                                marginLeft: '10px',
                            }}
                            src={studySet.imageCountry} />


                    </p>

                    <p className="flashcardcanh-creator">
                        Người tạo: {userName}
                        <img
                            className="flashcardcanh-avatar"
                            src={PictureUrl}
                            alt="Avatar người tạo"
                        />
                    </p>
                    <div className="flashcardcanh-mt-3">
                        <button className="flashcardcanh-btn-practice" onClick={handlePractice}>Luyện tập</button>
                        <button className="flashcardcanh-btn-practice">Luyện tập theo khoa học (beta)</button>
                    </div>
                    <p className="flashcardcanh-mt-2 text-muted mt-3">
                        Dựa trên nghiên cứu về đường cong lãng quên của Hermann Ebbinghaus,
                        chúng tôi khuyến khích bạn ôn lại 5-7 lần tại các khoảng thời gian khác nhau để ghi nhớ lâu dài.
                    </p>
                    <div className="flashcardcanh-stats-box w-100">
                        <div className="flashcardcanh-row flashcardcanh-mt-3 w-100 ">
                            <div className="col-3 border flashcardcanh-stat-item flashcardcanh-learned fs-5 fw-bold">Tất cả <br />{flashcardCount}</div>
                            <div className="col-3 border flashcardcanh-stat-item flashcardcanh-new fs-5 fw-bold">Đã nhớ<br />0</div>
                            <div className="col-3 border flashcardcanh-stat-item flashcardcanh-review fs-5 fw-bold">Ôn tập<br />0</div>
                            <div className="col-3 border flashcardcanh-stat-item flashcardcanh-mastered fs-5 fw-bold">Ghi nhớ <br />{flashcardCount}</div>
                        </div>

                    </div>
                </>
            )}

            {/* Flashcard 1 */}
            <div className="flashcardcanh-columns">
                <div className="row">
                    {flashcards && flashcards.map((data, index) => (
                        <div key={data.id} className="col-md-6 ">
                            <div className="flashcardcanh-container col-md-6 mb-4">
                                {studySet.userId === userInfor.userId && (
                                    <div className="d-flex justify-content-end gap-5">
                                        <i class="fas fa-edit fs-4 text-primary cursor-pointer mt-1"
                                            onClick={() => handleEditFlashCard(data)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#addWordModal"
                                        ></i>
                                        <i class="bi bi-trash fs-4 text-danger cursor-pointer "
                                            onClick={() => handleDeleteFlashCard(data)}
                                        ></i>
                                    </div>
                                )}
                                <h1 className="flashcardcanh-title">
                                    {data.title}
                                    <span className="fs-5 ml-2"  style={{color:"rgb(9, 64, 103)"}}>   {data.transcription}  </span>
                                    <span className="flashcardcanh-audio-icon fs-5  " >
                        
                                        <i className="bi bi-volume-up ml-2 fs-4 " ></i>
                                    </span>
                                </h1>
                                <p className="flashcardcanh-subtitle f">( {data.typeOfWord} )</p>

                                <span className="flashcardcanh-definition font-weight-bold">Định nghĩa : </span>
                                <span>{data.define}</span>

                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <p className="flashcardcanh-source font-weight-bold mb-0">Ví dụ:</p>
                                    <span className="flashcardcanh-time p-1">{calculateDaysAgo(data.createdAt)} ngày trước</span>
                                </div>

                                <div className="border border-secondary rounded p-3 flashcardcanh-examples-container custom-scroll">
                                    <div className="flashcardcanh-examples">
                                        {data.exampleVM?.map((example, idx) => (
                                            <div key={idx}>
                                                <p className="font-weight-bold fs-6 mb-0">
                                                    {idx + 1}. {example.en}
                                                    <span className="flashcardcanh-audio-icon">
                                                        <i className="bi bi-volume-up"></i>
                                                    </span>
                                                </p>
                                                <p className="flashcardcanh-translation font-weight-bold mb-0">{example.trans}</p>
                                                <p className="flashcardcanh-translation mb-0 font-italic">{example.vi}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <p className="flashcardcanh-note mt-2 font-weight-bold">
                                    Note: <span className="font-weight-normal">{data.note}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* popup add word  edit*/}

            <div className="modal fade" id="addWordModal" tabIndex="-1"
                aria-labelledby="addWordModalLabel" aria-hidden="true"
                onHide={handleResetForm} >
                <div className="modal-dialog modal-lg modal-dialog-centered" style={{ width: "30%" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addWordModalLabel">Thêm từ mới</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={handleResetForm}
                            ></button>
                        </div>

                        <div className="modal-body">
                            <div className="mb-3">
                                {/* Input từ mới và nút AI Generate */}
                                <div className="d-flex gap-3 align-items-end mb-3">
                                    <div className="flex-grow-1">
                                        <div className="d-flex gap-2 align-items-center">
                                            <p className="ms-2 mb-1">
                                                Tên từ mới (nhập rồi bấm vào AI Generate)
                                                <svg className="text-danger ms-1" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em">
                                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                                    <path d="M11.07 12.85c.77-1.39 2.25-2.21 3.11-3.44.91-1.29.4-3.7-2.18-3.7-1.69 0-2.52 1.28-2.87 2.34L6.54 6.96C7.25 4.83 9.18 3 11.99 3c2.35 0 3.96 1.07 4.78 2.41.7 1.15 1.11 3.3.03 4.9-1.2 1.77-2.35 2.31-2.97 3.45-.25.46-.35.76-.35 2.24h-2.89c-.01-.78-.13-2.05.48-3.15zM14 20c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"></path>
                                                </svg>
                                            </p>
                                        </div>
                                        <input
                                            type="text"
                                            name="title"
                                            className="form-control"
                                            placeholder="Tên từ mới"
                                            value={wordData.title}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <button
                                        className="btn btn-primary d-flex align-items-center gap-2"
                                        onClick={handleAIGenerate}
                                        disabled={isLoading || !wordData.title}
                                    >
                                        {isLoading ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em">
                                                <path d="M184 0c30.9 0 56 25.1 56 56V456c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56V56c0-30.9 25.1-56 56-56z"></path>
                                            </svg>
                                        )}
                                        AI Generate
                                    </button>
                                </div>

                                {/* Định nghĩa */}
                                <div className="mb-3">
                                    <p className="ms-2 mb-1">Định nghĩa</p>
                                    <input
                                        type="text"
                                        name="definition"
                                        className="form-control"
                                        placeholder="Định nghĩa (bắt buộc)"
                                        value={wordData.define}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Các trường không bắt buộc */}
                                <div className="border rounded p-3">
                                    <p className="text-muted">Không yêu cầu phải điền</p>
                                    <div className="d-flex gap-3 align-items-center mb-3">
                                        <div className="flex-grow-1">
                                            <p className="ms-2 mb-1">Loại từ</p>
                                            <input
                                                type="text"
                                                name="typeOfWord"
                                                className="form-control"
                                                placeholder="Loại từ (N,V,Adj,...)"
                                                value={wordData.typeOfWord}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="ms-2 mb-1">Phiên âm</p>
                                            <input
                                                type="text"
                                                name="phonetic"
                                                className="form-control"
                                                placeholder="Phiên âm"
                                                value={wordData.transcription}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <p className="ms-2 mb-1">Ví dụ</p>
                                        <textarea
                                            className="form-control custom-scroll"
                                            name="examples"
                                            rows="4"
                                            placeholder="Ví dụ (tối đa 10 câu)"
                                            value={wordData.examples}
                                            onChange={handleInputChange}
                                            style={{ height: "150px" }}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <p className="ms-2 mb-1">Ghi chú</p>
                                        <textarea
                                            className="form-control custom-scroll"
                                            name="note"
                                            rows="3"
                                            placeholder="Ghi chú"
                                            value={wordData.note}
                                            onChange={handleInputChange}
                                            style={{ height: "150px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={handleResetForm}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                disabled={!wordData.define}
                                onClick={handleSubmit}
                            >
                                {isEditMode ? "Cập nhật" : "Tạo"}

                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* popup add word  edit Studyset*/}
            <Modal
                title="Chỉnh sửa Study Set"
                visible={isEditModalVisible}
                onCancel={handleEditCancel}
                footer={null}
                centered
            >
                <div className="d-flex flex-column align-items-center text-center space-y-2"
                    style={{ minWidth: "20rem", minHeight: "10rem" }}>
                    <Input
                        placeholder="Tên list từ"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="w-100 m-2"
                    />
                    <Select
                        value={editData.language}
                        className="w-100 mt-2"
                        onChange={(value) => setEditData({ ...editData, language: value })}
                    >
                        <Option value="Tiếng Anh-Mỹ">Tiếng Anh-Mỹ</Option>
                        <Option value="Tiếng Anh-Anh">Tiếng Anh-Anh</Option>
                        <Option value="Vietnam">Tiếng Việt</Option>
                        <Option value="Tiếng Nhật">Tiếng Nhật</Option>
                        <Option value="Tiếng Trung Quốc">Tiếng Trung Quốc</Option>
                    </Select>
                    <TextArea
                        placeholder="Mô tả"
                        value={editData.desc}
                        onChange={(e) => setEditData({ ...editData, desc: e.target.value })}
                        className="w-100 m-3 custom-scroll"
                        style={{
                            maxHeight: "60px",
                            overflow: "auto",
                            resize: "none"
                        }}
                    />
                    <div className="d-flex justify-content-left">
                        <Checkbox
                            checked={editData.Public}
                            onChange={(e) => setEditData({ ...editData, Public: e.target.checked })}
                        >
                            Công khai
                        </Checkbox>
                    </div>
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <Button onClick={handleEditCancel} className="me-2">Hủy</Button>
                    <Button type="primary" onClick={handleEditStudySetSubmit}>Cập nhật</Button>
                </div>
            </Modal>


            {/* popup add word  Delete  Flashcard*/}
            <Modal
                title={deleteType === 'flashcard' ? "Xóa từ" : "Xóa Study Set"}
                visible={isDeleteModalVisible}
                onCancel={handleDeleteCancel}
                footer={null} 
                centered
              >
                <div className="d-flex flex-column align-items-center text-center space-y-2"
                    style={{ minWidth: "15rem", minHeight: "5rem" }}>
                    <p className='fs-5 fw-bold'>
                        Bạn có chắc chắn muốn xóa {deleteType === 'flashcard' ? 'từ' : 'study set'} này không?
                    </p>  
                    <div className="d-flex justify-content-center mt-3 w-100">
                        <Button onClick={handleDeleteCancel} className="me-2 btn-secondary w-25">Hủy</Button>
                        <Button type="primary" onClick={handleDeleteSubmit} className="w-25 btn-danger">Xóa</Button>
                    </div>
                </div>
            </Modal>


        </div>



    );
};





export default Flashcardcanh;