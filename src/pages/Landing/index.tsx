import React from 'react'
import styled from 'styled-components'

import { PageWrapper } from '../../components/Page'
import { TYPE } from '../../theme'

import Hero from '../../assets/images/hero.webp'
import Swap from '../../assets/images/swap.webp'
import Farm from '../../assets/images/farm.webp'
import { AutoColumn } from '../../components/Column'

const HeroSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;

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
  margin: 0 auto;
  padding: 20px;
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
  color: #6fa52e;
`

const AstronautsSection = styled.div`
  display: flex;
  justify-content: space-between;
`

const TinyAstronaut = styled.div`
  max-width: 150px;
  height: auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
`};
`

function Landing() {
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
      <AstronautsSection>
        <TinyAstronaut>
          <StyledImg src={Swap} alt="Trisolaris Astronaut buying coins" />
        </TinyAstronaut>
        <TinyAstronaut>
          <StyledImg src={Farm} alt="Trisolaris Astronaut farming" />
        </TinyAstronaut>
      </AstronautsSection>
    </Container>
  )
}

export default Landing
