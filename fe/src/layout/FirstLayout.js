import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useCallback } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

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

const fadeIn = keyframes`
    to {
        opacity: 1;
    }
`;

const Masthead = styled.header`
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 20, 0.7) 0%,
        rgba(0, 0, 40, 0.7) 100%
    );
    isolation: isolate;
`;

const BackgroundImage = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://images.unsplash.com/photo-1534237710431-e2fc698436d0');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -2;
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

const ParticlesContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    
    canvas {
        position: absolute !important;
        width: 100% !important;
        height: 100% !important;
    }
`;

const ContentWrapper = styled.div`
    position: relative;
    padding: 0 2rem;
    max-width: 1200px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    z-index: 2;
    flex-direction: column;
    justify-content: center;
    color: white;

    h1 {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        opacity: 0;
        animation: ${fadeInUp} 1s forwards;
        line-height: 1.3;
    }

    p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        opacity: 0;
        animation: ${fadeInUp} 1s forwards 0.3s;
        line-height: 1.6;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    opacity: 0;
    animation: ${fadeIn} 1s forwards 0.6s;

    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
        max-width: 300px;
    }
`;

const Button = styled.button`
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: all 0.3s ease;
    cursor: pointer;
    backdrop-filter: blur(5px);

    &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }

    &.facilities:hover {
        border-color: #4CAF50;
        box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
    }

    &.community:hover {
        border-color: #9C27B0;
        box-shadow: 0 5px 15px rgba(156, 39, 176, 0.3);
    }

    &.parking:hover {
        border-color: #2196F3;
        box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
    }

    &.payment:hover {
        border-color: #FF9800;
        box-shadow: 0 5px 15px rgba(255, 152, 0, 0.3);
    }
`;

const FirstLayout = () => {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const futuristicOptions = {
    autoPlay: true,
    background: {
      opacity: 0
    },
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 1900
        }
      },
      color: {
        value: ["#3498db", "#e74c3c", "#00ff7f", "#ffff00"]
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.6,
        random: false,
        anim: {
          enable: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false
        }
      },
      links: {
        enable: true,
        distance: 150,
        color: "rgba(255, 255, 255, 0.2)",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        outModes: {
          default: "bounce"
        },
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: {
          enable: true,
          mode: "grab"
        },
        onClick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 150,
          links: {
            opacity: 1
          }
        },
        push: {
          quantity: 4
        }
      }
    },
    detectRetina: false,
    fpsLimit: 144,
    fullScreen: {
      enable: false,
      zIndex: 0
    }
  };

  return (
    <Masthead>
      <BackgroundImage />
      <ParticlesContainer>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={futuristicOptions}
        />
      </ParticlesContainer>
      <ContentWrapper>
        <h1>
          아파트 통합 관리 시스템<br />
          UrbanSystem입니다.
        </h1>
        <p>
          아파트 활성화를 위한 맞춤형 시스템 <br />
          주민을 위한 편의시설/소통시설/주차/결제서비스를 제공 합니다.
        </p>
        <ButtonGroup>
          <Button
            className="facilities"
            onClick={() => handleScroll('facilities')}
          >
            시설관리
          </Button>
          <Button
            className="community"
            onClick={() => handleScroll('communities')}
          >
            소통관리
          </Button>
          <Button
            className="parking"
            onClick={() => handleScroll('parking')}
          >
            주차관리
          </Button>
          <Button
            className="payment"
            onClick={() => handleScroll('payment')}
          >
            결제관리
          </Button>
        </ButtonGroup>
      </ContentWrapper>
    </Masthead>
  );
};

export default FirstLayout;