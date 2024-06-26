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
    const fromData = new FormData();

    if (sessionStorage.getItem("mb_email") === null) {
      nav("/Login");
    } else {
      fromData.append("mb_email", sessionStorage.getItem("mb_email")); // 이메일 정보 보내기
      // 로그인 되어 있는 경우 결제 페이지 실행
      axios
        .post(
          `http://${process.env.REACT_APP_IP}:8083/api/kakaoPay`,
          fromData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const redirectUrl = res.data; // 서버 응답의 URL 사용
          console.log("카카오페이 응답 URL:", redirectUrl);
          if (redirectUrl.startsWith("http")) {
            window.location.href = redirectUrl; // 응답 URL로 리디렉션
          } else {
            console.error("Invalid URL:", redirectUrl);
          }
        })
        .catch((error) => {
          console.log("결제 요청 실패:", error);
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
            <h1 className="premiumservice">프리미엄 서비스 구독</h1>
          </span>
        </div>
      </section>
    </div>
  );
};

export default Premium;
