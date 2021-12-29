import React from 'react'
import styled from 'styled-components';
import { TYPE } from '../../theme';
import Card from '../Card';
import { AutoRow } from '../Row';
import spacemanOnPlanet from '../../assets/svg/spaceman_on_planet.svg';
import { AutoColumn } from '../Column';

const StyledCard = styled(Card)`
    background: radial-gradient(farthest-corner at 0% 0%, #32B4FF 0%,#000000 70%);
    padding-right: 0;
    padding-top: 0;
    padding-bottom: 0;
`

const IconContainer = styled.div`
    max-height: 144px;
    max-width: 240px;
    overflow: hidden;
    & > * {
        object-position: 16px 16px;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
        max-height: 90px;
        & > * {
            height: 200px;
            width: 150px;
            object-position: 24px 16px;
        }
  `};
`

export default function FarmBannerRadialCornerSpaceman13() {
    return (
        <StyledCard>
            <AutoRow justifyContent="space-between" style={{ alignItems: 'flex-start' }}>
                <AutoColumn style={{ paddingTop: '1rem' }}>
                    <TYPE.largeHeader>
                        Farm
                    </TYPE.largeHeader>
                    <TYPE.subHeader>
                        Total TVL: $1,000
                    </TYPE.subHeader>
                </AutoColumn>
                <IconContainer>
                    <img height="360px" src={spacemanOnPlanet} />
                </IconContainer>
            </AutoRow>
        </StyledCard>
    );
}