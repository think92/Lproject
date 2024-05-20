import React, { useContext, useEffect, useState } from "react";
import MainBar from "./MainBar";
import "./css/Customer.css";
import axios from "axios";
import Modal from "./component/Modal";
import ModalWrite from "./component/ModalWrite";
import { useNavigate } from "react-router-dom";
import { LoginUserContext } from "./context/LoginUserContent";

const Customer = () => {
  // 로그인한 회원 정보 저장하는 변수(아이디, 등급)
  const { login_id, setLogin_id, login_role, setLogin_role } =
    useContext(LoginUserContext);

  const navigate = useNavigate();

  // 데이터베이스 정보 불러오기
  const [inquiries, setInquiries] = useState([]); // 데이터를 저장할 상태

  const [searchTerm, setSearchTerm] = useState("");
  const [selectType, setSelectType] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [modalIsWriteOpen, setModalIsWriteOpen] = useState(false); // 모달 상태
  const [selectedInquiry, setSelectedInquiry] = useState(null); // 선택된 문의 상태
  const [waitingCount, setWaitingCount] = useState(0); // 대기 중인 문의 수
  const [todayCount, setTodayCount] = useState(0); // 오늘 등록된 문의 수

  // 페이지 버튼
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [currentGroup, setCurrentGroup] = useState(1); // 현재 페이지 그룹 상태
  const itemsPerPage = 10; // 페이지당 항목 수
  const pagesPerGroup = 5; // 그룹당 페이지 수

  useEffect(() => {
    boardList();
    // console.log("length : ", inquiri);
  }, []);
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

  //날짜 변경하기
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

  console.log("모달1 : ", modalIsOpen);
  console.log("모달2 : ", modalIsWriteOpen);
  // 모달
  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalIsOpen(true);
  };

  // 작성하기 버튼 클릭 시 실행될 함수
  const handleWriteButtonClick = () => {
    console.log("작성하기 클릭!");
    // if (login_id) {
    setModalIsWriteOpen(true);
    // } else {
    //   alert("로그인이 필요합니다.");
    //   navigate("/Login");
    //   handleClick("로그인이 필요합니다.");
    // }
  };

  // 데이터를 필터링하고 정렬하는 함수
  const filterAndSortInquiries = (data) => {
    let filtered = data;

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

  // 작성하기 버튼 클릭 핸들러
  const handleClick = (message) => {
    console.log(message);
  };

  return (
    <div>
      <MainBar />
      <section className="customerbody">
        <div className="customerbox1">
          <div className="customertab">
            <div className="customerinquiry">
              <h1 className="customerinquirys">문의내역</h1>
              <div>
                <select name="choice" className="customerselectbox">
                  <option className="opt">- 문의 종류 -</option>
                  <option value="">전체</option>
                  <option value="">모자이크 관련</option>
                  <option value="">서비스 이용</option>
                  <option value="">프리미엄 결제</option>
                  <option value="">기타</option>
                  <option value="">신고</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="searchinput"
              />
              <button className="searchbtn">검색</button>
            </div>
            <table className="customertable">
              <thead>
                <tr>
                  <th className="customernum">번호</th>
                  <th className="customerdivison">문의제목</th>
                  <th className="customerwriter">작성자</th>
                  <th className="customerdate">작성일시</th>
                  <th className="customeranswer">답변</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((inquiry) => (
                  <tr key={inquiry.num}>
                    <td className="customernums">{inquiry.qstn_idx}</td>
                    <td
                      className="customerdivisons"
                      onClick={() => openModal(inquiry)}
                    >
                      {inquiry.qstn_open === "N" && (
                        <div>
                          <img
                            src="./img/secured-lock.png"
                            className="lockicon"
                            alt="잠금"
                          ></img>
                          비공개된 글 입니다.
                        </div>
                      )}
                      {inquiry.qstn_open !== "N" && (
                        <div>{inquiry.qstn_title}</div>
                      )}
                    </td>
                    <td className="customerwriters">{inquiry.mb_email}</td>
                    <td className="customerdates">
                      {formatDate(inquiry.questioned_at)}
                      {/* {inquiry.questioned_at} */}
                    </td>
                    <td
                      className={
                        inquiry.qstn_answer === "N" ? "redText" : "blackText"
                      }
                    >
                      {inquiry.qstn_answer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {modalIsOpen && (
              <Modal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                inquiry={selectedInquiry}
              />
            )}
            {modalIsWriteOpen && (
              <ModalWrite
                isOpen={modalIsWriteOpen}
                onClose={() => setModalIsWriteOpen(false)}
              />
            )}

            {/* 페이지 버튼 */}
            <div className="paginations">
              <div></div>
              <div className="ss">
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
              {/* 작성하기 버튼 */}
              <div className="customerwrite">
                <button
                  id="bt"
                  className="customerwrites"
                  onClick={handleWriteButtonClick}
                >
                  작성하기
                </button>
              </div>
            </div>
          </div>

          <span className="customerbox2">
            <h1 className="customerservice">고객센터</h1>
          </span>
        </div>
      </section>
    </div>
  );
};

export default Customer;
