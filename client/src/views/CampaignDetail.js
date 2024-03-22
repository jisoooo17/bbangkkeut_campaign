import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../component/Header';
import {getPost} from '../store/store';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Comments from '../component/campaign/Comments';
import DOMPurify from "isomorphic-dompurify"
import "react-quill/dist/quill.core.css";
import Footer from "../component/Footer";

const CampaignDetail = (props) => {
  const navigate = useNavigate();
  const [campaignList, setCampaignList] = useState([]); // 글 리스트
  const {id} = useParams();
  const dispatch = useDispatch();
  
  const storedUserData = sessionStorage.getItem("userData");
  const userData = JSON.parse(storedUserData);

  const { kakao } = window;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 게시물 데이터 요청
        const result = await dispatch(getPost());
        setCampaignList(result.payload);

        // 조회수 증가 요청
        await axios.put(`http://localhost:8000/campaign/increase-views/${id}`);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [id, dispatch]);

  let curList = campaignList.find(function(data){
    return data.id === parseInt(id);
  });

  const renderModifyBtn = () => {
    if (userData.userid === curList?.userid) {
      return (
        <div className="bottom-area">
          <div className="btn-w">
            <button className="btn-tolist" onClick={()=>{navigate("/campaign");}}>목록</button>
            <button className="btn-edit" onClick={()=>{navigate(`/campaign/edit/${curList?.id}`);}}>수정</button>
            <button className="btn-delete" onClick={handleDelete}>삭제</button>
          </div>
        </div>
      )
    }
    return (
      <div className="bottom-area">
        <div className="btn-w">
          <button className="btn-tolist" onClick={()=>{navigate("/campaign")}}>목록</button>
        </div>
      </div>
    )
  };

  // 글 삭제 버튼
  const handleDelete = async () => {
    const confirmDelete = window.confirm("글을 삭제하시겠습니까?");

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/campaign/detail/${id}`);
        navigate(-1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(()=>{
    // curList가 존재하고 latitude 및 longitude 속성이 존재하는 경우에만 맵을 생성
    if(curList && curList.latitude && curList.longitude){
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(curList.latitude, curList.longitude),
        level: 3
      };
  
      const map = new kakao.maps.Map(container, options);
      const markerPosition  = new kakao.maps.LatLng(curList.latitude, curList.longitude); 
      const marker = new kakao.maps.Marker({
        position: markerPosition
      });
      marker.setMap(map);
    }
  }, [curList]);

  window.scrollTo({top: 0, behavior: "auto", });

  return (
    <div id="wrap" className="campaign-detail">
      <Header/>
      <div className="content-w">
        <div className="inner">
          {/* 제목 영역 */}
          {curList && (
            <div className="summary-wrap">
              <div className="title-area">
                <p className="title">{curList.title}</p>
                <div className="regi-info">
                  <p className="views">{"조회수: " + parseInt(curList?.views + 1)}</p>
                  <p className="date">{new Date(curList.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="info-area">
                <div className="detail-info">
                  {/* 캠페인 기간 */}
                  {curList.end_date && (
                    <div className="info-box">
                      <p className="tit">캠페인 기간</p>
                      <div className="date-wrap">
                        {curList.start_date && (
                          <p className="start-date">{new Date(curList.start_date).toLocaleDateString()}</p>
                        )}
                        <span>~</span>
                        {curList.end_date && (
                          <p className="end-date">{new Date(curList.end_date).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {/* 접수 기간 */}
                  {curList.end_date && (
                    <div className="info-box">
                      <p className="tit">접수 기간</p>
                      <div className="date-wrap">
                        {curList.reception_start_date && (
                          <p className="start-date">{new Date(curList.reception_start_date).toLocaleDateString()}</p>
                        )}
                        <span>~</span>
                        {curList.reception_end_date && (
                          <p className="end-date">{new Date(curList.reception_end_date).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {/* 위치 정보 */}
                  {curList.latitude && (
                    <div className="info-box">
                      <p className="tit">캠페인 장소</p>
                      <div className="txt-w">
                        <p className="txt">{curList.address}</p>
                        <p className="detail-txt">{curList.address_detail}</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* 작성자 정보 */}
                <div className="writer-info">
                  <div className="info-tit">작성자 정보</div>
                  <div className="txt-div">
                    <div className="txt-box">
                      <p className="tit">작성자</p>
                      <p className="txt">{curList.username}</p>
                    </div>
                    <div className="txt-box">
                      <p className="tit">이메일</p>
                      <p className="txt">{curList.email}</p>
                    </div>
                    <div className="txt-box">
                      <p className="tit">연락처</p>
                      <p className="txt">{curList.phonenumber}</p>
                    </div>
                  </div>
                  <p className="sub-txt">&#8251; 문의사항은 메일 / 전화 / 댓글을 이용해주세요.</p>
                </div>
              </div>
                {
                  userData.userid !== curList?.userid && (
                    <div className="btn-w">
                      <button className="btn-apply" onClick={() => {navigate(`/campaign/form/${curList.id}`)}}>신청하기</button>
                    </div>
                  )
                }
            </div>
          )}

          {/* 본문 내용 */}
          <div className="body-wrap">
            <p className="body-tit">상세정보</p>
            <div className="body-area" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(curList?.body)}}></div>
          </div>

          {/* 지도 영역 */}
          {curList && curList.latitude && (
            <div className="map-area vis-map">
              <p className="tit">위치 안내</p>
              <div id="map"></div>
              <div className="txt-w">
                <p className="txt">{curList.address}</p>
                <p className="detail-txt">{curList.address_detail}</p>
              </div>
            </div>
          )}
          <Comments curList={curList}/>


          {/* 하단 버튼 영역 */}
          {renderModifyBtn()}

          {/* 댓글 */}
          {/* <Comments curList={curList}/> */}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CampaignDetail;