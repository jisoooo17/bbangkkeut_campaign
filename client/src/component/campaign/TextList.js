import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const TextList = ({campaignList}) => {
  const navigate = useNavigate();
  const storedUserData = sessionStorage.getItem("userData");
  const userData = JSON.parse(storedUserData);

  // 이미지 태그의 src 속성값을 추출하는 함수
  const extractImageSrc = (htmlString) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;
    const imgTags = tempElement.getElementsByTagName('img');
    const srcList = [];
    for (let i = 0; i < imgTags.length; i++) {
      srcList.push(imgTags[i].getAttribute('src'));
    }
    return srcList;
  };

  // campaignList.body 내부의 이미지 src 추출
  const imageSrcList = extractImageSrc(campaignList.body);

  // 접수 종료 날짜와 오늘 날짜 비교
  const today = new Date(new Date().toUTCString());
  const receptionEndDate = new Date(campaignList.reception_end_date);
  const receptionStartDate = new Date(campaignList.reception_start_date);
  receptionEndDate.setDate(receptionEndDate.getDate() + 1);
  const isReceptionInProgress = today >= receptionStartDate && today < receptionEndDate;
  const isReceptionScheduled = today < receptionStartDate;

  // 뱃지 
  const renderBadge = () => {
    if (isReceptionInProgress) {
      return <span className="badge inprogress">접수중</span>;
    } else if (isReceptionScheduled) {
      return <span className="badge scheduled">예정</span>;
    } else {
      return <span className="badge completed">마감</span>;
    }
  };

  const campaignNavigate = () => {
    if (userData === null) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/Login");
    } else {
      navigate(`/campaign/detail/${campaignList.id}`);
    }
  };
  
  return (
    <button className="cont" onClick={campaignNavigate}>
      <div className="img-wrap">
        {imageSrcList.length > 0 ? (
          imageSrcList.map((src, index) => (
            <img key={index} src={src} alt={`Image ${index}`} />
          ))
        ) : (
          <img src={process.env.PUBLIC_URL + '/img/img-campaign-no-img.jpg'} alt="Default Campaign Image" />
        )}
          
        {/* 캠페인 진행상태 뱃지 */}
        {renderBadge()}
      </div>

      <div className="txt-wrap">
        <p className="title">{campaignList.title}</p>
        <div className="txt-info">
          <p className="username">{campaignList.username}</p>
          <p className="date">{campaignList.date.slice(0, 10).replace('T', ' ')}</p>
        </div>
      </div>
    </button>
  )
}

export default TextList;