import React, { useState } from "react";
import "../css/modalwrite.css";
import axios from "axios";

const ModalWrite = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [inquiries, setInquiries] = useState([]); // 데이터를 저장할 상태
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [customselect, setCustomSelect] = useState(null); // 작성하기 상태

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8083/AdmApi/adminInquiry", {
      title,
      content,
      isPrivate,
    })
    .then((res) => {
      // 작성 로직 추가
      console.log("문의사항 저장됨.", res.date);
      // console.log("내용 : ", res.date);
      // console.log("비공개 : ", res.date);
      alert("문의작성이 저장되었습니다.");
      onClose();
      qntnsList(); // 문의사항 목록을 다시 가져옴
    })
  };


  const qntnsList = () => {
    axios
      .post("http://localhost:8083/AdmApi/adminInquiry")
      .then((res) => {
        const data = Array.isArray(res.data.aQstnsCount)
          ? res.data.aQstnsCount
          : [];
        setInquiries(data); // 데이터를 상태에 저장
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        alert("저장 중 오류가 발생했습니다.");
      });
  };

  
  return (
    <div className="modalWrite">
      <div className="modalWrite-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="modalWrite-header">
          <div className="modalWrite-title">
            <h1 className="modalWrite-titles">문의사항 작성하기</h1>
            <div className="modalCheckbox-container">
              <label className="checkBoxes">
                <input
                  type="radio"
                  name="privacy"
                  checked="cheched"
                  onChange={() => setIsPrivate(false)}
                  className="checkBox"
                />
                <p className="checkboxOpen">공개</p>
                <input
                  type="radio"
                  name="privacy"
                  checked="cheched"
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
                  <option className="ModalWrite-opt">
                    항목을 선택해주세요.
                  </option>
                  <option value="T">전체</option>
                  <option value="I">모자이크 관련</option>
                  <option value="S">서비스 이용</option>
                  <option value="P">프리미엄 결제</option>
                  <option value="G">기타</option>
                  <option value="R">신고</option>
                </select>
                <div id="ModalWriteTitles">
                  <p>제목 : </p>
                    <input
                      type="text"
                      placeholder="제목을 입력해주세요."
                      id="ModalWriteTitle"
                      onChange={(e) => setTitle(e.target.value)}
                    ></input>
                </div>
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
          <button className="modalWriteClosebutton" onClick={onClose}>
            닫기
          </button>
          <button className="modalWriteSavebutton" onClick={handleSubmit}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWrite;
