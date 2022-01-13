import { nanoid } from '@reduxjs/toolkit'
import { useCallback, useEffect, useState } from 'react'
import { useAddPopup } from '../state/application/hooks'
import useInterval from './useInterval'

type ErrorAlert = {
  content: string
  isEnabled: boolean
  removeAfterMs: number | null
}

export default function useErrorAlertPoll() {
  const addPopup = useAddPopup()

  const fetchErrorAlert = useCallback(async (): Promise<ErrorAlert | null> => {
      console.log('running fetchErrorAlert');
    try {
      const response = await fetch('https://storage.googleapis.com/trisolaris_public/error_alert/error_alert.json')
      const result = await response.json()

      return result
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching error_alert.json: ', e)
      }

      return null
    }
  }, [])

  const dispatchErrorAlert = useCallback(
      (content: string, removeAfterMs: number | null) => {
        console.log('running dispatchErrorAlert');
      addPopup({
        errorAlert: { content }
      })
    },
    [addPopup]
  )

  const pollForErrorAlert = useCallback(async () => {
      console.log('running pollForErrorAlert');
    const errorAlert = await fetchErrorAlert()

    if (errorAlert == null) {
      return null
    }

    const { content, isEnabled, removeAfterMs } = errorAlert
    if (isEnabled !== true || content == null) {
      return
    }

    dispatchErrorAlert(content, removeAfterMs)
  }, [dispatchErrorAlert, fetchErrorAlert])

  // Fetch error message
  //    if !enabled
  //        do nothing

  useInterval(pollForErrorAlert, 60_000, true)
}
