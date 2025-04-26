'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';

const statusOptions = ['Not Started', 'On Progress', 'Done', 'Reject'];

export default function EditTaskPage() {
  const router = useRouter();
  const { taskId } = useParams();
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [assignedToTeamId, setAssignedToTeamId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch(`/api/task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setDescription(data.description || '');
        setStatus(data.status || '');
        setAssignedToTeamId(data.assignedToTeamId?.toString() || '');
      } catch (err) {
        console.error('Failed to fetch task:', err);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = Cookies.get('token');

    const res = await fetch(`/api/task/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        description,
        status,
        assignedToTeamId: assignedToTeamId ? Number(assignedToTeamId) : null,
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to update task');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleUpdate} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold text-blue-600 text-center">Edit Task</h1>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">-- Select Status --</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Assign to Team ID</label>
          <input
            type="number"
            value={assignedToTeamId}
            onChange={(e) => setAssignedToTeamId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white rounded ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Updating...' : 'Update Task'}
        </button>
      </form>
    </div>
  );
}
