import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Link2, Image as ImageIcon, Undo2, Redo2, Quote,
} from 'lucide-react';
import { uploadBannerImage } from '@/api/adminApi';

interface Props {
  value: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors disabled:opacity-40 ${
        active ? 'bg-koala-navy text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ inline: false }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }: { editor: Editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'koala-prose min-h-[240px] max-h-[440px] overflow-y-auto focus:outline-none px-3.5 py-3' },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return <div className="border border-gray-200 rounded-lg h-[300px] bg-gray-50 animate-pulse" />;
  }

  const pickImage = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('이미지 파일만 업로드할 수 있습니다.'); return; }
    setUploading(true);
    try {
      const url = await uploadBannerImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('링크 URL을 입력하세요', prev ?? 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-black/10">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50/70 px-2 py-1.5">
        <ToolbarButton title="굵게" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="기울임" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton title="제목" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="소제목" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="인용" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton title="글머리 목록" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="번호 목록" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton title="링크" active={editor.isActive('link')} onClick={setLink}>
          <Link2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title={uploading ? '업로드 중…' : '이미지'} disabled={uploading} onClick={pickImage}>
          {uploading
            ? <span className="w-4 h-4 border-2 border-gray-300 border-t-koala-navy rounded-full animate-spin" />
            : <ImageIcon className="w-4 h-4" />}
        </ToolbarButton>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton title="실행 취소" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="다시 실행" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="w-4 h-4" />
        </ToolbarButton>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
