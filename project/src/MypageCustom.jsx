import React, { useEffect, useState } from "react";
import "./css/MypageCustom.css";
import MypageBar from "./MypageBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Modal from "./component/Modal";

const pagesize = 10; // 12개 게시물 이상일때 다음 페이지로 이동

const MypageCustom = () => {
  // 데이터베이스 정보 불러오기
  const [inquiri, setInquiri] = useState([]);
  const [inquirilength, setInquiriLength] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectType, setSelectType] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [selectedInquiry, setSelectedInquiry] = useState(null); // 선택된 문의 상태

  useEffect(() => {
    boardList();
    console.log("length : ", inquiri);
  }, []);

  const boardList = () => {
    axios
      .post("http://localhost:8083/AdmApi/adminInquiry", {})
      .then((res) => {
        setInquiri(res.data.aQstnsList);
        setInquiriLength(res.data.length);
        console.log(res.data);
      })
      .catch((res) => {
        // console.log("fail:",inquiri.length);
      });
      
  };

  // 날짜 변경하기
  const formatDate = (dateString) => {
    if (!dateString) return ""; // null 또는 undefined 처리
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // 유효하지 않은 날짜 처리
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:00`;
  };

  // 페이지 버튼
  const [currentPage, setCurrenPage] = useState(1); // 현재 페이지 상태
  const [currentGroup, setCurrenGroup] = useState(1); // 현재 페이지 그룹 상태

  const totalPages = Math.ceil(inquirilength / pagesize); // 총 페이지 수
  const totalGroups = Math.ceil(totalPages / 3); // 그룹당 3개 페이지

  const startIndex = (currentPage - 1) * pagesize;
  const dispalyedInquiries = inquiri
    .sort((a, b) => b.qstn_idx - a.qstn_idx)
    .slice(startIndex, startIndex + pagesize);
  const handlePreviousGroup = () => {
    if (currentGroup > 1) {
      setCurrenPage(currentGroup - 1); // 이전 그룹으로
      setCurrenGroup((currentGroup - 2) * 3 + 1); // 그룸의 첫 페이지로 이동
    }
  };

  const handleNextGroup = () => {
    if (currentGroup < totalGroups) {
      setCurrenPage(Math.ceil(currentPage / 3) * 4); // 0으로 세팅하고 3 곱하기 페이징
      setCurrenGroup(Math.ceil(currentPage / 3 + 1)); // 그룹의 다음 첫 페이지
    }
  };

  const handlePageClick = (page) => {
    setCurrenPage(page);
  };

  const getCurrentGroupPages = () => {
    const start = (currentGroup - 1) * 3 + 1; // 그룹의 첫 페이지 번호
    const end = Math.min(start + 2, totalPages); // 그룹의 마지막 페이지 번호
    console.log("start, end        : ", start, end);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // 모달
  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalIsOpen(true);
  };

  // 데이터를 필터링하고 정렬하는 함수
  const filterAndSortInquiries = () => {
    let filtered = dispalyedInquiries.map((inquiry) => {
      if (selectType && searchTerm) {
        return inquiry[selectType]
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
      return true;
    });

    // "대기 중" 상태가 같은 경우, 날짜를 비교하여 오래된 문의를 상위에 배치
    filtered.sort((a, b) => {
      if (a.answerStatus === "N" && b.answerStatus !== "N") {
        return -1;
      } else if (b.answerStatus === "N" && a.answerStatus !== "N") {
        return 1;
      } else if (a.answerStatus === "N" && b.answerStatus === "N") {
        return a.inquiryDate < b.inquiryDate ? -1 : 1;
      }
      return 0;
    });

    setInquiri(filtered);
  };
  useEffect(() => {
    filterAndSortInquiries();
  }, []);

  const handleSelectTypeChange = (event) => {
    setSelectType(event.target.value);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    filterAndSortInquiries(); // 검색 실행 시 필터 및 정렬 실행
  };


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
                <option className="opt">- 문의 종류 -</option>
                <option>전체</option>
                <option>모자이크 관련</option>
                <option>서비스 이용</option>
                <option>프리미엄 결제</option>
                <option>기타</option>
                <option>신고</option>
              </select>
            </div>
            <div>
              <select
                name="choice"
                className="CustomChoiceBoxs"
                value={selectType}
                onChange={handleSelectTypeChange}
              >
                <option className="opt">- 항목 -</option>
                <option>전체</option>
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
            <div>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="customSearch"
                value={searchTerm}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <button className="searchBtn" onClick={boardList}>
                검색
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
            <tbody>
              {dispalyedInquiries.map(
                (inquiry, index) =>
                  index < 12 && (
                    <tr key={inquiry.num}>
                      <td>
                        <input type="checkbox"></input>
                      </td>
                      <td>{inquiry.qstn_idx}</td>
                      <td
                        className="CustomNum"
                        onClick={() => openModal(inquiry)}
                      >
                        {inquiry.qstn_title}
                      </td>
                      <td>{inquiry.mb_email}</td>
                      <td>
                        {formatDate(inquiry.questioned_at)}
                        {/* {inquiry.questioned_at} */}
                        </td>
                      <td
                        className={
                          inquiry.qstn_open === "N" ? "redText" : "blackText"
                        }
                      >
                        {inquiry.qstn_open}
                      </td>
                      <td>답변일시</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
          <Modal
            isOpen={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
            inquiry={selectedInquiry}
          />
          <div className="CustomArrow">
            <div>
              <button
                className="mypageArrowBtn"
                onClick={handlePreviousGroup}
                disabled={currentGroup <= 1}
              >
                <img
                  src="./img/arrow-circle-left-black.png"
                  className="arrowLeftIcon"
                  alt="이전 그룹"
                ></img>
              </button>
            </div>

            {/* 페이지 번호 버튼 생성 */}
            <div className="pageNum">
              {getCurrentGroupPages().map((page) => (
                <button
                  className="pageNums"
                  key={page}
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <div>
              <button
                className="mypageArrowBtn"
                onClick={handleNextGroup}
                disabled={currentGroup >= totalGroups}
              >
                <img
                  src="./img/arrow-circle-right-black.png"
                  className="arrowRightIcon"
                  alt="다음 페이지"
                ></img>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default MypageCustom;
