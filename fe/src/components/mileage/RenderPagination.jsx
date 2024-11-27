import React from 'react';

const RenderPagination = ({ pageMaker, page, setPage }) => {
    if (!pageMaker) return null;

    const pages = [];

    // 페이지 번호 버튼 생성
    for (let i = pageMaker.startPage; i <= pageMaker.endPage; i++) {
        pages.push(
            <button
                key={i}
                onClick={() => setPage(i)}
                style={{
                    boxShadow: page === i ? 'inset 0px -1px 0px  #DEE5D4' : '',
                    color: page === i ? 'red' : '',
                    fontSize: page === i ? '18px' : '',
                    fontWeight: page === i ? '700' : '',
                }} // 현재 페이지 강조
            >
                {i}
            </button>
        );
    }

    return (
        <div className="pageNationPager">
            {/* 첫 페이지로 이동 */}
            <button className='lastButton' onClick={() => setPage(1)} style={{ transform: 'rotateY(180deg)' }}>
                <img src="/images/next.png" alt="1" disabled={pageMaker.currentPage === 1} />
            </button>
            {/* 이전 페이지 블록으로 이동 */}
            {pageMaker.hasprev && (
                <button className='nextButton' onClick={() => setPage(pageMaker.startPage - 1)} style={{ transform: 'rotateY(180deg)' }}>
                    <img src="/images/next2.png" alt="1" />
                </button>
            )}
            {/* 페이지 번호 버튼들 */}
            {pages}
            {/* 다음 페이지 블록으로 이동 */}
            {pageMaker.hasnext && (
                <button className='nextButton' onClick={() => setPage(pageMaker.endPage + 1)}>
                    <img src="/images/next2.png" alt="1" />
                </button>
            )}
            {/* 마지막 페이지로 이동 */}
            <button className='lastButton' onClick={() => setPage(pageMaker.totalPage)}>
                <img src="/images/next.png" alt="last" disabled={pageMaker.currentPage === pageMaker.totalPage} />
            </button>
        </div>
    );
};

export default RenderPagination;