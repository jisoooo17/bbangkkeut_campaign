import React, { useState, useEffect, useRef } from "react";

import Header from "../component/Header";
// 내부 컴포넌트 분류---------------------------------------
import Consumption from "../component/CarbonFootprints/Consumption";
import Result from "../component/CarbonFootprints/Result";
import Practice from "../component/CarbonFootprints/Practice";
// ---------------------------------------------------------
import Footer from "../component/Footer";

import html2canvas from "html2canvas";

function CarbonFootprint() {
  // const userId = 179870; //개발용 user_id
  const storedUserData = sessionStorage.getItem("userData");
  const userData = JSON.parse(storedUserData);
  // console.log("세션확인:", userData);

  // const userData = {
  //   userid: 179870,
  //   username: "상호형",
  //   usertype: "1",
  // };

  const currentDate = new Date().toISOString().slice(0, 10); // 현재 날짜를 'YYYY-MM-DD' 형식으로

  const [activeTab, setActiveTab] = useState("consumption"); // 탭 핸들링
  const [userEmissionData, setUserData] = useState(null);
  const [newResultData, setNewResultData] = useState(null);
  const [initialData, setInitialData] = useState(null); // 초기 데이터 상태 추가
  // console.log("initialData :", initialData);
  const [isTransportationOption, setIsTransportationOption] = useState(null);
  const [consumptionData, setConsumptionData] = useState({
    electricity: "",
    gas: "",
    water: "",
    transportation: "",
    radioOption: "0",
    waste: "",
    kg: "",
    l: "",
  });

  // console.log("세션:",sessionStorage)

  const [userValueSave, setUserValueSave] = useState(false);

  // 사용자의 이번 달 데이터 존재 여부를 확인하고, 결과에 따라 탭을 설정
  useEffect(() => {
    const checkData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/carbonFootprint/check/${userData.userid}/${currentDate}`
        );
        const data = await response.json();
        if (data.hasData) {
          setNewResultData(data.data);
          setActiveTab("result");
          // console.log(data.data);
        } else {
          fetchInitialData();
          setActiveTab("consumption");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchInitialData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/carbonFootprint`);
        const data = await response.json();
        setInitialData(data); // 초기 데이터 상태 업데이트
        // console.log(data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    checkData();
    fetchInitialData();
  }, [userData.userid, currentDate]);

  const handleTabChange = (tabName) => {
    // "결과보기" 또는 "생활속 실천방안" 탭으로 이동하려고 할 때
    if (tabName === "result" || tabName === "practice") {
      // 서버로부터 넘어온 userData가 있거나, 사용자가 데이터를 제출한 경우 (resultData가 존재)에만 탭 전환 허용
      if (!userEmissionData && !newResultData) {
        alert("제출하기 완료하신 후에 결과확인하실 수 있습니다.");
        return; // userData도 없고 resultData도 없으면 여기서 함수 종료
      }
    }

    if (tabName === "practice") {
      if (userValueSave) {
        setActiveTab(tabName);
      } else if (!newResultData) {
        const userResponse = window.confirm(
          '"결과보기"의 저장을 하셨나요? \n 저장을 않하셨다면 "실천목표"가 초기화 됩니다. \n\n "취소"버튼을 누르시면 저장버튼으로 이동 합니다.'
        );
        if (!userResponse) {
          return window.scrollTo({
            top: 3200,
            behavior: "smooth", // 부드러운 스크롤 효과
          });
        } else {
          setActiveTab(tabName);
        }
      }
    }

    // 위의 조건을 만족하면 탭 변경
    setActiveTab(tabName);
  };

  const handleResultSubmit = (newResultData, inputData, isTransportationOption) => {
    // 사용자가 데이터를 제출하면, 이를 userData에 반영하여 바로 "결과보기" 탭에서 사용할 수 있도록 합니다.
    // 이는 서버로부터 받은 userData가 있더라도, 사용자의 최신 제출을 반영하는 것을 우선합니다.
    setUserData({
      ...userEmissionData,
      ...newResultData,
    });
    setConsumptionData(inputData);
    setIsTransportationOption(isTransportationOption);
    setActiveTab("result");
  };

  const renderContent = () => {
    if (!initialData) {
      // 데이터가 로딩 중이거나 로딩에 실패했을 때 보여줄 UI
      return <div>Loading...</div>;
    }
    switch (activeTab) {
      case "consumption":
        return (
          <Consumption
            inputData={consumptionData}
            initialData={initialData.carbonFootprintData}
            onResultSubmit={handleResultSubmit}
          />
        );
      case "result":
        // 서버의 userData가 있으면 그 값을, 없으면 로컬의 resultData를 사용
        const dataToShow = userEmissionData || newResultData;
        return (
          <Result
            initialData={initialData.calculationAdviceData}
            resultData={dataToShow}
            userData={userData}
            isTransportationOption={isTransportationOption}
            onSaveImage={saveAsImage}
            setUserValueSave={setUserValueSave}
          />
        );
      case "practice":
        return <Practice />;
      default:
        return (
          <Consumption
            inputData={consumptionData}
            initialData={initialData.carbonFootprintData}
            saveAsImage={handleResultSubmit}
          />
        );
    }
  };

  const tabItemClass = (tabName) => {
    return `tab-item ${activeTab === tabName ? "active" : ""}`;
  };

  // Ref를 생성하여 캡처하고자 하는 요소에 할당
  const captureRef = useRef(null);

  // 캡처 및 이미지 저장 함수
  const saveAsImage = () => {
    const elementsToHide = document.querySelectorAll(".hidden_for_capture");
    const elementsToVisibility = document.querySelectorAll(".visibility_for_capture");

    // html2canvas로 캡처 전에 class 숨기기
    elementsToHide.forEach((element) => {
      element.style.display = "none";
    });

    // html2canvas로 캡처 전에 class 보이기
    elementsToVisibility.forEach((element) => {
      element.style.display = "";
    });

    if (captureRef.current) {
      setTimeout(() => {
        // result의 엘리먼트 dispay 적용이 되지 않아 1초의 유휴시간 부여
        html2canvas(captureRef.current, {
          onclone: (canvas) => {
            // html2canvas로 캡처 후 요소를 다시 표시
            elementsToHide.forEach((element) => {
              element.style.display = "";
            });
            elementsToVisibility.forEach((element) => {
              element.style.display = "none";
            });
          },
        }).then((canvas) => {
          // 캔버스를 이미지로 변환 후 다운로드
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = "result.png";
          link.href = image;
          link.click();
        });
      }, 1000);
    }
  };

  return (
    <div id="wrap">     
      <div className="hidden_for_capture">
        <Header />
      </div>
      <div className="content-w tanso_bg" ref={captureRef}>
        <div className="carbon_wrap"></div>
        <div className="inner">
          <div className="tit-wrap">
            <div className="tit">탄소발자국 계산기</div>
            <div className="txt">내가 생활 속에서 배출하는 이산화탄소의 양은 얼마일까요?</div>
          </div>
          <div className="menu-container">
            <div className="tab-container">
              <ul className="tab-menu">
                {!newResultData && (
                  <li className={tabItemClass("consumption")} onClick={() => handleTabChange("consumption")}>
                    계산하기
                  </li>
                )}
                <li className={tabItemClass("result")} onClick={() => handleTabChange("result")}>
                  결과보기
                </li>
                <li className={tabItemClass("practice")} onClick={() => handleTabChange("practice")}>
                  생활속 실천방안
                </li>
              </ul>
            </div>
          </div>
          <div className="content-container">{renderContent()}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CarbonFootprint;
