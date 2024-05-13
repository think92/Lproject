import React from "react";
import MainBar from "./MainBar";
import "./css/mainbar.css";
import "./css/Premium.css";

const Premium = () => {
  return (
    <div>
      <MainBar />
      <section className="premiumbody">
        <div className="premiumbox1">
          <div className="premiumbox3">
            <div>
              <h3 className="premium">프리미엄</h3>
              <h2 className="price">
                ￦ 3,300원<span className="pricekr"> (월 요금)</span>
              </h2>
            </div>
            <div className="listbox">
              <img src="./img/premium.png" className="premiumcheck" alt="check"></img>
              <p className="premiumlist">
                사진 업로드 <span className="free"> Free</span>
              </p>
            </div>

            <div className="listbox">
              <img src="./img/premium.png" className="premiumcheck" alt="check"></img>
              <p className="premiumlist">
                기능 사용 확장 <span className="free"> Free</span>
              </p>
            </div>

            <div className="listbox">
              <img src="./img/premium.png" className="premiumcheck" alt="check"></img>
              <p className="premiumlist">
                광고없이 <span className="free"> Free</span>
              </p>
            </div>

            <button className="approval">결제하기</button>
          </div>
          <div className="premiumvideobox">
            <video controls poster="videos/Clouds.png" className="premiumvideo">
							<source src="videos/Clouds.mp4" type="video/mp4" />
						</video>
          </div>

          <span className="premiumbox2">
            <h1 className="premiumservice">프리미엄 서비스</h1>
          </span>

        </div>
      </section>
    </div>
  );
};

export default Premium;
