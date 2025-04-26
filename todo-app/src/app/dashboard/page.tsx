'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  assignedToTeamId: string; 
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const decoded = JSON.parse(atob(token.split('.')[1]));
    setRole(decoded.role);

    const fetchTasks = async () => {
      const res = await fetch('/api/task');
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, [router]);

  const handleAddTask = () => {
    router.push('/tasks/create');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900">Dashboard</h1>
      
      {role === 'Lead' && (
        <div className="flex justify-center mb-8">
          <button
            onClick={handleAddTask}
            className="dashboard-button"
          >
            Add New Task
          </button>
        </div>
      )}

      <div className="dashboard-grid">
        {tasks.slice(0, 12).map((task) => (
          <div
            key={task.id}
            className="dashboard-card"
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p className="status">Status: {task.status}</p>
            <p className="assigned-to-team-id">Assigned To Team : {task.assignedToTeamId}</p> 
          </div>
        ))}
      </div>
    </div>
  );
}
