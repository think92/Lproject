import React, { useRef, useState, useEffect, useContext } from "react";
import "../css/modal.css";
import axios from "axios";
import { LoginUserContext } from "../context/LoginUserContent";

const Modal = ({ isOpen, onClose, inquiry }) => {
  const { login_id } = useContext(LoginUserContext);
  const qstnsToAnswer = useRef(); // 답변 내용
  const [answers, setAnswers] = useState([]); // 답변 내용을 저장할 상태
  const [isAnswered, setIsAnswered] = useState(false); // 답변 완료 여부

  useEffect(() => {
    if (isOpen && inquiry) {
      // 문의사항의 답변 보기
      const formData = new FormData();
      formData.append("qstn_idx", inquiry.qstn_idx); // 문의사항의 고유 번호

      axios
        .post(`http://localhost:8083/AdmApi/adminAnswer`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("응답 데이터:", res.data);
          if (res.data && res.data.length > 0) {
            setAnswers(res.data); // 답변 내용을 상태에 저장
            setIsAnswered(true); // 답변 완료 여부 설정
          } else {
            setIsAnswered(false); // 답변 미완료 설정
          }
        })
        .catch((err) => {
          console.error("Error fetching answer:", err);
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
        setAnswers((prevAnswers) => [
          ...prevAnswers,
          {
            ans_content: qstnsToAnswer.current.value,
            admin_id: "admin",
            answered_at: new Date().toISOString(),
          },
        ]); // 저장된 답변 내용을 상태에 반영
        setIsAnswered(true); // 답변 완료 여부 설정
      })
      .catch((err) => {
        console.error("Error saving answer:", err);
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
            <h1>문의사항 답변</h1>
            <div className="user-info">
              <img src="./img/mypageuser.png" alt="mypageuser" />
              <div>
                <span className="user-email">{inquiry.mb_email}</span>
                <span className="question-date">
                  {formatDate(inquiry.questioned_at)}
                </span>
              </div>
            </div>
            <div className="question-details">
              <p className="question-title">제목: {inquiry.qstn_title}</p>
              <div className="question-content">
                {canViewContent ? (
                  <p>{inquiry.qstn_content}</p>
                ) : (
                  <p>비공개된 글 입니다. 작성자만 내용을 볼 수 있습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {isAnswered && (
          <div className="answer-section">
            {answers.map((ans, index) => (
              <div key={index} className="answer-content">
                <div className="user-info">
                  <img src="./img/blurbla_simbol.png" alt="mypageuser" />
                  <div>
                    <span className="user-email">{ans.admin_id}</span>
                    <span className="question-date">
                      {formatDate(ans.answered_at)}
                    </span>
                  </div>
                </div>
                <div className="question-details">
                  <p className="question-content">{ans.ans_content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isAnswered && (
          <div className="modal-body">
            <textarea
              ref={qstnsToAnswer}
              className="styled-textarea"
              placeholder="답변을 작성하세요"
            ></textarea>
          </div>
        )}
        <div className="modal-footer">
          <button className="button close-button" onClick={onClose}>
            닫기
          </button>
          {!isAnswered && (
            <button className="button save-button" onClick={saveAnswer}>
              저장
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
