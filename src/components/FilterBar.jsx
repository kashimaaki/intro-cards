import { useMemo } from 'react'
import { PARTS, GRADES } from './constants'

export default function FilterBar({ filters, setFilters, members, filteredCount }) {
  const set = (key, val) => setFilters(f => ({ ...f, [key]: val }))

  // メンバーから役職の一覧を動的生成
  const roles = useMemo(() => {
    const s = new Set(members.map(m => m.role).filter(Boolean))
    return [...s].sort()
  }, [members])

  return (
    <div className="filterbar">
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="名前 / 大学で検索..."
          value={filters.search}
          onChange={e => set('search', e.target.value)}
        />
      </div>

      <select
        className="filter-select"
        value={filters.gender}
        onChange={e => set('gender', e.target.value)}
      >
        <option value="">性別: すべて</option>
        <option value="男性">男性</option>
        <option value="女性">女性</option>
        <option value="その他">その他</option>
      </select>

      <select
        className="filter-select"
        value={filters.part}
        onChange={e => set('part', e.target.value)}
      >
        <option value="">パート: すべて</option>
        {PARTS.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <select
        className="filter-select"
        value={filters.grade}
        onChange={e => set('grade', e.target.value)}
      >
         <option value="">学年: すべて</option>
        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
      </select>

      <select
        className="filter-select"
        value={filters.sort}
        onChange={e => set('sort', e.target.value)}
      >
        <option value="">並び替え: 登録順</option>
        <option value="grade_asc">学年: 1年→博士</option>
        <option value="grade_desc">学年: 博士→1年</option>
      </select>
      <select
        className="filter-select"
        value={filters.role}
        onChange={e => set('role', e.target.value)}
      >
        <option value="">役職: すべて</option>
        {roles.map(r => <option key={r} value={r}>{r}</option>)}
      </select>

      <button
        className={`waseda-filter-btn${filters.wasedaOnly ? ' active' : ''}`}
        onClick={() => set('wasedaOnly', !filters.wasedaOnly)}
      >
        🔴 早稲田のみ
      </button>

      <span className="filter-count">{filteredCount} 件</span>
    </div>
  )
}
