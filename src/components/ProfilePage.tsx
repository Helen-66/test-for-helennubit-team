import { useState, useRef, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ProfilePageProps {
  onBack: () => void;
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [nickname, setNickname] = useState(profile?.nickname ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    setMessage('');

    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage(`上传失败: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    await updateProfile({ avatar_url: data.publicUrl });
    setUploading(false);
    setMessage('头像已更新');
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const { error } = await updateProfile({ nickname: nickname || null, bio: bio || null });
    setSaving(false);
    setMessage(error ? `保存失败: ${error.message}` : '资料已保存');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          ← 返回
        </button>
        <h2>个人资料</h2>
      </div>

      <div className="profile-avatar-section">
        <div className="profile-avatar">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="头像" />
          ) : (
            <div className="profile-avatar-placeholder">
              {nickname?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleAvatarUpload(file);
          }}
        />
        <button
          type="button"
          className="btn btn--secondary"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? '上传中...' : '更换头像'}
        </button>
      </div>

      <form className="profile-form" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="profile-email">邮箱</label>
          <input id="profile-email" type="email" value={user?.email ?? ''} disabled />
        </div>

        <div className="form-group">
          <label htmlFor="profile-nickname">昵称</label>
          <input
            id="profile-nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="你的昵称"
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label htmlFor="profile-bio">简介</label>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="介绍一下自己..."
            rows={3}
            maxLength={200}
          />
        </div>

        {message && <p className="profile-message">{message}</p>}

        <div className="form-actions">
          <button className="btn btn--primary" type="submit" disabled={saving}>
            {saving ? '保存中...' : '保存资料'}
          </button>
          <button type="button" className="btn btn--danger" onClick={handleSignOut}>
            退出登录
          </button>
        </div>
      </form>
    </div>
  );
}
