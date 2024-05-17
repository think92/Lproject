import React, { useEffect, useState } from "react";
import AdminMinBar from "./AdminMainBar";
import "./css/adminInquiry.css";
import Modal from "./component/Modal"; // 모달 컴포넌트 임포트
import axios from "axios";

const AdminInquiry = () => {
  // 검색창 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [selectType, setSelectType] = useState("");
  const [inquiries, setInquiries] = useState([]); // 데이터를 저장할 상태
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [selectedInquiry, setSelectedInquiry] = useState(null); // 선택된 문의 상태
  const [waitingCount, setWaitingCount] = useState(0); // 대기 중인 문의 수
  const [todayCount, setTodayCount] = useState(0); // 오늘 등록된 문의 수

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [currentGroup, setCurrentGroup] = useState(1); // 현재 페이지 그룹 상태
  const itemsPerPage = 10; // 페이지당 항목 수
  const pagesPerGroup = 5; // 그룹당 페이지 수

  useEffect(() => {
    qntnsList(); // 문의사항 데이터 가져오기
  }, []);

  const qntnsList = () => {
    axios
      .post("http://localhost:8083/AdmApi/adminInquiry")
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
      if (a.qstn_open === "N" && b.qstn_open !== "N") {
        return -1;
      } else if (b.qstn_open === "N" && a.qstn_open !== "N") {
        return 1;
      } else if (a.qstn_open === "N" && b.qstn_open === "N") {
        return new Date(a.questioned_at) < new Date(b.questioned_at) ? -1 : 1;
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

  const handleSearch = () => {
    filterAndSortInquiries(inquiries); // 검색 실행 시 필터 및 정렬 실행
  };

  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalIsOpen(true);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
    <div className="admin">
      <AdminMinBar />
      <div className="start">
        <div className="startIn">
          <h1 className="startTitle">문의사항 관리</h1>
          <hr />
          <div className="summaryDetails">
            <div className="detailBorder">
              <p className="newTitle">문의 등록</p>
              <p className="newCount">
                <span className="newConutI">{todayCount}</span>건
              </p>
            </div>
            <div className="detailBorder">
              <p className="addC">문의 대기</p>
              <p className="addCount">
                <span className="addConutI">{waitingCount}</span>건
              </p>
            </div>
          </div>
          <hr />
          <div className="buttonss">
            <button className="delete">삭제</button>
            <div className="seletes">
              <select className="select" name="select">
                <option value="">- 문의 종류 -</option>
                <option value="">전체</option>
                <option value="">모자이크 관련</option>
                <option value="">서비스 이용</option>
                <option value="">프리미엄 결제</option>
                <option value="">기타</option>
                <option value="">신고</option>
              </select>
              <select
                className="select"
                name="select"
                value={selectType}
                onChange={handleSelectTypeChange}
              >
                <option value="">- 항목 -</option>
                <option value="mb_email">아이디</option>
                <option value="qstn_title">문의제목</option>
                <option value="questioned_at">문의일시</option>
                <option value="qstn_open">답변유무</option>
                <option value="answerDate">답변일시</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={handleInputChange}
              />
              <button className="delete" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>선택</th>
                  <th>번호</th>
                  <th>문의제목</th>
                  <th>아이디</th>
                  <th>문의일시</th>
                  <th>답변유무</th>
                  <th>답변일시</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((inquiry, index) => (
                  <tr key={indexOfFirstItem + index}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td
                      className="clickable "
                      onClick={() => openModal(inquiry)}
                    >
                      {inquiry.qstn_title}
                    </td>
                    <td>{inquiry.mb_email}</td>
                    <td>{formatDate(inquiry.questioned_at)}</td>
                    <td
                      className={inquiry.qstn_answer === "N" ? "red-text" : ""}
                    >
                      {inquiry.qstn_answer === "N" ? "대기 중" : "답변 완료"}
                    </td>
                    <td>
                      {inquiry.answerDate
                        ? formatDate(inquiry.answerDate)
                        : "미답변"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <Modal
            isOpen={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
            inquiry={selectedInquiry}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminInquiry;
