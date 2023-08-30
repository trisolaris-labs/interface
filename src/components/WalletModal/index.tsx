// import { AbstractConnector } from '@web3-react/abstract-connector'
import { useWeb3React } from '@web3-react/core'
import { Connector } from '@web3-react/types'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import React, { useCallback, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import MetamaskIcon from '../../assets/images/metamask.png'
import { ReactComponent as Close } from '../../assets/images/x.svg'
// import { injected, NETWORK_CHAIN_ID } from '../../connectors'
import { NETWORK_CHAIN_ID, getWalletForConnector, injected } from '../../connectors'
import { SUPPORTED_WALLETS, CHAIN_PARAMS } from '../../constants'
// import usePrevious from '../../hooks/usePrevious'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useWalletModalToggle } from '../../state/application/hooks'
import { ExternalLink } from '../../theme'
import AccountDetails from '../AccountDetails'
import { ButtonLight } from '../../components/Button'
import Modal from '../Modal'
import Option from './Option'
import PendingView from './PendingView'
import { useTranslation } from 'react-i18next'
import { ChainId } from '@trisolaris/sdk'
import { isBraveWallet, isMetamask } from '../../utils'
import useSelectChain from '../../hooks/useSelectChain'

// import { useAppDispatch, useAppSelector } from '../../state/application/hooks'
// import { updateSelectedWallet } from '../../state/application/reducer'
// import { updateWalletError } from '../../state/application/reducer'

const WALLET_TUTORIAL = 'https://metamask.io/faqs'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const Blurb = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 1rem;
    font-size: 12px;
  `};
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending'
}

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}) {
  // important that these are destructed from the account-specific web3-react context
  // const { active, account, connector, activate, error } = useWeb3React()
  // const dispatch = useAppDispatch()
  const { connector, account, chainId } = useWeb3React()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  // const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()

  // const [pendingError, setPendingError] = useState<boolean>()

  const [pendingConnector, setPendingConnector] = useState<Connector | undefined>()
  // const pendingError = useAppSelector(state =>
  //   pendingConnector ? state.wallet.errorByWallet[getWalletForConnector(pendingConnector)] : undefined
  // )

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  // const previousAccount = usePrevious(account)
  const { t } = useTranslation()

  const openOptions = useCallback(() => {
    setWalletView(WALLET_VIEWS.OPTIONS)
  }, [setWalletView])

  // close on connection, when logged out before
  // useEffect(() => {
  //   if (account && !previousAccount && walletModalOpen) {
  //     toggleWalletModal()
  //   }
  // }, [account, previousAccount, toggleWalletModal, walletModalOpen])
  useEffect(() => {
    if (walletModalOpen) {
      setWalletView(account ? WALLET_VIEWS.ACCOUNT : WALLET_VIEWS.OPTIONS)
    }
  }, [walletModalOpen, setWalletView, account])

  // always reset to account view
  // useEffect(() => {
  //   if (walletModalOpen) {
  //     setPendingError(false)
  //     setWalletView(WALLET_VIEWS.ACCOUNT)
  //   }
  // }, [walletModalOpen])
  useEffect(() => {
    if (pendingConnector && walletView !== WALLET_VIEWS.PENDING) {
      // updateWalletError({ wallet: getWalletForConnector(pendingConnector), error: undefined })
      setPendingConnector(undefined)
    }
  }, [pendingConnector, walletView])

  // close modal when a connection is successful
  // const activePrevious = usePrevious(active)
  // const connectorPrevious = usePrevious(connector)
  // useEffect(() => {
  //   if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
  //     setWalletView(WALLET_VIEWS.ACCOUNT)
  //   }
  // }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])

  // const tryActivation = async (connector: AbstractConnector | undefined) => {
  //   let name = ''
  //   Object.keys(SUPPORTED_WALLETS).map(key => {
  //     if (connector === SUPPORTED_WALLETS[key].connector) {
  //       return (name = SUPPORTED_WALLETS[key].name)
  //     }
  //     return true
  //   })
  //   // log selected wallet
  //   ReactGA.event({
  //     category: 'Wallet',
  //     action: 'Change Wallet',
  //     label: name
  //   })
  //   setPendingWallet(connector) // set wallet for pending view
  //   setWalletView(WALLET_VIEWS.PENDING)

  //   connector &&
  //     activate(connector, undefined, true).catch(error => {
  //       if (error instanceof UnsupportedChainIdError) {
  //         activate(connector) // a little janky...can't use setError because the connector isn't set
  //       } else {
  //         setPendingError(true)
  //       }
  //     })
  // }

  const tryActivation = useCallback(
    async (connector: Connector) => {
      const wallet = getWalletForConnector(connector)
      // log selected wallet
      ReactGA.event({
        category: 'Wallet',
        action: 'Change Wallet',
        label: wallet
      })
      try {
        // Fortmatic opens it's own modal on activation to log in. This modal has a tabIndex
        // collision into the WalletModal, so we special case by closing the modal.
        // if (connector === fortmatic) {
        //   toggleWalletModal()
        // }
        setPendingConnector(connector)
        setWalletView(WALLET_VIEWS.PENDING)
        // dispatch(updateWalletError({ wallet, error: undefined }))

        await connector.activate()

        // dispatch(updateSelectedWallet({ wallet }))
      } catch (error) {
        console.debug(`web3-react connection error: ${error}`)
        // dispatch(updateWalletError({ wallet, error: error.message }))
      }
    },
    [toggleWalletModal]
  )

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key]
      const isActive = option.connector === connector

      const optionProps = {
        active: isActive,
        id: `connect-${key}`,
        link: option.href,
        header: option.name,
        color: option.color,
        key,
        icon: require('../../assets/images/' + option.iconName)
      }

      // check for mobile options
      if (isMobile) {
        // Don't list Brave wallet as option if not using Brave
        if (option.name === 'Brave Wallet' && !isBraveWallet()) {
          return null
        }
        return (
          option.name !== SUPPORTED_WALLETS.INJECTED.name && (
            <Option
              {...optionProps}
              onClick={() => {
                if (!isActive && !option.href && !!option.connector) {
                  tryActivation(option.connector)
                }
              }}
              subheader={null}
            />
          )
        )
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                icon={MetamaskIcon}
              />
            )
          } else {
            return null //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask()) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask()) {
          return null
        }
      }

      // return rest of options

      // Don't list Brave wallet as option if not using Brave
      if (option.name === 'Brave Wallet' && !isBraveWallet()) {
        return null
      }

      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            {...optionProps}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && option.connector && tryActivation(option.connector)
            }}
            subheader={null} //use option.descriptio to bring back multi-line
          />
        )
      )
    })
  }

  const selectChain = useSelectChain()
  async function addNetwork() {
    const chainID: ChainId = 1313161554 // n-
    return selectChain()
    // const provider = await injected.provider
    // if (!provider) return
    // try {
    //   try {
    //     await provider.request({
    //       method: 'wallet_switchEthereumChain',
    //       params: [{ chainId: CHAIN_PARAMS[chainID].chainId }]
    //     })
    //   } catch (e) {
    //     // This error code indicates that the chain has not been added to MetaMask.
    //     if ((e as any)?.code !== 4902) {
    //       throw e
    //     }

    //     await provider.request({
    //       method: 'wallet_addEthereumChain',
    //       params: [CHAIN_PARAMS[chainID]]
    //     })
    //   }
    // } catch (e) {
    //   console.error(e)
    // }
  }

  function getModalContent() {
    console.log(chainId, NETWORK_CHAIN_ID)
    if (chainId !== NETWORK_CHAIN_ID) {
      return (
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>{t('walletModal.wrongNetwork')}</HeaderRow>
          <ContentWrapper>
            {connector === injected ? (
              <>
                <h5>{`${t('Please connect to')}:`}</h5>
                {isMetamask() && <ButtonLight onClick={addNetwork}>{t('walletModal.switchNetwork')}</ButtonLight>}
              </>
            ) : (
              <h5>{`${'Please connect to Aurora network in your wallet settings.'}`}</h5>
            )}
          </ContentWrapper>
        </UpperSection>
      )
    }
    if (walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={openOptions}
        />
      )
    }

    return (
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        {walletView === WALLET_VIEWS.ACCOUNT || (!!account && chainId === NETWORK_CHAIN_ID) ? (
          <HeaderRow color="blue">
            <HoverText onClick={() => setWalletView(account ? WALLET_VIEWS.ACCOUNT : WALLET_VIEWS.OPTIONS)}>
              Back
            </HoverText>
          </HeaderRow>
        ) : (
          <HeaderRow>
            <HoverText>{t('walletModal.connectToWallet')}</HoverText>
          </HeaderRow>
        )}
        <ContentWrapper>
          {walletView === WALLET_VIEWS.PENDING && pendingConnector && (
            <PendingView
              openOptions={openOptions}
              connector={pendingConnector}
              error={!!false}
              tryActivation={tryActivation}
            />
          )}
          {walletView !== WALLET_VIEWS.PENDING && <OptionGrid data-cy="option-grid">{getOptions()}</OptionGrid>}
          {walletView !== WALLET_VIEWS.PENDING && (
            <Blurb>
              <span>{t('walletModal.newToAvalanche')} &nbsp;</span>{' '}
              <ExternalLink href={WALLET_TUTORIAL}>{t('walletModal.learnMoreWallet')}</ExternalLink>
            </Blurb>
          )}
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}
