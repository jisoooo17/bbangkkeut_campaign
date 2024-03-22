import React from 'react';
import { useNavigate } from "react-router-dom";

const MyApplication = ({campaignList, application}) => {
  const navigate = useNavigate();

  return (
    <div className="mycont-wrap">
      <div className="cont-area">
        <div className="post-list">
          {application.length > 0 ? (
            application.map((application, index) => {
              const matchedPost = campaignList.find((post) => post.id === application.post_id);
              if (matchedPost) {
                return (
                  <div className="mypost summary-wrap" key={index}>
                    <div className="title-area">
                      <p className="title">{matchedPost.title}</p>
                      <div className="regi-info">
                        <p className="date">{new Date(matchedPost.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="info-area">
                      <div className="detail-info">
                        {/* 캠페인 기간 */}
                        {matchedPost.end_date && (
                          <div className="info-box">
                            <p className="tit">캠페인 기간</p>
                            <div className="date-wrap">
                              {matchedPost.start_date && <p className="start-date">{new Date(matchedPost.start_date).toLocaleDateString()}</p>}
                              <span>~</span>
                              {matchedPost.end_date && <p className="end-date">{new Date(matchedPost.end_date).toLocaleDateString()}</p>}
                            </div>
                          </div>
                        )}
                        {/* 접수 기간 */}
                        {matchedPost.reception_end_date && (
                          <div className="info-box">
                            <p className="tit">접수 기간</p>
                            <div className="date-wrap">
                              {matchedPost.reception_start_date && <p className="start-date">{new Date(matchedPost.reception_start_date).toLocaleDateString()}</p>}
                              <span>~</span>
                              {matchedPost.reception_end_date && <p className="end-date">{new Date(matchedPost.reception_end_date).toLocaleDateString()}</p>}
                            </div>
                          </div>
                        )}
                        {/* 위치 정보 */}
                        {matchedPost.latitude && (
                          <div className="info-box">
                            <p className="tit">캠페인 장소</p>
                            <div className="txt-w">
                              <p className="txt">{matchedPost.address}</p>
                              <p className="detail-txt">{matchedPost.address_detail}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="btn-w">
                      <button
                        className="btn-view"
                        onClick={() => {
                          navigate(`/campaign/detail/${matchedPost.id}`);
                        }}
                      >
                        보러가기
                      </button>
                      <button
                        className="btn-view"
                        onClick={() => {
                          navigate(`/campaign/form/${matchedPost.id}/application`);
                        }}
                      >
                        신청서 확인
                      </button>
                    </div>
                  </div>
                );
              } else {
                return null; // 일치하는 캠페인이 없는 경우 null 반환
              }
            })
          ) : (
            <div className="no-data-w">
              <div className="no-data">
                <p className="tit">신청한 캠페인이 없습니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplication;