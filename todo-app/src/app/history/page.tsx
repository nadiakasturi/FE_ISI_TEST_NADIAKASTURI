"use client";
import React, { useEffect, useState } from 'react';

interface Log {
  id: number;
  action: string;
  userId: number;
  username: string;
  entityId: number;
  entity: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
  };
}

const HistoryPage = () => {
  const [history, setHistory] = useState<Log[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        if (response.ok) {
          const logs = await response.json();
          setHistory(logs);
        } else {
          console.error('Failed to fetch history');
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Task Update History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-separate border-spacing-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 border-b">Action</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 border-b">Updated By</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 border-b">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-3 text-center text-gray-500">No history available</td>
              </tr>
            ) : (
              history.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 border-b">
                  <td className="px-6 py-3 text-gray-800">{log.action}</td>
                  <td className="px-6 py-3 text-gray-600">{log.username || 'Unknown User'}</td>
                  <td className="px-6 py-3 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;
