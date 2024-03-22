import React, { useState } from 'react';

const Pagination = ({ listLimit, page, setPage, totalPosts }) => {
  const totalPages = Math.ceil(totalPosts / listLimit); // 전체 페이지 수 계산
  const paginationNum = 5;
  const [currentPageGroup, setCurrentPageGroup] = useState(1); // 현재 페이지 그룹

  // 페이지 그룹의 시작과 끝 번호 계산
  const startPage = (currentPageGroup - 1) * paginationNum + 1;
  const endPage = Math.min(currentPageGroup * paginationNum, totalPages);

  // 페이지 버튼을 동적으로 생성하는 함수
  const renderPageButtons = () => {
    const buttons = [];
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button key={i} className={i === page ? 'btn-num active' : 'btn-num'} onClick={() => setPage(i)}
        >{i}</button>
      );
    }
    return buttons;
  };

  return (
    <div className="pagination">
      <button
        className="btn-prev" onClick={() => {
          if (page > 1) {
            setPage(page - 1);
            if (page === startPage) {
              setCurrentPageGroup(currentPageGroup - 1);
            }
          }
        }}
        disabled={page === 1}
      >
      </button>

      <div className="btn-num-w">
        {renderPageButtons()}
      </div>

      <button
        className="btn-next" onClick={() => {
          if (page < totalPages) {
            setPage(page + 1);
            if (page === endPage && endPage < totalPages) {
              setCurrentPageGroup(currentPageGroup + 1);
            }
          }
        }}
        disabled={page === totalPages}
      >
      </button>
    </div>
  );
};
export default Pagination;