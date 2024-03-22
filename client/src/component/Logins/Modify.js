import React, { useState, useEffect } from "react";
import axios from "axios";
// import './1.css'

function Modify() {
  const [userData, setUserData] = useState({}); // 사용자 데이터를 저장할 상태

  // 상호형
  const storedUserData = sessionStorage.getItem("userData"); // 클라이언트단에서 세션값을 획득하는 부분
  const storedUserType = sessionStorage.getItem("usertype");
  const userId= JSON.parse(storedUserData).userid;
  const usertype = JSON.parse(storedUserType);

  console.log(userId);

   
  useEffect(() => {
    axios.get(`http://localhost:8000/edit-profile/${userId}/${usertype}`) // 클라이언트에서 파라미터에 세션안의 값을 요청으로 전달
      .then(response => {
        setUserData(response.data.userData);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          window.location.href = "/login";
        } else {
          console.error('회원 정보 수정 실패:', error);
        }
      });
  }, [userId, usertype]);

  const handleDeleteAccount = () => {
    if (window.confirm("정말로 회원 탈퇴하시겠습니까?")) {
      axios.delete(`http://localhost:8000/delete-account/${userId}/${usertype}`)
        .then(response => {
          console.log('회원 탈퇴 성공:', response);
          window.location.href = "/login"; // 회원 탈퇴 후 로그인 페이지로 리다이렉트
        })
        .catch(error => {
          console.error('회원 탈퇴 실패:', error);
        });
    }
  };


  console.log(userData);// 상호형
  return (
    <form className="form-details">
      <div className="form-details-Modify">
      <h2>정보 수정 페이지</h2>
        <p>회원번호: {userData.userid}</p>
        <p>회원이름: {userData.username}</p>
        <p>회원아이디: {userData.email}</p>
        <p>회원주소: {userData.address}</p>
        <p>회원상세주소:{userData.detailedaddress}</p>
        <p>핸드폰번호:{userData.phonenumber}</p>
        {/* 기타 사용자 정보 표시 */}
      {/* <button onClick={handleDeleteAccount}>회원 탈퇴</button> */}
      </div>
    </form>
  );
}

export default Modify;