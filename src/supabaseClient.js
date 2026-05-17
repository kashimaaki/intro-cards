import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase環境変数が設定されていません。.envファイルを確認してください。')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const PHOTO_BUCKET = 'photos'

export async function uploadPhoto(file, memberId) {
  const ext = file.name.split('.').pop()
  const path = `${memberId}.${ext}`
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
