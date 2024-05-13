import React, { useRef } from "react";
import MainBar from "./MainBar";
import "./css/Join.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Join = () => {
  const inputEmail = useRef(null);
  const inputPw = useRef(null);
  const inputPwCheck = useRef(null);

  function joinMember() {
    console.log(inputEmail.current.value);
    console.log(inputPw.current.value);
    console.log(inputPwCheck.current.value);

    if (inputPw.current.value === inputPwCheck.current.value) {
      axios
        .post("http://localhost:8083/restApi/join", {
          mb_email: inputEmail.current.value,
          mb_pw: inputPw.current.value,
        })
        .then((res) => console.log(res));
    } else {
      alert("비밀번호가 일치하지 않습니다.");
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
              <img src="./img/blurbla_simbol.png" className="joinsimbol" />
              <img src="./img/blurbla_logo(kr).png" className="logokr" />
            </div>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                ref={inputEmail}
                placeholder="이메일"
                className="email"
              />
              <input
                type="email"
                id="pw"
                ref={inputPw}
                name="password"
                placeholder="비밀번호"
                className="password"
              />
              <input
                type="email"
                id="pw"
                ref={inputPwCheck}
                name="passwordcheck"
                placeholder="비밀번호 확인"
                className="password"
              />
              <Link to={"/Login"} className="joinbtn" onClick={joinMember}>
                회원가입
              </Link>
            </div>
          </span>
          <span className="joinbox2">
            <div className="terms">
              <p>이용약관</p>
              <p className="point">개인정보 처리방침</p>
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
