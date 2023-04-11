import React from 'react'
import { useHistory } from 'react-router-dom'

import { AutoColumn } from '../../components/Column'

import Hero from '../../assets/images/hero.webp'
import Swap from '../../assets/images/swap.webp'
import Farm from '../../assets/images/farm.webp'
import Electric from '../../assets/images/electric.svg'
import Dragonfly from '../../assets/images/dragonfly.svg'
import Jump from '../../assets/images/jump.svg'
import Lemniscap from '../../assets/images/lemniscap.svg'
import Ethereal from '../../assets/images/ethereal.svg'

import { TYPE } from '../../theme'
import {
  HeroSection,
  HeroImg,
  StyledImg,
  Container,
  ListSection,
  ListItem,
  StyledHeroTitle,
  TitleSection,
  StyledInfoTitle,
  CallToActionSection,
  TinyAstronaut,
  CallToAction,
  FarmCallToAction,
  StyledArrow,
  StyledCallToActionButton,
  InvestorsSection,
  InvestorLogo,
  StyledListInfo
} from './Landing.styles'

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
              <StyledListInfo>$1.25M+</StyledListInfo>
            </ListItem>
            <ListItem>
              <StyledInfoTitle>LP's EARNED</StyledInfoTitle>
              <StyledListInfo>$6.25M+</StyledListInfo>
            </ListItem>
            <ListItem>
              <StyledInfoTitle>LIFETIME VOLUME</StyledInfoTitle>
              <StyledListInfo>$2.5B+</StyledListInfo>
            </ListItem>
            <ListItem>
              <StyledInfoTitle>TOKENS LISTED</StyledInfoTitle>
              <StyledListInfo>50+</StyledListInfo>
            </ListItem>
            <ListItem>
              <StyledInfoTitle>
                GAS
                <br />
                FEES
              </StyledInfoTitle>
              <StyledListInfo>$0-0.01</StyledListInfo>
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
          <FarmCallToAction>
            <TinyAstronaut>
              <StyledImg src={Farm} alt="Trisolaris Astronaut farming" />
            </TinyAstronaut>
            <AutoColumn gap="sm">
              <TYPE.largeHeader>
                Start Earning <StyledArrow>↗</StyledArrow>
              </TYPE.largeHeader>
              <TYPE.body>Best Yields. Most Partnerships.</TYPE.body>
            </AutoColumn>
          </FarmCallToAction>
        </StyledCallToActionButton>
      </CallToActionSection>
      <AutoColumn justify="center">
        <StyledHeroTitle>INVESTORS</StyledHeroTitle>
        <InvestorsSection>
          <InvestorLogo>
            <StyledImg src={Electric} alt="Electric Capital logo" />
          </InvestorLogo>
          <InvestorLogo>
            <StyledImg src={Dragonfly} alt="Dragonfly logo" />
          </InvestorLogo>
          <InvestorLogo>
            <StyledImg src={Jump} alt="Jump Crypto logo" />
          </InvestorLogo>
          <InvestorLogo>
            <StyledImg src={Lemniscap} alt="Lemniscap logo" />
          </InvestorLogo>
          <InvestorLogo>
            <StyledImg src={Ethereal} alt="Ethereal Ventures logo" />
          </InvestorLogo>
        </InvestorsSection>
      </AutoColumn>
    </Container>
  )
}

export default Landing