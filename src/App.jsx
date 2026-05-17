import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import MemberGrid from './components/MemberGrid'
import MemberModal from './components/MemberModal'
import MemberDetail from './components/MemberDetail'

export default function App() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [detailMember, setDetailMember] = useState(null)
  const [filters, setFilters] = useState({
    search: '', gender: '', part: '', role: '', wasedaOnly: false,
    grade: '', sort: '',
  })

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) { setError(error.message); setLoading(false); return }
    setMembers(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  const filtered = members.filter(m => {
    const q = filters.search.toLowerCase()
    if (q && !m.name?.toLowerCase().includes(q) && !m.university?.toLowerCase().includes(q)) return false
    if (filters.gender && m.gender !== filters.gender) return false
    if (filters.part && m.part !== filters.part) return false
    if (filters.role && m.role !== filters.role) return false
    if (filters.wasedaOnly && !m.is_waseda) return false
    if (filters.grade && m.grade !== filters.grade) return false
    return true
  })

  const GRADE_ORDER = [
    '学部1年', '学部2年', '学部3年', '学部4年',
    '修士1年（M1）', '修士2年（M2）',
    '博士1年（D1）', '博士2年（D2）',
  ]

  const sorted = [...filtered].sort((a, b) => {
    if (!filters.sort) return 0
    const ai = GRADE_ORDER.indexOf(a.grade ?? '')
    const bi = GRADE_ORDER.indexOf(b.grade ?? '')
    const ia = ai === -1 ? 999 : ai
    const ib = bi === -1 ? 999 : bi
    return filters.sort === 'grade_asc' ? ia - ib : ib - ia
  })

  async function handleDelete(id) {
    if (!window.confirm('このメンバーを削除しますか？')) return
    await supabase.from('members').delete().eq('id', id)
    fetchMembers()
  }

  return (
    <div>
      <Header count={members.length} onAdd={() => { setEditTarget(null); setModalOpen(true) }} />
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        members={members}
        filteredCount={sorted.length}
      />
      <div className="grid-container">
        {error && <div className="error-banner" style={{gridColumn:'1/-1'}}>⚠️ {error}</div>}
        <MemberGrid
          members={sorted}
          loading={loading}
          onCardClick={setDetailMember}
        />
      </div>

      {detailMember && (
        <MemberDetail
          member={detailMember}
          onClose={() => setDetailMember(null)}
          onEdit={(m) => { setEditTarget(m); setModalOpen(true) }}
          onDelete={handleDelete}
        />
      )}

      {modalOpen && (
        <MemberModal
          member={editTarget}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); fetchMembers() }}
        />
      )}
    </div>
  )
}