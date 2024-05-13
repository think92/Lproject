import React from "react";
import "./css/MypageCustom.css";
import MypageBar from "./MypageBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

const MypageCustom = () => {
  return (
    <div>
      <MypageBar />
      <section className="mypageCustom">
        <div className="CustomBody">
          <p className="CustomList">문의사항</p>
          <hr className="Customtoolhr" />
          <div className="CustomLists">
            <div>
              <button className="CustomDelete">삭제</button>
            </div>
            <div>
              <select name="choice" className="CustomChoiceBox">
                <option className="opt">전체</option>
                <option>모자이크 관련</option>
                <option>서비스 이용</option>
                <option>프리미엄 결제</option>
                <option>기타</option>
                <option>신고</option>
              </select>
            </div>
            <div>
              <select name="choice" className="CustomChoiceBoxs">
                <option className="opt">전체</option>
                <option>아이디</option>
                <option>문의내용</option>
                <option>작성일시</option>
                <option>답변유무</option>
                <option>답변일시</option>
              </select>
            </div>
            <div>
              <button className="CalendarBox">
                <FontAwesomeIcon icon={faCalendarDays} className="Calendar" />
              </button>
            </div>
            <div className="customSearch">
              <input
                type="text"
                placeholder="검색"
                className="searchInput"
              ></input>
              <button className="searchBtn">
                <img
                  src="./img/search.png"
                  className="searchIcon"
                  alt="검색"
                ></img>
              </button>
            </div>
          </div>
          <table className="customTable">
            <thead>
              <tr>
                <th className="customCheck">선택</th>
                <th className="customNum">번호</th>
                <th className="customDivison">문의제목</th>
                <th className="customWriter">작성자</th>
                <th className="customDate">작성일시</th>
                <th className="customAnswer">답변</th>
                <th className="customAnswerDate">답변일시</th>
              </tr>
            </thead>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MypageCustom;
