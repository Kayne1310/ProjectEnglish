import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ModalResult.scss';

const ModalResult = (props) => {
  const { show, setShow, dataModalResult } = props;

  const handleClose = () => setShow(false);

  if (!dataModalResult) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{dataModalResult.quizTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="quiz-summary">
          <h4>Quiz Summary</h4>
          <p><strong>Description:</strong> {dataModalResult.quizDescription}</p>
          <p><strong>Total Questions:</strong> {dataModalResult.countTotal}</p>
          <p><strong>Correct Answers:</strong> {dataModalResult.countCorrect}</p>
          <p><strong>Score:</strong> {((dataModalResult.countCorrect / dataModalResult.countTotal) * 100).toFixed(2)}%</p>
        </div>

        <div className="questions-review">
          <h4>Detailed Review</h4>
          {dataModalResult.quizData.map((question, index) => (
            <div key={question.questionId} className={`question-item ${question.isCorrect ? 'correct' : 'incorrect'}`}>
              <h5>Question {index + 1}: {question.questionDescription}</h5>
              <div className="answers-list">
                <p><strong>Your Answer:</strong> {question.userAnswerDescription}</p>
                <p><strong>Correct Answer:</strong> {
                  question.systemAnswers.find(answer => answer.correctAnswer)?.description || 'Not available'
                }</p>
              </div>
              <div className="system-answers">
                <p><strong>All Possible Answers:</strong></p>
                <ul>
                  {question.systemAnswers.map(answer => (
                    <li key={answer.id} className={answer.correctAnswer ? 'correct-answer' : ''}>
                      {answer.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Try Again
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalResult;