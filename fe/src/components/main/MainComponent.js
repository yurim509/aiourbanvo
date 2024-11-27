// MainComponent.js
import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import FirstLayout from '../../layout/FirstLayout';
import SecondLayout from '../../layout/SecondLayout';
import ThirdLayout from '../../layout/ThirdLayout';
import FourthLayout from '../../layout/FourthLayout';
import FifthLayout from '../../layout/FifthLayout';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

const Section = styled.section`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const ScrollProgress = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-in-out;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-3px);
    background: rgba(0, 0, 0, 0.4);
  }

  &::before {
    content: '';
    position: absolute;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
`;

const CircularProgress = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const Circle = styled.circle`
  width: 100%;
  height: 100%;
  fill: none;
  stroke: #00ff88;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: ${2 * Math.PI * 28}; // 원의 둘레 (r=28)
  stroke-dashoffset: ${props =>
    2 * Math.PI * 28 * (1 - props.progress)}; // 진행률에 따라 선 길이 조절
  transition: stroke-dashoffset 0.3s ease;
  filter: drop-shadow(0 0 2px rgba(0, 255, 136, 0.5));
`;

const ProgressText = styled.span`
  position: absolute;
  color: white;
  font-size: 12px;
  font-weight: bold;
  margin-top: 25px;
`;

const ArrowIcon = styled.div`
  width: 12px;
  height: 12px;
  border-left: 3px solid white;
  border-top: 3px solid white;
  transform: rotate(45deg);
  margin-top: -5px;
  transition: transform 0.3s ease;

  ${ScrollProgress}:hover & {
    transform: rotate(45deg) scale(1.1);
  }
`;

const MainComponent = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 로드 시 진행률 계산

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Container>
      <Content>
        <Section>
          <FirstLayout />
        </Section>
        <Section>
          <SecondLayout />
        </Section>
        <Section>
          <ThirdLayout />
        </Section>
        <Section>
          <FourthLayout />
        </Section>
        <Section>
          <FifthLayout />
        </Section>
      </Content>

      <ScrollProgress
        onClick={scrollToTop}
        title="맨 위로 이동"
      >
        <CircularProgress>
          <Circle
            cx="30"
            cy="30"
            r="28"
            progress={scrollProgress}
          />
        </CircularProgress>
        <ArrowIcon />
        <ProgressText>
          {Math.round(scrollProgress * 100)}%
        </ProgressText>
      </ScrollProgress>
    </Container>
  );
};

export default MainComponent;