import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { QueryProvider } from './providers/QueryProvider';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import MainLayout from './components/Layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/Users/UserManagement';
import AssessmentList from './pages/Assessments/AssessmentList';
import AssessmentForm from './pages/Assessments/AssessmentForm';
import AssessmentDetail from './pages/Assessments/AssessmentDetail';
import QuestionList from './pages/Questions/QuestionList';
import QuestionForm from './pages/Questions/QuestionForm';
import QuestionBankList from './pages/QuestionBanks/QuestionBankList';
import QuestionBankForm from './pages/QuestionBanks/QuestionBankForm';
import GradingList from './pages/Grading/GradingList';

/**
 * Main App Component
 * Wraps everything in providers:
 * - ErrorBoundary for error handling
 * - ThemeProvider for theme management
 * - QueryProvider (inside ThemeProvider to access App.useApp)
 * - BrowserRouter for routing
 */

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultMode="light">
        <QueryProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Users Management */}
                <Route path="users" element={<UserManagement />} />

                {/* Assessment routes */}
                <Route path="assessments">
                  <Route index element={<AssessmentList />} />
                  <Route path="new" element={<AssessmentForm />} />
                  <Route path="edit/:id" element={<AssessmentForm />} />
                  <Route path=":id" element={<AssessmentDetail />} />
                </Route>

                {/* Question routes */}
                <Route path="questions">
                  <Route index element={<QuestionList />} />
                  <Route path="new" element={<QuestionForm />} />
                  <Route path="edit/:id" element={<QuestionForm />} />
                </Route>

                {/* Question Bank routes */}
                <Route path="question-banks">
                  <Route index element={<QuestionBankList />} />
                  <Route path="new" element={<QuestionBankForm />} />
                  <Route path="edit/:id" element={<QuestionBankForm />} />
                </Route>

                {/* Grading routes */}
                <Route path="grading">
                  <Route index element={<GradingList />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
