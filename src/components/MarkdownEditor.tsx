import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="markdown-editor">
      <div className="markdown-editor__toolbar">
        <label htmlFor="diary-review">日记内容</label>
        <button
          type="button"
          className={`toolbar-btn ${!preview ? 'toolbar-btn--active' : ''}`}
          onClick={() => setPreview(false)}
        >
          编辑
        </button>
        <button
          type="button"
          className={`toolbar-btn ${preview ? 'toolbar-btn--active' : ''}`}
          onClick={() => setPreview(true)}
        >
          预览
        </button>
      </div>
      {preview ? (
        <div className="markdown-editor__preview">
          {value ? <ReactMarkdown>{value}</ReactMarkdown> : <p className="placeholder">暂无内容</p>}
        </div>
      ) : (
        <textarea
          id="diary-review"
          className="markdown-editor__textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="写下你的观影感受…支持 Markdown 格式"
          rows={8}
        />
      )}
    </div>
  );
}
