import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Example = () => {
  const navigate = useNavigate();
  const [mainInitialData, setMainInitialData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 현재 월을 기본값으로 설정
  const [opacity, setOpacity] = useState({ user: 0.3, average: 0.3 });
  const [isLoggedin, setIsLoggedin] = useState("");

  const handleMouseEnter = (o) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 1 });
  };

  const handleMouseLeave = (o) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 0.3 });
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/carbonFootprint/main`);
        const data = await response.json();
        setMainInitialData(data); // 초기 데이터 상태 업데이트
        // console.log(data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();

    setIsLoggedin(sessionStorage.length);
  }, [isLoggedin]);

  // 평균 데이터
  const averageData = { electricity: 32.5, gas: 38.9, water: 1.6, transportation: 270.8, waste: 0.6, total: 344.4 };

  const labels = {
    electricity: "전기",
    gas: "가스",
    water: "수도",
    transportation: "교통",
    waste: "폐기물",
    total: "total",
  };

  const colors = {
    전기: "#457CE8",
    가스: "#FE842A",
    수도: "#AC73FF",
    교통: "#FE6A8E",
    폐기물: "#5CD1A6",
    total: "#F4DD7C",
  };

  // ################################################################################################################### user data set (consol.log)
  // console.log("mainInitialData", mainInitialData);
  // ################################################################################################################### 평균 data set (consol.log)
  // console.log("averageData", averageData);

  // user data 변경 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // 조건 : 1)년도는 1개년도 고정, 2)항목(5개)별 평균값

  // 변경 data-----------------
  // const data = [
  //   {
  //     currentMonth: mainInitialData.calculation_month의 월만
  //     name: labels의 값,
  //     user: labels별 mainInitialData의 평균,
  //     average: labels별 averageData 값,
  //     usertotal: mainInitialData.total의 평균,
  //     averagetotal: averageData.total값,
  //   }];
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  // 함수작성 부분
  const transformData = (mainInitialData) => {
    if (!mainInitialData || mainInitialData.length === 0) {
      return { transformed: [], months: [] };
    }

    const groupedByMonth = {};
    const uniqueMonths = new Set();

    // 월별로 데이터 그룹화
    mainInitialData.forEach((item) => {
      const month = new Date(item.calculation_month).getMonth() + 1;
      uniqueMonths.add(month);

      if (!groupedByMonth[month]) {
        groupedByMonth[month] = [];
      }
      groupedByMonth[month].push(item);
    });

    // 각 월별로 데이터 변환
    const transformed = Object.keys(groupedByMonth).flatMap((month) => {
      const items = groupedByMonth[month];
      const sum = {};
      const count = {};

      // 데이터 초기화 및 합계 계산
      Object.keys(labels).forEach((key) => {
        sum[key] = 0;
        count[key] = 0;

        items.forEach((item) => {
          if (key !== "total") {
            sum[key] += parseFloat(item[key]);
            count[key]++;
          }
        });

        sum["total"] += parseFloat(items[0]["total"]);
        count["total"]++;
      });

      // 평균 계산 및 데이터 구조 생성
      return Object.keys(labels).map((key) => ({
        currentMonth: parseInt(month, 10),
        name: labels[key],
        user: parseFloat((sum[key] / count[key]).toFixed(1)) || 0,
        average: averageData[key] || 0,
        usertotal: sum["total"] / count["total"] || 0,
        averagetotal: averageData["total"] || 0,
      }));
    });

    // 고유 월 목록 반환
    const months = Array.from(uniqueMonths).sort((a, b) => a - b);

    return { transformed, months };
  };

  const transformedData = transformData(mainInitialData).transformed;
  const uniqueMonthsData = transformData(mainInitialData).months;
  // ################################################################################################################### chart데이터 및 user데이터 월단위 fillter (consol.log)
  // console.log("transformedData", transformedData);
  // console.log("uniqueMonthsData", uniqueMonthsData);

  // 변환된 데이터를 현재 선택된 월에 따라 필터링
  const filteredData = transformedData.filter((data) => data.currentMonth === selectedMonth);
  // ################################################################################################################### chart데이터 월단위 분할 (consol.log)
  // console.log("filteredData", filteredData);

  const CustomTick = (props) => {
    const { x, y, payload } = props;

    const color = colors[payload.value] || "#000000"; // 기본 색상은 검정색으로 설정

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={25} fill={color} fontSize="18px" fontWeight="bold" textAnchor="middle">
          <tspan>{payload.value}</tspan>
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // payload[0]는 현재 호버링되고 있는 데이터 포인트의 정보를 담고 있습니다.
      const data = payload[0].payload; // 툴팁에 표시될 전체 데이터 객체를 가져옵니다.

      // 데이터 객체에서 name, average, user 값을 추출합니다.
      const { name, average, user } = data;

      // 색상은 name을 키로 사용하여 colors 객체에서 동적으로 결정합니다.
      const color = colors[name] || "#000"; // 기본값으로 검정색을 설정합니다.

      return (
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            lineHeight: 3,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "0 20px",
          }}
        >
          <p style={{ color: color, fontWeight: "bold" }}>-{name} 평균-</p>
          <p style={{ color: "#ccc" }}>{`평균: ${average} kg`}</p>
          <p style={{ color: color }}>{`사용자: ${user} kg`}</p>
        </div>
      );
    }

    return null;
  };
  // console.log(sessionStorage.length);
  const carbonNavigate = () => {
    if (isLoggedin === 0) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/Login");
    } else {
      navigate("/carbonFootprint");
      window.scrollTo({
        top: 0, // Y 좌표
        left: 0, // X 좌표
        behavior: "smooth", // 부드러운 스크롤 효과
      });
    }
  };

  // 배경이미지 에니메이션 효과
  window.onscroll = function () {
    var windowScroll = window.scrollY; // 현재 스크롤 위치
    var desiredScrollPosition = 1600; // 이미지가 선명해지기 시작할 스크롤 위치

    var images = document.querySelectorAll(".main_chart_img img"); // 두 이미지 모두 선택

    images.forEach((image) => {
      if (windowScroll >= desiredScrollPosition) {
        image.style.opacity = 1; // 스크롤 위치에 도달하면 이미지를 선명하게
      } else {
        image.style.opacity = 0; // 그렇지 않으면 이미지를 투명하게
      }
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="main_chart_img_left main_chart_img">
        <img src="/img/main_chart_img_left_bg.png" alt="왼쪽 배경" />
        {/* <img className="main_chart_img_left" src="/img/Wind_turbine_bro.svg"/> */}
      </div>
      <div className="main_chart_img_right main_chart_img">
        {/* <img src="/img/foot.png" /> */}
        <img className="main_chart_img_left" src="/img/foot_3.svg" alt="오른쪽 배경" />
      </div>
      <div className="mainchart_wrap">
        <div className="mainchart_title">
          <div className="mainchart_title_month">
            <select onChange={handleMonthChange} value={selectedMonth}>
              {uniqueMonthsData.map((month, index) => (
                <option key={index} value={month}>
                  {month}월
                </option>
              ))}
            </select>
          </div>
          <div className="mainchart_title_left">
            {filteredData.length !== 0 ? (
              <>
                <p>
                  여러분의 <span className="forest_green_text">{selectedMonth}월</span>의 <br />
                  평균 탄소배출 평균(총량)은 <span className="forest_green_text">{filteredData[0].usertotal} kg</span>
                  /월 입니다.
                </p>
              </>
            ) : (
              <>아직 {selectedMonth}월의 평균 탄소배출 총량은 집계 되지 않았어요</>
            )}
          </div>
        </div>
        <div className="mainchart_content">
          <ResponsiveContainer width="100%" height={450}>
            <LineChart
              width={500}
              height={400}
              data={filteredData}
              margin={{
                top: 20,
                right: 40,
                left: 20,
                bottom: 15,
              }}
            >
              <CartesianGrid strokeDasharray="7 7" />
              <XAxis dataKey="name" tick={<CustomTick />} />
              <YAxis />
              <Tooltip content={CustomTooltip} />

              <Legend
                wrapperStyle={{ fontSize: "25px", fontWeight: "bold", lineHeight: 2 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                formatter={(value) => {
                  if (value === "average") return "평균";
                  if (value === "user") return "빵끗";
                  return value;
                }}
                height={80}
                iconSize={50}
                layout="horizontal"
                verticalAlign="top"
              />
              <Line
                type="monotone"
                dataKey="average"
                strokeOpacity={opacity.average}
                stroke="#F4DD7C"
                activeDot={{ r: 10 }}
                strokeWidth={5}
                dot={{ strokeWidth: 1, r: 8, stroke: "#fff", fill: "#F4DD7C" }}
              />
              <Line
                type="monotone"
                dataKey="user"
                strokeOpacity={opacity.user}
                stroke="#82ca9d"
                activeDot={{ r: 20 }}
                strokeWidth={5}
                dot={{ strokeWidth: 1, r: 8, stroke: "#fff", fill: "#82ca9d" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mainchart_content_bottom">
          <button onClick={carbonNavigate}>
            내 탄소발자국
            <br />
            계산하러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Example;
