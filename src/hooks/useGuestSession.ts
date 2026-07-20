// Bootstraps a "guest" Supabase Auth session with no email/password.
//
// Pseudocode:
//   on mount:
//     ask Supabase "do I already have a session?" (it checks localStorage)
//     if yes -> use it, done
//     if no  -> ask Supabase to create a brand new anonymous user, use that
//
// Because supabase-js persists the session token in the browser's
// localStorage automatically, this means:
//   - reloading the page keeps the same guest identity (same user_id)
//   - a different browser / incognito window / cleared storage gets a
//     brand-new, empty guest identity — there's no login to get the old one
//     back, since there's no password
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
    // Guards against setting state after the component has unmounted
    // (e.g. if the user navigates away mid-request).
    let cancelled = false

    async function bootstrap() {
      // Step 1: is there already a session stored from a previous visit?
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

      // Step 2: no existing session -> create a new anonymous guest user.
      // Requires "Anonymous Sign-ins" enabled in the Supabase dashboard.
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
