'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        setTasks(data.tasks);
        setRole(data.role); 
      } catch (err) {
        console.error('Error fetching tasks:', err);
        router.push('/login');
      }
    };

    fetchTasks();
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {role === 'Lead' && (
        <button className="mb-4 px-4 py-2 bg-green-600 text-white rounded">Add Task</button>
      )}
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="border p-4 mb-2 rounded shadow">
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <p className="text-sm text-gray-600">Status: {task.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
