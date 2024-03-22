import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
// import './1.css'

import Header from "../Header";

function Register() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const [isPage, setIsPage] = useState();
  const [handlePage, setHandlePage] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsPage(location.pathname);
    // console.log("page", isPage);
    if (isPage === "/Login") {
      setHandlePage(true);
    }
    // console.log("handlePage", handlePage);
  });

  const addClass = () => {
    const addclass = "render-register";
    return handlePage ? "" : addclass;
  };

  const registerRenderReturn = () => {
    return (
      <>
        <div id="wrap">
          <Header />
          <div className="content-w">
            <div className="inner">
              {loginRenderpage()}
              <div className="login-Link">
                
                <Link to="/Login">로그인창</Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const loginRenderpage = () => {
    return (
      <>
        <form className="form-register">
          <div className="txt-wrap">
            <h3 className="title">REGISTER</h3>
            <p>BBANG끗과 함께 탄소중립을 실천해주세요</p>
          </div>
          <div className="register-botton-wrap">
            {/* 각 버튼 클릭 시에 해당 페이지로 이동하는 버튼을 추가합니다 */}
            <div className="btn-w">
              <button className={`register-botton ${addClass()}`} onClick={() => navigateTo("/Register/personal")}>
                <img src={process.env.PUBLIC_URL + '/img/icon-register-user.png'} />
              </button>
              <span className="type">개인</span>
            </div>
            <div className="btn-w">
              <button className={`register-botton ${addClass()}`} onClick={() => navigateTo("/Register/corporate")}>
                <img src={process.env.PUBLIC_URL + '/img/icon-register-enterprise.png'} />
              </button>
              <span className="type">기업</span>
            </div>
            <div className="btn-w">
              <button className={`register-botton ${addClass()}`} onClick={() => navigateTo("/Register/group")}>
                <img src={process.env.PUBLIC_URL + '/img/icon-register-organization2.png'} />
              </button>
              <span className="type">단체</span>
            </div>
          </div>
        </form>
      </>
    );
  };

  // console.log(addClass());
  return <>{handlePage ? loginRenderpage() : registerRenderReturn()}</>;
}

export default Register;
