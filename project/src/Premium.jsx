import React, { useContext, useEffect } from "react";
import MainBar from "./MainBar";
import "./css/mainbar.css";
import "./css/Premium.css";
import axios from "axios";
import { LoginUserContext } from "./context/LoginUserContent";
import { Link, NavLink, redirect, useNavigate } from "react-router-dom";

const Premium = () => {
  const nav = useNavigate();

  // 로그인한 회원 정보 저장하는 변수(아이디, 등급)
  const {
    login_id,
    setLogin_id,
    login_role,
    setLogin_role,
    kakaoLink,
    setKakaoLink,
  } = useContext(LoginUserContext);

  // 화면
  const KakaoPayment = () => {
    if (login_id === false) {
      console.log(kakaoLink);
      console.log(login_id);
      nav("/Login");
    } else {
      console.log(kakaoLink);
      console.log(login_id);
      // 로그인 되어 있는 경우 결제 페이지 실행
      axios
        .post("http://localhost:8083/api/kakaoPay")
        .then((res) => {
          nav(res.data);
          console.log(res.data);
        })
        .catch((res) => {
          // console.log("fail:",inquiri.length);
        });
    }
  };

  return (
    <div>
      <MainBar />
      <section className="premiumbody">
        <div className="premiumbox1">
          <div className="premiumbox3">
            <div>
              <h3 className="premium">프리미엄</h3>
              <h2 className="price">
                ￦ 3,300원<span className="pricekr"> (월 요금)</span>
              </h2>
            </div>
            <div className="listbox">
              <img
                src="./img/premium.png"
                className="premiumcheck"
                alt="check"
              ></img>
              <p className="premiumlist">
                사진 업로드 <span className="free"> Free</span>
              </p>
            </div>

            <div className="listbox">
              <img
                src="./img/premium.png"
                className="premiumcheck"
                alt="check"
              ></img>
              <p className="premiumlist">
                기능 사용 확장 <span className="free"> Free</span>
              </p>
            </div>

            <div className="listbox">
              <img
                src="./img/premium.png"
                className="premiumcheck"
                alt="check"
              ></img>
              <p className="premiumlist">
                광고없이 <span className="free"> Free</span>
              </p>
            </div>

            <button className="approval" onClick={KakaoPayment}>
              결제하기
            </button>
          </div>
          <div className="premiumvideobox">
            <video controls poster="videos/Clouds.png" className="premiumvideo">
              <source src="videos/Clouds.mp4" type="video/mp4" />
            </video>
          </div>

          <span className="premiumbox2">
            <h1 className="premiumservice">프리미엄 서비스</h1>
          </span>
        </div>
      </section>
    </div>
  );
};

export default Premium;
