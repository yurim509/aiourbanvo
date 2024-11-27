import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const slideInRight = keyframes`
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
`;

const Masthead = styled.header`
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background: linear-gradient(
        to bottom,
        rgba(0, 20, 50, 0.7) 0%,
        rgba(0, 40, 70, 0.7) 100%
    );
`;

const BackgroundImage = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -1;
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            45deg,
            rgba(0, 20, 50, 0.7),
            rgba(0, 10, 30, 0.7)
        );
    }
`;

const ContentWrapper = styled.div`
    position: relative;
    padding: 0 2rem;
    max-width: 1200px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
`;

const Title = styled.h1`
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    opacity: 0;
    animation: ${props => props.isVisible ? css`${slideInRight} 1s forwards` : 'none'};
    line-height: 1.3;
`;

const Description = styled.p`
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0;
    animation: ${props => props.isVisible ? css`${fadeInUp} 1s forwards 0.3s` : 'none'};
    line-height: 1.6;
`;

const FacilitiesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin: 2rem 0;

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const FacilityIcon = styled.div`
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 1.5rem;
    text-align: center;
    opacity: 0;
    animation: ${props => props.isVisible ? css`
        ${fadeInUp} 0.5s forwards,
        ${float} 3s ease-in-out infinite
    ` : 'none'};
    animation-delay: ${props => props.isVisible ? props.delay : '0s'};
    cursor: pointer;
    
    i {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    &:hover {
        transform: scale(1.05);
        background: rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
    }
`;

const IconButton = styled.button`
    background: none;
    border: none;
    font-size: 2rem;
    color: white;
    cursor: pointer;
    padding: 0;
    margin: 0;
`;

const Button = styled.button`
    display: inline-block;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: all 0.3s ease;
    opacity: 0;
    animation: ${props => props.isVisible ? css`${fadeInUp} 1s forwards 0.6s` : 'none'};
    cursor: pointer;
    backdrop-filter: blur(10px);

    &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
`;

const SecondLayout = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
                    setIsVisible(true);
                }
            },
            {
                threshold: 0.2,
                rootMargin: '0px'
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const handleScroll = () => {
        const facilitiesSection = document.getElementById('facilities');
        if (facilitiesSection) {
            facilitiesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const facilities = [
        { icon: '🏌️', name: '골프장', url: '/facilities/golf' },
        { icon: '🏋️‍♀️', name: '헬스장', url: '/facilities/gym' },
        { icon: '📖', name: '독서실', url: '/facilities/study' },
        { icon: '🏃‍♂️', name: '예약하러가기', url: '/facilities' }
    ];

    const handleFacilityClick = (url) => {
        navigate(url);
    };

    return (
        <Masthead id="facilities" ref={sectionRef}>
            <BackgroundImage />
            <ContentWrapper>
                <Title isVisible={isVisible}>
                    스마트한 시설관리<br />
                    편리한 예약시스템
                </Title>
                <Description isVisible={isVisible}>
                    실시간 시설 예약과 관리를 한 번에<br />
                    더 나은 주거 환경을 위한 스마트 시설관리 시스템
                </Description>
                <FacilitiesGrid>
                    {facilities.map((facility, index) => (
                        <FacilityIcon
                            key={index}
                            delay={`${index * 0.2}s`}
                            isVisible={isVisible}
                            onClick={() => handleFacilityClick(facility.url)}
                        >
                            <IconButton>{facility.icon}</IconButton>
                            <p>{facility.name}</p>
                        </FacilityIcon>
                    ))}
                </FacilitiesGrid>
                <Button onClick={handleScroll} isVisible={isVisible}>
                    자세히 보기
                </Button>
            </ContentWrapper>
        </Masthead>
    );
};

export default SecondLayout;