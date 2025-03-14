import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, Upload, ArrowUp, ArrowDown, Save } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import { supabase } from '../../lib/supabase';

interface Pastor {
  id: string;
  name: string;
  title: string;
  description: string;
  image_url: string;
  order_position: number;
}

interface PastorsFellowshipContent {
  id: string;
  title: string;
  content: string;
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

const ManagePastorsFellowship = () => {
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [content, setContent] = useState<PastorsFellowshipContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [newPastor, setNewPastor] = useState({
    name: '',
    title: '',
    description: '',
    imageFile: null as File | null
  });

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
        .from('pastors_fellowship_content')
        .select('*')
        .single();

      if (error) throw error;
      setContent(data);
      setTitle(data.title);
      editor?.commands.setContent(data.content);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchPastors = async () => {
    try {
      const { data, error } = await supabase
        .from('pastors')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      setPastors(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editor) {
      fetchContent();
      fetchPastors();
    }
  }, [editor]);

  const handleSaveContent = async () => {
    if (!editor) return;
    setSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('pastors_fellowship_content')
        .upsert({
          id: 'default',
          title,
          content: editor.getHTML(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('pastors')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('pastors')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddPastor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      if (!newPastor.imageFile) {
        throw new Error('Please select an image');
      }

      // Get the highest order number and add 1
      const maxOrder = pastors.reduce((max, p) => Math.max(max, p.order_position), 0);
      const newOrder = maxOrder + 1;

      // Upload image to storage
      const imageUrl = await uploadImage(newPastor.imageFile);

      // Create pastor record
      const { error } = await supabase
        .from('pastors')
        .insert([{
          name: newPastor.name,
          title: newPastor.title,
          description: newPastor.description,
          image_url: imageUrl,
          order_position: newOrder
        }]);

      if (error) throw error;

      setNewPastor({
        name: '',
        title: '',
        description: '',
        imageFile: null
      });
      fetchPastors();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePastor = async (id: string, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this pastor?')) return;

    try {
      // Delete image from storage
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await supabase.storage
        .from('pastors')
        .remove([fileName]);

      // Delete record from database
      const { error } = await supabase
        .from('pastors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchPastors();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMovePastor = async (id: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = pastors.findIndex(p => p.id === id);
      if (currentIndex === -1) return;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= pastors.length) return;

      const currentPastor = pastors[currentIndex];
      const swapPastor = pastors[newIndex];

      const { error } = await supabase
        .from('pastors')
        .upsert([
          { ...currentPastor, order_position: swapPastor.order_position },
          { ...swapPastor, order_position: currentPastor.order_position }
        ]);

      if (error) throw error;

      fetchPastors();
    } catch (err: any) {
      setError(err.message);
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
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Content</h2>
          <button
            onClick={handleSaveContent}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} className="mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

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

            <div className="prose max-w-none">
              <MenuBar editor={editor} />
              <EditorContent editor={editor} className="min-h-[300px] p-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Manage Pastors</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleAddPastor} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4">Add New Pastor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pastor Image
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
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewPastor({ ...newPastor, imageFile: file });
                          }
                        }}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  {newPastor.imageFile && (
                    <p className="text-sm text-green-600">
                      Selected: {newPastor.imageFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pastor Name
              </label>
              <input
                type="text"
                value={newPastor.name}
                onChange={(e) => setNewPastor({ ...newPastor, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newPastor.title}
                onChange={(e) => setNewPastor({ ...newPastor, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newPastor.description}
                onChange={(e) => setNewPastor({ ...newPastor, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows={3}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="mt-6 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} className="mr-2" />
            {uploading ? 'Adding...' : 'Add Pastor'}
          </button>
        </form>

        <div className="space-y-4">
          {pastors.map((pastor, index) => (
            <div key={pastor.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-6">
                <img
                  src={pastor.image_url}
                  alt={pastor.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{pastor.name}</h3>
                      <p className="text-gray-600">{pastor.title}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMovePastor(pastor.id, 'up')}
                        disabled={index === 0}
                        className="p-2 text-gray-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowUp size={20} />
                      </button>
                      <button
                        onClick={() => handleMovePastor(pastor.id, 'down')}
                        disabled={index === pastors.length - 1}
                        className="p-2 text-gray-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowDown size={20} />
                      </button>
                      <button
                        onClick={() => handleDeletePastor(pastor.id, pastor.image_url)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600">{pastor.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagePastorsFellowship;