import React from "react";
import MainBar from "./MainBar";
import "./css/Join.css";
import { Link } from "react-router-dom";

const Join = () => {
  return (
    <div>
      <MainBar />
      <section className="joinbody">
        <div className="joinbox1">
          <span className="joinbox3">
            <div className="joinclose">
              <Link to={"/"} className="joinclosebox">X</Link>
            </div>
            <div>
              <img src="./img/blurbla_simbol.png" className="joinsimbol" />
              <img src="./img/blurbla_logo(kr).png" className="logokr" />
            </div>
            <div>
              <input type="email" id="email" name="email" placeholder="이메일" className="email" />
              <input type="email" id="pw" name="password" placeholder="비밀번호" className="password" />
              <input type="email" id="pw" name="passwordcheck" placeholder="비밀번호 확인" className="password" />
              <Link to={"/Login"} className="joinbtn">회원가입</Link>
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
