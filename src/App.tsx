import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { ThemeProvider } from './theme/ThemeProvider';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { NotificationProvider } from './components/NotificationProvider/NotificationProvider';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect/RoleBasedRedirect';

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
import QuestionBankDetail from './pages/QuestionBanks/QuestionBankDetail';
import PublicQuestionBanks from './pages/QuestionBanks/PublicQuestionBanks';
import SharedQuestionBanks from './pages/QuestionBanks/SharedQuestionBanks';
import GradingList from './pages/Grading/GradingList';
import GradingDetail from './pages/Grading/GradingDetail';
import Profile from './pages/Profile';
import Login from './pages/Auth/Login';
import Callback from './pages/Auth/Callback';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';
import AvailableAssessments from './pages/Student/AvailableAssessments';
import FaceVerification from './pages/Student/FaceVerification';
import TakeAssessment from './pages/Student/TakeAssessment';
import AssessmentResults from './pages/Student/AssessmentResults';
import StudentHistory from './pages/Student/StudentHistory';

// Teacher Pages
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import MyAssessments from './pages/Teacher/MyAssessments';
import StudentProgress from './pages/Teacher/StudentProgress';


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
        <AntdApp>
          <NotificationProvider>
            <QueryProvider>
              <AuthProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/callback" element={<Callback />} />

                  {/* Protected routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={
                        <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                          <Navigate to="/dashboard" replace />
                        </RoleBasedRedirect>
                      }
                    />
                    <Route
                      path="dashboard"
                      element={
                        <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                          <Dashboard />
                        </RoleBasedRedirect>
                      }
                    />

                    {/* Users Management */}
                    <Route
                      path="users"
                      element={
                        <RoleBasedRedirect allowedRoles={['admin']}>
                          <UserManagement />
                        </RoleBasedRedirect>
                      }
                    />

                    {/* Profile */}
                    <Route path="profile" element={<Profile />} />

                    {/* Assessment routes - Admin/Teacher only */}
                    <Route path="assessments">
                      <Route
                        index
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <AssessmentList />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path="new"
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <AssessmentForm />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path="edit/:id"
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <AssessmentForm />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path=":id"
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <AssessmentDetail />
                          </RoleBasedRedirect>
                        }
                      />
                    </Route>

                    {/* Question routes - Admin/Teacher only */}
                    <Route path="questions">
                      <Route
                        index
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <QuestionList />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path="new"
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <QuestionForm />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path="edit/:id"
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <QuestionForm />
                          </RoleBasedRedirect>
                        }
                      />
                    </Route>

                    {/* Question Bank routes - Admin/Teacher only */}
                    <Route path="question-banks">
                      <Route
                        index
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <QuestionBankList />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path="public"
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <PublicQuestionBanks />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path="shared"
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <SharedQuestionBanks />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path="new"
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <QuestionBankForm />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path="edit/:id"
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <QuestionBankForm />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path=":id"
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <QuestionBankDetail />
                          </RoleBasedRedirect>
                        }
                      />
                    </Route>

                    {/* Grading routes - Admin/Teacher only */}
                    <Route path="grading">
                      <Route
                        index
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <GradingList />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path=":id"
                        element={
                          <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
                            <GradingDetail />
                          </RoleBasedRedirect>
                        }
                      />
                    </Route>

                    {/* Student routes */}
                    <Route path="student">
                      <Route index element={<Navigate to="/student/dashboard" replace />} />
                      <Route path="dashboard" element={<StudentDashboard />} />
                      <Route path="assessments" element={<AvailableAssessments />} />
                      <Route path="face-verification" element={<FaceVerification />} />
                      <Route path="take/:attemptId" element={<TakeAssessment />} />
                      <Route path="results/:attemptId" element={<AssessmentResults />} />
                      <Route path="history" element={<StudentHistory />} />
                    </Route>

                    {/* Teacher routes */}
                    <Route path="teacher">
                      <Route
                        index
                        element={
                          <RoleBasedRedirect allowedRoles={['teacher', 'admin']}>
                            <Navigate to="/teacher/dashboard" replace />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path="dashboard"
                        element={
                          <RoleBasedRedirect allowedRoles={['teacher', 'admin']}>
                            <TeacherDashboard />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path="my-assessments"
                        element={
                          <RoleBasedRedirect allowedRoles={['teacher', 'admin']}>
                            <MyAssessments />
                          </RoleBasedRedirect>
                        }
                      />
                      <Route
                        path="student-progress"
                        element={
                          <RoleBasedRedirect allowedRoles={['teacher', 'admin']}>
                            <StudentProgress />
                          </RoleBasedRedirect>
                        }
                      />
                    </Route>
                  </Route>
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </QueryProvider>
          </NotificationProvider>
        </AntdApp>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
