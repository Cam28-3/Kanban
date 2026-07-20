// Manages the guest user's "team" — lightweight named people (name + color)
// that tasks can be assigned to. These are rows in `team_members`, scoped to
// the current guest session by RLS, not real linked user accounts.
//
// Note: removing a member here does NOT clean up any Task.assignee_ids
// arrays that still reference it. That's intentional — those ids simply
// stop resolving to anything, and TaskCard/TaskModal already filter out
// unresolvable ids when rendering, so orphaned references are harmless.
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

  // Loads every team member belonging to this guest user.
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

  // Creates a new team member and appends the server's copy (with its
  // generated id) to local state, so it's immediately assignable to tasks.
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

  // Deletes a team member, optimistically removing it from local state first
  // and rolling back if the server call fails (same pattern as
  // useTasks.moveTask/deleteTask).
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
