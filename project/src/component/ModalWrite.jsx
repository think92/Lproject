import React from "react";
import "../css/modalwrite.css";

const ModalWrite = ({ isOpen, onClose, inquiry }) => {
  console.log("ModalWrite 방문");
  if (!isOpen || !inquiry) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  return (
    <div className="modalWrite">
      <div className="modalWrite-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="modalWrite-header">
          <div className="modalWrite-title">
            <h1>문의작성</h1>
            <td>
              <input type="checkbox"></input>
            </td>
            <div className="userInrtos">
              <div className="userInrto">
                <img src="./img/mypageuser.png" alt="mypageuser" />
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

export default ModalWrite;
