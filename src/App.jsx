import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import MemberGrid from './components/MemberGrid'
import MemberModal from './components/MemberModal'

export default function App() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null) // null = 新規, object = 編集
  const [filters, setFilters] = useState({
    search: '',
    gender: '',
    part: '',
    role: '',
    wasedaOnly: false,
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

  // フィルタリング
  const filtered = members.filter(m => {
    const q = filters.search.toLowerCase()
    if (q && !m.name?.toLowerCase().includes(q) && !m.university?.toLowerCase().includes(q)) return false
    if (filters.gender && m.gender !== filters.gender) return false
    if (filters.part && m.part !== filters.part) return false
    if (filters.role && m.role !== filters.role) return false
    if (filters.wasedaOnly && !m.is_waseda) return false
    return true
  })

  function handleAdd() {
    setEditTarget(null)
    setModalOpen(true)
  }
  function handleEdit(member) {
    setEditTarget(member)
    setModalOpen(true)
  }
  async function handleDelete(id) {
    if (!window.confirm('このメンバーを削除しますか？')) return
    const { error } = await supabase.from('members').delete().eq('id', id)
    if (error) { alert('削除エラー: ' + error.message); return }
    fetchMembers()
  }

  return (
    <div>
      <Header count={members.length} onAdd={handleAdd} />
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        members={members}
        filteredCount={filtered.length}
      />
      <div className="grid-container">
        {error && <div className="error-banner" style={{gridColumn:'1/-1'}}>⚠️ {error}</div>}
        <MemberGrid
          members={filtered}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
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
