import React, { useRef, useState } from "react";
import "../css/modal.css";
import axios from "axios";

const Modal = ({ isOpen, onClose, inquiry }) => {
  const qstnsToAnswer = useRef(); // 답변 내용

  if (!isOpen || !inquiry) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // 문의사항의 답변 보기
  const formData = new FormData();
  formData.append("qstn_idx", inquiry.qstn_idx); // 문의사항의 답변 내용
  console.log("문의 고유번호  : ", formData.get("qstn_idx"));

  axios
    .post(`http://localhost:8083/AdmApi/adminAnswer`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      console.log("문의 답변보기  : ", res.data);
    });

  // 답변 저장

  function answer() {
    const ansFormData = new FormData();

    ansFormData.append("qstn_idx", inquiry.qstn_idx); // 문의사항의 고유 번호
    ansFormData.append("ans_content", qstnsToAnswer.current.value); // 문의사항의 답변 내용
    ansFormData.append("admin_id", "admin"); // 문의 답변한 관리자(추후 변경하도록)

    console.log("[보냄] 문의 고유번호  : ", ansFormData.get("qstn_idx"));
    console.log("[보냄] 문의 답변내용  : ", ansFormData.get("ans_content"));
    console.log("[보냄] 문의 답변관리자  : ", ansFormData.get("admin_id"));

    axios
      .post(`http://localhost:8083/AdmApi/adminToAnswer`, ansFormData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("문의 답변등록 여부  : ", res.data);
        alert("답변이 저장되었습니다.");
      });
  }

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
            ref={qstnsToAnswer}
            className="styled-textarea"
            placeholder="답변을 작성하세요"
          ></textarea>
        </div>
        <div className="modal-footer">
          <button className="button" onClick={onClose}>
            닫기
          </button>
          <button className="button" onClick={answer}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
