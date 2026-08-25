export default function NavSearchDropdown({ suggestions, onSelect, onViewAll, getImageUrl }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-md overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
      {suggestions.map(item => (
        <div
          key={item.id}
          className="flex items-center px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(item);
          }}
        >
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-10 h-10 object-cover rounded-sm border border-slate-200 mr-3"
          />
          <div>
            <p className="text-xs font-bold text-black line-clamp-1">{item.name}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-widest">PKR {item.price}</p>
          </div>
        </div>
      ))}
      <div
        className="px-4 py-2 bg-slate-50 text-center text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-black hover:bg-slate-100 cursor-pointer transition"
        onMouseDown={(e) => {
          e.preventDefault();
          onViewAll(e);
        }}
      >
        View all results
      </div>
    </div>
  );
}
