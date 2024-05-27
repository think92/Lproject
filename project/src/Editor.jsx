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
import AWS from "aws-sdk";
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import localforage from "localforage";


ReactModal.setAppElement("#root");

const Editor = () => {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [mediaView, setMediaView] = useState(null);
  const [medias, setMedias] = useState([]);
  const [intensityAuto, setIntensityAuto] = useState(50);
  const [intensity, setIntensity] = useState(50);
  const [updatedAreas, setUpdatedAreas] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [dragStart, setDragStart] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]); // 선택된 영역
  const [activeArea, setActiveArea] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [premiumModalIsOpen, setPremiumModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const openDeleteModal = () => setDeleteModalIsOpen(true);
  const closeDeleteModal = () => setDeleteModalIsOpen(false);
  const openLoginModal = () => setLoginModalIsOpen(true);
  const closeLoginModal = () => setLoginModalIsOpen(false);
  const navigate = useNavigate();
  const openPremiumModal = () => setPremiumModalIsOpen(true);
  const closePremiumModal = () => setPremiumModalIsOpen(false);

  const [buttonStates, setButtonStates] = useState({
    face: false,
    carNumber: false,
    knife: false,
    cigar: false,
  });

  /////////////AWS S3설정/////////////
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_API_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
    region: process.env.REACT_APP_REGION,
  });

  const s3 = new AWS.S3();

  useEffect(() => {
    const loadLocalforageData = async () => {
      try {
        const storedMedias = await localforage.getItem("medias");
        if (storedMedias) {
          setMedias(storedMedias);
        }
  
        const storedMediaView = await localforage.getItem("mediaView");
        if (storedMediaView) {
          setMediaView(storedMediaView);
        }
  
        if (location.state?.medias && location.state.medias.length > 0) {
          const formattedMedias = location.state.medias.map((media) => {
            if (typeof media === 'string') {
              return {
                type: "image/png",
                data: `https://${process.env.REACT_APP_AWS_BUCKET}.s3.${process.env.REACT_APP_REGION}.amazonaws.com/${media}`
              };
            } else {
              return media;
            }
          });
          setMedias((prevMedias)=>[...prevMedias,...formattedMedias]);
          if (!mediaView && formattedMedias.length > 0) {
            setMediaView(formattedMedias[0]?.data || null);
          }
        } else {
          console.error("No images passed in state.");
        }
      } catch (err) {
        console.error("Error loading medias or mediaView from localforage:", err);
      }
    };
  
    loadLocalforageData();
  }, [location.state]);
  
  
  
  useEffect(() => {
    if (mediaView) {
      console.log("Updated mediaView:", mediaView);
      if (mediaView.startsWith("data:image") || mediaView.startsWith("https")) {
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
      } else if (
        mediaView.startsWith("data:video") ||
        mediaView.startsWith("blob:") ||
        mediaView.endsWith(".mp4")
      ) {
        if (!mediaView.startsWith("blob:")) {
          fetch(mediaView, { mode: "cors" })
            .then((response) => response.blob())
            .then((blob) => {
              const videoURL = URL.createObjectURL(blob);
              setMediaView(videoURL);
              console.log("Video URL updated:", videoURL);
            })
            .catch((error) => console.error("Error fetching video:", error));
        }
      }
    }
  }, [mediaView, updatedAreas]);
 // 데이터가 변경될 때 localforage에 저장
 useEffect(() => {
  localforage.setItem("medias", medias).catch((err) => {
    console.error("Error saving medias to localforage:", err);
  });
  localforage.setItem("mediaView", mediaView).catch((err) => {
    console.error("Error saving mediaView to localforage:", err);
  });
}, [medias, mediaView]);



// 컴포넌트 로드 시 localforage에서 데이터 불러오기
useEffect(() => {
  localforage.getItem("medias").then((storedMedias) => {
    if (storedMedias) {
      setMedias(storedMedias);
    }
  }).catch((err) => {
    console.error("Error loading medias from localforage:", err);
  });

  localforage.getItem("mediaView").then((storedMediaView) => {
    if (storedMediaView) {
      setMediaView(storedMediaView);
    }
  }).catch((err) => {
    console.error("Error loading mediaView from localforage:", err);
  });

  if (location.state?.medias && location.state.medias.length > 0) {
    const formattedMedias = location.state.medias.map((media) => {
      if (typeof media === 'string') {
        return {
          type: "image/png",
          data: `https://${process.env.REACT_APP_AWS_BUCKET}.s3.${process.env.REACT_APP_REGION}.amazonaws.com/${media}`
        };
      } else {
        return media;
      }
    });
    setMedias(formattedMedias);
    setMediaView(formattedMedias[0]?.data || null);
  } else {
    console.error("No images passed in state.");
  }
}, [location.state]);

const handleLogout = () => {
  sessionStorage.removeItem("mb_email");
  localforage.removeItem("medias").then(() => {
    console.log("medias removed from localforage");
    setMedias([]); // medias 상태 초기화
  }).catch((err) => {
    console.error("Error removing medias from localforage:", err);
  });

  localforage.removeItem("mediaView").then(() => {
    console.log("mediaView removed from localforage");
    setMediaView(null); // mediaView 상태 초기화
  }).catch((err) => {
    console.error("Error removing mediaView from localforage:", err);
  });

  navigate("/");
};

useEffect(() => {
  if (!sessionStorage.getItem("mb_email")) {
    setMedias([]); // 세션에 mb_email이 없을 경우 medias 초기화
    setMediaView(null); // 세션에 mb_email이 없을 경우 mediaView 초기화
  }
}, []);


  const handleButtonClick = () => {
    // 로그인 여부 확인
    if (null === sessionStorage.getItem("mb_email")) {
      if (
        medias.length >= 1 ||
        medias.some((media) => media.type.startsWith("video/"))
      ) {
        openLoginModal();
        return;
      }
    }
    fileInputRef.current.click();
  };

  const aiHandleButtonClick = (buttonType) => {
    setButtonStates((prevState) => ({
      ...prevState,
      [buttonType]: !prevState[buttonType],
    }));
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
  
    // 로그인 여부 확인
    if (
      null === sessionStorage.getItem("mb_email") &&
      (files.length > 1 || files.some((file) => file.type.startsWith("video/")))
    ) {
      openLoginModal();
      return;
    }
    if (
      sessionStorage.getItem("mb_role") === "M" &&
      files.some(
        (file) => file.type.startsWith("video/") && file.size > 5 * 1024 * 1024
      )
    ) {
      openPremiumModal();
      return;
    }
  
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (file.type.startsWith("image/")) {
            resolve({ type: file.type, data: reader.result });
          } else if (file.type.startsWith("video/")) {
            resolve({ type: file.type, data: URL.createObjectURL(file) });
          }
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });
  
    Promise.all(promises).then(
      (newMedias) => {
        setMedias((prevMedias) => {
          const updatedMedias = [...prevMedias, ...newMedias];
          localforage.setItem("medias", updatedMedias).catch((err) => {
            console.error("Error saving medias to localforage:", err);
          });
          return updatedMedias;
        });
        if (newMedias.length > 0) {
          setMediaView(newMedias[0].data); // Ensure correct data is used
          localforage.setItem("mediaView", newMedias[0].data).catch((err) => {
            console.error("Error saving mediaView to localforage:", err);
          });
        }
      },
      (error) => {
        console.error("Error loading images: ", error);
      }
    );
  };
  
  

  const selectMedia = (event, media) => {
    if (media && (media.type.startsWith("image") || media.type.startsWith("video"))) {
      setMediaView(media.data);
      setUpdatedAreas([]); // Reset updated areas when mediaView changes
    }
  };

  const handleRemoveImage = (event, index) => {
    event.stopPropagation();
    setMedias((prevMedias) => {
      const filteredMedias = prevMedias.filter((_, idx) => idx !== index);
      if (index === 0 && filteredMedias.length > 0) {
        setMediaView(filteredMedias[0].data); // Ensure correct data is used
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
      imageData: null,
    };
    const ctx = canvasRef.current.getContext("2d");
    const imageData = ctx.getImageData(
      newArea.x,
      newArea.y,
      newArea.width,
      newArea.height
    );
    newArea.imageData = imageData;

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
          img.data === mediaView
            ? { ...img, data: mosaicResult.mosaicImage }
            : img
        );
        setMedias(updatedMedias);
        setMediaView(mosaicResult.mosaicImage);
      }
    } else if (activeTool === "except") {
      setUpdatedAreas((prevAreas) => [...prevAreas, newArea]);
      setSelectedAreas((prevAreas) => [...prevAreas, newArea]);
      console.log("Active area set:", newArea);
    }
    setDragStart(null);
  }

  const handleSubmit = async () => {
    if (!mediaView) return;
    // 프리미엄 회원 확인
    if (
      sessionStorage.getItem("mb_role") === "M" &&
      (medias.some(
        (media) =>
          media.type.startsWith("video/") && media.size > 5 * 1024 * 1024
      ) ||
        activeTool === "except")
    ) {
      openPremiumModal();
      return;
    }

    let mediaFile, mediaFileName, mediaFileType;

    if (mediaView.startsWith("data:image")) {
      const response = await fetch(mediaView, { mode: "cors" });
      const blob = await response.blob();
      mediaFile = new File([blob], "mediaView.png", { type: "image/png" });
      mediaFileName = `mediaView-${Date.now()}.png`;
      mediaFileType = "image/png";
    } else if (
      mediaView.startsWith("data:video") ||
      mediaView.startsWith("blob:")
    ) {
      const response = await fetch(mediaView, { mode: "cors" });
      const blob = await response.blob();
      mediaFile = new File([blob], "mediaView.mp4", { type: "video/mp4" });
      mediaFileName = `mediaView-${Date.now()}.mp4`;
      mediaFileType = "video/mp4";
    }

    await uploadToS3(mediaFile, mediaFileName);

    const mb_email = sessionStorage.getItem("mb_email");

    const originalPhoto = {
      file_name: mediaFileName,
      file_rename: mediaFileName,
      file_type: mediaFileType,
      file_size: mediaFile.size,
      created_at: new Date().toISOString(),
      mb_email: mb_email ? mb_email : null,
    };

    console.log("원본 파일 정보", originalPhoto);

    let areaFileInfoArray = [];

    if (selectedAreas.length > 0) {
      for (let i = 0; i < selectedAreas.length; i++) {
        const area = selectedAreas[i];
        const canvas = document.createElement("canvas");
        canvas.width = area.width;
        canvas.height = area.height;
        const ctx = canvas.getContext("2d");
        ctx.putImageData(area.imageData, 0, 0);

        await new Promise((resolve) => {
          canvas.toBlob(async (blob) => {
            const file = new File([blob], `area-${Date.now()}.png`, {
              type: "image/png",
            });
            const fileName = `area-${Date.now()}.png`;
            await uploadToS3(file, fileName);

            const areaFileInfo = {
              file_name: fileName,
              file_rename: fileName,
              file_type: file.type,
              file_size: file.size,
              created_at: new Date().toISOString(),
              mb_email: mb_email ? mb_email : null,
            };

            console.log("사용자 선택영역 파일 정보", areaFileInfo);
            areaFileInfoArray.push(areaFileInfo);
            resolve();
          }, "image/png");
        });
      }
    } else {
      console.log("Active area is not set");
    }

    const editorData = new FormData();
    for (const key in originalPhoto) {
      editorData.append(`original_${key}`, originalPhoto[key]);
    }

    areaFileInfoArray.forEach((areaFileInfo, index) => {
      for (const key in areaFileInfo) {
        editorData.append(`area_${index}_${key}`, areaFileInfo[key]);
      }
    });

    for (const key in buttonStates) {
      editorData.append(key, buttonStates[key]);
    }
    editorData.append("intensityAuto", intensityAuto);

    axios
      .post(
        `http://${process.env.REACT_APP_IP}:8083/FileApi/uploadFileInfo`,
        editorData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        const s3Url = `https://${process.env.REACT_APP_AWS_BUCKET}.s3.${process.env.REACT_APP_REGION}.amazonaws.com/${res.data.file_name}`;
        setMediaView(s3Url);
        setMedias((prevMedias) => {
          return prevMedias.map((media) => {
            if (media.data === mediaView) {
              return { ...media, data: s3Url, type: mediaFileType };
            }
            return media;
          });
        });
        console.log("S3 URL:", s3Url);
      })
      .catch((err) => {
        console.error("API 요청 실패:", err);
      });
  };

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

  // 저장 버튼 클릭 핸들러 수정
  const handleSave = async () => {
    if (!mediaView) {
      console.error("mediaView is not defined");
      return;
    }

    let mediaFile, mediaFileName, mediaFileType;

    try {
      console.log("mediaView:", mediaView); // mediaView의 실제 값을 로그로 출력

      if (
        mediaView.startsWith("data:image") ||
        mediaView.endsWith(".png") ||
        mediaView.endsWith(".jpg") ||
        mediaView.endsWith(".jpeg")
      ) {
        console.log("Processing image data...");

        // 이미지인 경우
        const response = await fetch(mediaView);
        if (!response.ok) {
          throw new Error("Failed to fetch image data");
        }
        const blob = await response.blob();
        console.log("Blob created from mediaView URL:", blob); // Blob 객체 로그

        // Blob 객체 확인
        if (!blob) {
          throw new Error("Failed to create Blob from mediaView URL");
        }

        mediaFile = new File([blob], "final-mediaView.png", {
          type: "image/png",
        });
        mediaFileName = `final-mediaView-${Date.now()}.png`;
        mediaFileType = "image/png";

        console.log("Image file created:", mediaFile);

        // 이미지 다운로드
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = mediaFileName;
        link.click();
      } else if (
        mediaView.startsWith("data:video") ||
        mediaView.startsWith("blob:") ||
        mediaView.endsWith(".mp4")
      ) {
        console.log("Processing video data...");

        // 동영상인 경우
        const response = await fetch(mediaView);
        if (!response.ok) {
          throw new Error("Failed to fetch video data");
        }
        const blob = await response.blob();
        console.log("Blob created from mediaView URL:", blob); // Blob 객체 로그

        // Blob 객체 확인
        if (!blob) {
          throw new Error("Failed to create Blob from mediaView URL");
        }

        mediaFile = new File([blob], "final-mediaView.mp4", {
          type: "video/mp4",
        });
        mediaFileName = `final-mediaView-${Date.now()}.mp4`;
        mediaFileType = "video/mp4";

        console.log("Video file created:", mediaFile);

        // 동영상 다운로드
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = mediaFileName;
        link.click();
      } else {
        console.error("Unsupported media type:", mediaView);
      }

      // mediaFile이 잘 정의되었는지 확인
      if (!mediaFile) {
        console.error("Media file is not defined after processing");
        return;
      }

      // S3에 업로드
      const s3Url = await uploadToS3(mediaFile, mediaFileName);
      console.log("S3 URL:", s3Url);

      const mb_email = sessionStorage.getItem("mb_email");

      const originalPhoto = {
        file_name: mediaFileName,
        file_rename: mediaFileName,
        file_type: mediaFileType,
        file_size: mediaFile.size,
        created_at: new Date().toISOString(),
        mb_email: mb_email ? mb_email : null,
      };

      console.log("원본 파일 정보", originalPhoto);
      closeModal(); // 모달 닫기

      const editorData = new FormData();
      for (const key in originalPhoto) {
        editorData.append(`${key}`, originalPhoto[key]);
      }

      axios
        .post(
          `http://${process.env.REACT_APP_IP}:8083/FileApi/mosaicUploadFileInfo`,
          editorData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setMediaView(s3Url);
          setMedias((prevMedias) => {
            return prevMedias.map((media) => {
              if (media.data === mediaView) {
                return { ...media, data: s3Url, type: mediaFileType };
              }
              return media;
            });
          });
          console.log("File saved locally and uploaded to S3:", s3Url);
          closeModal(); // 모달 닫기
        })
        .catch((err) => {
          console.error("API 요청 실패:", err);
        });
    } catch (error) {
      console.error("Error in handleSave:", error);
    }
  };

  const uploadToS3 = async (file, key) => {
    const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET,
      Key: key,
      Body: file,
      ContentType: file.type,
    };

    try {
      const data = await s3.upload(params).promise();
      console.log("Upload Success", data.Location);
      return data.Location;
    } catch (err) {
      console.log("Upload Error", err);
      throw err; // 에러 발생 시 예외 던지기
    }
  };

  const handleDelete = () => {
    if (!mediaView) return;

    setMedias((prevMedias) => {
      const filteredMedias = prevMedias.filter(
        (media) => media.data !== mediaView
      );
      if (filteredMedias.length > 0) {
        setMediaView(filteredMedias[0].data); // Ensure correct data is used
      } else {
        setMediaView(null);
      }
      closeDeleteModal(); // 모달 닫기
      return filteredMedias;
    });
  };

  useEffect(() => {
    if (!sessionStorage.getItem("mb_email")) {
      setMedias([]); // 세션에 mb_email이 없을 경우 medias 초기화
    }
  }, []);

  return (
    <div className="editor-specific">
      <MainBar onLogout={handleLogout} />
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
                onClick={() => aiHandleButtonClick("face")}
              >
                <FontAwesomeIcon
                  style={{ color: buttonStates.face ? "green" : "inherit" }}
                  icon={faFaceSmile}
                />
              </button>
              <button
                className="type"
                onClick={() => aiHandleButtonClick("carNumber")}
              >
                <FontAwesomeIcon
                  style={{
                    color: buttonStates.carNumber ? "green" : "inherit",
                  }}
                  icon={faCar}
                />
              </button>
              <button
                className="type"
                onClick={() => aiHandleButtonClick("knife")}
              >
                <FontAwesomeIcon
                  style={{ color: buttonStates.knife ? "green" : "inherit" }}
                  icon={faPhone}
                />
              </button>
              <button
                className="type"
                onClick={() => aiHandleButtonClick("cigar")}
              >
                <FontAwesomeIcon
                  style={{ color: buttonStates.cigar ? "green" : "inherit" }}
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
              <button className="typeSubmit" onClick={handleSubmit}>
                적용하기
              </button>
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
            <button className="submit" onClick={openModal}>
              저장
            </button>
            <button className="submit" onClick={openDeleteModal}>
              삭제
            </button>
          </div>
        </div>
        <div className="edit">
          {mediaView ? (
            <>
              {mediaView.startsWith("data:video") ||
              mediaView.startsWith("blob:") ||
              mediaView.endsWith(".mp4") ? (
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
              {media.type.startsWith("video/") ? (
                <video className="thumb" src={media.data} />
              ) : (
                <img src={media.data} alt={`미디어 ${index + 1}`} />
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
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Save Confirmation"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <h2>저장 확인</h2>
          <p>정말 저장하시겠습니까?</p>
          {mediaView && (
            <div className="media-preview">
              {mediaView.startsWith("data:video") ||
              mediaView.startsWith("blob:") ? (
                <video controls className="video-preview">
                  <source src={mediaView} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={mediaView}
                  alt="mediaView"
                  className="image-preview"
                />
              )}
            </div>
          )}
          <div className="modal-buttons">
            <button className="btn confirm" onClick={handleSave}>
              확인
            </button>
            <button className="btn cancel" onClick={closeModal}>
              취소
            </button>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Confirmation"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <h2>삭제 확인</h2>
          <p>정말 삭제하시겠습니까?</p>
          {mediaView && (
            <div className="media-preview">
              {mediaView.startsWith("data:video") ||
              mediaView.startsWith("blob:") ? (
                <video controls className="video-preview">
                  <source src={mediaView} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={mediaView}
                  alt="mediaView"
                  className="image-preview"
                />
              )}
            </div>
          )}
          <div className="modal-buttons">
            <button className="btn confirm" onClick={handleDelete}>
              확인
            </button>
            <button className="btn cancel" onClick={closeDeleteModal}>
              취소
            </button>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={loginModalIsOpen}
        onRequestClose={closeLoginModal}
        contentLabel="Login Required"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <h2>로그인 하시겠습니까?</h2>
          <p>사진 두 장 이상 또는 동영상을 업로드하려면 로그인이 필요합니다.</p>
          <div className="modal-buttons">
            <button
              className="btn confirm"
              onClick={() => {
                closeLoginModal();
                navigate("/Login");
              }}
            >
              확인
            </button>
            <button className="btn cancel" onClick={closeLoginModal}>
              취소
            </button>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={premiumModalIsOpen}
        onRequestClose={closePremiumModal}
        contentLabel="Premium Required"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <h2>프리미엄 회원 기능</h2>
          <p>
            동영상 파일 크기가 5MB 이상, 모자이크 제외 기능은 프리미엄 회원만
            가능합니다.
          </p>
          <div className="modal-buttons">
            <button
              className="btn confirm"
              onClick={() => {
                closePremiumModal();
                navigate("/Premium");
              }}
            >
              확인
            </button>
            <button className="btn cancel" onClick={closePremiumModal}>
              취소
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default Editor;