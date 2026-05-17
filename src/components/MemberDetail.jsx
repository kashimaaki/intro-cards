export default function MemberDetail({ member, onClose, onEdit, onDelete }) {
  const { name, university, gender, part, role, is_waseda, photo_url } = member

  function handleDelete() {
    onClose()
    onDelete(member.id)
  }

  return (
    <div className="detail-overlay">
      <div className="detail-backdrop" onClick={onClose} />
      <div className="detail-card">
        <button className="btn-detail-close" onClick={onClose}>✕</button>

        {photo_url
          ? <img className="detail-photo" src={photo_url} alt={name} />
          : <div className="detail-photo-placeholder">👤</div>
        }

        <div className="detail-body">
          <div className="detail-header">
            <div className="detail-name">{name || '（名前未設定）'}</div>
            {is_waseda && <span className="detail-waseda">早稲田</span>}
          </div>

          <div className="detail-info">
            {university && (
              <div className="detail-info-item">
                <div className="detail-info-label">大学</div>
                <div className="detail-info-value">{university}</div>
              </div>
            )}
            {part && (
              <div className="detail-info-item">
                <div className="detail-info-label">パート</div>
                <div className="detail-info-value">{part}</div>
              </div>
            )}
            {role && (
              <div className="detail-info-item">
                <div className="detail-info-label">役職</div>
                <div className="detail-info-value">{role}</div>
              </div>
            )}
            {gender && (
              <div className="detail-info-item">
                <div className="detail-info-label">性別</div>
                <div className="detail-info-value">{gender}</div>
              </div>
            )}
          </div>

          <div className="detail-actions">
            <button className="btn-detail-edit" onClick={() => { onClose(); onEdit(member) }}>
              編集
            </button>
            <button className="btn-detail-del" onClick={handleDelete}>
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
