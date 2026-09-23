import { useState, useRef } from 'react';
import { X, Plus, Star, Image as ImageIcon, Upload, FolderPlus } from 'lucide-react';
import { compressImageFile } from './ProductForm';

export default function ProductImageUploader({ form, setForm }) {
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const mainInputRef = useRef(null);
  const extraInputRef = useRef(null);

  const handleMainFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImageFile(file);
    if (compressed) setForm(f => ({ ...f, image: compressed, imageFile: null }));
  };

  const handleExtraFiles = async (e) => {
    const files = Array.from(e.target.files);
    const compressed = (await Promise.all(files.map(compressImageFile))).filter(Boolean);
    if (compressed.length) setForm(f => ({ ...f, galleryImages: [...f.galleryImages, ...compressed] }));
    e.target.value = null;
  };

  const addGalleryUrl = () => {
    if (newGalleryUrl.trim()) {
      setForm(f => ({ ...f, galleryImages: [...f.galleryImages, newGalleryUrl.trim()] }));
      setNewGalleryUrl('');
    }
  };

  const removeGallery = (index) => setForm(f => ({ ...f, galleryImages: f.galleryImages.filter((_, i) => i !== index) }));

  const setAsCover = (imgUrl, index) => {
    const prev = form.image;
    setForm(f => ({
      ...f,
      image: imgUrl,
      imageFile: null,
      galleryImages: prev ? [...f.galleryImages.filter((_, i) => i !== index), prev] : f.galleryImages.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-slate-50 p-4 md:p-6 rounded-xl border-2 border-dashed border-slate-300 space-y-6">
      <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
        <span className="p-2 bg-black text-white rounded-lg"><ImageIcon size={18} /></span>
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-black">Product Photos / Images</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Device gallery se photos upload ya Image URL add karein.</p>
        </div>
      </div>

      {/* Main Cover Photo */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="sm:col-span-2 space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Main Cover Photo (From Gallery):
            </label>
            <input
              ref={mainInputRef}
              type="file"
              accept="image/*"
              onChange={handleMainFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => mainInputRef.current?.click()}
              className="w-full py-2.5 px-4 bg-black hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Upload size={14} />
              <span>Choose Main Photo From Gallery</span>
            </button>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Ya Photo URL Paste Karein:</label>
            <input
              type="url"
              placeholder="https://example.com/main.jpg"
              value={form.image}
              onChange={e => setForm(f => ({ ...f, image: e.target.value, imageFile: null }))}
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium focus:border-black outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[100px]">
          {form.image ? (
            <div className="relative group w-20 h-20 rounded border border-slate-300 overflow-hidden shadow-sm bg-white">
              <img src={form.image} alt="Main" className="w-full h-full object-cover" onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }} />
              <button type="button" onClick={() => setForm(f => ({ ...f, image: '', imageFile: null }))} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"><X size={10} /></button>
            </div>
          ) : (
            <span className="text-slate-400 text-xs">No Cover Photo</span>
          )}
        </div>
      </div>

      {/* Extra Gallery Photos */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-black">Extra Gallery Photos ({form.galleryImages.length})</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Upload Multiple Gallery Images:</label>
            <input
              ref={extraInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleExtraFiles}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => extraInputRef.current?.click()}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-black text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <FolderPlus size={14} />
              <span>Select Photos From Gallery</span>
            </button>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Add Image URL:</label>
            <div className="flex gap-2">
              <input type="url" placeholder="https://..." value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGalleryUrl(); } }} className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs outline-none" />
              <button type="button" onClick={addGalleryUrl} className="bg-black text-white px-3 py-1.5 rounded text-xs font-bold uppercase"><Plus size={12} /></button>
            </div>
          </div>
        </div>

        {form.galleryImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
            {form.galleryImages.map((imgUrl, idx) => (
              <div key={idx} className="relative group bg-white rounded border border-slate-200 overflow-hidden aspect-square">
                <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 p-1">
                  <button type="button" onClick={() => setAsCover(imgUrl, idx)} className="bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded w-full">Cover</button>
                  <button type="button" onClick={() => removeGallery(idx)} className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded w-full">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
