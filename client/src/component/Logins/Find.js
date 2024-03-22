import React, { useState } from "react";
import axios from "axios";
// import "./1.css"

function Find() {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleFindClick = async () => {
    try {
      // 서버의 회원 찾기 API 엔드포인트로 요청을 보냅니다.
      const response = await axios.post("http://localhost:8000/find", {
        username,
        phonenumber: phoneNumber,
      });

      // 응답으로 받은 이메일을 설정합니다.
      setEmail(response.data.email);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // 사용자를 찾지 못했을 때의 처리
      setEmail("일치하는 사용자가 없습니다.");
    } else {
      console.error("사용자 찾기 오류:", error);
    }
  }
};

  return (
    <div id="wrap" className="register find-id">
      <div className="content-w">
        <div className="inner">
          <div className="page-tit">회원 ID 찾기</div>
          <div className="form-w">
            <form>
              <div className="form-input">
                <p className="title">사용자 이름</p>
                <input type="text" placeholder="사용자 이름을 입력해주세요." value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="form-input">
                <p className="title">휴대폰 번호</p>
                <input
                  type="text"
                  placeholder="휴대폰 번호를 입력하세요."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="bottom-area">
                <div className="btn-w">
                  <button type="button" onClick={handleFindClick}>찾기</button>
                </div>
              </div>
              <div className="result-w">
                {email && <p><span>가입된 이메일: </span>{email}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Find;;