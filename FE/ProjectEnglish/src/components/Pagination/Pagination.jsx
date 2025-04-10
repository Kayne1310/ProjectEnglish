import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5
}) => {
  // Tính toán các trang cần hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const halfMaxPages = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="d-flex justify-content-center">
      <BootstrapPagination>
        {showFirstLast && (
          <BootstrapPagination.First
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
          />
        )}
        
        {showPrevNext && (
          <BootstrapPagination.Prev
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          />
        )}
        
        {getPageNumbers().map((pageNumber) => (
          <BootstrapPagination.Item
            key={pageNumber}
            active={currentPage === pageNumber}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </BootstrapPagination.Item>
        ))}
        
        {showPrevNext && (
          <BootstrapPagination.Next
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          />
        )}
        
        {showFirstLast && (
          <BootstrapPagination.Last
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          />
        )}
      </BootstrapPagination>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showFirstLast: PropTypes.bool,
  showPrevNext: PropTypes.bool,
  maxVisiblePages: PropTypes.number
};

export default Pagination; 