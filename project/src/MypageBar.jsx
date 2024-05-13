import React, { useState } from "react";
import "./css/MypageBar.css";
import { faHouse, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const MypageBar = () => {
  return (
    <div className="mypageBody">
      <section>
        <div className="mypagebody">
          <div className="mypagebar">
            <div className="mypagegomain">
              <FontAwesomeIcon icon={faHouse} className="fahouse" />
              <Link to={"/"} className="mypagegomainhome">
                메인 홈
              </Link>
            </div>

            <div className="mypageuser">
              <img
                src="./img/mypageuser.png"
                className="mypageuserimg"
                alt="user"
              ></img>
            </div>
            
            <p className="useremail">user1</p>
            <div>
              <Link to={"/Mypage"} className="mypagetool">
                <FontAwesomeIcon icon={faCircle} className="facircle" />
                <p className="mypagetools">작업내역</p>
              </Link>
            </div>
            <div>
              <Link to={"/MypageCustom"} className="mypagecustomer">
                <FontAwesomeIcon icon={faCircle} className="facirclewhite" />
                <p className="mypagecustomers">문의사항</p>
              </Link>
            </div>
            <div>
              <Link to={"/MypagePay"} className="mypagepay">
                <FontAwesomeIcon icon={faCircle} className="facirclewhite" />
                <p className="mypagepays">결재내역</p>
              </Link>
            </div>

            <div className="mypagegologout">
              <FontAwesomeIcon icon={faHouse} className="bracket" />
              <Link to={"/"} className="mypagegologouts">
                로그아웃
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MypageBar;
