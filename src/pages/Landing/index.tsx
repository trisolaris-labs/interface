import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import { ButtonEmpty, ButtonNone } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import Hero from '../../assets/images/hero.webp'
import Swap from '../../assets/images/swap.webp'
import Farm from '../../assets/images/farm.webp'

import { TYPE } from '../../theme'

const HeroSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
`

const HeroImg = styled.div`
  max-width: 40%;
  min-width: 450px;
  min-height: 450px;
  height: auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
`};
`

const StyledImg = styled.img`
  width: 100%;
`

const Container = styled.div`
  max-width: 1200px;
  margin: -40px 0px auto;
  padding: 0 20px;
`

const ListSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`
const ListItem = styled.div`
  flex: 0 1 calc(33.33% - 20px);
  padding: 0px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

//   ${({ theme }) => theme.mediaWidth.upToSmall`
//   flex: 0 1 100%;
// `};
`

const StyledHeroTitle = styled.h1`
  font-size: 30px;
  margin-bottom: 20px;
  font-weight: 500;
`

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledInfoTitle = styled(TYPE.body)`
  color: ${({ theme }) => theme.auroraGreen};
`

const CallToActionSection = styled.div`
  display: flex;
  justify-content: space-around;
  padding-bottom: 20px;
  border-bottom: 1px solid white;
`

const TinyAstronaut = styled.div`
  max-width: 150px;
  height: auto;
  margin-right: 20px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
`};
`

const CallToAction = styled.div`
  display: flex;
  align-items: center;
`

const StyledArrow = styled.span`
  font-size: 18px;
`

const StyledCallToActionButton = styled(ButtonNone)`
  &:hover {
    border: 1px solid ${({ theme }) => theme.bg3};
  }
`

function Landing() {
  const history = useHistory()
  return (
    <Container>
      <HeroSection>
        <HeroImg>
          <StyledImg src={Hero} alt="logo" />
        </HeroImg>
        <TitleSection>
          <StyledHeroTitle>The first and top DEX on the Aurora Network</StyledHeroTitle>
          <ListSection>
            <ListItem>
              <StyledInfoTitle>STAKERS EARNED</StyledInfoTitle>
              <TYPE.largeHeader>$1.25M+</TYPE.largeHeader>
            </ListItem>
            <ListItem>
              <StyledInfoTitle>LP's Earned</StyledInfoTitle>
              <TYPE.largeHeader>$6.25M+</TYPE.largeHeader>
            </ListItem>
            <ListItem>
              <StyledInfoTitle>LIFETIME VOLUME</StyledInfoTitle>
              <TYPE.largeHeader>$2.5B+</TYPE.largeHeader>
            </ListItem>
            <ListItem>
              <StyledInfoTitle>TOKENS LISTED</StyledInfoTitle>
              <TYPE.largeHeader>50+</TYPE.largeHeader>
            </ListItem>
            <ListItem>
              <StyledInfoTitle>GAS FEES</StyledInfoTitle>
              <TYPE.largeHeader>$0-0.01</TYPE.largeHeader>
            </ListItem>
          </ListSection>
        </TitleSection>
      </HeroSection>
      <CallToActionSection>
        <StyledCallToActionButton onClick={() => history.push('/swap')}>
          <CallToAction>
            <TinyAstronaut>
              <StyledImg src={Swap} alt="Trisolaris Astronaut buying coins" />
            </TinyAstronaut>
            <AutoColumn gap="sm">
              <TYPE.largeHeader>
                Start Buying <StyledArrow>↗</StyledArrow>
              </TYPE.largeHeader>
              <TYPE.body>Most options. Cheapest fees.</TYPE.body>
            </AutoColumn>
          </CallToAction>
        </StyledCallToActionButton>

        <StyledCallToActionButton onClick={() => history.push('/farm')}>
          <CallToAction>
            <TinyAstronaut>
              <StyledImg src={Farm} alt="Trisolaris Astronaut farming" />
            </TinyAstronaut>
            <AutoColumn gap="sm">
              <TYPE.largeHeader>
                Start Earning <StyledArrow>↗</StyledArrow>
              </TYPE.largeHeader>
              <TYPE.body>Best Yields. Most Partnerships.</TYPE.body>
            </AutoColumn>
          </CallToAction>
        </StyledCallToActionButton>
      </CallToActionSection>
    </Container>
  )
}

export default Landing
