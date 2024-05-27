import React, { useEffect, useRef, useState } from "react";
import MainBar from "./MainBar";
import "./css/Join.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Join = () => {
  const nav = useNavigate();
  const inputEmail = useRef(null);
  const inputPw = useRef(null);
  const inputPwCheck = useRef(null);

  function joinMember() {
    const formData = new FormData();
    formData.append("mb_email", inputEmail.current.value);
    formData.append("mb_pw", inputPw.current.value);

    if (inputPw.current.value === inputPwCheck.current.value) {
      axios
        .post(`http://${process.env.REACT_APP_IP}:8083/MemApi/join`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data === "Success") {
            nav("/");
            // 추후 제거..
            // } else if (res.data === "Error") {
            //   alert(
            //     "에러가 발생하였습니다. 재시도 이후 문제 발생시 문의사항에 작성하여주세요."
            //   );
          } else {
            alert("이미 존재하는 이메일입니다. 다시 입력하여 주세요.");
          }
        });
    } else {
      alert("입력 값이 잘못되었습니다.");
    }
  }

  return (
    <div>
      <MainBar />
      <section className="joinbody">
        <div className="joinbox1">
          <span className="joinbox3">
            <div className="joinclose">
              <Link to={"/"} className="joinclosebox">
                X
              </Link>
            </div>
            <div>
              <img
                src="./img/blurbla_simbol.png"
                className="joinsimbol"
                alt="simbol"
              />
              <img
                src="./img/blurbla_logo(kr).png"
                className="joinlogokr"
                alt="logokr"
              />
            </div>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                ref={inputEmail}
                placeholder="이메일"
                className="joinemail"
              />
              <input
                type="password"
                id="pw"
                ref={inputPw}
                name="password"
                placeholder="비밀번호"
                className="joinpassword"
              />
              <input
                type="password"
                id="pw"
                ref={inputPwCheck}
                name="passwordcheck"
                placeholder="비밀번호 확인"
                className="joinpassword"
              />
              <button to={"/Login"} className="joinbtn" onClick={joinMember}>
                회원가입
              </button>
            </div>
          </span>
          <span className="joinbox2">
            <div className="jointerms">
              <p>이용약관</p>
              <p className="joinpoint">개인정보 처리방침</p>
              <p>운영정책</p>
              <p>회원정보 고객센터</p>
              <p>공지사항</p>
            </div>
          </span>
        </div>
      </section>
    </div>
  );
};

export default Join;
