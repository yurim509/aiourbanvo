import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useCustomLogin from '../hook/useCustomLogin';
import '../../css/_modules/menucomponent.css';

const MenuComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { doLogout, moveToPath, isLogin, loadLoginData } = useCustomLogin();
    const [activeMenu, setActiveMenu] = useState(() => {
        return localStorage.getItem('activeMenu') || null;
    });

    useEffect(() => {
        if (activeMenu) {
            localStorage.setItem('activeMenu', activeMenu);
        } else {
            localStorage.removeItem('activeMenu');
        }
    }, [activeMenu]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.menu-item')) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleSidebar = () => {
        const sidebar = document.getElementById('sidebar-wrapper');
        const menuButton = document.querySelector('.menu-toggle');
        sidebar.classList.toggle('active');
        menuButton.classList.toggle('active');
    };

    const handleClickLogout = () => {
        doLogout();
        alert('로그아웃 되었습니다.');
        moveToPath('/');
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const isCurrentPath = (path) => {
        return location.pathname === path;
    };

    const subMenus = {
        '입주민관리': [
            { name: '입주민 목록', path: '/user/list', icon: 'bi-people' },
            { name: '가입 승인', path: '/user/approval', icon: 'bi-check-circle' },
            { name: '입주민 등록', path: '/user/add', icon: 'bi-person-plus' }
        ],
        '시설관리': [
            { name: 'Gym', path: '/facilities/gym', icon: 'bi-bicycle' },
            { name: 'Golf', path: '/facilities/golf', icon: 'bi-trophy' },
            { name: 'Study', path: '/facilities/study', icon: 'bi-book' }
        ],
        '소통관리': [
            { name: '게시판', path: '/communities/board/list', icon: 'bi-clipboard' },
            { name: '공지사항', path: '/communities/announce/list', icon: 'bi-megaphone' },
            { name: '장터', path: '/communities/market/list', icon: 'bi-shop' },
            { name: '생활정보', path: '/communities/info/jobs', icon: 'bi-info-circle' }
        ],
        '주차관리': [
            { name: '정기권 차량', path: '/parking/regular', icon: 'bi-p-circle' },
            { name: '방문 예약 차량', path: '/parking/visit', icon: 'bi-calendar-check' },
            { name: '입출차 기록', path: '/parking/entry', icon: 'bi-clock-history' }
        ]
    };

    const handleMenuClick = (menuName, e) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === menuName ? null : menuName);
    };

    const handleSubMenuClick = (path) => {
        navigate(path);
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-logo" onClick={handleLogoClick}>
                    {Array.from('Urban').map((char, index) => (
                        <span key={index} className="urban-char">{char}</span>
                    ))}
                </div>

                <div className="navbar-left">
                    <ul className="main-menu">
                        {(loadLoginData().role === 'ADMIN' || loadLoginData().role === 'ROOT') && (
                            <li className="menu-item">
                                <div
                                    className={`menu-title ${activeMenu === '입주민관리' ? 'active' : ''}`}
                                    onClick={(e) => handleMenuClick('입주민관리', e)}
                                >
                                    입주민관리
                                </div>
                                <div className={`submenu ${activeMenu === '입주민관리' ? 'show' : ''}`}>
                                    {subMenus['입주민관리'].map((item, index) => (
                                        <div
                                            key={index}
                                            className={`submenu-item ${isCurrentPath(item.path) ? 'active' : ''}`}
                                            onClick={() => handleSubMenuClick(item.path)}
                                        >
                                            <i className={`bi ${item.icon}`}></i>
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            </li>
                        )}

                        {['시설관리', '소통관리', '주차관리'].map((menuName) => (
                            <li key={menuName} className="menu-item">
                                <div
                                    className={`menu-title ${activeMenu === menuName ? 'active' : ''}`}
                                    onClick={(e) => handleMenuClick(menuName, e)}
                                >
                                    {menuName}
                                </div>
                                <div className={`submenu ${activeMenu === menuName ? 'show' : ''}`}>
                                    {subMenus[menuName].map((item, index) => (
                                        <div
                                            key={index}
                                            className={`submenu-item ${isCurrentPath(item.path) ? 'active' : ''}`}
                                            onClick={() => handleSubMenuClick(item.path)}
                                        >
                                            <i className={`bi ${item.icon}`}></i>
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            </li>
                        ))}

                        <li className="menu-item">
                            <div
                                className={`menu-title ${isCurrentPath('/mileage/manual') ? 'active' : ''}`}
                                onClick={() => navigate('/mileage/manual')}
                            >
                                결제관리
                            </div>
                        </li>

                        {loadLoginData().role === 'ROOT' && (
                            <li className="menu-item">
                                <div
                                    className={`menu-title ${isCurrentPath('/superAdmin') ? 'active' : ''}`}
                                    onClick={() => navigate('/superAdmin')}
                                >
                                    관리자 모드
                                </div>
                            </li>
                        )}
                    </ul>
                </div>

                <div className="navbar-right">
                    {isLogin ? (
                        <>
                            {loadLoginData().role === 'PENDING' ? null : (
                                <button className="menu-toggle" onClick={toggleSidebar}>
                                    <i className="bi bi-person"></i> 마이페이지
                                </button>
                            )}
                            <button onClick={handleClickLogout} className="nav-link">
                                <i className="bi bi-box-arrow-right"></i> 로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                <i className="bi bi-box-arrow-in-left"></i> 로그인
                            </Link>
                            <Link to="/join" className="nav-link">
                                <i className="bi bi-person-plus"></i> 회원가입
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <nav id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <li className="sidebar-brand">
                        <Link to="/">aio Urban</Link>
                    </li>
                    <li>
                        <Link to="/myPage/myInfo">
                            <i className="bi bi-calendar-check"></i> 내정보
                        </Link>
                    </li>
                    <li>
                        <Link to="/myPage/mileage">
                            <i className="bi bi-chat-dots"></i> 마일리지 내역
                        </Link>
                    </li>
                    <li>
                        <Link to="/myPage/facilities">
                            <i className="bi bi-car-front"></i> 예약현황
                        </Link>
                    </li>
                    <li>
                        <Link to="/myPage/communities">
                            <i className="bi bi-car-front"></i> 내가 쓴 글
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default MenuComponent;