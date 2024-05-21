import "./css/Editor.css";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainBar from "./MainBar";
import axios from "axios";
import {
  faCar,
  faFaceSmile,
  faPhone,
  faSmoking,
  faVectorSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faSquare, faCircle } from "@fortawesome/free-regular-svg-icons";
import { useLocation } from "react-router-dom";
// import AWS from "aws-sdk";

const Editor = () => {
  const fileInputRef = useRef(null);
  const [mediaView, setMediaView] = useState(null);
  const [medias, setMedias] = useState([]);
  const [intensityAuto, setIntensityAuto] = useState(50);
  const [intensity, setIntensity] = useState(50);
  const [updatedAreas, setUpdatedAreas] = useState([]);
  const location = useLocation();
  const [activeTool, setActiveTool] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [dragStart, setDragStart] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [faceButtonTrue, setFaceButtonTrue] = useState(false);
  const [cigarButtonTrue, setCigarButtonTrue] = useState(false);
  const [carNumButtonTrue, setCarNumButtonTrue] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]); // 선택된 영역
  const [activeArea, setActiveArea] = useState(null);

  ///////////////AWS S3설정/////////////
  // AWS.config.update({
  //   accessKeyId: "",
  //   secretAccessKey: "",
  //   region: "",
  // });

  // const s3 = new AWS.S3();

  // S3 업로드 함수
  // const uploadToS3 = async (file, key) => {
  //   const params = {
  //     Bucket: "",
  //     Key: key,
  //     Body: file,
  //     ContentType: file.type,
  //   };

  //   try {
  //     const data = await s3.upload(params).promise();
  //     console.log("Upload Success", data.Location);
  //   } catch (err) {
  //     console.log("Upload Error", err);
  //   }
  // };

  // const handleSubmit = async () => {
  //   if (!imageView) return;

  //   const response = await fetch(imageView);
  //   const blob = await response.blob();
  //   const imageFile = new File([blob], "imageView.png", { type: "image/png" });
  //   await uploadToS3(imageFile, "imageView.png");

  //   updatedAreas.forEach(async (area, index) => {
  //     const { imageData } = area;
  //     if (!imageData) return; // imageData가 존재하는지 확인

  //     const canvas = document.createElement("canvas");
  //     canvas.width = imageData.width;
  //     canvas.height = imageData.height;
  //     const ctx = canvas.getContext("2d");
  //     ctx.putImageData(imageData, 0, 0);

  //     canvas.toBlob(async (blob) => {
  //       const file = new File([blob], `area-${index}.png`, {
  //         type: "image/png",
  //       });
  //       await uploadToS3(file, `area-${index}.png`);
  //     }, "image/png");
  //   });
  // };

  useEffect(() => {
    console.log("Location state on editor load:", location.state);
    if (location.state?.images) {
      setMedias(location.state.medias);
      setMediaView(location.state.medias[0]);
    } else {
      console.error("No images passed in state.");
    }
  }, [location.state]);

  useEffect(() => {
    if (!mediaView) return;
    const image = new Image();
    image.src = mediaView;
    image.onload = () => {
      imageRef.current = image;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      updatedAreas.forEach((area) => {
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.strokeRect(area.x, area.y, area.width, area.height);
      });
    };
  }, [mediaView, updatedAreas]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          reject(error);
        };
        if(file.type.startsWith("image/")){
          reader.readAsDataURL(file);
        } else if (file.type.startsWith("video/")){
          resolve(URL.createObjectURL(file))
        }
      });
    });
    Promise.all(promises).then(
      (newMedias) => {
        setMedias((prevMedias) => [...prevMedias, ...newMedias]);
        if (newMedias.length > 0) {
          setMediaView(newMedias[0]);
        }
      },
      (error) => {
        console.error("Error loading images : ", error);
      }
    );
  };

  const selectMedia = (event, media) => {
    event.stopPropagation();
    setMediaView(media);
    setUpdatedAreas([]);
  };

  const handleRemoveImage = (event, index) => {
    event.stopPropagation();
    setMedias((prevMedias) => {
      const filteredMedias = prevMedias.filter((_, idx) => idx !== index);
      if (index === 0 && filteredMedias.length > 0) {
        setMediaView(filteredMedias[0]);
      } else if (filteredMedias.length === 0) {
        setMediaView(null);
      }
      return filteredMedias;
    });
  };

  function handleMouseDown(e) {
    if (!activeTool) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    setDragStart({ x: startX, y: startY });
    setDragging(true);
  }

  function handleMouseMove(e) {
    if (!dragging || !dragStart || !activeTool) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(
      imageRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.rect(dragStart.x, dragStart.y, endX - dragStart.x, endY - dragStart.y);
    ctx.stroke();
  }

  function handleMouseUp(e) {
    if (!dragging || !dragStart || !activeTool) {
      setDragging(false);
      return;
    }
    setDragging(false);
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    const newArea = {
      x: dragStart.x,
      y: dragStart.y,
      width: endX - dragStart.x,
      height: endY - dragStart.y,
    };
    const ctx = canvasRef.current.getContext("2d");
    const imageData = ctx.getImageData(
      newArea.x,
      newArea.y,
      newArea.width,
      newArea.height
    );
    if (activeTool === "moza") {
      const mosaicResult = applyMosaic(
        dragStart.x,
        dragStart.y,
        endX - dragStart.x,
        endY - dragStart.y,
        intensityAuto
      );
      if (mosaicResult) {
        setUpdatedAreas((prevAreas) => [...prevAreas, newArea]);
        const updatedMedias = medias.map((img) =>
          img === mediaView ? mosaicResult.mosaicImage : img
        );
        setMedias(updatedMedias);
        setMediaView(mosaicResult.mosaicImage);
      }
    } else if (activeTool === "except") {
      setUpdatedAreas((prevAreas) => [...prevAreas, { ...newArea, imageData }]);
    }
    setDragStart(null);
  }

  function applyMosaic(x, y, width, height, intensity) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
      const pixelSize = Math.max(1, Math.ceil((intensity / 100) * 30));
      for (let i = 0; i < width; i += pixelSize) {
        for (let j = 0; j < height; j += pixelSize) {
          averageColor(ctx, x + i, y + j, pixelSize);
        }
      }
      const dataUrl = canvas.toDataURL("image/png");
      return {
        mosaicImage: dataUrl,
        pixelSize: pixelSize,
      };
    } else {
      console.error("imgRef.current is not set");
      return null;
    }
  }

  function averageColor(ctx, x, y, size) {
    const imageData = ctx.getImageData(x, y, size, size);
    let r = 0,
      g = 0,
      b = 0,
      a = 0,
      count = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = (i * size + j) * 4;
        r += imageData.data[index];
        g += imageData.data[index + 1];
        b += imageData.data[index + 2];
        a += imageData.data[index + 3];
        count++;
      }
    }
    r /= count;
    g /= count;
    b /= count;
    a /= count;
    const averageColor = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(
      b
    )}, ${(a / 255).toFixed(2)})`;
    ctx.fillStyle = averageColor;
    ctx.fillRect(x, y, size, size);
  }

  const handleIntensityChange = (e) => {
    const newIntensity = parseInt(e.target.value);
    console.log("Slider Changed to", newIntensity);
    setIntensity(newIntensity);
    if (selectedAreas && selectedAreas.width > 0 && selectedAreas.height > 0) {
      applyMosaic(
        selectedAreas.x,
        selectedAreas.y,
        selectedAreas.width,
        selectedAreas.height,
        intensity
      );
    }
  };

  function handleCanvasClick(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedArea = selectedAreas.find(
      (area) =>
        x >= area.x &&
        x <= area.x + area.width &&
        y >= area.y &&
        y <= area.y + area.height
    );

    setActiveArea(clickedArea);

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(
      imageRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    selectedAreas.forEach((area) => {
      if (area === clickedArea) {
        ctx.setLineDash([]);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 4;
      } else {
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
      }
      ctx.strokeRect(area.x, area.y, area.width, area.height);
    });
  }

  // 이미지 로컬 다운로드 함수 추가
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "mosaic-image.png";
    link.click();
  };

  // 이미지 업로드
  const uploadImage = async (imageDataUrl) => {
    try{
      const response = await axios.post('/api/upload', {image: imageDataUrl})
      return response.data;
    }catch(error) {
      console.error('Image upload failed:', error);
      return null;
    }
  }

  // 저장 버튼 클릭 핸들러 추가
  const handleSave = async () => {
    const canvas = canvasRef.current;
    if(!canvas) return;

    const imageDataUrl = canvas.toDataURL("image/png");

    // 이미지 다운로드
    downloadImage();

    // 이미지 서버 업로드
    const uploadResponse = await uploadImage(imageDataUrl);
    if(uploadResponse) {
      console.log('Image successfully uploaded:', uploadResponse);

      // 여기서 사용자 프로필을 업데이트하는 로직을 추가합니다.
      // 예: 사용자 상태를 업데이트하거나, Mypage.jsx에 이미지를 추가하는 등
    } else{
      console.log('Image upload failed');
    }
  }

  return (
    <div className="editor-specific">
      <MainBar />
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageChange}
        multiple
        accept="image/*, video/*"
      />

      <section className="sec">
        <div className="buttons">
          <p className="auto">Auto Mosaic</p>
          <div className="li">
            <div className="types">
              <p>타입</p>
              <button
                className="type"
                onClick={() => setFaceButtonTrue((prev) => !prev)}
              >
                <FontAwesomeIcon
                  style={{ color: faceButtonTrue ? "green" : "inherit" }}
                  icon={faFaceSmile}
                />
              </button>
              <button
                className="type"
                onClick={() => setCarNumButtonTrue((prev) => !prev)}
              >
                <FontAwesomeIcon
                  style={{ color: carNumButtonTrue ? "green" : "inherit" }}
                  icon={faCar}
                />
              </button>
              <button className="type">
                <FontAwesomeIcon icon={faPhone} />
              </button>
              <button
                className="type"
                onClick={() => setCigarButtonTrue((prev) => !prev)}
              >
                <FontAwesomeIcon
                  style={{ color: cigarButtonTrue ? "green" : "inherit" }}
                  icon={faSmoking}
                />
              </button>
            </div>
            <div className="types">
              <p>농도</p>
              <input
                type="range"
                min="0"
                max="100"
                value={intensityAuto}
                onChange={(e) => setIntensityAuto(e.target.value)}
                className="slider"
              />
              <p>{intensityAuto}%</p>
            </div>
            <div className="types1">
              <p>모양</p>
              <button className="typeshape">
                <FontAwesomeIcon icon={faSquare} />
              </button>
              <button className="typeshape">
                <FontAwesomeIcon icon={faCircle} />
              </button>
            </div>
            <div className="types2">
              <p>모자이크 해제 대상</p>
              <button
                className="typeclear except"
                onClick={() => setActiveTool("except")}
              >
                <FontAwesomeIcon icon={faVectorSquare} />
              </button>
            </div>
            <div>
              <button className="typeSubmit">적용하기</button>
            </div>
          </div>
          <p className="auto">User Mosaic</p>
          <div className="li2">
            <div className="types2">
              <p>모자이크 대상 선택</p>
              <button
                className="typeclear moza"
                onClick={() => setActiveTool("moza")}
              >
                <FontAwesomeIcon icon={faVectorSquare} />
              </button>
            </div>
            <div className="types">
              <p>농도</p>
              <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={handleIntensityChange}
                className="slider"
              />
              <p>{intensity}%</p>
            </div>
            <div className="types1">
              <p>모양</p>
              <button className="typeshape">
                <FontAwesomeIcon icon={faSquare} />
              </button>
              <button className="typeshape">
                <FontAwesomeIcon icon={faCircle} />
              </button>
            </div>
          </div>
          <div className="submits">
            <button onClick={handleButtonClick} className="submit active">
              사진/영상 업로드
            </button>
            <button className="submit" onClick={handleSave}>저장</button>
            <button className="submit">삭제</button>
          </div>
        </div>
        <div className="edit">
          {mediaView ? (
            <>
              {mediaView.startsWith("blob:")?(
                <video controls className="videoEdit">
                  <source src={mediaView} type="video/mp4" />
                </video>
              ) : (
                <canvas
                  ref={canvasRef}
                  className="imgEdit"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onClick={handleCanvasClick}
                />
              )}
            </>
          ) : (
            <p>이미지를 선택하세요</p>
          )}
        </div>
        <div className="imgSaves">
          {medias.map((media, index) => (
            <div
              key={index}
              className="imgsave"
              onClick={(event) => selectMedia(event, media)}
            >
              {media.startsWith("blob:")?(
                <video className="thumb">
                  <source src={media} type="video/mp4" />
                </video>
              ) : (
                <img src={media} alt={`미디어 ${index +1}`}></img>
              )}
              <div
                className="delete-icon"
                onClick={(event) => handleRemoveImage(event, index)}
              >
                X
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Editor;
