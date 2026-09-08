import { useEffect, useMemo, useState } from 'react'
import { Trophy } from 'lucide-react'

function playerName(player) {
  return (
    player?.display_name ||
    player?.name ||
    player?.pickle_queue_players?.display_name ||
    'Player'
  )
}

/**
 * Active Pickle Queue court card.
 *
 * Expected match shape:
 * {
 *   id,
 *   winner_team: 'A' | 'B' | null,
 *   completed_at: string | null,
 *   players: [
 *     { team: 'A', slot: 1, display_name: 'Ella' },
 *     { team: 'A', slot: 2, display_name: 'Rico' },
 *     { team: 'B', slot: 1, display_name: 'Nikki' },
 *     { team: 'B', slot: 2, display_name: 'Sam' },
 *   ]
 * }
 *
 * You can also pass Supabase match-player rows where the player name is nested
 * under `pickle_queue_players.display_name`.
 */
export default function PickleQueueCourtCard({
  courtLabel,
  match,
  onFinish,
  isFinishing = false,
}) {
  const [selectedWinner, setSelectedWinner] = useState(match?.winner_team || null)

  useEffect(() => {
    setSelectedWinner(match?.winner_team || null)
  }, [match?.id, match?.winner_team])

  const players = match?.players || match?.match_players || []

  const teams = useMemo(() => {
    const sorted = [...players].sort((a, b) => (a.slot || 0) - (b.slot || 0))
    return {
      A: sorted.filter((player) => player.team === 'A'),
      B: sorted.filter((player) => player.team === 'B'),
    }
  }, [players])

  const completed = Boolean(match?.completed_at)
  const winner = match?.winner_team || selectedWinner

  async function finishGame() {
    if (!selectedWinner || !onFinish || isFinishing) return
    await onFinish(selectedWinner)
  }

  return (
    <section className="rounded-[22px] border border-[#dedbd0] bg-[#f5faef] p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-[#14251d]">{courtLabel}</h3>
        <span className="rounded-full bg-[#dff2c9] px-3 py-1 text-sm font-semibold text-[#66a92f]">
          {completed ? 'Finished' : 'In play'}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {['A', 'B'].map((team) => {
          const isWinner = winner === team
          const isSelected = selectedWinner === team

          return (
            <div
              key={team}
              className={`rounded-2xl border p-4 transition ${
                isWinner
                  ? 'border-[#176447] bg-white ring-2 ring-[#176447]/15'
                  : isSelected
                    ? 'border-[#176447] bg-white'
                    : 'border-[#e2e0d8] bg-white'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#607066]">
                  Team {team}
                </p>

                {isWinner && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e5f4d7] px-2.5 py-1 text-xs font-bold text-[#4f8f27]">
                    <Trophy size={14} /> Winner
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {teams[team].map((player, index) => (
                  <div
                    key={player.id || player.player_id || `${team}-${index}`}
                    className="rounded-xl bg-[#f8f8f5] px-4 py-3 text-center font-semibold text-[#17251f]"
                  >
                    {playerName(player)}
                  </div>
                ))}

                {teams[team].length === 0 && (
                  <div className="rounded-xl bg-[#f8f8f5] px-4 py-3 text-center text-sm text-[#8b938e]">
                    Waiting for players
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {!completed && (
        <>
          <p className="mb-3 mt-5 text-sm font-semibold text-[#536159]">
            Select the winning team
          </p>

          <div className="grid grid-cols-2 gap-3">
            {['A', 'B'].map((team) => (
              <button
                key={team}
                type="button"
                onClick={() => setSelectedWinner(team)}
                className={`rounded-xl border px-4 py-3 font-bold transition ${
                  selectedWinner === team
                    ? 'border-[#176447] bg-[#176447] text-white'
                    : 'border-[#d9d7cf] bg-white text-[#213129] hover:border-[#176447]'
                }`}
              >
                Team {team} won
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={!selectedWinner || isFinishing}
            onClick={finishGame}
            className="mt-4 w-full rounded-full bg-[#176447] px-5 py-3.5 text-base font-bold text-white transition hover:bg-[#124f39] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isFinishing
              ? 'Saving result…'
              : selectedWinner
                ? `Finish game · Team ${selectedWinner} wins`
                : 'Choose a winner to finish'}
          </button>
        </>
      )}
    </section>
  )
}
