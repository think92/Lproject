import React from "react";
import "../css/modal.css";

const Modal = ({ isOpen, onClose, inquiry }) => {
  if (!isOpen || !inquiry) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="modal-header">
          <div className="modal-title">
            <h1>답변작성</h1>
            <div className="userInrtos">
              <div className="userInrto">
                <img src="./img/mypageuser.png" />
                {inquiry.mb_email} {formatDate(inquiry.questioned_at)}
              </div>
              <div>
                <p className="titleIntro">제목 : {inquiry.qstn_title}</p>
                <p className="titleIntro">{inquiry.qstn_content}</p>{" "}
                {/* qstn_content를 표시 */}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <textarea
            className="styled-textarea"
            placeholder="답변을 작성하세요"
          ></textarea>
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
