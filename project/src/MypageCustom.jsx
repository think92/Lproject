import React, { useContext, useEffect, useState } from "react";
import "./css/MypageCustom.css";
import MypageBar from "./MypageBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Modal from "./component/Modal";
import { LoginUserContext } from "./context/LoginUserContent";

const MypageCustom = () => {
  // 데이터베이스 정보 불러오기
  const [inquiries, setInquiries] = useState([]); // 데이터를 저장할 상태
  const [filteredInquiries, setFilteredInquiries] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectType, setSelectType] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [selectedInquiry, setSelectedInquiry] = useState(null); // 선택된 문의 상태
  const [waitingCount, setWaitingCount] = useState(0); // 대기 중인 문의 수
  const [todayCount, setTodayCount] = useState(0); // 오늘 등록된 문의 수

  // 페이지 버튼
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [currentGroup, setCurrentGroup] = useState(1); // 현재 페이지 그룹 상태
  const itemsPerPage = 12; // 페이지당 항목 수
  const pagesPerGroup = 5; // 그룹당 페이지 수

  const { login_id } = useContext(LoginUserContext); // 로그인한 유저 아이디 가져오기

  useEffect(() => {
    boardList();
    // console.log("length : ", inquiri);
  }, [login_id, searchTerm, selectType]);

  const boardList = () => {
    axios
      .post("http://localhost:8083/AdmApi/adminInquiry", {})
      .then((res) => {
        const data = Array.isArray(res.data.aQstnsList)
          ? res.data.aQstnsList
          : [];
        setInquiries(data); // 데이터를 상태에 저장
        filterAndSortInquiries(data); // 필터링 및 정렬 실행
        const waiting = data.filter(
          (inquiry) => inquiry.qstn_open === "N"
        ).length;
        setWaitingCount(waiting); // 대기 중인 문의 수 계산
        const today = new Date().toISOString().split("T")[0];
        const todayInquiries = data.filter(
          (inquiry) => inquiry.questioned_at.split("T")[0] === today
        ).length;
        setTodayCount(todayInquiries); // 오늘 등록된 문의 수 계산
        console.log(data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
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

  // 모달
  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalIsOpen(true);
  };

  // 데이터를 필터링하고 정렬하는 함수
  const filterAndSortInquiries = (data) => {
    let filtered = data.filter(
      (inquiry) => inquiry.mb_email === sessionStorage.getItem("mb_email")
    );

    if (selectType && searchTerm) {
      filtered = filtered.filter((inquiry) =>
        inquiry[selectType]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

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

    setInquiries(filtered);
  };

  const handleSelectTypeChange = (event) => {
    setSelectType(event.target.value);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextGroup = () => {
    setCurrentGroup(currentGroup + 1);
    setCurrentPage((currentGroup - 1) * pagesPerGroup + 1);
  };

  const handlePrevGroup = () => {
    setCurrentGroup(currentGroup - 1);
    setCurrentPage((currentGroup - 2) * pagesPerGroup + 1);
  };

  // 현재 페이지에 해당하는 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inquiries.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호 계산
  const totalPages = Math.ceil(inquiries.length / itemsPerPage);
  const totalGroups = Math.ceil(totalPages / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

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
                <option value="">전체</option>
                <option value="test_id">아이디</option>
                <option value="test_context">문의내용</option>
                <option value="createdAt">작성일시</option>
                <option value="answerStatus">답변유무</option>
                <option value="answeredAt">답변일시</option>
              </select>
            </div>
            {/* <div>
              <button className="CalendarBox">
                <FontAwesomeIcon icon={faCalendarDays} className="Calendar" />
              </button>
            </div> */}
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
              <button className="searchBtn" onClick={filterAndSortInquiries}>
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
              {currentItems.map(
                (inquiry, index) =>
                  index < 12 && (
                    <tr key={inquiry.num}>
                      <td>
                        <input type="checkbox"></input>
                      </td>
                      <td>{indexOfFirstItem + index + 1}</td>
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
            isAdmin={false} // 고객 페이지에서는 관리자 모드를 false로 설정
            isMypageCustomer={true} // 마이페이지 고객 모달로 설정
          />
          <div className="pagination">
            {currentGroup > 1 && (
              <button onClick={handlePrevGroup}>{"<"}</button>
            )}
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={currentPage === number ? "active" : ""}
              >
                {number}
              </button>
            ))}
            {currentGroup < totalGroups && (
              <button onClick={handleNextGroup}>{">"}</button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default MypageCustom;
