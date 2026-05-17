export default function Header({ count, onAdd }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1>🎴 自己紹介カード DB</h1>
        <span className="header-count">{count} 名</span>
      </div>
      <button className="btn-add" onClick={onAdd}>
        <span>＋</span> メンバー追加
      </button>
    </header>
  )
}
