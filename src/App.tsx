import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/home";
import { Layout } from "./pages/layout";

const ProjectPage = lazy(() => import("./pages/project"));
const TimelinePage = lazy(() => import("./pages/timeline"));
const SearchPage = lazy(() => import("./pages/search"));
const SettingsPage = lazy(() => import("./pages/settings"));
const UsersPage = lazy(() => import("./pages/users"));
const TeamsPage = lazy(() => import("./pages/teams"));
const UrgentPage = lazy(() => import("./pages/priority/urgent"));
const HighPage = lazy(() => import("./pages/priority/high"));
const MediumPage = lazy(() => import("./pages/priority/medium"));
const LowPage = lazy(() => import("./pages/priority/low"));
const BacklogPage = lazy(() => import("./pages/priority/backlog"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/priority/urgent" element={<UrgentPage />} />
          <Route path="/priority/high" element={<HighPage />} />
          <Route path="/priority/medium" element={<MediumPage />} />
          <Route path="/priority/low" element={<LowPage />} />
          <Route path="/priority/backlog" element={<BacklogPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
