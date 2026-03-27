import './ConfirmationModal.css'

const MODAL_CONTENT = {
  playerCountChange: {
    title: 'Restart game?',
    body: 'Changing the number of players will restart the game. All scores and round history will be lost.',
    cancel: 'Keep playing',
    confirm: 'Restart',
    confirmDanger: true,
  },
  editRound: {
    title: (data) => `Edit round ${data?.roundIdx + 1}?`,
    body: (data) =>
      `This will recalculate all scores from round ${data?.roundIdx + 1} onwards. Current standings will update.`,
    cancel: 'Cancel',
    confirm: 'Edit round',
    confirmDanger: false,
  },
  finalRound: {
    title: 'Final Round',
    body: 'Double-check that all scoring is correct before finishing the game.',
    cancel: 'Go back',
    confirm: 'Confirm & End Game',
    confirmDanger: false,
  },
  endGame: {
    title: 'End game?',
    body: 'This will end the game now and show final results. You can still edit past rounds after.',
    cancel: 'Keep playing',
    confirm: 'End Game',
    confirmDanger: false,
  },
}

export default function ConfirmationModal({ modal, onCancel, onConfirm }) {
  if (!modal) return null
  const cfg = MODAL_CONTENT[modal.type]
  if (!cfg) return null

  const title  = typeof cfg.title === 'function'  ? cfg.title(modal.data)  : cfg.title
  const body   = typeof cfg.body  === 'function'  ? cfg.body(modal.data)   : cfg.body

  return (
    <div className="cm-overlay" role="dialog" aria-modal="true" aria-labelledby="cm-title">
      <div className="cm-box">
        <h2 className="cm-title" id="cm-title">{title}</h2>
        <p className="cm-body">{body}</p>
        <div className="cm-actions">
          <button
            className="cm-cancel"
            type="button"
            onClick={onCancel}
          >
            {cfg.cancel}
          </button>
          <button
            className={`cm-confirm ${cfg.confirmDanger ? 'danger' : ''}`}
            type="button"
            onClick={onConfirm}
          >
            {cfg.confirm}
          </button>
        </div>
      </div>
    </div>
  )
}
