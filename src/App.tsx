import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TestsDashboard from './pages/TestsDashboard';
import PastPapers from './pages/PastPapers';
import TestSubmitted from './pages/TestSubmitted';
import Analytics from './pages/Analytics';
import TestEnvironment from './pages/TestEnvironment';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login'; // Added import

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} /> {/* Added Login Route */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/tests" replace />} />
          <Route path="tests" element={<TestsDashboard />} />
          <Route path="tests/past-papers" element={<PastPapers />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        <Route path="/test-environment" element={<TestEnvironment />} />
        <Route path="/test-submitted" element={<TestSubmitted />} />
      </Routes>
    </BrowserRouter>
  );
}