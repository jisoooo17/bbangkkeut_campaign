import React from "react";
import { useNavigate } from "react-router-dom";

const MyCampaign = ({campaignList, userData})=>{
  const navigate = useNavigate();

  return(
    <div className="mycont-wrap">
      <div className="cont-area">
        <div className="post-list">
          {campaignList.filter((item) => item.userid === userData.userid).length > 0 ? (
            campaignList
              .filter((item) => item.userid === userData.userid)
              .map((post, index) => (
                <div className="mypost summary-wrap" key={index}>
                  <div className="title-area">
                    <p className="title">{post.title}</p>
                    <div className="regi-info">
                      {/* <p className="views">{"조회수: " + parseInt(post.views + 1)}</p> */}
                      <p className="date">{new Date(post.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="info-area">
                    <div className="detail-info">
                      {/* 캠페인 기간 */}
                      {post.end_date && (
                        <div className="info-box">
                          <p className="tit">캠페인 기간</p>
                          <div className="date-wrap">
                            {post.start_date && <p className="start-date">{new Date(post.start_date).toLocaleDateString()}</p>}
                            <span>~</span>
                            {post.end_date && <p className="end-date">{new Date(post.end_date).toLocaleDateString()}</p>}
                          </div>
                        </div>
                      )}
                      {/* 접수 기간 */}
                      {post.reception_end_date && (
                        <div className="info-box">
                          <p className="tit">접수 기간</p>
                          <div className="date-wrap">
                            {post.reception_start_date && <p className="start-date">{new Date(post.reception_start_date).toLocaleDateString()}</p>}
                            <span>~</span>
                            {post.reception_end_date && <p className="end-date">{new Date(post.reception_end_date).toLocaleDateString()}</p>}
                          </div>
                        </div>
                      )}
                      {/* 위치 정보 */}
                      {post.latitude && (
                        <div className="info-box">
                          <p className="tit">캠페인 장소</p>
                          <div className="txt-w">
                            <p className="txt">{post.address}</p>
                            <p className="detail-txt">{post.address_detail}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="btn-w">
                    <button
                      className="btn-view"
                      onClick={() => {
                        navigate(`/campaign/detail/${post.id}`);
                      }}
                    >
                      보러가기
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="no-data-w">
              <div className="no-data">
                <p className="tit">내가 쓴 글이 없습니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyCampaign;