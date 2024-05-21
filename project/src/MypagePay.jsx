import React, {useState, useEffect} from "react";
import "./css/MypagePay.css";
import MypageBar from "./MypageBar";
import axios from "axios";

const MypagePay = () => {
  const [payHistory, setPayHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayHistory = async () => {
      try {
        const formData = new FormData();
        formData.append("mb_email", sessionStorage.getItem("mb_email"));
        const response = await axios
          .post("http://localhost:8083/MemApi/MypagePay", formData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          // .then((res) => {
          //   console.log(res.data);
          // });
          setPayHistory(response.data);
      } catch(err) {
        console.error("Error fetching payment history:", err);
        setError("결제 내역을 가져오는데 실패했습니다. 다시 시도해 주세요.");
      }
    };

    fetchPayHistory();
  }, []);

  if(error) {
    return <div>{error}</div>
  }



  return (
    <div>
      <MypageBar />
      <section className="mypagePay">
        <div className="PayBody">
          <p className="PayList">결재내역</p>
          <hr className="Paytoolhr" />
          <div className="PayBodys">
            <div className="PayContainer">
              <input type="date" i="date" className="PayDate"></input>
              <div className="PayDateBoxContainer">
                {payHistory.length > 0 ? (
                  payHistory.map((payment, index) => (
                <div className="PayDateBox">
                  <p className="PayDates">{payment.date}</p>
                  <p className="PaySuccess">
                    결재완료<span className="Pays">{payment.amount}원</span>
                  </p>
                  <p className="paySuccess">
                    블러블라 프리미엄<span className="pays">{payment.amount}</span>
                  </p>
                  <div className="PayBox">
                    <p className="payCash">현금영수증</p>
                    <p className="payCheck">거래확인증</p>
                  </div>
                  <hr />
                </div>

                  ))
                ) : (
                  <p>결제 내역이 없습니다.</p>
                )}

                {/* <div className="PayDateBox">
                  <p className="PayDates">2024.3.24. 오후 1:37</p>
                  <p className="PaySuccess">
                    결재완료<span className="Pays">3,300원</span>
                  </p>
                  <p className="paySuccess">
                    블러블라 프리미엄<span className="pays">3,300원</span>
                  </p>
                  <div className="PayBox">
                    <p className="payCash">현금영수증</p>
                    <p className="payCheck">거래확인증</p>
                  </div>
                  <hr />
                </div>

                <div className="PayDateBox">
                  <p className="PayDates">2024.2.24. 오후 1:02</p>
                  <p className="PaySuccess">
                    결재완료<span className="Pays">3,300원</span>
                  </p>
                  <p className="paySuccess">
                    블러블라 프리미엄<span className="pays">3,300원</span>
                  </p>
                  <div className="PayBox">
                    <p className="payCash">현금영수증</p>
                    <p className="payCheck">거래확인증</p>
                  </div>
                  <hr />
                </div>

                <div className="PayDateBox">
                  <p className="PayDates">2024.1.24. 오전 9:26</p>
                  <p className="PaySuccess">
                    결재완료<span className="Pays">3,300원</span>
                  </p>
                  <p className="paySuccess">
                    블러블라 프리미엄<span className="pays">3,300원</span>
                  </p>
                  <div className="PayBox">
                    <p className="payCash">현금영수증</p>
                    <p className="payCheck">거래확인증</p>
                  </div>
                  <hr />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MypagePay;
