import React, { useState, useEffect } from 'react';
import { AlertCircle, Save, Upload } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import { supabase } from '../../lib/supabase';

interface VedapatasalaContent {
  id: string;
  title: string;
  content: string;
  pdf_url?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 p-4 space-x-2 flex flex-wrap gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        Underline
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive('paragraph') ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        Paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1 rounded ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-3 py-1 rounded ${
          editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`px-3 py-1 rounded ${
          editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        Left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`px-3 py-1 rounded ${
          editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        Center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`px-3 py-1 rounded ${
          editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        Right
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        Ordered List
      </button>
    </div>
  );
};

const ManageVedapatasalaContent = () => {
  const [content, setContent] = useState<VedapatasalaContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [2, 3],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Color,
    ],
    content: '',
  });

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('vedapatasala_content')
        .select('*')
        .single();

      if (error) throw error;
      setContent(data);
      setTitle(data.title);
      editor?.commands.setContent(data.content);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editor) {
      fetchContent();
    }
  }, [editor]);

  const uploadPDF = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('vedapatasala-pdfs')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('vedapatasala-pdfs')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSave = async () => {
    if (!editor) return;
    setSaving(true);
    setError(null);

    try {
      let pdfUrl = content?.pdf_url;

      if (pdfFile) {
        // If there's an existing PDF, delete it first
        if (content?.pdf_url) {
          const oldPdfKey = content.pdf_url.split('/').pop();
          if (oldPdfKey) {
            await supabase.storage
              .from('vedapatasala-pdfs')
              .remove([oldPdfKey]);
          }
        }
        // Upload new PDF
        pdfUrl = await uploadPDF(pdfFile);
      }

      const { error } = await supabase
        .from('vedapatasala_content')
        .upsert({
          id: 'default',
          title,
          content: editor.getHTML(),
          pdf_url: pdfUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setPdfFile(null);
      fetchContent();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Vedapatasala Content</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} className="mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPdfFile(file);
                        }
                      }}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF up to 10MB
                </p>
                {pdfFile && (
                  <p className="text-sm text-green-600">
                    Selected: {pdfFile.name}
                  </p>
                )}
                {content?.pdf_url && !pdfFile && (
                  <p className="text-sm text-blue-600">
                    Current PDF: <a href={content.pdf_url} target="_blank" rel="noopener noreferrer" className="underline">View PDF</a>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="min-h-[500px] p-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageVedapatasalaContent;