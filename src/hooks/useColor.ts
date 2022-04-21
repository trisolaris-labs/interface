import { useState, useLayoutEffect } from 'react'
import { shade } from 'polished'
import Vibrant from 'node-vibrant'
import { hex } from 'wcag-contrast'
import { Token } from '@trisolaris/sdk'

const COLOR_MAP = new Map()

async function getVibrant(path: string, address: string) {
  try {
    const palette = await Vibrant.from(path).getPalette()

    if (palette?.Vibrant == null) {
      return null
    }

    let color = palette.Vibrant.hex
    let AAscore = hex(color, '#FFF')
    while (AAscore < 3) {
      color = shade(0.005, color)
      AAscore = hex(color, '#FFF')
    }

    COLOR_MAP.set(address, color)

    return color
  } catch (error) {
    return null
  }
}

async function getColorFromToken(token: Token): Promise<string | null> {
  if (COLOR_MAP.has(token.address)) {
    return COLOR_MAP.get(token.address)
  }

  const paths = [
    `https://raw.githubusercontent.com/trisolaris-labs/tokens/master/assets/${token.address}/logo.svg`,
    `https://raw.githubusercontent.com/trisolaris-labs/tokens/master/assets/${token.address}/logo.png`
  ]

  return (await getVibrant(paths[0], token.address)) ?? (await getVibrant(paths[1], token.address))
}

export function useColor(token?: Token) {
  const [color, setColor] = useState<string | null>(null)

  useLayoutEffect(() => {
    let stale = false

    if (token) {
      getColorFromToken(token).then(tokenColor => {
        if (!stale && tokenColor !== null) {
          setColor(tokenColor)
        }
      })
    }

    return () => {
      stale = true
      setColor(null)
    }
  }, [token])

  return color
}

export function useColorWithDefault(defaultColor: string, token?: Token) {
  return useColor(token) ?? defaultColor
}

// These tokens are mostly grey; Override color to blue
const GREY_ICON_TOKENS = ['ETH', 'WETH', 'WBTC', 'WNEAR']
const FALLBACK_COLOR = '#2172E5'
// Colors are dynamically chosen based on token logos
export function useColorForToken(token?: Token, fallbackPredicate?: () => boolean) {
  const color = useColor(token)
  const predicateResult = fallbackPredicate?.() ?? true

  if (predicateResult && GREY_ICON_TOKENS.includes(token?.symbol ?? '')) {
    return FALLBACK_COLOR
  }

  return color
}
