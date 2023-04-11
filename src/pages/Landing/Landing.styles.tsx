import styled from 'styled-components'
import { ButtonNone } from '../../components/Button'

import { TYPE } from '../../theme'

export const HeroSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    margin-bottom: 0px;
  `};
`

export const HeroImg = styled.div`
  max-width: 40%;
  height: auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 400px;
    flex-direction: column;
    // min-width: 100%;
    min-height:auto;
`};
`

export const StyledImg = styled.img`
  width: 100%;
`

export const Container = styled.div`
  max-width: 1200px;
  margin: -60px 0px auto;
  padding: 0 20px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: -70px 0px auto;
  `};
`

export const ListSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`
export const ListItem = styled.div`
  flex: 0 1 calc(33.33% - 20px);
  padding: 0px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0px 0px 20px;
    flex: 0 1 30%;
  `};
`

export const StyledHeroTitle = styled.h1`
  font-size: 30px;
  margin-bottom: 20px;
  font-weight: 500;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 24px;
  `};
`

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`

export const StyledInfoTitle = styled(TYPE.body)`
  color: ${({ theme }) => theme.auroraGreen};
  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 50%;
    white-space: normal;
  `};
`

export const CallToActionSection = styled.div`
  display: flex;
  justify-content: space-around;
  padding-bottom: 20px;
  border-bottom: 1px solid white;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
`

export const TinyAstronaut = styled.div`
  max-width: 150px;
  height: auto;
  margin-right: 20px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-right: 0px;
    max-width: 100px;
  `};
`

export const CallToAction = styled.div`
  display: flex;
  align-items: center;
`

export const FarmCallToAction = styled(CallToAction)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: row-reverse
    `};
`

export const StyledArrow = styled.span`
  font-size: 18px;
`

export const StyledCallToActionButton = styled(ButtonNone)`
  padding: 0px;
  &:hover {
    border: 1px solid ${({ theme }) => theme.bg3};
  }
`

export const InvestorsSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 50px;
`
export const InvestorLogo = styled.div<{}>`
  max-width: 180px;
  flex: 1 0 20%;
`

export const StyledListInfo = styled.h1`
  font-weight: 600;
  font-size: 24px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 16px;
  `};
`