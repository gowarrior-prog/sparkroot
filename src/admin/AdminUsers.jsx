export default function AdminUsers({ users }) {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold uppercase tracking-widest">User Management</h3>
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-x-auto w-full max-w-full">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Name', 'Email', 'Role', 'Orders', 'Joined'].map(h => (
                <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-bold text-sm text-black">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-black flex-shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm font-medium">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest ${
                    u.role === 'admin' ? 'bg-black text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-black font-bold">{u._count?.orders || 0}</td>
                <td className="px-6 py-4 text-slate-400 text-xs font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan="5" className="text-center py-12 text-slate-400 font-medium">No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
