import React from "react";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import WorkoutManagement from "./pages/admin/WorkoutManagement";
import ActivityMonitoring from "./pages/admin/ActivityMonitoring";

function App() {
  return (
    <div>
      <AdminDashboard />
      <UsersManagement />
      <WorkoutManagement />
      <ActivityMonitoring />
    </div>
  );
}

export default App;