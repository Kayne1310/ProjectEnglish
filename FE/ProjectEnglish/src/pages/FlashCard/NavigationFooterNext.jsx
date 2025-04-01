import React from 'react';
const NavigationFooterNext = ({ onPrevious, onNext, currentIndex, totalItems }) => {
    return (
      <div className="quiz-footer border-top bg-white p-3 d-flex justify-content-between align-items-center mt-auto">
        <button 
          className="btn btn-outline-secondary d-flex align-items-center gap-2" 
          onClick={onPrevious} 
          disabled={currentIndex === 0}
        >
          <i className="fas fa-chevron-left"></i>
          <span>Lùi lại</span>
        </button>
        <button 
          className="btn btn-outline-secondary d-flex align-items-center gap-2" 
          onClick={onNext} 
          disabled={currentIndex === totalItems - 1}
        >
          <span>Tiến tới</span>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };
  
  export default NavigationFooterNext;