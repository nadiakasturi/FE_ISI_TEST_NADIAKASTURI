'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function CreateTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToTeamId, setAssignedToTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('token');

    if (!token) {
      alert('Token tidak ditemukan');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        assignedToTeamId: assignedToTeamId ? Number(assignedToTeamId) : null,
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      alert(data.message || 'Gagal membuat task');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-4"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Create New Task
        </h1>

        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Assigned to Team ID</label>
          <input
            type="number"
            value={assignedToTeamId}
            onChange={(e) => setAssignedToTeamId(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded transition text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}
