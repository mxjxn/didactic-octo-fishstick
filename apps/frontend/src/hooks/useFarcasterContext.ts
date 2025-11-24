import { useEffect, useState } from 'react'
import sdk from '@farcaster/frame-sdk'

export function useFarcasterContext() {
  const [isContextReady, setIsContextReady] = useState(false)
  const [context, setContext] = useState<{
    fid: number | null
    username: string | null
  }>({
    fid: null,
    username: null,
  })

  useEffect(() => {
    const initSdk = async () => {
      try {
        await sdk.actions.ready()
        const ctx = sdk.context

        setContext({
          fid: ctx?.user?.fid || null,
          username: ctx?.user?.username || null,
        })
        setIsContextReady(true)
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error)
        setIsContextReady(true)
      }
    }

    initSdk()
  }, [])

  return {
    isContextReady,
    fid: context.fid,
    username: context.username,
  }
}
