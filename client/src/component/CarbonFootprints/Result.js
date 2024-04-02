import React, { useState, useEffect } from "react";
import PiChart from "./Result/PiChartData";
import BarChart from "./Result/BarChart";
import TargetBarchart from "./Result/TargetBarchart";
import TargetBarchartTotal from "./Result/TargetBarchartTotal";

import { useNavigate } from "react-router-dom";

function Result({ initialData, resultData, userData, isTransportationOption, onSaveImage, setUserValueSave }) {
  const navigate = useNavigate();

  const [barChatData, setBarChatData] = useState([]);
  const [selectTargetTap, setSelectSubTap] = useState("electricity");
  const [selectTap, setSelectTap] = useState("electricity");

  const [targetEmissions, setTargetEmission] = useState(resultData);
  const [checkedItems, setCheckedItems] = useState({});
  const [categorySavings, setCategorySavings] = useState({
    electricity: 0,
    gas: 0,
    water: 0,
    transportation: 0,
    waste: 0,
    total: 0,
  });
  const [currentMonth, setCurrentMonth] = useState(null);

  const hasResultData = resultData && resultData.calculation_month;

  // console.log("??", hasResultData);
  // console.log("유저 결과 :", userData);
  // console.log("추천 실천과제 :", initialData);
  // console.log("resultData :", resultData);
  // console.log("targetEmissions :", targetEmissions.transportation);
  // console.log("교통 라디오 옵션(차량없음) :", isTransportationOption);
  // console.log("barChatData :", barChatData);
  // console.log("barChatDataTotal :", categorySavings);
  // const userId = 104716;

  // resultData.total(유저) / categorySavings.total(목표) / averageData.total(평균) 데이터셋 작성 -> targetBarChart작성

  const averageData = {
    // 평균 데이터
    electricity: 32.5,
    gas: 38.9,
    water: 1.6,
    transportation: 270.8,
    waste: 0.6,
    total: 344.4,
  };

  const resultTotalData = {
    name: "total",
    user: resultData.total,
    average: averageData.total,
    target: parseFloat(resultData.total - categorySavings.total).toFixed(1),
    color: "#25B058",
  };

  const labels = {
    electricity: "전기",
    gas: "가스",
    water: "수도",
    transportation: "교통",
    waste: "폐기물",
  };

  const colors = ["#316EE6", "#FE7713", "#A364FF", "#FE5A82", "#4ACC9C", "#FF8042"];
  const maxValues = [14.1, 42.9, 4.9, 90.9, 14.6];

  // useEffect를 컴포넌트 최상위 수준으로 이동
  useEffect(() => {
    if (hasResultData) {
      // 서버로부터 받은 데이터를 상태에 설정
      const newCheckedItems = JSON.parse(resultData.checked_items || "{}");
      const newCategorySavings = JSON.parse(resultData.category_savings || "{}");

      if (JSON.stringify(checkedItems) !== JSON.stringify(newCheckedItems)) {
        setCheckedItems(newCheckedItems);
      }

      if (JSON.stringify(categorySavings) !== JSON.stringify(newCategorySavings)) {
        setCategorySavings(newCategorySavings);
      }
    }

    const convertToChartData = (resultData, averageData, labels, colors, targetEmissions) => {
      return Object.keys(labels).map((key, index) => {
        const targetKey = key; // labels 객체의 키와 targetEmissions 객체의 키가 서로 매치되어야 함
        return {
          category: Object.keys(labels)[index],
          name: labels[key],
          user: parseFloat(resultData[key]),
          average: averageData[key],
          color: colors[index],
          target: parseFloat(targetEmissions[targetKey]), // targetEmissions의 값을 target으로 추가
        };
      });
    };

    if (resultData && Object.keys(resultData).length > 0) {
      const data = convertToChartData(resultData, averageData, labels, colors, targetEmissions);
      setBarChatData(data);
    }

    // 현재 월 가져오기
    const date = new Date();
    const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줍니다.
    setCurrentMonth(month);
  }, [resultData, targetEmissions]);

  useEffect(() => {
    // 감소목표 카테고리 분류
    const categories = ["electricity", "gas", "water", "transportation", "waste"];

    const updatedTargetEmissions = categories.reduce((acc, category) => {
      acc[category] = calculateTargetEmissions(resultData, categorySavings, category);
      return acc;
    }, {});

    // console.log("Updated Target Emissions: ", updatedTargetEmissions);

    setTargetEmission(updatedTargetEmissions);
  }, [categorySavings]);

  function transformDataToBarChart(categorySavings) {
    // 카테고리 키를 배열로 변환합니다.
    const categoryKeys = Object.keys(categorySavings);

    // 결과 배열을 생성합니다.
    const barChartDataTotal = categoryKeys
      .map((key, index) => {
        // 카테고리에 해당하는 레이블과 색상을 가져옵니다.
        // total 키는 제외합니다.
        if (key !== "total") {
          return {
            name: labels[key], // 레이블을 이름으로 사용
            value: categorySavings[key].toFixed(1), // 해당 카테고리의 값
            color: colors[index], // 순서에 따른 색상 할당
            maxVlaue: maxValues[index],
          };
        }
      })
      .filter((item) => item !== undefined); // total 키로 생성된 undefined 값을 제거합니다.

    return barChartDataTotal;
  }

  const barChartDataTotal = transformDataToBarChart(categorySavings);

  // 객체를 배열로 변환
  function convertDataToObject(resultData) {
    // resultData가 유효하지 않은 경우, 빈 객체로 처리
    if (!resultData || typeof resultData !== "object") {
      console.error("Invalid or undefined resultData:", resultData);
      return [];
    }

    const result = [];
    for (const [key, value] of Object.entries(resultData)) {
      if (key !== "total" && labels[key]) {
        result.push({
          name: labels[key],
          value: parseFloat(value),
        });
      }
    }

    return result;
  }
  const data = convertDataToObject(resultData);

  // 탄소계산기 다시하기 이벤트 핸들러
  const onClickCarbonFootprint = () => {
    // confirm 대화상자를 표시하고 사용자의 응답을 변수에 저장
    const userConfirmed = window.confirm("작성된 데이터가 초기화 됩니다. 계속하시겠습니까?");

    // 사용자가 '확인'을 클릭했을 때의 로직
    if (userConfirmed) {
      window.location.href = "/carbonfootprint";
      // 첫 페이지로 리플레시하는 로직
      // navigate("/carbonfootprint");
    }
    // 사용자가 '취소'를 클릭했을 때는 아무것도 하지 않음
  };

  const onSaveClick = async () => {
    const calculationMonth = new Date().toISOString().slice(0, 10); // 현재 날짜를 'YYYY-MM-DD' 형식으로 설정
    const postData = {
      userId: userData.userid,
      electricity: resultData.electricity,
      gas: resultData.gas,
      water: resultData.water,
      transportation: resultData.transportation,
      waste: resultData.waste,
      total: resultData.total,
      calculationMonth: calculationMonth,
      checkedItems: checkedItems, // 체크된 항목들
      categorySavings: categorySavings, // 각 카테고리별 절감량
    };

    try {
      const response = await fetch("http://localhost:8000/api/carbonFootprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }
      
      setUserValueSave(true);

      // 데이터 저장 성공 후 알림 표시
      alert("데이터가 성공적으로 저장되었습니다. 메인 페이지로 이동합니다.");
      // 메인 페이지로 리다이렉트
      navigate("/");
    } catch (error) {
      console.error("Error saving data: " + error.message);
      alert("데이터 저장에 실패했습니다.");
    }

    // 부드럽게 페이지 상단으로 스크롤
    window.scrollTo({
      top: 0, // Y 좌표
      left: 0, // X 좌표
      behavior: "smooth", // 부드러운 스크롤 효과
    });
  };

  //목표 분류템 선택
  const handleSubTapClick = (key) => {
    setSelectSubTap(key);
    setSelectTap(key);
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const [category, index] = name.split("-"); // 'electricity-0' -> ['electricity', '0']
    const newValue = parseFloat(value);

    // 체크 상태 업데이트
    const updatedCheckedItems = {
      ...checkedItems,
      [name]: checked ? newValue : 0,
    };
    setCheckedItems(updatedCheckedItems);

    // 분류별 총합 계산
    const newCategorySavings = { ...categorySavings };
    Object.keys(categorySavings).forEach((cat) => {
      if (cat === category || cat === "total") {
        // 현재 카테고리 또는 total일 경우 재계산
        newCategorySavings[cat] = Object.keys(updatedCheckedItems)
          .filter((key) => key.startsWith(cat))
          .reduce((total, key) => total + (updatedCheckedItems[key] || 0), 0);
      }
    });

    // total 값 업데이트 (total은 모든 카테고리의 합산)
    const totalSavings = Object.keys(newCategorySavings)
      .filter((key) => key !== "total") // 'total' 키를 제외하고 계산
      .reduce((total, key) => total + newCategorySavings[key], 0);
    newCategorySavings["total"] = totalSavings.toFixed(1);

    // 분류별 절감량 상태 업데이트
    setCategorySavings(newCategorySavings);
  };

  // 초기값, 감소목표량 계산 함수
  function calculateTargetEmissions(resultData, categorySavings, category) {
    return Math.max(0, resultData[category] - categorySavings[category]).toFixed(1);
  }

  // console.log("barChatData", barChatData);

  // 평균보다 입력데이터가 높은 항목의 개수를 계산하는 함수
  function countHigherItems(resultData, averageData) {
    // 키 값들을 배열로 변환
    const keys = Object.keys(resultData).filter((key) => key !== "total");

    // reduce 함수를 사용하여 조건을 만족하는 항목의 개수를 카운트
    const count = keys.reduce((acc, key) => {
      // 두 데이터의 해당 키 값에 대한 값 비교
      if (parseFloat(resultData[key]) > parseFloat(averageData[key])) {
        // 조건을 만족하면 카운트 증가
        return acc + 1;
      } else {
        return acc;
      }
    }, 0); // 초기값은 0

    return count;
  }

  const higherItemCount = countHigherItems(resultData, averageData);

  return (
    <>
      <div>
        <div className="top_box">
          <div className="title_info">
            <span className="weight_600">결과 페이지</span>
          </div>
        </div>

        <div className="result_box">
          <div className="item_title">
            <p>사용량 분석</p>
          </div>
          <div className="result_box_content">
            <div className="pi_chart_wrap">
              <PiChart data={data} />
              <div className="pi_chart_wrap_right">
                <div className="result_conment_right">
                  <h2>
                    <span className="forest_green_text">{currentMonth}월</span> 결과안내
                  </h2>
                  <p>
                    <span className="forest_green_text">{userData.username}</span>님의 이산화탄소(CO₂) 발생량
                    통계입니다.
                  </p>
                </div>
                <p>
                  <span className="forest_green_text">{userData.username}</span>님의 가정은 이산화탄소 배출량은 총{" "}
                  {resultData.total}kg 이며,
                  <br /> 비슷한 다른 가정 평균 <span className="forest_green_text">{averageData.total}kg</span> 보다 약{" "}
                  <span className="forest_green_text">
                    {((resultData.total / averageData.total) * 100 - 100).toFixed(1)}%
                  </span>{" "}
                  더 많이 배출하고 있습니다. 아래의 그래프를 보고 어느 부분에서 이산화탄소를 많이 발생하고 있는지 비교해
                  보세요.
                </p>
              </div>
            </div>

            <div className="barChart_container">
              {barChatData.map((data) => (
                <div key={data.name} className="bar_chart">
                  <div className="chart_title">
                    <div className={`step_icon forest_${data.category}_bg`}>
                      <img src={`/img/${data.category}_small_icon.svg`} alt={`${data.category}_아이콘`}/>
                    </div>
                    <span className={`forest_${data.category}_text`}>{data.name}</span>
                  </div>
                  <BarChart barChatData={[data]} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="result_box">
            <div className="item_title">
              <p>실천 목표</p>
            </div>
            <div className="result_box_content">
              <h2>
                우리집 실천목표! <span className="forest_green_text">생활 속에서 실천가능한 목표</span>를 선택해주세요.
              </h2>
              {/* 이미지 저장시 hidden처리될 구역 */}
              <div className="hidden_for_capture">
                <div className="select_category">
                  <ul>
                    {Object.keys(labels).map((key) => (
                      <li
                        key={key}
                        // className={`select_tap ${selectTap === key ? "active" : ""} `} //"교통 : 차량없음"으로 결과페이지를 넘어왔을때 탭 동작 제한
                        className={`select_tap ${key === 'transportation' && isTransportationOption ? 'disabled' : selectTap === key ? "active" : ""} `}
                        // onClick={() => handleSubTapClick(key)}
                        onClick={() => {if (!(key === 'transportation' && isTransportationOption)) {handleSubTapClick(key);}}}
                      >
                        {labels[key]}
                      </li>
                    ))}
                  </ul>
                </div>
                {Object.keys(labels).map(
                  (label) =>
                    selectTargetTap === label && (
                      <div key={label} className="select_content">
                        <div className={`category forest_${label}_bg`}>
                          <div className={`category_title forest_${label}_text`}>
                            <div className={"step_icon"} style={{ backgroundColor: "white" }}>
                              <img src={`/img/${label}_small_icon.svg`} alt={`${label}_아이콘`}/>
                            </div>
                            <span>{labels[label]}</span>
                          </div>
                          <div className="category_sub">
                            {initialData
                              .filter((item) => item.name === label)
                              .map((filteredItem, index) => (
                                <div key={index}>
                                  <label htmlFor={`${filteredItem.name}-${index}`}>
                                    <input
                                      type="checkbox"
                                      id={`${label}-${index}`}
                                      name={`${filteredItem.name}-${index}`}
                                      value={filteredItem.savings_value}
                                      // 체크 박스 추적관리
                                      checked={!!checkedItems[`${filteredItem.name}-${index}`]}
                                      // onChange 작성 부분
                                      onChange={handleCheckboxChange}
                                      disabled={
                                        hasResultData ||
                                        (filteredItem.name === "transportation" && isTransportationOption)
                                      }
                                    />
                                    <span
                                      className={
                                        !!checkedItems[`${filteredItem.name}-${index}`] ? `forest_${label}_text` : ""
                                      }
                                    >
                                      {filteredItem.advice_text}
                                    </span>
                                  </label>
                                  {/* ------------------ 사진 저장시만 표시될 항목*/}
                                  {!!checkedItems[`${filteredItem.name}-${index}`] ? (
                                    <div style={{ borderTop: "1px solid #999", marginTop: "10px" }}>
                                      <span style={{ paddingLeft: "15px", color: "red" }}>
                                        월간 {checkedItems[`${filteredItem.name}-${index}`]} kg 저감
                                      </span>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {/* ------------------- */}
                                </div>
                              ))}
                          </div>
                        </div>
                        <div className="target_co2saving">
                          <div className="item_title">
                            <h3>월간 CO₂ 저감목표</h3>
                          </div>
                          <div className="barChart">
                            <div className="total">
                              <div className="total_chart_label">
                                {barChatData.map((data) => (
                                  <div key={data.name} className="chart_title">
                                    <div className={`step_icon forest_${data.category}_bg`}>
                                      <img src={`/img/${data.category}_small_icon.svg`} alt={`${data.name} icon`} />
                                    </div>
                                    <span className={`forest_${data.category}_text`}>{data.name}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="total_chart">
                                <TargetBarchartTotal barChartDataTotal={barChartDataTotal} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="target_category">
                          <div className="item_title">
                            <h3>부분별 실천목표</h3>
                          </div>
                          {barChatData
                            .filter((item) => item.name === labels[label])
                            .map((filterBarchartItem, index) => (
                              <div key={index} className="barChart" style={{ width: "100%", height: "280px" }}>
                                <TargetBarchart barChatData={[filterBarchartItem]} />
                              </div>
                            ))}
                        </div>
                        <div className="total_target_co2saving">
                          <p>총 합계</p>
                          <span>{categorySavings.total}kg</span>
                        </div>
                      </div>
                    )
                )}
              </div>
              {/* 이미지 저장시 visibility처리될 구역 */}
              <div className="visibility_for_capture select_content" style={{ display: "none" }}>
                {Object.keys(labels).map((label) => (
                  <div key={label} className="">
                    <div className={`category forest_${label}_bg`}>
                      <div className={`category_title forest_${label}_text`}>
                        <div className="step_icon" style={{ backgroundColor: "white" }}>
                          <img src={`/img/${label}_small_icon.svg`} alt={`${label}_아이콘`}/>
                        </div>
                        <span>{labels[label]}</span>
                      </div>
                      <div className="category_sub">
                        {initialData
                          .filter((item) => item.name === label)
                          .map((filteredItem, index) => (
                            <div key={index}>
                              <label htmlFor={`${filteredItem.name}-${index}`}>
                                <input
                                  type="checkbox"
                                  id={`${label}-${index}`}
                                  name={`${filteredItem.name}-${index}`}
                                  value={filteredItem.savings_value}
                                  // 체크 박스 추적관리
                                  checked={!!checkedItems[`${filteredItem.name}-${index}`]}
                                  // onChange 작성 부분
                                  onChange={handleCheckboxChange}
                                  disabled={
                                    hasResultData || (filteredItem.name === "transportation" && isTransportationOption)
                                  }
                                />
                                <span
                                  className={
                                    !!checkedItems[`${filteredItem.name}-${index}`] ? `forest_${label}_text` : ""
                                  }
                                >
                                  {filteredItem.advice_text}
                                </span>
                              </label>
                              {/* ------------------ 사진 저장시만 표시될 항목*/}
                              {!!checkedItems[`${filteredItem.name}-${index}`] ? (
                                <div style={{ borderTop: "1px solid #999", marginTop: "10px" }}>
                                  <span style={{ paddingLeft: "15px", color: "red" }}>
                                    월간 {checkedItems[`${filteredItem.name}-${index}`]} kg 저감
                                  </span>
                                </div>
                              ) : (
                                ""
                              )}
                              {/* ------------------- */}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="target_co2saving">
                  <div className="item_title">
                    <h3>월간 CO₂ 저감목표</h3>
                  </div>
                  <div className="barChart">
                    <div className="total">
                      <div className="total_chart_label">
                        {barChatData.map((data) => (
                          <div key={data.name} className="chart_title">
                            <div className={`step_icon forest_${data.category}_bg`}>
                              <img src={`/img/${data.category}_small_icon.svg`} alt={`${data.category}_아이콘`}/>
                            </div>
                            <span className={`forest_${data.category}_text`}>{data.name}</span>
                          </div>
                        ))}
                        {/* {console.log("barChatData :",barChatData)}
                        {console.log("barChartDataTotal :",barChartDataTotal)} */}
                      </div>
                      <div className="total_chart">
                        <TargetBarchartTotal barChartDataTotal={barChartDataTotal} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="total_target_co2saving">
                  <p>총 합계</p>
                  <span>{categorySavings.total}kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="result_box">
          <div className="item_title">
            <p>종합평가</p>
          </div>
          <div className="result_box_content">
            <h2>
              <span className="forest_green_text">{userData.username}</span>님의 종합평가입니다.
            </h2>

            <div className="result_total">
              <div className="result_total_left">
                <h3>
                  <span className="forest_green_text">{currentMonth}월</span>
                  <br />
                  이산화탄소 배출현황 및 목표
                </h3>
                <ul>
                  <li>
                    <p>
                      우리집의 이산화탄소 배출량은 총 <span className="forest_green_text">{resultData.total} kg</span>
                      이며, 다른 가정보다 약{" "}
                      <span className="forest_green_text">
                        {((resultData.total / averageData.total) * 100 - 100).toFixed(1)}% 더많이 배출
                      </span>
                      하고 있습니다.
                    </p>
                  </li>
                  <li>
                    <p>
                      부문별로 보면 전기,가스,수도,교통,폐기물의 5개 부문 중{" "}
                      <span className="forest_green_text">{higherItemCount}개 부문</span>에서 다른 가정보다 이산화탄소
                      배출이 많습니다.{" "}
                    </p>
                    {/* 많은 배출이 없다면 "적습니다."조건문 적용 */}
                  </li>
                </ul>
              </div>
              <div className="barChart" style={{ width: "100%", height: "280px" }}>
                <TargetBarchart barChatData={[resultTotalData]} />
              </div>
            </div>
          </div>

          <div className="result_bottom_box">
            <div className="item_title">
              <p>부문별 배출현황 및 목표</p>
            </div>

            <div className="result_box_content">
              {Object.keys(labels).map((label) => (
                <div key={label} className="result_box_content_item">
                  <div className="result_box_content_item_title">
                    <div className={`step_icon forest_${label}_bg`}>
                      <img src={`/img/${label}_small_icon.svg`} alt={`${label}_아이콘`}/>
                    </div>
                    <span className={`forest_${label}_text`}>{labels[label]}</span>
                  </div>
                  {barChatData
                    .filter((item) => item.name === labels[label])
                    .map((filterBarchartItem, index) => (
                      <div key={index} className="barChart" style={{ width: "100%", height: "250px" }}>
                        <TargetBarchart barChatData={[filterBarchartItem]} />
                      </div>
                    ))}
                </div>
              ))}
              <div className="result_box_content_item">
                <div>
                  <p>
                    <span className="forest_green_text">{userData.username}</span>님 가정에서 이산화탄소 배출을 줄이는
                    실천을 하시면 약 <span className="forest_green_text">{categorySavings.total} kg</span>의
                    이산화탄소를 줄일 수 있습니다.
                  </p>
                  <div className="handle_box">
                    {!hasResultData && (
                      <>
                        <p>최종결과를 저장하세요.</p>
                        <div className="save_button">
                          <button onClick={onClickCarbonFootprint}>
                            탄소계산기
                            <br /> 다시하기
                          </button>
                          <button onClick={onSaveClick}>저장</button>
                        </div>
                      </>
                    )}
                    <button onClick={onSaveImage}>이미지로 저장하기</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Result;
