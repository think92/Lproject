import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./css/Editor.css";
import MainBar from "./MainBar";
import {
  faCar,
  faFaceSmile,
  faPhone,
  faSmoking,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

const Editor = () => {
  // const location = useLocation();
  // const [imageView, setImageView] = useState(location.state?.imageView || null);
  const [imageView, setImageView] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.style.backgroundColor = "black";
  }, []);

  const handleButtonClick = () => {
    if(fileInputRef.current){
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    // 
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageView(reader.result);
      }
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="editor-specific">
      <MainBar />
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      <section className="sec">
        <div className="buttons">
          <p className="auto">Auto Mosaic</p>
          <div className="li">
            <div className="types">
              <p>타입</p>
              <button className="type">
                <FontAwesomeIcon icon={faFaceSmile} />
              </button>
              <button className="type">
                <FontAwesomeIcon icon={faCar} />
              </button>
              <button className="type">
                <FontAwesomeIcon icon={faPhone} />
              </button>
              <button className="type">
                <FontAwesomeIcon icon={faSmoking} />
              </button>
            </div>
            <div className="types">
              <p>농도</p>
              <p>■■■■■■■■</p>
              <p>50%</p>
            </div>
            <div className="types">
              <p>모양</p>
              <button className="type">
                <FontAwesomeIcon icon={faSquare} />
              </button>
              <button className="type">■</button>
              <button className="type">■</button>
              <button className="type">■</button>
            </div>
            <div className="types">
              <p>모자이크 해제 대상</p>
              <button className="type">■</button>
            </div>
          </div>
          <p className="auto">User Mosaic</p>
          <div className="li">
            <div className="types">
              <p>모자이크 해제 대상</p>
              <button className="type">■</button>
            </div>
            <div className="types">
              <p>농도</p>
              <p>■■■■■■■■</p>
              <p>50%</p>
            </div>
            <div className="types">
              <p>모양</p>
              <button className="type">■</button>
              <button className="type">■</button>
              <button className="type">■</button>
              <button className="type">■</button>
            </div>
          </div>
          <div className="submits">
            <button onClick={handleButtonClick} className="submit active">
              사진/영상 업로드
            </button>
            <button className="submit">저장</button>
            <button className="submit">삭제</button>
          </div>
        </div>
        <div className="edit">
          {imageView ? <img src={imageView} alt="이미지" /> : <p>이미지</p>}
        </div>
      </section>
    </div>
  );
};

export default Editor;
