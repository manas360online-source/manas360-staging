import React, { useState } from 'react';
import { AdminUser } from '../services/analyticsApi';

interface UserManagementProps {
    users: AdminUser[];
    onVerify: (id: string) => Promise<boolean>;
    loading: boolean;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, onVerify, loading }) => {
    const [search, setSearch] = useState('');
    const displayUsers = users || [];

    const filteredUsers = displayUsers.filter(user =>
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold text-calm-blue">User Management</h2>
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-9 pr-4 py-2 border border-calm-lightBlue/30 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-calm-blue w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-calm-lightBlue/20 bg-white/60 backdrop-blur-sm shadow-sm">
                <table className="min-w-full divide-y divide-calm-lightBlue/10">
                    <thead className="bg-calm-lightBlue/5">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-calm-blue uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-calm-blue uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-calm-blue uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-calm-blue uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-calm-blue uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-calm-lightBlue/10 bg-transparent">
                        {loading && filteredUsers.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">Loading users...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">No users found</td></tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-calm-lightBlue/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-calm-lavender/40 flex items-center justify-center text-calm-blue font-bold">
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-calm-text">{user.fullName}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${user.role === 'admin' ? 'bg-rose-100 text-rose-800' :
                                            user.role === 'therapist' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            {user.role === 'therapist' && (
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                                                    {user.isVerified ? 'Verified' : 'Pending'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {user.role === 'therapist' && !user.isVerified && (
                                            <button
                                                onClick={() => onVerify(user.id)}
                                                className="text-calm-blue hover:text-opacity-80 font-semibold"
                                            >
                                                Verify
                                            </button>
                                        )}
                                        {user.role !== 'admin' && (
                                            <button className="ml-4 text-gray-400 hover:text-rose-600 transition-colors">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
