import React from "react";
import "../css/modal.css";

const Modal = ({ isOpen, onClose, inquiry }) => {
  if (!isOpen || !inquiry) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="modal-header">
          <div className="modal-title">
            <h1>답변작성</h1>
            <div>
              {inquiry.userId} · {inquiry.inquiryDate}
            </div>
          </div>
        </div>
        <div className="modal-body">
          <p>{inquiry.title}</p>
          <textarea placeholder="답변을 작성하세요"></textarea>
        </div>
        <div className="modal-footer">
          <button className="button" onClick={onClose}>
            닫기
          </button>
          <button
            className="button"
            onClick={() => alert("답변이 저장되었습니다.")}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
