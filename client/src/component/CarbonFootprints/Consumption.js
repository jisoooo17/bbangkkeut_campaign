import React, { useState, useEffect } from "react";

function Consumption({ inputData, initialData, onResultSubmit }) {
  // console.log("계산공식 :", initialData);
  const [inputValue, setInputValue] = useState(inputData); // 예시 입력 값
  const [co2Emission, setCo2Emission] = useState({
    electricity: 0,
    gas: 0,
    water: 0,
    transportation: 0,
    waste: 0,
    total: 0,
  });

  const parent_category_id = {
    transportation: 4,
    waste: 8,
  };

  // parent_category_id가 transportation, waste인 데이터 필터링 및 정렬
  const transportationOptions = initialData
    .filter((item) => item.parent_category_id === parent_category_id.transportation)
    .sort((a, b) => a.id - b.id);
  const wasteOptions = initialData
    .filter((item) => item.parent_category_id === parent_category_id.waste)
    .sort((a, b) => a.id - b.id);

  // 교통 부분의 라디오 버튼 변경 핸들러
  const handleTransportChange = (e) => {
    const { value } = e.target;
    if (value === transportationOptions.length.toString()) {
      // 추가 옵션 선택 시
      // 기본값 설정 또는 특별한 처리
      setInputValue({
        ...inputValue,
        radioOption: value,
        transportation: "0",
      }); // 예시: "0"으로 설정
    } else {
      setInputValue({
        ...inputValue,
        radioOption: value,
        transportation: "",
      }); // 라디오 버튼 선택 시 입력 필드 초기화
    }
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  // Result Data전달
  const handleSubmit = () => {
    // `transportation`이 4항목 (예: "추가 옵션") 선택된 경우를 처리합니다.
    const isTransportationOption = inputValue.radioOption === "3"; // 여기서는 "3"이 4번째 옵션을 의미합니다.

    // `transportation` 제외한 나머지 값들의 유효성 검사
    const isValidEmissionExcludingTransportation = Object.entries(co2Emission).every(([key, value]) => {
      if (key === "transportation") {
        // `transportation`이 4항목 선택된 경우는 유효한 값으로 간주
        return isTransportationOption || parseFloat(value) > 0;
      }
      // 나머지 값들은 0보다 커야 함
      return parseFloat(value) > 0;
    });

    // 유효성 검사가 실패하면 얼럿 표시
    if (!isValidEmissionExcludingTransportation) {
      alert("모든 사용량을 입력해 주세요");
      return; // 함수 실행 중단
    }

    const resultData = co2Emission; // 계산된 결과 데이터
    onResultSubmit(resultData, inputValue, isTransportationOption);

    // 부드럽게 페이지 상단으로 스크롤
    window.scrollTo({
      top: 0, // Y 좌표
      left: 0, // X 좌표
      behavior: "smooth", // 부드러운 스크롤 효과
    });
  };

  // 화면에 처리 할 데이터 가공 함수
  const transformCostFormula = (data, parentCategoryName) => {
    let result = {};
    // 부모 카테고리의 ID 찾기
    const parentCategory = data.find((item) => item.category_name === parentCategoryName);

    if (parentCategory) {
      // 해당 부모 카테고리 ID를 parent_category_id로 가지는 자식들 찾기
      const childCategories = data.filter((item) => item.parent_category_id === parentCategory.id);

      if (childCategories.length > 0) {
        // 자식 데이터가 있는 경우, 각 자식 데이터의 category_name과 cost_formula 처리
        childCategories.forEach((child) => {
          // 문자열 형태의 수식을 그대로 유지
          result[child.category_name ? child.category_name : child.category_name] = child.cost_formula;
        });
      } else {
        // 자식 데이터가 없는 경우, 부모 카테고리 정보만 포함
        result[parentCategoryName] = parentCategory.cost_formula;
      }
    }

    return result;
  };

  // 입력값 계산 로직
  useEffect(() => {
    const handleData = inputValue;
    // console.log("userInputValue :",inputValue);

    const getCostFormula = (costObj, key) => Object.values(costObj)[key] ?? "0";

    const electricityCost = transformCostFormula(initialData, "electricity");
    const gasCost = transformCostFormula(initialData, "gas");
    const waterCost = transformCostFormula(initialData, "water");
    const transportationCost = transformCostFormula(initialData, "transportation");
    const wasteCost = transformCostFormula(initialData, "waste");
    let transportationEmission = "";
    let wasteEmission = 0;

    // Transportation 계산
    if (handleData.radioOption !== "3") {
      const formula = getCostFormula(transportationCost, handleData.radioOption);
      const [val1, val2] = formula.split(" * ").map(Number);
      transportationEmission = (handleData.transportation / val1) * val2;
    } else transportationEmission = 0;

    // Waste 계산
    if (handleData.kg !== "") {
      wasteEmission = handleData.kg * parseFloat(wasteCost["kg"]);
    } else if (handleData.l !== "") {
      const [val1, val2] = Object.values(wasteCost["l"].split(" * ").map(Number));
      wasteEmission = handleData.l * val1 * val2;
    }

    // 각 카테고리별 CO2 배출량 계산 함수
    const calculateEmission = (quantity, cost) => parseFloat(quantity * cost);
    // 개별 값 계산
    const electricityEmission = calculateEmission(handleData.electricity, electricityCost["electricity"]);
    const gasEmission = calculateEmission(handleData.gas, gasCost["gas"]);
    const waterEmission = calculateEmission(handleData.water, waterCost["water"]);
    // Total 계산
    const totalEmission = electricityEmission + gasEmission + waterEmission + transportationEmission + wasteEmission;

    setCo2Emission({
      electricity: electricityEmission.toFixed(1),
      gas: gasEmission.toFixed(1),
      water: waterEmission.toFixed(1),
      transportation: transportationEmission.toFixed(1),
      waste: wasteEmission.toFixed(1),
      total: totalEmission.toFixed(1),
    });
  }, [inputValue]);

  const [activeBox, setAtiveBox] = useState(null);

  const handleActivebox = (boxname) => {
    return setAtiveBox(boxname);
  };

  return (
    <>
      <div className="top_box">
        <div className="title_info">
          <span className="weight_600">월간 사용량(권장)</span>을 입력해주세요
        </div>
      </div>
      <div className="totalbox">
        {initialData
          .filter((item) => item.parent_category_id === null)
          .map((item) => (
            <div
              key={item.id}
              className={`box_item_wrap ${activeBox === item.id ? "active" : ""}`}
              onClick={() => handleActivebox(item.id)}
            >
              <div className={`item_title forest_${item.category_name}_text`}>
                <div className={`step_icon forest_${item.category_name}_bg`}>
                  <img src={`/img/${item.category_name}_small_icon.svg`} alt={`${item.category_name}_이미지`} />
                </div>
                {item.label}
              </div>
              <div className="box_item">
                {/* 교통 부분 라디오 버튼 구현 */}
                {item.category_name === "transportation" && (
                  <div className="input_box">
                    <div className="input_box_left">
                      <p>승용차 종류</p>
                    </div>
                    <div className="radioBox">
                      {/* 이 div가 모든 라디오 버튼들을 감싸는 컨테이너 역할을 합니다. */}
                      {transportationOptions.map((option, idx) => (
                        <div key={option.id}>
                          <input
                            type="radio"
                            name="radioOption"
                            id={`radioOption${option.id}`}
                            value={idx} // ID를 0부터 시작하는 값으로 설정
                            checked={inputValue.radioOption === `${idx}`}
                            onChange={handleTransportChange}
                          />
                          <label htmlFor={`radioOption${option.id}`}>{option.sublabel}</label>
                        </div>
                      ))}
                      {/* 교통 부분 추가 라디오 버튼 */}
                      {item.category_name === "transportation" && (
                        <div>
                          <input
                            type="radio"
                            name="radioOption"
                            id="radioOption8"
                            value={transportationOptions.length.toString()} // 별도의 라디오 버튼 값
                            checked={inputValue.radioOption === transportationOptions.length.toString()}
                            onChange={handleTransportChange}
                          />
                          <label htmlFor="radioOption8">차량 없음</label>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* unit이 있고 category_name이 "waste"가 아닌 경우에만 입력 필드 생성 */}
                {item.unit && item.category_name !== "waste" && (
                  <>
                    <div className="input_box">
                      <div className="input_box_left">
                        <p>{item.label} 사용량</p>
                      </div>
                      <div className="input_box_right">
                        <input
                          type="number"
                          name={item.category_name}
                          placeholder="숫자 입력..."
                          value={inputValue[item.category_name]}
                          onChange={handleChange}
                          disabled={item.category_name === "transportation" && inputValue.radioOption === "3"} // 네 번째 라디오 버튼 선택 시 비활성화
                        />
                        <span>{item.unit}/월</span>
                      </div>
                    </div>
                  </>
                )}
                {/* 폐기물 관련 입력 필드 구현 */}
                {item.category_name === "waste" &&
                  initialData
                    .filter((subItem) => subItem.parent_category_id === item.id)
                    .map((subItem) => (
                      <div key={subItem.id} className="input_box">
                        <div className="input_box_left">
                          <p>폐기물 사용량</p>
                        </div>
                        <div className="input_box_right">
                          <input
                            type="number"
                            name={subItem.category_name}
                            placeholder={"숫자 입력..."}
                            value={inputValue[subItem.category_name]}
                            onChange={(e) => {
                              // 선택된 폐기물 입력값 설정 및 다른 필드 초기화
                              const newConsumption = {
                                ...inputValue,
                                kg: subItem.category_name === "kg" ? e.target.value : "",
                                l: subItem.category_name === "l" ? e.target.value : "",
                                [subItem.category_name]: e.target.value,
                              };
                              setInputValue(newConsumption);
                            }}
                          />
                          <span>{subItem.unit}/월</span>
                        </div>
                      </div>
                    ))}
                {/* 각 구역 마지막 부분에 출력값 입력 필드 추가 */}
                <div className="input_box">
                  <div className="input_box_left">
                    <p>CO₂발생량</p>
                  </div>
                  <div className="input_box_right">
                    <input
                      className="weight_600 co2Emission"
                      type="number"
                      placeholder="출력값"
                      value={co2Emission[item.category_name]} // 예시로 입력값을 그대로 출력; 실제 로직에 따라 변경 필요
                      readOnly
                    />
                    <span>kg/월</span>
                  </div>
                </div>
                <div className="cost_formula">
                  {item.category_name === "transportation" ? (
                    <>
                      <span>{item.label} CO₂발생량 |</span>
                      {transportationOptions.map((option, idx) => (
                        <p key={idx}>
                          {option.sublabel}: (이동거리 / {option.cost_formula})
                        </p>
                      ))}
                    </>
                  ) : item.category_name === "waste" ? (
                    <>
                      <span>{item.label} CO₂발생량 | </span>
                      {wasteOptions.map((option, idx) => (
                        <p key={idx}>
                          {option.unit}: (폐기물사용량 * {option.cost_formula})
                        </p>
                      ))}
                    </>
                  ) : (
                    <>
                      <span>{item.label} CO₂발생량 | </span>
                      <p>
                        ({item.label} 사용량 {item.cost_formula})
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="bottom_box">
        <div className="bottom_box_title">
          <h3>전체 에너지원CO₂ 발생 합계</h3>
        </div>
        <div className="bottom_box_content">
          <div className="box_item">
            <div className="input_box">
              <div className="input_box_left">
                <p>CO₂ 발생량</p>
              </div>
              <div className="input_box_right">
                <input
                  className="weight_600 co2Emission"
                  type="number"
                  placeholder="total"
                  value={co2Emission.total}
                  readOnly
                />
                <span>kg/월</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom_box_info">
          <p>※ 생활 속에서 발생되는 이산화탄소의 양을 계산해보고 이산화탄소 발생을줄이는 실천방법도 확인하세요!</p>
        </div>
        <div className="bottom_box_button_box">
          <button onClick={handleSubmit}>제출하기</button>
        </div>
      </div>
    </>
  );
}

export default Consumption;
