import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { AvatarColor, TeamMember } from '../types/task'

interface UseTeamMembersState {
  members: TeamMember[]
  loading: boolean
  error: string | null
}

export function useTeamMembers(userId: string | undefined) {
  const [state, setState] = useState<UseTeamMembersState>({
    members: [],
    loading: true,
    error: null,
  })

  const fetchMembers = useCallback(async () => {
    if (!userId) return

    setState((prev) => ({ ...prev, loading: true, error: null }))

    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) {
      setState({ members: [], loading: false, error: error.message })
      return
    }

    setState({ members: data as TeamMember[], loading: false, error: null })
  }, [userId])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const addMember = useCallback(
    async (name: string, color: AvatarColor) => {
      if (!userId) return

      const { data, error } = await supabase
        .from('team_members')
        .insert({ name, color, user_id: userId })
        .select()
        .single()

      if (error) {
        setState((prev) => ({ ...prev, error: error.message }))
        return
      }

      setState((prev) => ({ ...prev, members: [...prev.members, data as TeamMember], error: null }))
    },
    [userId],
  )

  const removeMember = useCallback(async (memberId: string) => {
    let previousMembers: TeamMember[] = []

    setState((prev) => {
      previousMembers = prev.members
      return { ...prev, members: prev.members.filter((m) => m.id !== memberId), error: null }
    })

    const { error } = await supabase.from('team_members').delete().eq('id', memberId)

    if (error) {
      setState((prev) => ({ ...prev, members: previousMembers, error: error.message }))
    }
  }, [])

  return {
    members: state.members,
    loading: state.loading,
    error: state.error,
    addMember,
    removeMember,
  }
}
