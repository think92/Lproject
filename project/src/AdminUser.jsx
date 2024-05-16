import React, { useEffect, useState } from "react";
import AdminMinBar from "./AdminMainBar";
import "./css/adminUser.css";
import Modal from "./component/Modal"; // 모달 컴포넌트 임포트

const AdminUser = () => {
  // 검색창 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [selectType, setSelectType] = useState("");
  const [users, setUsers] = useState([]); // 데이터를 저장할 상태
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 문의 상태

  const initialUsers = [
    {
      id: 1,
      userId: "user123",
      grade: "신규회원",
      joinDate: "2023-01-15",
      paymentDate: "2024-05-10",
    },
    {
      id: 2,
      userId: "user456",
      grade: "일반회원",
      joinDate: "2022-11-23",
      paymentDate: "2024-04-20",
    },
    {
      id: 3,
      userId: "user789",
      grade: "프리미엄회원",
      joinDate: "2023-02-10",
      paymentDate: "2024-03-15",
    },
    {
      id: 4,
      userId: "user101",
      grade: "일반회원",
      joinDate: "2021-08-05",
      paymentDate: "2024-01-25",
    },
  ];

  // 데이터를 필터링하고 정렬하는 함수
  const filterAndSortUsers = () => {
    let filtered = initialUsers.filter((user) => {
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
    filterAndSortUsers(); // 초기 로드 시 필터 및 정렬 실행
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

  const openModal = (user) => {
    setSelectedUser(user);
    setModalIsOpen(true);
  };

  return (
    <div className="admin">
      <AdminMinBar />
      <div className="start">
        <div className="startIn">
          <h1 className="startTitle">회원 관리</h1>
          <hr />
          <div className="summaryDetails">
            <h1 className="aa">전체회원 <span className="bb">00</span>명</h1>
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
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.userId}</td>
                    <td>{user.grade}</td>
                    <td>{user.joinDate}</td>
                    <td>{user.paymentDate}</td>
                    <td>
                      <button onClick={() => openModal(user)}>수정</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal
            isOpen={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
            user={selectedUser}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminUser;
