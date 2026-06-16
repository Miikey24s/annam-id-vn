"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Code,
} from "lucide-react";

type RichTextEditorProps = {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[300px] max-h-[600px] overflow-y-auto bg-surface-alt/20 border border-border rounded-b-2xl py-4 px-6 focus:outline-none focus:border-primary prose dark:prose-invert max-w-none text-sm text-text",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const Button = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg hover:bg-primary-light hover:text-primary transition-colors ${
        isActive ? "bg-primary-light text-primary font-bold" : "text-text-secondary"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full flex flex-col border border-border rounded-2xl overflow-hidden bg-surface">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-surface-alt border-b border-border/80">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-border/80 mx-1" />
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Code Block inline"
        >
          <Code className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
