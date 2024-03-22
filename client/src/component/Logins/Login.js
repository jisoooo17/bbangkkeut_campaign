import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import './1.css'

import Header from "../Header";

import Register from "./Register";

//로그인 페이지 상태 변화 함수
function LoginPage() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loginStatus, setloginStatus] = useState("");
  const [userTypes, setUserTypes] = useState(1);

  const [activeTab, setActiveTab] = useState("personalCheckbox");

  const LoginPageJs = () => {
    //스크립트 동작시 콘솔에 출력
    // console.log('LoginPageJs 함수 호출됨');

    // 로그인 요청 구현
    axios
      .post("http://localhost:8000/login", {
        email: email,
        password: password,
        usertype: userTypes,
      }) //회원 정보 email, password, usertype의 정보를 가져옴
      .then((response) => {
        console.log("서버 응답:", response);
        if (response.data.success) {
          const { usertype, userid, username } = response.data.data[0]; //0213 김민호 익스플로우세션
          const userData = {
            userid: userid,
            username: username,
            usertype: usertype,
          };
          sessionStorage.setItem("loggedIn", true);
          sessionStorage.setItem("userData", JSON.stringify(userData)); // 0210 상호형 추가 세션에 userNumber,username추가
          sessionStorage.setItem("usertype", usertype); //익스플로우 세션 데이터 추가 0213 김민호
          //Application에 세션스토리지 안에서 정보를 출력한다

          navigate("/");
          window.location.reload(); //0210 상호형 추가 페이지를강제로 리로드
        } else {
          // 로그인 실패 시 처리
          console.log("로그인 실패:", response.data);
          setloginStatus("로그인 실패: " + response.data.message);
        }
      });
  };
  // 0304 수정 작성 : 상호형
  const checkTapValues = [
    { label: "개인", tabname: "personalCheckbox" },
    { label: "기업", tabname: "businessCheckbox" },
    { label: "단체", tabname: "organizationCheckbox" },
  ];

  const handleOnClick = (e) => {
    setUserTypes(e.target.value);
    setActiveTab(e.target.id);
  };

  const tabItemClass = (tabName) => {
    return `tab-item ${activeTab === tabName ? "active" : ""}`;
  };

  return (
    <div id="wrap">
      <Header />
      <div className="content-w">
        <div className="login-inner">
          <div className="login">
            <form className="form-login">
              {/* 로그인 아이디 비밀번호 표시 */}
              <h3 className="title">LOGIN</h3>
              <div className="tab-wrap">
                <ul className="tab-item-wrap">
                  {checkTapValues.map((key, index) => (
                    <li
                      key={key.label}
                      id={key.tabname}
                      value={index + 1}
                      className={tabItemClass(key.tabname)}
                      onClick={handleOnClick}
                    >
                      {key.label}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="input-wrap">
                <input
                  id="id"
                  className="login-input"
                  type="text"
                  placeholder="아이디를 입력해주세요."
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
                <input
                  className="login-input"
                  type="password"
                  placeholder="비밀번호를 입력해주세요."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* 로그인 버튼 표시 */}
                <button
                  className="login-button"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("버튼 클릭됨");
                    LoginPageJs();
                  }}
                >
                  로그인
                </button>
                <div className="form-login-link">
                  {/* <Link to="/Register">회원가입</Link> */}
                  <Link to="/Find">회원 ID찾기</Link>
                </div>
              </div>
              {loginStatus && <div>{loginStatus}</div>}
            </form>
                <Register />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
