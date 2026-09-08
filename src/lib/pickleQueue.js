import { supabase } from './supabase'

export async function recordPickleQueueWinner(matchId, winnerTeam) {
  if (!['A', 'B'].includes(winnerTeam)) throw new Error('winnerTeam must be A or B')

  const { data, error } = await supabase.rpc('complete_pickle_queue_match', {
    p_match_id: matchId,
    p_winner_team: winnerTeam,
  })

  if (error) throw error
  return data
}

export async function getPickleQueueLeaderboard(sessionId) {
  const { data, error } = await supabase
    .from('pickle_queue_player_stats')
    .select('*')
    .eq('session_id', sessionId)
    .order('wins', { ascending: false })
    .order('games_played', { ascending: false })

  if (error) throw error
  return data
}
