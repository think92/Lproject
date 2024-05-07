import React, { useRef } from "react";
import MainBar from "./MainBar";
import "./css/Login.css";
import "./css/mainbar.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const nav = useNavigate();
  const email = useRef();
  const pw = useRef();

  function tryLogin() {
    // 사용자가 적은 ID, PW 값을 가져와서
    // SpringBoot 서버로 전송하겠습니다 ! --> 비동기 통신방식 (axios)
    let inputEmail = email.current.value;
    let inputPw = pw.current.value;

    axios
      .get(
        `http://localhost:8083/restApi/Login?email=${inputEmail}&pw=${inputPw}`
      )
      .then((res) => {
        // 로그인 성공 -> Main
        // 로그인 실패 -> 로그인 실패 알림
        console.log(res);
        if (res.data == "Success") {
          window.localStorage.setItem("nick", res.data);
          nav("/");
        } else {
          alert("로그인 실패");
        }
      });

    // 로그인 성공시 Nick 값 -> Main
  }

  return (
    <div>
      <MainBar />
      <section className="loginbody">
        <div className="loginbox1">
          <span className="loginbox3">
            <div className="loginclose">
              <Link to={"/"} className="loginclosebox">
                X
              </Link>
            </div>
            <div>
              <img src="./img/blurbla_simbol.png" className="loginsimbol" />
              <img src="./img/blurbla_logo(kr).png" className="logokr" />
            </div>
            <div>
              <input
                ref={email}
                type="email"
                id="email"
                name="email"
                placeholder="이메일"
                className="email"
              />
              <input
                ref={pw}
                type="password"
                id="pw"
                name="pw"
                placeholder="비밀번호"
                className="password"
              />
              {/* <Link to={"/"} className="loginbtn" onClick={tryLogin}> */}
              <button to={"/"} className="loginbtn" onClick={tryLogin}>
                로그인
              </button>

              <div className="find">
                <Link to={"/"} className="find">
                  비밀번호 찾기
                </Link>
                <p>l</p>
                <Link to={"/"} className="find">
                  아이디 찾기
                </Link>
                <p>l</p>
                <Link to={"/Join"} className="find">
                  회원가입
                </Link>
              </div>
            </div>
          </span>
          <span className="loginbox2">
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

export default Login;
