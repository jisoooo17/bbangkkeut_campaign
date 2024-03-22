import React, { useEffect, useState } from 'react';
import Header from '../component/Header';
import { useNavigate } from 'react-router-dom';
import { getPost } from '../store/store';
import { useDispatch } from 'react-redux';
import Pagination from '../component/campaign/Pagination';
import TextList from '../component/campaign/TextList';
import Footer from '../component/Footer';

const Campaign = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 글 목록
  const [campaignList, setCampaignList] = useState([]); // 캠페인 목록을 저장 
  const [filteredResults, setFilteredResults] = useState([]); // 필터링된 결과 저장
  const [isSearchClicked, setIsSearchClicked] = useState(false); // 검색 버튼이 클릭되었는지 여부를 저장
  const [totalPostsCount, setTotalPostsCount] = useState(0); // 탭별 전체 포스트 개수를 저장

  // 페이지네이션
  const [page, setPage] = useState(1); // 현재 페이지 번호를 저장
  const listLimit = 9; // 페이지당 글 갯수
  const offset = (page - 1) * listLimit; // 시작점과 끝점을 구하는 offset

  // 검색 인풋  
  const [searchInput, setSrchInput] = useState(''); // 검색어를 저장하는 state

  // 데이터 불러옴
  useEffect(() => {
    // 포스트 데이터를 불러와서 campaignList state에 저장
    dispatch(getPost())
      .then((res) => {
        if (res.payload) {
          let arrPost = [...res.payload];
          // 새로운 데이터가 불러와졌을 때 역순으로 정렬하여 최신 글이 위로 오도록 함
          setCampaignList(arrPost.reverse());
          // 초기 필터링 결과로 전체 포스트를 설정
          setFilteredResults(arrPost);
          // 전체 포스트 개수 설정
          setTotalPostsCount(arrPost.length);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // 검색 함수
  const searchPosts = () => {
    // 검색어를 포함하는 글만 필터링하여 filteredResults state에 저장
    const filteredData = campaignList.filter((item) => {
      return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase());
    });
    setFilteredResults(filteredData);
    setIsSearchClicked(true); // 검색 버튼이 클릭되었음을 설정
    // 검색 결과에 따라 전체 포스트 개수 업데이트
    setTotalPostsCount(filteredData.length);
    setPage(1); // 페이지를 1로 초기화
    // console.log(filteredData.length)
  };

  // 검색 버튼 클릭 이벤트 핸들러
  const handleSrchBtnClk = () => {
    searchPosts();
    setSrchInput(""); // 검색어 초기화

    // 탭 버튼 초기화
    const tabBtns = document.querySelectorAll(".tab-area .btn-tab");
    tabBtns.forEach(tab => tab.classList.remove("active"));
    // 전체 버튼 활성화
    tabBtns[0].classList.add("active");
  };

  // 포스트 목록을 페이지에 따라 잘라내 반환하는 함수
  const postsData = (posts) => {
    if (!posts || posts.length === 0) {
      return [];
    }

    let result = posts.slice(offset, offset + listLimit);
    return result;
  };

  // 버튼 탭 클릭 이벤트
  const handleTabClk = (index) => {
    let filteredUsertype;
    if (index === 0) {
      // 전체 보기 버튼을 클릭한 경우 
      filteredUsertype = campaignList;
    } else {
      // 클릭한 탭의 usertype과 동일한 데이터만 필터링
      filteredUsertype = campaignList.filter((item) => parseInt(item.usertype) === index);
    }

    setFilteredResults(filteredUsertype); // 필터링된 결과를 저장
    setIsSearchClicked(false); // 검색 결과 초기화
    // 필터링된 결과의 개수로 전체 포스트 개수 설정
    setTotalPostsCount(filteredUsertype.length);
    setPage(1); // 페이지를 1로 초기화

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

  return (
    <div id="wrap" className="campaign">
      <Header/>
      <div className="content-w">
        <div className="inner">
          <div className="tit-wrap">
            <div className="tit"> 캠페인</div>
            <div className="txt"> 우리는 탄소 중립 난제를 해결하고 녹색 성장을 이끌어내기 위해 모이고 있습니다.</div>
          </div>
          <div className="search-wrap">
            <input type="text" placeholder="검색어를 입력하세요." value={searchInput} onChange={(e) => setSrchInput(e.target.value)} />
            <button className="btn-search" onClick={handleSrchBtnClk}>검색</button>
          </div>
            <div className="group-box">
              <div className="tab-area">
                {/* 각 탭 클릭시 handleTabClk 함수 호출 */}
                <button className='btn-tab active' onClick={() => handleTabClk(0)}>전체</button>
                <button className='btn-tab' onClick={() => handleTabClk(1)}>개인</button>
                <button className='btn-tab' onClick={() => handleTabClk(2)}>기업</button>
                <button className='btn-tab' onClick={() => handleTabClk(3)}>단체</button>
              </div>

              <button className="btn-write" onClick={()=>{navigate('/campaign/write')}}>글쓰기</button>
            </div>
          <div className="campaign-wrap">
            <div className="container">
              {/* 검색 결과에 따라 글목록 나열 */}
              {
                filteredResults.length > 0 ? (
                  postsData(filteredResults).map((data, i) => (
                    <TextList campaignList={data} key={i} />
                  ))
                ):(
                <div className="no-data-w">
                  <div className="no-data">
                    <p className="tit">검색 결과가 없습니다.</p>
                  </div>
                </div>
                )
              }
              {/* {postsData(filteredResults).map((data, i) => (
                <TextList campaignList={data} key={i} />
              ))} */}
            </div>
          </div>
          {/* 페이지네이션 컴포넌트 */}
          <Pagination listLimit={listLimit} page={page} setPage={setPage} totalPosts={totalPostsCount} />
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Campaign;
