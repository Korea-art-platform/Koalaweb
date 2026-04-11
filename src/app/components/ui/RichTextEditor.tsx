import { Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, List, ListOrdered, Link, Image as ImageIcon, Table, Palette, Eye } from 'lucide-react';
import { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'wysiwyg' | 'markdown'>('wysiwyg');

  return (
    <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <ToolbarButton icon={<Bold className="w-4 h-4" />} label="Bold" />
          <ToolbarButton icon={<Italic className="w-4 h-4" />} label="Italic" />
          <ToolbarButton icon={<Underline className="w-4 h-4" />} label="Underline" />
          <ToolbarButton icon={<Strikethrough className="w-4 h-4" />} label="Strikethrough" />
        </div>
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={<Heading1 className="w-4 h-4" />} label="H1" />
          <ToolbarButton icon={<Heading2 className="w-4 h-4" />} label="H2" />
          <ToolbarButton icon={<Heading3 className="w-4 h-4" />} label="H3" />
        </div>
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={<AlignLeft className="w-4 h-4" />} label="Align Left" />
          <ToolbarButton icon={<AlignCenter className="w-4 h-4" />} label="Align Center" />
        </div>
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={<List className="w-4 h-4" />} label="Bullet List" />
          <ToolbarButton icon={<ListOrdered className="w-4 h-4" />} label="Numbered List" />
        </div>
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={<Link className="w-4 h-4" />} label="Link" />
          <ToolbarButton icon={<ImageIcon className="w-4 h-4" />} label="Image" />
          <ToolbarButton icon={<Table className="w-4 h-4" />} label="Table" />
        </div>
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={<Palette className="w-4 h-4" />} label="Color" />
        </div>
        <div className="flex items-center gap-1 pl-2">
          <ToolbarButton icon={<Eye className="w-4 h-4" />} label="Preview" />
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative min-h-[400px] bg-white">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full p-4 resize-none outline-none text-base leading-relaxed text-gray-800"
          placeholder="내용을 입력해주세요..."
        />
      </div>

      {/* Footer / Tabs */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs">
        <div className="flex items-center gap-4">
          <button 
            className={`font-medium ${activeTab === 'wysiwyg' ? 'text-black' : 'text-gray-400'}`}
            onClick={() => setActiveTab('wysiwyg')}
          >
            WYSIWYG
          </button>
          <button 
            className={`font-medium ${activeTab === 'markdown' ? 'text-black' : 'text-gray-400'}`}
            onClick={() => setActiveTab('markdown')}
          >
            Markdown
          </button>
        </div>
        <div className="text-gray-400">
          {value.length} / 5000자
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      title={label}
      className="p-1.5 text-gray-500 rounded hover:bg-gray-200 hover:text-black transition-colors"
    >
      {icon}
    </button>
  );
}
