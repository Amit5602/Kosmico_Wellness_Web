import { useState } from 'react';
import { useAdminUsers, useAdminUpdateUserRole } from '../../hooks/useAdmin';
import { Button } from '../../components/ui/Button';

export function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useAdminUsers(page, 20, search);
  const updateRoleMutation = useAdminUpdateUserRole();

  const handleRoleUpdate = (id: string, currentRole: string) => {
    const newRole = prompt('Enter new role (user, admin):', currentRole);
    if (newRole && ['user', 'admin'].includes(newRole.toLowerCase()) && newRole !== currentRole) {
      updateRoleMutation.mutate({ id, role: newRole.toLowerCase() });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-serif text-primary">Manage Users</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <input 
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border border-border rounded-lg px-4 py-2 flex-1 max-w-sm"
        />
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-main">User</th>
                <th className="px-6 py-4 font-medium text-text-main">Role</th>
                <th className="px-6 py-4 font-medium text-text-main">Status</th>
                <th className="px-6 py-4 font-medium text-text-main">Joined</th>
                <th className="px-6 py-4 font-medium text-text-main text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">Loading...</td></tr>
              ) : data?.users?.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">No users found.</td></tr>
              ) : (
                data?.users?.map((user: any) => (
                  <tr key={user._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-main">{user.name}</div>
                      <div className="text-xs text-text-muted">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold uppercase ${user.role === 'admin' ? 'text-primary' : 'text-text-muted'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold uppercase ${user.isActive ? 'text-green-600' : 'text-error'}`}>
                        {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="outline" 
                        className="py-1 px-3 text-xs"
                        onClick={() => handleRoleUpdate(user._id, user.role)}
                      >
                        Change Role
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data?.meta?.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <span className="flex items-center px-4 text-sm text-text-muted">Page {page} of {data.meta.pages}</span>
          <Button variant="outline" onClick={() => setPage(p => Math.min(data.meta.pages, p + 1))} disabled={page >= data.meta.pages}>Next</Button>
        </div>
      )}
    </div>
  );
}
