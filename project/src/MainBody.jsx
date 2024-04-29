import React, { useEffect, useRef, useState } from "react";
import MainBar from "./MainBar";
import "./css/mainbar.css";
import "./css/mainbody.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faSliders,
  faShapes,
} from "@fortawesome/free-solid-svg-icons";

const MainBody = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [imageView, setImageView] = useState(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setImageView(reader.result);
    };
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        navigate("/Editor", { state: { imageView: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="body">
      <MainBar />
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      <section>
        <div id="upload">
          <div className="uploadbackground1">
            <div className="uploadbackground2">
              <div className="uploadtext">
                <h1>무료 온라인 모자이크 에디터</h1>
                <p>Blurbla(블러블라) 무료 온라인 모자이크 에디터로</p>
                <p>사진 및 동영상을 손쉽게 모자이크 처리 할 수 있습니다.</p>
                <br />
                <br />
                <Link onClick={handleButtonClick} to={"/Editor"}>
                  이미지/영상업로드
                </Link>
              </div>

              <div className="uploadimg">
                <img src="img/main_img01.png" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div id="intro1">
          <div className="introtitle">
            <h1>
              Blurbla(블러블라)무료 모자이크
              <br />
              에디터로 빠르게 모자이크 처리
            </h1>
          </div>
          <div className="introbox">
            <div className="iconbox">
              <p>
                <FontAwesomeIcon icon={faCloudArrowUp} className="loadicon" />
              </p>
            </div>
            <div className="introtext">
              <h3>즉시 업로드</h3>
              <p>
                이미지를 편집기로 끌어다 놓기만 하면
                <br />
                바로 편집을 시작할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="introbox">
            <div className="iconbox">
              <p>
                <FontAwesomeIcon icon={faShapes} className="loadicon" />
              </p>
            </div>
            <div className="introtext">
              <h3>사진/영상 모자이크</h3>
              <p>
                이미지, 영상을 원하는 부분을 선택하거나
                <br />
                AI기능을 사용해서 모자이크 처리 할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="introbox">
            <div className="iconbox">
              <p>
                <FontAwesomeIcon icon={faSliders} className="loadicon" />
              </p>
            </div>
            <div className="introtext">
              <h3>필터 및 조정</h3>
              <p>
                모자이크를 다양한 농도와 모양을 선택하여
                <br />
                사용자가 원하는 결과를 만들 수 있습니다.
              </p>
            </div>
          </div>
        </div>
        <div id="intro2">
          <img src="./img/main_img02.png" />
        </div>
      </section>
    </div>
  );
};

export default MainBody;
