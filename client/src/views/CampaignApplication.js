import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../component/Header';
import {getPost} from '../store/store';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Footer from "../component/Footer";

const CampaignApplication = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams();
  const storedUserData = sessionStorage.getItem("userData");
  const userData = JSON.parse(storedUserData);
  const [myApplication, setMyApplication] = useState([]);
  const [filteredUserInfo, setFilteredUserInfo] = useState(null); // 로그인한 사용자 정보를 저장

  // 신청한 캠페인 목록 불러옴
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/campaign/form/all`);
        const filteredData =  response.data.filter((item)=>{
          return item.userid === userData.userid;
        })
        setMyApplication(filteredData);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    
    fetchUserInfo();
  }, []);

  // 페이지가 로드될 때 사용자 정보를 가져오는 useEffect
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users');
        const userInfo = response.data;
        const filteredInfo = userInfo.find(item => item.username === userData.username);
        setFilteredUserInfo(filteredInfo);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const filteredData = myApplication.find((data, index) => {
    return data.post_id == id
  });

  return (
    <div id="wrap" className="application-form">
      <Header/>
      <div className="content-w">
        <div className="inner">
          <div className="tit-wrap">
            <div className="tit">신청서 확인</div>
          </div>
          <div className="form-table">
            <table className="vertical">
              <caption></caption>
              <colgroup>
                <col style={{width: "160px"}}/>
                <col style={{width: "auto"}} />
                <col style={{width: "160px"}}/>
                <col style={{width: "auto"}} />
              </colgroup>
              <tbody>
                <tr>
                  <th className="user-name" scope="row">이름</th>
                  <td className="user-name">
                    <span className="value_txt">{filteredUserInfo?.username}</span>
                  </td>
                  <th className="user-email" scope="row">이메일</th>
                  <td className="user-email">
                    <span className="value_txt">{filteredUserInfo?.email}</span>
                  </td>
                </tr>
                <tr>
                  <th className="user-name" scope="row">전화번호</th>
                  <td className="user-name">
                    <span className="value_txt">{filteredUserInfo?.phonenumber}</span>
                  </td>
                  <th className="user-email" scope="row">소속</th>
                  <td className="user-company">
                    <span className="value_txt">{filteredData?.company}</span>
                  </td>
                </tr>
                <tr>
                  <th>신청자 메모</th>                
                  <td className="user-email" colSpan="3">
                    <span className="value_txt">{filteredData?.memo}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bottom-area">
            <div className="btn-w">
              <button className="btn-tolist" type="button" onClick={()=>{navigate(-1)}}>뒤로가기</button> 
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CampaignApplication;
