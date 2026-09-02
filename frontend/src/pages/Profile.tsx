
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      logout();
      navigate('/');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">My Account</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 mb-8">
        <h2 className="text-xl font-bold mb-4">Profile Details</h2>
        <div className="space-y-4">
          <div>
            <span className="block text-sm text-neutral-500">Name</span>
            <span className="font-medium">{user.name}</span>
          </div>
          <div>
            <span className="block text-sm text-neutral-500">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div>
            <span className="block text-sm text-neutral-500">Role</span>
            <span className="font-medium uppercase text-xs bg-neutral-100 px-2 py-1 rounded">{user.role}</span>
          </div>
        </div>
      </div>

      <Button variant="outline" onClick={handleLogout}>
        Log Out
      </Button>
    </div>
  );
};
