'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  assignedToTeamId: string | number | null;
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const decoded = JSON.parse(atob(token.split('.')[1]));
    setRole(decoded.role);
    setUserId(decoded.userId);
    setTeamId(decoded.teamId);

    const fetchTasks = async () => {
      const res = await fetch('/api/task', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log('Fetched tasks:', data);

      if (decoded.role === 'Lead') {
        setTasks(data);
      } else if (decoded.role === 'Team') {
       
        const filteredTasks = data.filter(
          (task: Task) =>
            String(task.assignedToTeamId) === String(decoded.teamId)
        );
        console.log('Filtered tasks for team:', filteredTasks);
        setTasks(filteredTasks);
      }
    };

    fetchTasks();
  }, [router]);

  const handleAddTask = () => {
    router.push('/task/create');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900">Dashboard</h1>

      {role === 'Lead' && (
        <div className="flex justify-center mb-8">
          <button onClick={handleAddTask} className="dashboard-button">
            Add New Task
          </button>
        </div>
      )}

      <div className="dashboard-grid">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="dashboard-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p className="status">Status: {task.status}</p>
              <p className="assigned-to-team-id">Assigned To Team: {task.assignedToTeamId}</p>

              {role === 'Lead' && (
                <button
                  onClick={() => router.push(`/task/${task.id}`)}
                  className="mt-2 text-blue-600 hover:underline text-sm"
                >
                  ✏️ Edit Task
                </button>
              )}

              {role === 'Team' && String(task.assignedToTeamId) === String(teamId) && (
                <button
                  onClick={() => router.push(`/task/status/${task.id}`)}
                  className="mt-2 text-blue-600 hover:underline text-sm"
                >
                  ✏️ Edit Status
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No tasks available for your role.</p>
        )}
      </div>
    </div>
  );
}
