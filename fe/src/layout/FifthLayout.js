import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const rotateIn = keyframes`
    from {
        transform: perspective(1000px) rotateY(90deg);
        opacity: 0;
    }
    to {
        transform: perspective(1000px) rotateY(0);
        opacity: 1;
    }
`;

const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
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

const Masthead = styled.header`
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background: linear-gradient(
        to bottom,
        rgba(0, 40, 70, 0.8) 0%,
        rgba(0, 80, 120, 0.8) 100%
    );
`;

const BackgroundImage = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://images.unsplash.com/photo-1563013544-824ae1b704d3');
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
            rgba(0, 40, 70, 0.8),
            rgba(0, 80, 120, 0.8)
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
    animation: ${props => props.isVisible ? css`${rotateIn} 1s forwards` : 'none'};
    line-height: 1.3;
`;

const Description = styled.p`
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0;
    animation: ${props => props.isVisible ? css`${fadeInUp} 1s forwards 0.3s` : 'none'};
    line-height: 1.6;
`;

const PaymentCards = styled.div`
    display: flex;
    gap: 2rem;
    margin: 2rem 0;
    perspective: 1000px;
`;

const Card = styled.div`
    width: 200px;
    height: 120px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
    opacity: 0;
    animation: ${props => props.isVisible ? css`${rotateIn} 0.5s forwards ${props.delay}` : 'none'};
    transition: transform 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-10px) rotateY(10deg);
        box-shadow: 0 15px 30px rgba(0,0,0,0.3);
    }

    i {
        font-size: 2rem;
        margin-bottom: 1rem;
        animation: ${pulse} 2s infinite;
    }
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

const FifthLayout = () => {
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
        const paymentSection = document.getElementById('payment');
        if (paymentSection) {
            paymentSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    
// 원하는거 만들고 여기다가 url 넣으면 이동 가능
//{ icon: '💳', title: '카드결제', url: '/payment/card' }, << example     
    const paymentMethods = [ 
        { icon: '💳', title: '카드결제', },
        { icon: '📱', title: '모바일결제', },
        { icon: '🏦', title: '계좌이체', },
        { icon: '💰', title: '마일리지',  }
    ];

    const handleCardClick = (url) => {
        navigate(url);
    };

    const handleMileageCharge = () => {
        // 마일리지 페이지로 이동
        navigate('/mileage', {
            state: {
                from: 'payment',
                timestamp: new Date().getTime()
            }
        });
    };

    return (
        <Masthead id="payment" ref={sectionRef}>
            <BackgroundImage />
            <ContentWrapper>
                <Title isVisible={isVisible}>
                    스마트한 결제 시스템<br />
                    간편한 통합 관리
                </Title>
                <Description isVisible={isVisible}>
                    안전하고 편리한 결제 시스템으로<br />
                    모든 관리비를 한 번에 해결하세요
                </Description>
                <PaymentCards>
                    {paymentMethods.map((method, index) => (
                        <Card
                            key={index}
                            delay={`${index * 0.2}s`}
                            isVisible={isVisible}
                            onClick={() => handleCardClick(method.url)}
                        >
                            <span style={{ fontSize: '2rem' }}>{method.icon}</span>
                            <span style={{ marginTop: '0.5rem' }}>{method.title}</span>
                        </Card>
                    ))}
                </PaymentCards>
                <Button onClick={handleMileageCharge} isVisible={isVisible}>
                    마일리지충전하기
                </Button>
            </ContentWrapper>
        </Masthead>
    );
};

export default FifthLayout;