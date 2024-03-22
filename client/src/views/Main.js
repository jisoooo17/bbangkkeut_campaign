import React, { useEffect, useState, useRef } from 'react';
import Header from '../component/Header';
import { getPost } from '../store/store';
import { useDispatch } from 'react-redux';
import TextList from '../component/campaign/TextList';
import Footer from '../component/Footer';
import {gsap} from "gsap";

import { Swiper, SwiperSlide } from 'swiper/react';

// 0229 상호형 메인 Chart
import LegendEffectOpacityChart from'../component/CarbonFootprints/Result/LegendEffectOpacityChart';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';


const Main = () => {
  const dispatch = useDispatch();

  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    if (swiper) {
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [swiper]);
  
  // 글 목록
  const [campaignList, setCampaignList] = useState([]); 
  const [mainCampaignList, setmainCampaignList] = useState([]); 


  // 메인 비주얼 모션
  useEffect(()=>{
    document.querySelector(".main-visual").style.height = window.innerHeight + "px";

    gsap.to(".main-visual .txt", { duration: 1, y: 0, opacity: 1, delay: 0.4, ease: "power2.out" });
    gsap.to(".main-visual .sub-txt", { duration: 1, y: 0, opacity: 1, delay: 0.5, ease: "power2.out" });
  });

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

  useEffect(() => {
    if (campaignList.length > 0) {
      const firstThreeItems = MainCampaignList(); 
      setmainCampaignList(firstThreeItems);
    }
  }, [campaignList]);
  
  const MainCampaignList = () => {
    const firstThreeItems = campaignList.slice(0, 6); 
    return firstThreeItems;
  };

  // 스크롤 모션
  let getScrollObjY = function() {
    let arrY = [];
    let scrollMotions = document.querySelectorAll(".scroll-motion");

    scrollMotions.forEach(function(el) {
      let offsetTop = el.getBoundingClientRect().top + window.pageYOffset;
      arrY.push(parseInt(offsetTop));
    });

    return arrY;
  };

  window.addEventListener("scroll", function() {
    let scrollMotions = document.querySelectorAll(".scroll-motion");
    let scrollY = window.scrollY || window.pageYOffset;

    scrollMotions.forEach(function(el, q) {
      if (scrollY + window.innerHeight > getScrollObjY()[q]) {
        el.classList.add("active");
      }
    });
  });

  return (
    <div id="wrap" className='main'>
      <Header />
      {/* 키비주얼 영역 */}
      <section className="main-visual">
        <div className="img-wrap">
          {/* <video id="main_video0" src={process.env.PUBLIC_URL + '/img/main-video.mp4'} autoPlay loop muted preload="auto" playsInline></video> */}
          <img src={process.env.PUBLIC_URL + '/img/bg-key-visual5.jpg'} alt="Default Campaign Image" />
        </div>

        <div className="txt-wrap">
          <p className="txt">나의 행동이 <br/>지구를 위한 발걸음이 되도록</p>
          <p className="sub-txt">탄소 중립을 향한 여정을 함께하세요.</p>
        </div>

        <div className="scroll-mark">
          <div className="bar">
            <div className="move-bar"></div>
          </div>
          <div className="text">Scroll Down</div>
        </div>
      </section>

      {/* 캠페인 소개 */}
      <section className="campaign">
        <div className="inner">
          <div className="txt-area scroll-motion">
            <p className="sec-tit">캠페인</p>
            <p className="sec-txt">우리는 탄소 중립 난제를 해결하고 녹색 성장을 이끌어내기 위해 모이고 있습니다.</p>
          </div>

          <div className="cont-area scroll-motion">
            <Swiper loop={true} slidesPerView={3} spaceBetween={20} className="mySwiper" onSwiper={setSwiper} modules={[Navigation]} 
              navigation={{ // navigation 활성화
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next'
              }}
            >
              {mainCampaignList.map((data, i) => (
                <SwiperSlide key={i}>
                  <TextList campaignList={data} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="custom-swiper-navigation">
              <button className="swiper-button-prev"></button>
              <button className="swiper-button-next"></button>
            </div>
          </div>
        </div>
      </section>

      <section className='carbon'>
      <div className="inner">
          <div className="txt-area scroll-motion">
            <p className="sec-tit">탄소발자국</p>
            <p className="sec-txt">우리들의 생활 속에서 배출하는 이산화탄소의 양은 얼마일까요?</p>
          </div>

          <div className="cont-area scroll-motion">
            <LegendEffectOpacityChart/>
          </div>
          
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default Main;