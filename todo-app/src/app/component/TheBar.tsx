const TheBar = () => {
    return (
      <div className="h-full w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl mb-6">Todo List</h1>
        <nav>
          <ul className="space-y-4">
            <li><a href="/dashboard" className="text-white hover:text-gray-400">Dashboard</a></li>
            <li><a href="/history" className="text-white hover:text-gray-400">History</a></li>
            <li><a href="/login" className="text-white hover:text-gray-400">Logout</a></li>
          </ul>
        </nav>
      </div>
    );
  };
  
  export default TheBar;
  