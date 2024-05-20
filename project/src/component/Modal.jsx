import React, { useRef, useState, useEffect, useContext } from "react";
import "../css/modal.css";
import axios from "axios";
import { LoginUserContext } from "../context/LoginUserContent";

const Modal = ({ isOpen, onClose, inquiry }) => {
  const { login_id } = useContext(LoginUserContext);
  const qstnsToAnswer = useRef(); // 답변 내용
  const [answer, setAnswer] = useState(""); // 답변 내용을 저장할 상태

  useEffect(() => {
    if (isOpen && inquiry) {
      // 문의사항의 답변 보기
      const formData = new FormData();
      formData.append("qstn_idx", inquiry.qstn_idx); // 문의사항의 답변 내용

      axios
        .post(`http://localhost:8083/AdmApi/adminAnswer`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data && res.data.answerContent) {
            setAnswer(res.data.answerContent); // 답변 내용을 상태에 저장
          }
        });
    }
  }, [isOpen, inquiry]);

  if (!isOpen || !inquiry) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // 답변 저장
  function saveAnswer() {
    const ansFormData = new FormData();
    ansFormData.append("qstn_idx", inquiry.qstn_idx); // 문의사항의 고유 번호
    ansFormData.append("ans_content", qstnsToAnswer.current.value); // 문의사항의 답변 내용
    ansFormData.append("admin_id", "admin"); // 문의 답변한 관리자(추후 변경하도록)

    axios
      .post(`http://localhost:8083/AdmApi/adminToAnswer`, ansFormData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        alert("답변이 저장되었습니다.");
        setAnswer(qstnsToAnswer.current.value); // 저장된 답변 내용을 상태에 반영
      });
  }

  const isPrivate = inquiry.qstn_open === "N";
  const canViewContent =
    !isPrivate || (isPrivate && inquiry.mb_email === login_id);

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
                <img src="./img/mypageuser.png" alt="mypageuser" />
                {inquiry.mb_email} {formatDate(inquiry.questioned_at)}
              </div>
              <div>
                <p className="titleIntro">제목 : {inquiry.qstn_title}</p>
                <div>
                  {canViewContent ? (
                    <p className="titleIntro">{inquiry.qstn_content}</p>
                  ) : (
                    <p>비공개된 글 입니다. 작성자만 내용을 볼 수 있습니다.</p>
                  )}
                </div>
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
          <button className="button" onClick={saveAnswer}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
