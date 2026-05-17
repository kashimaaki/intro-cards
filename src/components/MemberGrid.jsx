import MemberCard from './MemberCard'

export default function MemberGrid({ members, loading, onEdit, onDelete }) {
  if (loading) return (
    <div className="loading-overlay">
      <div className="spinner" />
      読み込み中...
    </div>
  )

  if (members.length === 0) return (
    <div className="empty-state">
      <p>🎴</p>
      <p>メンバーが見つかりません。<br />上の「メンバー追加」から登録してください。</p>
    </div>
  )

  return members.map(m => (
    <MemberCard key={m.id} member={m} onEdit={onEdit} onDelete={onDelete} />
  ))
}
