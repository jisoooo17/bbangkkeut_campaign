import { Link } from "react-router-dom";
import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { handlePostcode } from "./Handle/Postcodehandle";
import axios from 'axios';
// import './1.css'

function RegisterPersonal() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openPostcode, setOpenPostcode] = useState(false);
  const [address, setAddress] = useState('');
  const [detailedaddress, setdetailedaddress] = useState('');
  const [phonenumber, setphonenumber] = useState('');
  const [emailDuplication, setEmailDuplication] = useState(true);
  const [IsDuplicateChecked, setIsDuplicateChecked] = useState(false);
  // 이메일 유효성 검사 02/14 김민호
  const handle = handlePostcode(openPostcode, setOpenPostcode, setAddress);

  const setPasswordMatch = (match) => {
    // setPasswordMatch(true) 또는 setPasswordMatch(false) 등으로 사용
  };
  
  // 이메일 유효성 검사 02/14 김민호
  const handleEmailDuplicationCheck = async (event) => {
    event.preventDefault();
    console.log("이메일 중복 확인 시작");

    if (!email) {
      alert('이메일을 입력해주세요!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/checkEmailDuplication', { email });
      console.log('서버 응답:', response.data);
      alert(response.data.message);
      setEmailDuplication(response.data.success);

      if (response.data.success) {
        setIsDuplicateChecked(true);
      }else{
        setIsDuplicateChecked(false);//중복되지 않은경우
      }
    } catch (error) {
      console.error('이메일 중복 확인 중 오류:', error);
      alert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };



  const handleRegesterClick = (event) => {
    event.preventDefault();
    console.log("회원가입 시작");

    if (!IsDuplicateChecked) {
      alert('이미 등록된 이메일이거나 이메일 중복 확인을 해주세요.');
      return;
    }

    if (!username || !email || !password || !confirmPassword || !address) {
      alert('정보를 모두 입력해주세요!');
      return;
    }
   

    // 이메일이 중복되었는지 확인합니다.
    // 이메일 유효성 검사 02/14 김민호
  
    // --------이메일 기능 구현 함수 @가 없으면 회원가입이 안되게 해놨음-------
    // if (!email.includes('@')) {
    //   alert('이메일을 입력해주세요!');
    //   return;
    // }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      setPasswordMatch(false);
      return;
    }
  // --------비밀번호 유효성------------------------
    // if (password.length < 10 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //   alert('비밀번호는 최소 10글자 이상이어야 하며, 특수문자를 포함해야 합니다.');
    //   return;
    // }

    // 클라이언트에서 서버로 회원가입 요청
    axios.post('http://localhost:8000/register', {
      username,
      password,
      email,
      address,
      detailedaddress,
      phonenumber,
      usertype: 'personal'
    })
      .then(response => {
        console.log('서버 응답:', response.data);
        alert('회원가입이 완료되었습니다.');
        if (response.data.userType === 1) {
          // 개인 사용자 처리
        }
        window.location.href = '/'; // 홈 페이지 또는 다른 페이지로 리디렉션
      })
      .catch(error => {
        if (error.response) {
          // 서버가 응답한 상태 코드가 2xx가 아닌 경우
          console.error('서버 응답 오류:', error.response.status, error.response.data);
        } else if (error.request) {
          // 서버로 요청이 전송되었지만 응답이 없는 경우
          console.error('서버 응답이 없음:', error.request);
        } else {
          // 요청을 설정하는 중에 에러가 발생한 경우
          console.error('요청 설정 중 오류:', error.message);
        }
        alert('서버와의 통신 중 오류가 발생했습니다.');
      });
  };

  return (
    <div id="wrap" className="register personal">
      <div className="content-w">
        <div className="inner">
        <h2 className="page-tit">개인 회원</h2>
          <div className="form-w">
            <form className="form-details">
              <div className="form-input">
                <p className="title">사용자 이름</p>
                <input
                  type="text"
                  placeholder="사용자 이름을 입력해주세요."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              {/*  */}
              {/* <dl className="pwd-chk">
                <dt className="f-hm-p1"><label for="confPwNum">비밀번호 확인</label> <span className="point-color" title="필수입력">*</span></dt>
                <dd className="f-hm-p2">
                  <div className="form-text login-form-txt">
                    <input id="confPwNum" type="password" placeholder="비밀번호를 다시 입력해주세요."/> 
                  </div>
                </dd>
              </dl> */}
              {/*  */}

              <div className="form-input">
                <p className="title">비밀번호</p>
                <input
                  type="password"
                  placeholder="비밀번호를 입력해주세요."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-input">
                <p className="title">비밀번호 확인</p>
                <input
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="form-input">
                <p className="title">이메일</p>
                <div className="flex-box">
                  <input
                    type="text"
                    placeholder="이메일 주소를 입력해주세요."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button className="btn-check" onClick={handleEmailDuplicationCheck}>확인</button>
                </div>
              </div>
              <div className="form-input">
                <p className="title">휴대폰 번호</p>
                <input
                  type="text"
                  placeholder="휴대폰 번호를 입력해주세요."
                  value={phonenumber}
                  onChange={(e) => setphonenumber(e.target.value)}
                />
              </div>
              <div className="form-input multiple">
                <p className="title">주소</p>
                <div className="flex-box">
                  <input
                    type="text"
                    placeholder="주소를 입력해주세요."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <button type="button" className="btn-check" onClick={handle.clickButton}>선택</button>
                </div>
                {openPostcode && (
                  <DaumPostcode
                    onComplete={handle.selectAddress}
                    autoClose={false}
                    defaultQuery=""
                  />
                )}
                <input
                  type="text"
                  placeholder="상세 주소를 입력해주세요."
                  value={detailedaddress}
                  onChange={(e) => setdetailedaddress(e.target.value)}
                />
              </div>

              <div className="bottom-area">
                <div className="btn-w">
                  <button className="btn-register" onClick={handleRegesterClick}>가입완료</button>
                  <Link to="/Login">로그인창</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPersonal;