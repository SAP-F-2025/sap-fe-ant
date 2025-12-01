import { App as AntdApp } from 'antd';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import ExamLayout from './components/Layout/ExamLayout';
import MainLayout from './components/Layout/MainLayout';
import { NotificationProvider } from './components/NotificationProvider/NotificationProvider';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect/RoleBasedRedirect';
import { SettingsModalProvider } from './components/SettingsModal';
import { AuthProvider } from './contexts/AuthContext';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './theme/ThemeProvider';

// Pages
import AssessmentDetail from './pages/Assessments/AssessmentDetail';
import AssessmentForm from './pages/Assessments/AssessmentForm';
import AssessmentList from './pages/Assessments/AssessmentList';
import Callback from './pages/Auth/Callback';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import GradingDetail from './pages/Grading/GradingDetail';
import GradingList from './pages/Grading/GradingList';
import PublicQuestionBanks from './pages/QuestionBanks/PublicQuestionBanks';
import QuestionBankDetail from './pages/QuestionBanks/QuestionBankDetail';
import QuestionBankForm from './pages/QuestionBanks/QuestionBankForm';
import QuestionBankList from './pages/QuestionBanks/QuestionBankList';
import SharedQuestionBanks from './pages/QuestionBanks/SharedQuestionBanks';
import QuestionForm from './pages/Questions/QuestionForm';
import QuestionList from './pages/Questions/QuestionList';
import UserManagement from './pages/Users/UserManagement';

// Student Pages
import AssessmentResults from './pages/Student/AssessmentResults';
import AvailableAssessments from './pages/Student/AvailableAssessments';
import FaceVerification from './pages/Student/FaceVerification';
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentHistory from './pages/Student/StudentHistory';
import TakeAssessment from './pages/Student/TakeAssessment';

// Teacher Pages
import MyAssessments from './pages/Teacher/MyAssessments';
import StudentProgress from './pages/Teacher/StudentProgress';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';


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
								<SettingsModalProvider>
									<BrowserRouter>
										<Routes>
											{/* Public routes */}
											<Route path="/login" element={<Login />} />
											<Route path="/callback" element={<Callback />} />

											{/* Exam mode route - separate layout without navigation */}
											<Route
												path="/student/take/:attemptId"
												element={
													<ProtectedRoute>
														<ExamLayout />
													</ProtectedRoute>
												}
											>
												<Route index element={<TakeAssessment />} />
											</Route>

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
													{/* Note: take/:attemptId moved to ExamLayout below */}
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
								</SettingsModalProvider>
							</AuthProvider>
						</QueryProvider>
					</NotificationProvider>
				</AntdApp>
			</ThemeProvider>
		</ErrorBoundary>
	);
};

export default App;
