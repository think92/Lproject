import React, { useContext, useRef } from "react";
import MainBar from "./MainBar";
import "./css/Login.css";
import "./css/mainbar.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginUserContext } from "./context/LoginUserContent";

const Login = () => {
  const nav = useNavigate();
  const mb_email = useRef();
  const mb_pw = useRef();

  // 로그인한 회원 정보 저장하는 변수(아이디, 등급)
  const { login_id, setLogin_id, login_role, setLogin_role } =
    useContext(LoginUserContext);

  function tryLogin() {
    // 사용자가 적은 ID, PW 값을 가져와서
    // SpringBoot 서버로 전송하겠습니다 ! --> 비동기 통신방식 (axios)
    const formData = new FormData();
    formData.append("mb_email", mb_email.current.value); // 아이디 값
    formData.append("mb_pw", mb_pw.current.value); //비밀번호 값
    axios
      .post(`http://${process.env.REACT_APP_LOCALHOST}:8083/MemApi/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("로그인 정보보기  : ", res.data);
        console.log("로그인 이메일    : ", res.data.mb_email);
        console.log("로그인 비번      : ", res.data.mb_pw);
        console.log("로그인 등급      : ", res.data.mb_role);
        console.log("로그인 가입일자  : ", res.data.joinedAt);

        if (res.data.mb_email !== undefined) {
          // 로그인 성공한 회원 정보 Session에 담기
          sessionStorage.setItem("mb_email", res.data.mb_email);
          sessionStorage.setItem("mb_role", res.data.mb_role);
        } else {
          alert("아이디 비밀번호가 잘 못 되었습니다.");
        }

        if (res.data.mb_role === "A0") {
          nav("/admin");
        } else {
          nav("/");
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
              <img
                src="./img/blurbla_simbol.png"
                className="loginsimbol"
                alt="simbol"
              />
              <img
                src="./img/blurbla_logo(kr).png"
                className="loginlogokr"
                alt="logokr"
              />
            </div>
            <div>
              <input
                ref={mb_email}
                type="email"
                id="email"
                name="email"
                placeholder="이메일"
                className="loginemail"
              />
              <input
                ref={mb_pw}
                type="password"
                id="pw"
                name="pw"
                placeholder="비밀번호"
                className="loginpassword"
              />
              {/* <Link to={"/"} className="loginbtn" onClick={tryLogin}> */}
              <button to={"/"} className="loginbtn" onClick={tryLogin}>
                로그인
              </button>

              <div className="loginfind">
                <button to={"/"} className="loginfinds">
                  비밀번호 찾기
                </button>
                <p>l</p>
                <button to={"/"} className="loginfinds">
                  아이디 찾기
                </button>
                <p>l</p>
                <Link to={"/Join"} className="loginfinds1">
                  회원가입
                </Link>
              </div>
            </div>
          </span>
          <span className="loginbox2">
            <div className="loginterms">
              <p>이용약관</p>
              <p className="loginpoint">개인정보 처리방침</p>
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
