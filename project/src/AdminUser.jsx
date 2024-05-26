import React, { useEffect, useState } from "react";
import AdminMinBar from "./AdminMainBar";
import "./css/adminUser.css";
import Filter from "./component/Filter";
import axios from "axios";

const AdminUser = () => {
  // 검색창 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [selectType, setSelectType] = useState("");
  const [users, setUsers] = useState([]); // 데이터를 저장할 상태
  const [editingUserId, setEditingUserId] = useState(null); // 수정 중인 사용자 ID
  const [updatedGrade, setUpdatedGrade] = useState(""); // 업데이트된 등급

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [currentGroup, setCurrentGroup] = useState(1); // 현재 페이지 그룹 상태
  const itemsPerPage = 8; // 페이지당 항목 수
  const pagesPerGroup = 5; // 그룹당 페이지 수

  // 데이터를 필터링하고 정렬하는 함수
  const filterAndSortUsers = () => {
    let filtered = users.filter((user) => {
      if (selectType && searchTerm) {
        return user[selectType]
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
      return true;
    });

    setUsers(filtered);
  };

  useEffect(() => {
    adminUser(); // 회원 정보 리스트
  }, []);

  const handleSelectTypeChange = (event) => {
    setSelectType(event.target.value);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    filterAndSortUsers(); // 검색 실행 시 필터 및 정렬 실행
  };
  const handleEditClick = (user) => {
    setEditingUserId(user.mb_email);
    setUpdatedGrade(user.mb_role);
  };

  const handleGradeChange = (event) => {
    setUpdatedGrade(event.target.value);
  };

  const handleSaveClick = (user) => {
    console.log("등급 변경!", user);
    const meFormDate = new FormData();
    meFormDate.append("mb_role", updatedGrade);
    meFormDate.append("mb_email", editingUserId);

    axios
      .post(
        `http://${process.env.REACT_APP_IP}:8083/AdmApi/memberRoleUpdate`,
        meFormDate,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // res.data가 유효한지 확인
        console.log(res.data);
      })
      .catch((err) => {
        console.error("API 요청 실패:", err);
        setUsers([]); // 오류 발생 시 빈 배열 설정
      });

    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.mb_email === user.mb_email ? { ...u, mb_role: updatedGrade } : u
      )
    );
    setEditingUserId(null);
  };

  const adminUser = () => {
    axios
      .post(`http://${process.env.REACT_APP_IP}:8083/AdmApi/adminUser`)
      .then((res) => {
        // res.data가 유효한지 확인
        console.log(res);
        const data = res.data;
        if (Array.isArray(data)) {
          // 가입일시로 정렬(최신 가입 순)
          const sortedData = data.sort(
            (a, b) => new Date(b.joinedAt) - new Date(a.joinedAt)
          );
          setUsers(sortedData);
        } else {
          console.error("API 응답 데이터가 배열이 아닙니다:", data);
          setUsers([]); // 기본값으로 빈 배열 설정
        }
      })
      .catch((err) => {
        console.error("API 요청 실패:", err);
        setUsers([]); // 오류 발생 시 빈 배열 설정
      });
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
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호 계산
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const totalGroups = Math.ceil(totalPages / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="admin">
      <AdminMinBar />
      <div className="start">
        <div className="startIn">
          <h1 className="startTitle">회원 관리</h1>
          <hr />
          <div className="summaryDetails">
            <h1 className="aa">
              전체회원 <span className="bb">{users.length}</span>명
            </h1>
          </div>
          <hr />
          <div className="buttonss">
            <div></div>
            <div className="seletes">
              <select
                className="select"
                name="select"
                value={selectType}
                onChange={handleSelectTypeChange}
              >
                <option value="">- 항목 -</option>
                <option value="">전체</option>
                <option value="userId">아이디</option>
                <option value="joinDate">가입일시</option>
                <option value="grade">등급</option>
                <option value="paymentDate">결제일시</option>
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
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>아이디</th>
                  <th>등급</th>
                  <th>가입일시</th>
                  <th>프리미엄 결재일시</th>
                  <th>정보수정</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user, index) => (
                  <tr key={user.mb_email}>
                    <td>{users.length - indexOfFirstItem - index}</td>
                    <td>{user.mb_email}</td>
                    <td>
                      {editingUserId === user.mb_email ? (
                        <select
                          className="styled-select"
                          value={updatedGrade}
                          onChange={handleGradeChange}
                        >
                          <option value="A0" className="new-member">
                            관리자
                          </option>
                          <option value="M" className="regular-member">
                            일반회원
                          </option>
                          <option value="U" className="premium-member">
                            프리미엄회원
                          </option>
                        </select>
                      ) : (
                        user.mb_role
                      )}
                    </td>
                    <td>{formatDate(user.joinedAt)}</td>
                    <td>{user.answered_at}</td>
                    <td>
                      {editingUserId === user.mb_email ? (
                        <button onClick={() => handleSaveClick(user)}>
                          완료
                        </button>
                      ) : (
                        <button onClick={() => handleEditClick(user)}>
                          수정
                        </button>
                      )}
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
        </div>
      </div>
    </div>
  );
};

export default AdminUser;
