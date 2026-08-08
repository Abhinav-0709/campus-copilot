'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Filter, Trash2, ShieldCheck, GraduationCap, Users } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  department: string;
  rollOrEmp: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'faculty' | 'admin'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error('Failed to fetch admin users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userToDelete: UserRow) => {
    if (!window.confirm(`Are you sure you want to delete user "${userToDelete.name}" (${userToDelete.email})? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(userToDelete.id);
    try {
      const res = await fetch(`/api/admin/users?profileId=${userToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to delete user');
      }
    } catch (e) {
      console.error('Failed to delete user:', e);
      alert('Error connecting to server to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = filterRole === 'all' ? users : users.filter((u) => u.role === filterRole);

  const getRoleBadge = (role: 'student' | 'faculty' | 'admin') => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center rounded-full bg-[#DBEAFE] dark:bg-[#1A2129] px-3 py-1 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Admin
          </span>
        );
      case 'faculty':
        return (
          <span className="inline-flex items-center rounded-full bg-[#DBEAFE] dark:bg-[#1A2129] px-3 py-1 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
            <Users className="mr-1 h-3.5 w-3.5" /> Faculty
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-[#DBEAFE] dark:bg-[#1A2129] px-3 py-1 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
            <GraduationCap className="mr-1 h-3.5 w-3.5" /> Student
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA] tracking-tight">User Directory & Management</h1>
          <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">
            View registered system accounts and remove authorized access
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="aurora-btn-primary px-4 py-2.5 text-xs inline-flex items-center cursor-pointer w-fit"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Users
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E5EAF2] dark:border-[#27313B] pb-3 text-xs font-bold">
        <Filter className="h-4 w-4 text-[#475569] dark:text-[#A3ADB8] mr-1" />
        <span className="text-[#475569] dark:text-[#A3ADB8] mr-2">Filter Role:</span>
        {(['all', 'student', 'faculty', 'admin'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setFilterRole(r)}
            className={`rounded-xl px-3.5 py-1.5 capitalize transition-all cursor-pointer ${
              filterRole === r
                ? 'bg-[#2563EB] text-white shadow-sm font-extrabold'
                : 'bg-white dark:bg-[#1A2129] text-[#475569] dark:text-[#A3ADB8] hover:bg-[#DBEAFE]/50 dark:hover:bg-[#27313B] hover:text-[#2563EB] border border-[#E5EAF2] dark:border-[#27313B]'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5EAF2] dark:border-[#27313B] flex items-center justify-between bg-[#F5F8FC] dark:bg-[#1A2129]">
          <h2 className="text-sm font-extrabold text-[#111827] dark:text-[#F5F7FA]">Registered Accounts ({filteredUsers.length})</h2>
          <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA]">Live Database Sync</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm font-semibold text-[#475569] dark:text-[#A3ADB8]">
            Loading system user directory...
          </div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            title="No Users Found"
            description="No registered user accounts match the selected role filter."
            icon={Users}
            className="border-0 shadow-none py-12"
          />
        ) : (
          <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
            {filteredUsers.map((u) => (
              <div key={u.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129] transition-colors">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-[#DBEAFE] dark:bg-[#1A2129] text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B] flex items-center justify-center font-extrabold text-sm shadow-sm">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-extrabold text-[#111827] dark:text-[#F5F7FA] truncate">{u.name}</p>
                      {getRoleBadge(u.role)}
                    </div>
                    <p className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8] truncate mt-0.5">{u.email} • {u.department}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <span className="text-xs font-bold text-[#475569] dark:text-[#A3ADB8] bg-[#F5F8FC] dark:bg-[#1A2129] px-3 py-1.5 rounded-xl border border-[#E5EAF2] dark:border-[#27313B]">
                    ID: {u.rollOrEmp}
                  </span>

                  <button
                    onClick={() => handleDeleteUser(u)}
                    disabled={deletingId === u.id}
                    title="Delete User"
                    className="inline-flex items-center rounded-xl border border-rose-200 dark:border-[#FF5C5C]/30 bg-rose-50 dark:bg-[#FF5C5C]/10 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-[#FF5C5C] hover:bg-rose-600 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    {deletingId === u.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

