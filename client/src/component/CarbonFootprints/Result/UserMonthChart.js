import React, { useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Sector, Cell, Legend, ResponsiveContainer } from "recharts";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import UserSavingChart from "./UserSavingChart";
import TargetBarchartTotal from "./TargetBarchartTotal";

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@_DATA 형상_(목적)@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// const userData = [
//   {
//     year: "2024",
//     months: [
//       {
//         month: "1",
//         details: [
//           { category: "electricity", label: "전기", value: "95.6" },
//           { category: "gas", label: "가스", value: "435.2" },
//           { category: "water", label: "수도", value: "6.7" },
//           { category: "transportation", label: "교통", value: "91.5" },
//           { category: "waste", label: "폐기물", value: "6.7" },
//           { category: "total", label: "전체", value: "652.7" },
//         ],
//       },
//       {
//         month: "2",
//         details: [
//           { category: "electricity", label: "전기", value: "95.6" },
//           { category: "gas", label: "가스", value: "435.2" },
//           { category: "water", label: "수도", value: "6.7" },
//           { category: "transportation", label: "교통", value: "91.5" },
//           { category: "waste", label: "폐기물", value: "6.7" },
//           { category: "total", label: "전체", value: "652.7" },
//         ],
//       },
//       {
//         month: "3",
//         details: [
//           { category: "electricity", label: "전기", value: "95.6" },
//           { category: "gas", label: "가스", value: "435.2" },
//           { category: "water", label: "수도", value: "6.7" },
//           { category: "transportation", label: "교통", value: "91.5" },
//           { category: "waste", label: "폐기물", value: "6.7" },
//           { category: "total", label: "전체", value: "652.7" },
//         ],
//       },
//     ],
//   },
// ];

// 전기, 가스, 수도, 교통, 폐기물, total
// const COLORS = ["#316EE6", "#FE7713", "#A364FF", "#FE5A82", "#4ACC9C", "#FF8042"];
const COLORS = {
  electricity: "#316EE6",
  gas: "#FE7713",
  water: "#A364FF",
  transportation: "#FE5A82",
  waste: "#4ACC9C",
  total: "#FF8042",
};
// const labels = {
//   electricity: "전기",
//   gas: "가스",
//   water: "수도",
//   transportation: "교통",
//   waste: "폐기물",
//   total: "전체",
// };

// const data3 = [
//   {
//     category: "electricity",
//     name: "전기",
//     value: -7.0,
//     color: "#316EE6",
//     maxVlaue: 1000,
//     minVlaue: -1000,
//   },
//   {
//     category: "gas",
//     name: "가스",
//     value: -676.8,
//     color: "#FE7713",
//     maxVlaue: 1000,
//     minVlaue: -1000,
//   },
//   {
//     category: "water",
//     name: "수도",
//     value: "4.3",
//     color: "#A364FF",
//     maxVlaue: 1000,
//     minVlaue: -1000,
//   },
//   {
//     category: "transportation",
//     name: "교통",
//     value: "39.1",
//     color: "#FE5A82",
//     maxVlaue: 1000,
//     minVlaue: -1000,
//   },
//   {
//     category: "waste",
//     name: "폐기물",
//     value: "14.6",
//     color: "#4ACC9C",
//     maxVlaue: 1000,
//     minVlaue: -1000,
//   },
// ];
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

function UserMonthChart() {
  const navigate = useNavigate();
  const storedUserData = sessionStorage.getItem("userData"); // 세션접근
  const userData = JSON.parse(storedUserData); // 세션 userData 획득
  const [mypageInitialData, setMypageInitialData] = useState([]); //mypage data

  const [resultDataSet, setResultDataSet] = useState([]);

  const [activeIndex, setActiveIndex] = useState(0); // 차트 상태관리
  // 주 차트 데이터
  const [currentMonthchartData, setCurrentMonthchartData] = useState([]);
  // 보조 차트 데이터
  const [previousMonthchartData, setPreviousMonthchartData] = useState([
    {
      category: "electricity",
      label: "전기",
      value: 0.0,
    },
    {
      category: "gas",
      label: "가스",
      value: 0.0,
    },
    {
      category: "water",
      label: "수도",
      value: 0.0,
    },
    {
      category: "transportation",
      label: "교통",
      value: 0.0,
    },
    {
      category: "waste",
      label: "폐기물",
      value: 0.0,
    },
  ]);

  // 저감달성 차트 데이터
  const [categorySavings, setCategorySavings] = useState([
    {
      category: "electricity",
      name: "전기",
      value: 0,
      color: "#316EE6",
      maxValaue: 1000,
      minValaue: -1000,
    },
    {
      category: "gas",
      name: "가스",
      value: 0,
      color: "#FE7713",
      maxValaue: 1000,
      minValaue: -1000,
    },
    {
      category: "water",
      name: "수도",
      value: 0,
      color: "#A364FF",
      maxValaue: 1000,
      minValaue: -1000,
    },
    {
      category: "transportation",
      name: "교통",
      value: 0,
      color: "#FE5A82",
      maxValaue: 1000,
      minValaue: -1000,
    },
    {
      category: "waste",
      name: "폐기물",
      value: 0,
      color: "#4ACC9C",
      maxValaue: 1000,
      minValaue: -1000,
    },
  ]);

  // 렌더시 현재 날자 데이터 획득
  const [startDate, setStartDate] = useState(new Date());
  const [checkYear, setCheckYear] = useState(startDate.getFullYear());
  // @@@@@@@@@@@@@@@@

  const [beforeMonth, setBeforeMonth] = useState(null);
  const [checkMonth, setCheckMonth] = useState(startDate.getMonth() + 1);
  const [thisMonth, setThisMonth] = useState(startDate.getMonth() + 1);

  const [isDataCheck, setIsDataCheck] = useState(false);

  const [isActive, setIsActive] = useState(true);

  // 데이터 피커
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [buttonCSS, setButtonCSS] = useState();

  // 차트 에니메이션
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className={`example-custom-input ${buttonCSS}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onClick={(e) => {
        onClick(e);
        setIsClicked(true);
        setButtonCSS("active");
      }}
      ref={ref}
    >
      {value}
    </button>
  ));

  useEffect(() => {
    setCheckYear(startDate.getFullYear());
    setCheckMonth(startDate.getMonth() + 1);
  }, [startDate]);

  // 에니메이면 클래스 추가
  useEffect(() => {
    // 컴포넌트가 마운트된 후 1.8초 후에 클래스를 제거
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 1800);

    // 컴포넌트가 언마운트될 때 타이머를 정리
    return () => clearTimeout(timer);
  }, []);

  // 데이터 획득
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/carbonFootprint/mypage/${userData.userid}`);
        const data = await response.json();
        setMypageInitialData(data.mypageInitialData); // 초기 데이터 상태 업데이트
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  // 획득 데이터 확인시 데이터 전달
  useEffect(() => {
    if (mypageInitialData) {
      // mypageInitialData가 설정되었을 때만 transformData를 호출
      setResultDataSet(transformData(mypageInitialData));
      // setChartData(resultDataSet[0].months[0]);
    }
  }, [mypageInitialData]); // mypageInitialData가 변경될 때마다 이 useEffect 실행

  // 데이터 포멧변경 함수
  const transformData = (data) => {
    // 데이터베이스 획득 데이터 년[{월[{...}]}] 형식 변경
    if (!data) {
      // data가 null이면 빈 배열을 반환
      return [];
    }

    const groupedData = {};

    data.forEach((entry) => {
      const date = new Date(entry.calculation_month);
      const year = date.getFullYear().toString();
      const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해준다.

      const details = [
        { category: "electricity", label: "전기", value: parseFloat(entry.electricity) },
        { category: "gas", label: "가스", value: parseFloat(entry.gas) },
        { category: "water", label: "수도", value: parseFloat(entry.water) },
        { category: "transportation", label: "교통", value: parseFloat(entry.transportation) },
        { category: "waste", label: "폐기물", value: parseFloat(entry.waste) },
        { category: "total", label: "전체", value: parseFloat(entry.total) },
      ];

      if (!groupedData[year]) {
        groupedData[year] = [];
      }

      groupedData[year].push({ month, details });
    });

    return Object.keys(groupedData).map((year) => ({
      year,
      months: groupedData[year],
    }));
  };

  // 지정월 / 최근월 차트 데이터 여부 확인 및 획득
  useEffect(() => {
    // 현재 년/월이 기본값으로 데이터 셋을 점검
    if (resultDataSet && resultDataSet.length > 0) {
      const selectedYearData = resultDataSet.find((d) => d.year === checkYear.toString());
      // console.log(selectedYearData);
      if (selectedYearData) {
        const selectedCurrentMonthData = selectedYearData.months.find((m) => m.month === checkMonth);
        const selectedPreviousMonthData = selectedYearData.months.filter((m) => m.month < checkMonth).sort((a, b) => b.month - a.month);

        // 데이터가 있다면
        if (selectedCurrentMonthData) {
          setIsDataCheck(true);
          const filteredCurrentMonthData = selectedCurrentMonthData.details.filter((item) => item.category !== "total");
          setCurrentMonthchartData(filteredCurrentMonthData);
          if (selectedPreviousMonthData.length === 0) {
            setBeforeMonth(false);
            setPreviousMonthchartData([
              {
                category: "electricity",
                label: "전기",
                value: 0.0,
              },
              {
                category: "gas",
                label: "가스",
                value: 0.0,
              },
              {
                category: "water",
                label: "수도",
                value: 0.0,
              },
              {
                category: "transportation",
                label: "교통",
                value: 0.0,
              },
              {
                category: "waste",
                label: "폐기물",
                value: 0.0,
              },
            ]);
            return;
          }
          const filteredPreviousMonthData = selectedPreviousMonthData[0].details.filter((item) => item.category !== "total");
          setBeforeMonth(selectedPreviousMonthData[0].month);
          setPreviousMonthchartData(filteredPreviousMonthData);
        } else {
          // console.log("데이터 없음");
          setIsDataCheck(false);
        }
      } else setIsDataCheck(false);
    }
  }, [resultDataSet, checkYear, checkMonth]);

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@_차트 관련_@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  const onPieEnter = (_, index) => {
    setActiveIndex(index); // 활성 인덱스 업데이트
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    return (
      <g>
        <text style={{ fontSize: "20px", fontWeight: 900 }} x={cx} y={cy - 20} dy={8} textAnchor="middle" fill={fill}>
          {payload.label}
        </text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius + 5} outerRadius={outerRadius + 5} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={innerRadius - 10} outerRadius={innerRadius - 3} fill={fill} />
        <text x={cx + 5} y={cy + 20} textAnchor="middle" fill="#333" style={{ fontSize: "18px", fontWeight: 700 }}>{`${value} kg`}</text>
      </g>
    );
  };

  const renderActiveShape1 = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, value } = props;
    return (
      <g>
        <text style={{ fontSize: "20px" }} x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#AAC">
          {`${beforeMonth} 월`}
        </text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={1} />
        <text x={cx + 5} y={cy + 20} textAnchor="middle" fill="#333" style={{ fontSize: "16px", fontWeight: 700 }}>{`${value} kg`}</text>
      </g>
    );
  };

  useEffect(() => {
    if (isDataCheck) {
      //화명 true며
      if (beforeMonth) {
        const updateCategorySavings = () => {
          const updatedCategorySavings = categorySavings.map((entry, index) => {
            const previousValue = currentMonthchartData[index].value;
            const currentValue = previousMonthchartData[index].value;
            const maxValaue = Math.max(previousValue, currentValue);
            const minValaue = Math.min(previousValue, currentValue);
            const savings = parseFloat((previousValue - currentValue).toFixed(1));
            return { ...entry, value: savings, maxValaue: maxValaue, minValaue: minValaue };
          });
          setCategorySavings(updatedCategorySavings);
        };
        updateCategorySavings();
      } else {
        const updateCategorySavings = () => {
          const updatedCategorySavings = categorySavings.map((entry, index) => {
            const currentValue = currentMonthchartData[index].value;
            const maxValaue = currentValue;
            const minValaue = currentValue;
            const savings = parseFloat(currentValue.toFixed(1));
            return { ...entry, value: savings, maxValaue: maxValaue, minValaue: minValaue };
          });
          setCategorySavings(updatedCategorySavings);
        };
        updateCategorySavings();
      }
    }
  }, [currentMonthchartData]);

  const CustomLegend = (props) => {
    // 목록 커스텀
    const { categorySavings } = props;

    return (
      <ul className={`mypage-left-chart__ul ${isActive ? "load" : ""}`}>
        <li>{beforeMonth}월 대비 저감량</li>
        {categorySavings.map((entry, index) => (
          <li key={`item-${index}`}>
            <div>
              <svg width="14" height="14" style={{ marginRight: 10 }}>
                <rect width="14" height="14" fill={COLORS[entry.category]} />
              </svg>
              <span>{entry.name}</span>
              {entry.value > 0 ? <span style={{ color: "red" }}>+{entry.value.toFixed(1)} kg</span> : <span style={{ color: "#0095ff" }}>{entry.value.toFixed(1)} kg</span>}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  // 콘솔 확인
  console.log("userId:", userData.userid);
  // console.log("초기 mypageInitialData: ", mypageInitialData);
  // console.log("초기 calculationAdviceData: ", calculationAdviceData);
  // console.log("resultDataSet :", resultDataSet);

  // console.log("fill", COLORS["electricity"]);
  // console.log("현재 년", year);
  // console.log("현재 월", month);
  // console.log("현재 월데이터", currentMonthchartData);
  // console.log("전 월데이터", previousMonthchartData);

  const undefinedDataRender = (
    <div className="mypage-userchart">
      <div className="no-data-w">
        <div className="no-data">
          <p className="tit">계산 결과가 없습니다.</p>
          {thisMonth === checkMonth ? (
            <button onClick={() => navigate("/carbonFootprint")}>
              내 탄소발자국
              <br />
              계산하러가기
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );

  const userChartRender = (
    <div>
      <div className="mypage-userchart">
        <div className="mypage-userchart__left">
          <div className="mypage-userchart-left__chartarea">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={currentMonthchartData}
                  nameKey="label"
                  cx="center"
                  cy={160}
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {currentMonthchartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.category]} />
                  ))}
                </Pie>
                {beforeMonth && <Legend content={<CustomLegend categorySavings={categorySavings} />} />}
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape1}
                  data={previousMonthchartData}
                  nameKey="label"
                  cx={70}
                  cy={70}
                  innerRadius={45}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {previousMonthchartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.category]} opacity={0.5} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={`mypage-userchart__title ${isActive ? "load" : ""}`}>
            <h2>
              <span className="forest_green_text">{checkMonth}</span>월 결과안내
            </h2>
          </div>
        </div>
        <div className="mypage-userchart__right">
          <div className="target_co2saving">
            <div className="item_title">{beforeMonth ? <h3>월간 CO₂ 저감 달성량</h3> : <h3>월간 CO₂ 사용량</h3>}</div>
            <div className="barChart">
              <div className="total">
                <div className="total_chart_label">
                  {categorySavings.map((data) => (
                    <div key={data.name} className="chart_title">
                      <div className={`step_icon forest_${data.category}_bg`}>
                        <img src={`/img/${data.category}_small_icon.svg`} alt={`${data.category}_아이콘`} />
                      </div>
                      <span className={`forest_${data.category}_text`}>{data.name}</span>
                    </div>
                  ))}
                </div>
                <div className="total_chart">{beforeMonth ? <UserSavingChart barChartDataTotal={categorySavings} /> : <TargetBarchartTotal barChartDataTotal={categorySavings} />}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="carbon-myage-title-wrap">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy년 MM월"
          showMonthYearPicker
          showFullMonthYearPicker
          open={isHovered || isClicked}
          customInput={<ExampleCustomInput />}
          onClickOutside={() => setIsClicked(false)}
        />
        <div>
          <h2>
            <span className="forest_green_text">{checkYear}</span>년 <span className="forest_green_text">{checkMonth}</span>월 계산결과
          </h2>
        </div>
      </div>
      {!isDataCheck ? undefinedDataRender : userChartRender}
    </>
  );
}

export default UserMonthChart;
