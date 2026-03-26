import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TestsDashboard from './pages/TestsDashboard';
import PastPapers from './pages/PastPapers';
import TestSubmitted from './pages/TestSubmitted';
import Analytics from './pages/Analytics';
import TestEnvironment from './pages/TestEnvironment';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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
