import { ErrorBoundary as ErrorBoundaryImpl } from 'react-error-boundary'
import React from 'react'

type Props = Exclude<React.ComponentProps<typeof ErrorBoundaryImpl>, 'onError'>

export default function ErrorBoundary(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleError(error: Error, _info: { componentStack: string }) {
    console.error(error)
  }

  return <ErrorBoundaryImpl {...props} onError={handleError} />
}
