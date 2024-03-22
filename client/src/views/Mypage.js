import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getPost } from "../store/store";
import axios from "axios";
import Header from "../component/Header";
import Footer from "../component/Footer";
import MyCampaign from "../component/campaign/MyCampaign";
import MyApplication from "../component/campaign/MyApplication";
// user 월별 차트
import UserMonthChart from "../component/CarbonFootprints/Result/UserMonthChart";

function Mypage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const storedUserData = sessionStorage.getItem("userData");
  const userData = JSON.parse(storedUserData);

  // 글 목록
  const [campaignList, setCampaignList] = useState([]); // 내가 쓴 글
  const [application, setApplication] = useState([]); // 신청한 캠페인 목록

  // 현재 선택된 탭 인덱스
  const [activeTab, setActiveTab] = useState(0);

  // 캠페인 데이터 불러옴
  useEffect(() => {
    dispatch(getPost())
      .then((res) => {
        if (res.payload) {
          let arrPost = [...res.payload];
          setCampaignList(arrPost.reverse());
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // 신청한 캠페인 목록 불러옴
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/campaign/form/all`);
        const filteredData = response.data.filter((item) => {
          return item.userid === userData.userid;
        });

        setApplication(filteredData);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // 버튼 탭 클릭 이벤트
  const handleTabClick = (index) => {
    setActiveTab(index);
    // 클릭한 탭에 active 클래스 추가
    const tabList = document.querySelectorAll(".tab-area .btn-tab");
    tabList.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });
  };

  window.scrollTo({top: 0, behavior: "auto", });
  return (
    <div id="wrap" className="mypage">
      <Header />
      <div className="content-w">
        <div className="inner">
          <div className="tit-wrap">
            <div className="tit"> Mypage</div>
          </div>
          <div className="tab-wrap">
            {/* 탭 버튼 영역 */}
            <div className="tab-area">
              {/* 각 탭 클릭시 handleTabClick 함수 호출 */}
              <button className={`btn-tab ${activeTab === 0 ? "active" : ""}`} onClick={() => handleTabClick(0)}>
                내가 쓴 글
              </button>
              <button className={`btn-tab ${activeTab === 1 ? "active" : ""}`} onClick={() => handleTabClick(1)}>
                신청한 캠페인
              </button>
              <button className={`btn-tab ${activeTab === 2 ? "active" : ""}`} onClick={() => handleTabClick(2)}>
                탄소 발자국
              </button>
            </div>
            {/* 콘텐츠 영역 */}
            <div className="content-area">
              {/* 내가 쓴 캠페인 글 */}
              {activeTab === 0 && (
                <MyCampaign campaignList={campaignList} userData={userData}/>
              )}
              {/* 신청한 캠페인 */}
              {activeTab === 1 && (
                <MyApplication campaignList={campaignList} application={application}/>
              )}

              {/* 탄소발자국 */}
              {activeTab === 2 && (
                <div className="mycont-wrap">
                  <div className="cont-area">
                    
                      <UserMonthChart />
                      {/* <div className="no-data-w">
                      <div className="no-data">
                        <p className="tit">발자국 계산 내역이 없습니다.</p>
                      </div>
                    </div> */}
                    </div>
                  </div>

              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Mypage;
