import React from "react";
import "./css/MypagePay.css";
import MypageBar from "./MypageBar";

const MypagePay = () => {
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
                <div className="PayDateBox">
                  <p className="PayDates">2024.4.24. 오전 9:23</p>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MypagePay;
