import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 소용돌이 효과 애니메이션
const vortexEffect = keyframes`
  0% {
    background: conic-gradient(from 0deg at 50% 50%,
      rgba(255,255,255,0.1) 0%,
      rgba(255,255,255,0.2) 25%,
      rgba(255,255,255,0.3) 50%,
      rgba(255,255,255,0.2) 75%,
      rgba(255,255,255,0.1) 100%
    );
  }
  100% {
    background: conic-gradient(from 360deg at 50% 50%,
      rgba(255,255,255,0.1) 0%,
      rgba(255,255,255,0.2) 25%,
      rgba(255,255,255,0.3) 50%,
      rgba(255,255,255,0.2) 75%,
      rgba(255,255,255,0.1) 100%
    );
  }
`;

// 아이콘 회전 효과
const iconRotate = keyframes`
   0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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

const Masthead = styled.header`
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 40, 0.7) 0%,
        rgba(60, 0, 80, 0.7) 100%
    );
`;

const BackgroundImage = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://images.unsplash.com/photo-1577563908411-5077b6dc7624');
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
            rgba(0, 0, 50, 0.7),
            rgba(60, 0, 80, 0.7)
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
    animation: ${props => props.isVisible ? css`${fadeInUp} 1s forwards` : 'none'};
    line-height: 1.3;
`;

const Description = styled.p`
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0;
    animation: ${props => props.isVisible ? css`${fadeInUp} 1s forwards 0.3s` : 'none'};
    line-height: 1.6;
`;

const IconsContainer = styled.div`
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    justify-content: center;
    opacity: 0;
    animation: ${props => props.isVisible ? css`${fadeInUp} 1s forwards 0.6s` : 'none'};
`;

const IconWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem;
`;

const IconEmoji = styled.span`
  font-size: 1.5rem;
  margin-bottom: 0.2rem;
  position: relative;
  z-index: 2;
  animation: ${iconRotate} 4s linear infinite;
`;

const IconInner = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    animation: ${vortexEffect} 4s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    background: rgba(60, 0, 80, 0.7);
    border-radius: 50%;
    z-index: 1;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const IconText = styled.span`
  font-size: 0.8rem;
  color: white;
  position: absolute;
  bottom: -20px;
  width: 100%;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
    animation: ${props => props.isVisible ? css`${fadeInUp} 1s forwards 0.9s` : 'none'};
    cursor: pointer;
    backdrop-filter: blur(10px);
    margin-top: 3rem;

    &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
`;

const ThirdLayout = () => {
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
        const communitiesSection = document.getElementById('communities');
        if (communitiesSection) {
            communitiesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const communityIcons = [
        { icon: '💬', name: '게시판', url: '/communities/board' },
        { icon: '📢', name: '공지사항', url: '/communities/announce' },
        { icon: '🤝', name: '장터', url: '/communities/market' },
        { icon: '📱', name: '생활정보', url: '/communities/info' }
    ];

    const handleIconClick = (url) => {
        navigate(url);
    };

    return (
        <Masthead id="communities" ref={sectionRef}>
            <BackgroundImage />
            <ContentWrapper>
                <Title isVisible={isVisible}>
                    소통하는 우리 아파트<br />
                    함께 만드는 커뮤니티
                </Title>
                <Description isVisible={isVisible}>
                    실시간 소통과 정보 공유로<br />
                    더 가까워지는 이웃과의 관계
                </Description>
                <IconsContainer isVisible={isVisible} className='p-5 space-x-24'>
                    {communityIcons.map((item, index) => (
                        <IconWrapper key={index}>
                            <IconInner
                                isVisible={isVisible}
                                onClick={() => handleIconClick(item.url)}
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                <IconEmoji>{item.icon}</IconEmoji>
                            </IconInner>
                            <IconText>{item.name}</IconText>
                        </IconWrapper>
                    ))}
                </IconsContainer>
                <Button onClick={handleScroll} isVisible={isVisible}>
                    자세히 보기
                </Button>
            </ContentWrapper>
        </Masthead>
    );
};

export default ThirdLayout;