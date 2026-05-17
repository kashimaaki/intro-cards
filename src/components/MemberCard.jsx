export default function MemberCard({ member, onEdit, onDelete }) {
  const { name, university, gender, part, role, is_waseda, photo_url } = member

  return (
    <div className="member-card">
      <div className="card-photo-wrap">
        {photo_url
          ? <img src={photo_url} alt={name} loading="lazy" />
          : <div className="card-photo-placeholder">👤</div>
        }
        {is_waseda && <span className="waseda-badge">早稲田</span>}
      </div>

      <div className="card-body">
        <div className="card-name">{name || '（名前未設定）'}</div>
        <div className="card-tags">
          {university && <span className="tag tag-univ">{university}</span>}
          {part      && <span className="tag tag-part">{part}</span>}
          {role      && <span className="tag tag-role">{role}</span>}
          {gender    && <span className="tag tag-gender">{gender}</span>}
        </div>
        <div className="card-actions">
          <button className="btn-edit" onClick={() => onEdit(member)}>編集</button>
          <button className="btn-del"  onClick={() => onDelete(member.id)}>削除</button>
        </div>
      </div>
    </div>
  )
}
