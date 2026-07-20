import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface GuestSessionState {
  session: Session | null
  loading: boolean
  error: string | null
}

export function useGuestSession() {
  const [state, setState] = useState<GuestSessionState>({
    session: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const { data, error } = await supabase.auth.getSession()

      if (cancelled) return

      if (error) {
        setState({ session: null, loading: false, error: error.message })
        return
      }

      if (data.session) {
        setState({ session: data.session, loading: false, error: null })
        return
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously()

      if (cancelled) return

      if (signInError) {
        setState({ session: null, loading: false, error: signInError.message })
        return
      }

      setState({ session: signInData.session, loading: false, error: null })
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
