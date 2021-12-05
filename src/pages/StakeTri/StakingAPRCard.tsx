import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { DataCard, CardBGImage, CardSection } from '../../components/earn/styled'
import { useTriBarStats } from '../../state/stakeTri/hooks'
import { useFetchTriBarAPR } from '../../fetchers/bar'

const Card = styled(DataCard)`
   background: radial-gradient(76.02% 75.41% at 1.84% 0%, #888D9B 0%, #33ffa7c2 100%);
 `

const MediumHeaderWhite = styled(TYPE.mediumHeader)`
  color: white;
`
const SubHeaderWhite = styled(TYPE.subHeader)`
  color: white;
`
const LargeHeaderWhite = styled(TYPE.largeHeader)`
  color: white;
`

export default function StakingAPRCard() {
    const { triToXTRIRatio } = useTriBarStats();
    const apr = useFetchTriBarAPR();
    // @TODO Use this after prod APR is ready
    // const aprText = (
    //     <>
    //         <LargeHeaderWhite>
    //             {apr == null
    //                 ? 'Loading...'
    //                 : `${apr?.toFixed(2)}%`}
    //         </LargeHeaderWhite>
    //         <SubHeaderWhite>
    //             Yesterday's APR
    //         </SubHeaderWhite>
    //     </>
    // );
    const aprText = <LargeHeaderWhite>Coming Soon</LargeHeaderWhite>;

    const triToXTRIRatioFormatted = triToXTRIRatio?.toFixed(6);
    const ratioText = triToXTRIRatioFormatted == null
        ? 'Loading...'
        : `1 TRI = ${triToXTRIRatioFormatted} xTRI`;

    return (
        <Card>
            <CardSection>
                <AutoColumn gap="md">
                    <RowBetween>
                        <AutoColumn gap="sm" justify="start">
                            <MediumHeaderWhite fontWeight={600}>
                                Staking APR
                            </MediumHeaderWhite>
                            <SubHeaderWhite>
                                {ratioText}
                            </SubHeaderWhite>
                        </AutoColumn>
                        <AutoColumn gap="sm" justify="end">
                            {aprText}
                        </AutoColumn>
                    </RowBetween>
                </AutoColumn>
            </CardSection>
            <CardBGImage />
        </Card>
    )
}