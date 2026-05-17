import { useState, useRef, useEffect } from 'react'
import { supabase, uploadPhoto } from '../supabaseClient'
import { PARTS, ROLES } from './constants'

const BLANK = {
  name: '', university: '', gender: '', part: '', role: '',
  is_waseda: false, photo_url: '',
}

export default function MemberModal({ member, onClose, onSaved }) {
  const isEdit = !!member
  const [form, setForm]       = useState(isEdit ? { ...member } : BLANK)
  const [photoFile, setPhotoFile] = useState(null)
  const [preview, setPreview]   = useState(member?.photo_url || null)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)
  const fileInputRef = useRef()

  // 大学名から早稲田を自動検知
  useEffect(() => {
    if (form.university?.includes('早稲田')) {
      setForm(f => ({ ...f, is_waseda: true }))
    }
  }, [form.university])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!form.name.trim()) { setError('名前は必須です'); return }
    setSaving(true)
    setError(null)

    try {
      let photoUrl = form.photo_url

      if (isEdit) {
        // 編集：まずレコード更新してIDを確保
        const memberId = member.id
        if (photoFile) {
          photoUrl = await uploadPhoto(photoFile, memberId)
        }
        const { error } = await supabase.from('members').update({
          ...form, photo_url: photoUrl
        }).eq('id', memberId)
        if (error) throw error
      } else {
        // 新規：先にDBへinsertしてIDを取得、その後写真アップロード
        const { data, error: insertError } = await supabase
          .from('members')
          .insert([{ ...form, photo_url: '' }])
          .select()
          .single()
        if (insertError) throw insertError

        if (photoFile) {
          photoUrl = await uploadPhoto(photoFile, data.id)
          await supabase.from('members').update({ photo_url: photoUrl }).eq('id', data.id)
        }
      }

      onSaved()
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? '✏️ メンバー編集' : '＋ メンバー追加'}</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-banner">⚠️ {error}</div>}

          {/* 写真アップロード */}
          <div className="photo-upload-area">
            <div className="photo-preview" onClick={() => fileInputRef.current.click()}>
              {preview
                ? <img src={preview} alt="preview" />
                : (
                  <div className="photo-preview-placeholder">
                    <span>📷</span>
                    写真を<br />選択
                  </div>
                )
              }
            </div>
            <button className="btn-photo-select" onClick={() => fileInputRef.current.click()}>
              📁 写真を選択
            </button>
            <input
              ref={fileInputRef}
              className="photo-upload-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>

          {/* 名前・大学 */}
          <div className="form-row">
            <div className="form-group">
              <label>名前 *</label>
              <input
                type="text"
                placeholder="山田 太郎"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>大学</label>
              <input
                type="text"
                placeholder="早稲田大学"
                value={form.university}
                onChange={e => set('university', e.target.value)}
              />
            </div>
          </div>

          {/* 性別・パート */}
          <div className="form-row">
            <div className="form-group">
              <label>性別</label>
              <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="">選択してください</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="その他">その他</option>
              </select>
            </div>
            <div className="form-group">
              <label>パート（楽器）</label>
              <select value={form.part} onChange={e => set('part', e.target.value)}>
                <option value="">選択してください</option>
                {PARTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* 役職 */}
          <div className="form-group">
            <label>役職</label>
            <select value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="">選択してください</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* 早稲田タグ */}
          <div
            className={`waseda-toggle${form.is_waseda ? ' active' : ''}`}
            onClick={() => set('is_waseda', !form.is_waseda)}
          >
            <span className="waseda-toggle-label">🔴 早稲田大学タグ</span>
            <span className="waseda-toggle-badge">早稲田</span>
            <div className="toggle-switch" />
          </div>
          <p style={{ fontSize: '.75rem', color: 'var(--muted)', marginBottom: '.75rem', marginTop: '-.5rem' }}>
            ※ 大学名に「早稲田」と入力すると自動でONになります
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>キャンセル</button>
          <button className="btn-save" onClick={handleSubmit} disabled={saving}>
            {saving ? '保存中...' : isEdit ? '更新する' : '登録する'}
          </button>
        </div>
      </div>
    </div>
  )
}
