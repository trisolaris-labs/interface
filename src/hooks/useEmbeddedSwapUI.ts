import { URL_WARNING_DOMAIN_EXCEPTIONS } from '../constants'

export default function useEmbeddedSwapUI() {
  const isEmbedded = window.self !== window.top

  const isAllowListed = URL_WARNING_DOMAIN_EXCEPTIONS.has(window.top?.location.hostname ?? '')

  return isAllowListed || isEmbedded
}
