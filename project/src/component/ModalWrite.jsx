import React, { useState } from "react";
import "../css/modalwrite.css";

const ModalWrite = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // 작성 로직 추가
    console.log("제목 : ", title);
    console.log("내용 : ", content);
    console.log("비공개 : ", isPrivate);
    alert("문의작성이 저장되었습니다.");
    onClose();
  };
  return (
    <div className="modalWrite">
      <div className="modalWrite-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="modalWrite-header">
          <div className="modalWrite-title">
            <h1 className="modalWrite-titles">문의작성</h1>
            <div className="modalCheckbox-container">
              <label className="checkBoxes">
                <input
                  type="radio"
                  name="privacy"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(false)}
                  className="checkBox"
                />
                <p className="checkboxOpen">공개</p>
                <input
                  type="radio"
                  name="privacy"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(true)}
                  className="checkBox"
                />
                <p className="checkboxPrivate">비공개</p>
              </label>
            </div>
            <div className="ModalWriteuserInrtos">
              <div>
                <select
                  name="choice"
                  className="ModalWriteselectbox"
                  onChange={(e) => setTitle(e.target.value)}
                >
                  <option className="ModalWrite-opt">제목을 선택해주세요.</option>
                  <option value="">전체</option>
                  <option value="">모자이크 관련</option>
                  <option value="">서비스 이용</option>
                  <option value="">프리미엄 결제</option>
                  <option value="">기타</option>
                  <option value="">신고</option>
                </select>
              </div>
              <div>{/* qstn_content를 표시 */}</div>
            </div>
          </div>
        </div>
        <div className="modalWrite-body">
          <textarea
            className="styled-textarea"
            placeholder="내용을 작성하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="modalWrite-footer">
          <button className="modalWritebutton" onClick={onClose}>
            닫기
          </button>
          <button className="modalWritebutton" onClick={handleSubmit}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWrite;
