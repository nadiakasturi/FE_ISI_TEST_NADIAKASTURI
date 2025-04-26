'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function EditTaskStatusPage() {
  const { taskId } = useParams();
  const router = useRouter();

  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch(`/api/task`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const tasks = await res.json();
        const task = tasks.find((t: any) => t.id === parseInt(taskId as string));
        if (!task) {
          setError('Task not found or not assigned to you.');
          return;
        }

        setStatus(task.status);
        setDescription(task.description);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load task');
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const res = await fetch(`/api/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update task');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  if (loading) return <p>Loading task...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Task Status</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border px-3 py-2"
          >
            <option value="Not Started">Not Started</option>
            <option value="On Progress">On Progress</option>
            <option value="Done">Done</option>
            <option value="Reject">Reject</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}
