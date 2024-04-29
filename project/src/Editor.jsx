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

const Editor = () => {
  const fileInputRef = useRef(null);
  const [imageView, setImageView] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    document.body.style.backgroundColor = "black";
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    e.preventDefault();

    const files = Array.from(e.target.files);
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(
      (newImages) => {
        setImages((prevImages) => [...prevImages, ...newImages]);
        if (newImages.length > 0) {
          setImageView(newImages[0]);
        }
      },
      (error) => {
        console.error("Error loading images : ", error);
      }
    );
  };

  const selectImage = (image) => {
    setImageView(image);
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
          {imageView ? (
            <img src={imageView} alt="Selected" />
          ) : (
            <p>이미지를 선택하세요</p>
          )}
        </div>
        <div className="imgSaves">
          {images.map((image, index) => (
            <div
              key={index}
              className="imgsave"
              onClick={() => selectImage(image)}
            >
              <img src={image} alt={`이미지 ${index + 1}`}></img>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Editor;
