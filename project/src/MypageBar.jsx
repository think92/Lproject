import React, { Children, createContext, useRef, useState } from "react";
import "./css/MypageBar.css";
import { faHouse, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";

const MypageBar = () => {
  const changeBtn = {
    backgroundColor: "#4ce577",
  };


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
              <NavLink
                to={"/Mypage"}
                className="mypagetool"
                style={({ isActive }) => (isActive ? changeBtn : {})}
              >
                <FontAwesomeIcon
                  icon={faCircle}
                  className="facircle"
                  to={"/Mypage"}
                  style={({ isActive }) => (isActive ? changeBtn : {})}
                />
                <p className="mypagetools">작업내역</p>
              </NavLink>
            </div>
            <div>
              <NavLink
                to={"/MypageCustom"}
                className="mypagecustomer"
                style={({ isActive }) => (isActive ? changeBtn : {})}
              >
                <FontAwesomeIcon
                  icon={faCircle}
                  className="facirclewhite"
                  onClick={() => {
                    changeBtn();
                  }}
                />
                <p className="mypagecustomers">문의사항</p>
              </NavLink>
            </div>
            <div>
              <NavLink to={"/MypagePay"} className="mypagepay" style={({ isActive }) => (isActive ? changeBtn : {})}>
                <FontAwesomeIcon icon={faCircle} className="facirclewhite" />
                <p className="mypagepays">결재내역</p>
              </NavLink>
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