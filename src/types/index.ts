// Base enums
export enum AssessmentStatus {
  Draft = 'Draft',
  Active = 'Active',
  Expired = 'Expired',
  Archived = 'Archived',
}

export enum QuestionType {
  MultipleChoice = 'multiple_choice',
  TrueFalse = 'true_false',
  Essay = 'essay',
  FillBlank = 'fill_blank',
  Matching = 'matching',
  Ordering = 'ordering',
  ShortAnswer = 'short_answer',
}

export enum DifficultyLevel {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum AttemptStatus {
  InProgress = 'in_progress',
  Completed = 'completed',
  Abandoned = 'abandoned',
  Timeout = 'timeout',
}

// Assessment types
export interface AssessmentSettings {
  randomize_questions?: boolean;
  randomize_options?: boolean;
  questions_per_page?: number;
  show_progress_bar?: boolean;
  show_results?: boolean;
  show_correct_answers?: boolean;
  show_score_breakdown?: boolean;
  allow_retake?: boolean;
  retake_delay?: number;
  time_limit_enforced?: boolean;
  auto_submit_on_timeout?: boolean;
  require_webcam?: boolean;
  prevent_tab_switching?: boolean;
  prevent_right_click?: boolean;
  prevent_copy_paste?: boolean;
  require_identity_verification?: boolean;
  require_full_screen?: boolean;
  allow_screen_reader?: boolean;
  font_size_adjustment?: number;
  high_contrast_mode?: boolean;
}

export interface AssessmentCreateRequest {
  title: string;
  description?: string;
  duration: number; // minutes
  passing_score: number; // percentage
  max_attempts?: number;
  time_warning?: number; // seconds
  due_date?: string;
  settings?: AssessmentSettings;
  category_id?: number;
}

export interface Assessment {
  id: number;
  title: string;
  description?: string;
  duration: number;
  passing_score: number;
  max_attempts: number;
  time_warning?: number;
  status: AssessmentStatus;
  due_date?: string;
  settings?: AssessmentSettings;
  category_id?: number;
  creator_id: number;
  created_at: string;
  updated_at: string;
  questions_count?: number;
  total_points?: number;
  questions?: AssessmentQuestion[];
}

// Question types
export interface QuestionOption {
  id: string;
  text: string;
  order: number;
}

export interface QuestionContent {
  options?: QuestionOption[];
  correct_answers?: string[];
  multiple_correct?: boolean;
  pairs?: Array<{ left: string; right: string }>;
  blanks?: string[];
  items?: string[];
  [key: string]: any;
}

export interface QuestionCreateRequest {
  type: QuestionType;
  text: string;
  points: number;
  time_limit?: number;
  content: QuestionContent;
  category_id?: number;
  difficulty: DifficultyLevel;
  tags?: string[];
  explanation?: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  points: number;
  time_limit?: number;
  content: QuestionContent;
  category_id?: number;
  difficulty: DifficultyLevel;
  tags?: string[];
  explanation?: string;
  creator_id: number;
  created_at: string;
  updated_at: string;
  usage_count?: number;
}

// Question Bank types
export enum QuestionBankSharePermission {
  ViewOnly = 'view',
  CanEdit = 'edit',
  CanDelete = 'delete',
}

export interface QuestionBankCreateRequest {
  name: string;
  description?: string;
  is_public?: boolean;
  category_id?: number;
  tags?: string[];
}

export interface QuestionBank {
  id: number;
  name: string;
  description?: string;
  is_public: boolean;
  category_id?: number;
  tags?: string[];
  creator_id: number;
  created_at: string;
  updated_at: string;
  question_count?: number;
}

export interface ShareQuestionBankRequest {
  user_ids: string[];
  permission: QuestionBankSharePermission;
}

export interface UpdateSharePermissionRequest {
  permission: QuestionBankSharePermission;
}

export interface QuestionBankShare {
  id: number;
  bank_id: number;
  user_id: string;
  permission: QuestionBankSharePermission;
  shared_by: string;
  shared_at: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface QuestionBankStats {
  total_questions: number;
  total_usage: number;
  avg_difficulty: number;
  question_types: Record<string, number>;
  difficulty_distribution: Record<string, number>;
}

// Attempt types
export interface AttemptStartRequest {
  assessment_id: number;
  student_id: number;
}

export interface Attempt {
  id: number;
  assessment_id: number;
  student_id: number;
  status: AttemptStatus;
  started_at: string;
  completed_at?: string;
  time_remaining?: number;
  score?: number;
  passed?: boolean;
}

export interface StudentAnswer {
  question_id: number;
  answer: any;
  time_spent?: number;
  answered_at?: string;
}

// Grading types
export interface GradeAnswerRequest {
  score: number;
  feedback?: string;
}

export interface GradingStats {
  total_attempts: number;
  graded_attempts: number;
  pending_attempts: number;
  average_score: number;
  auto_gradable?: number;
  manual_required?: number;
}

// Pagination
export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface PaginatedQuestionResponse<T> {
  questions: T[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

export interface PaginatedAssessmentResponse<T> {
    assessments: T[];
    total: number;
    page: number;
    size: number;
    total_pages: number;
}

export interface PaginatedQuestionBankResponse<T> {
    banks: T[];
    total: number;
    page: number;
    size: number;
    total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
}

// Statistics
export interface AssessmentStats {
  total_attempts: number;
  completed_attempts: number;
  average_score: number;
  pass_rate: number;
  average_time: number;
}

// Assessment Questions Management
export interface AssessmentQuestionSettings {
  order?: number;
  points?: number;
  time_limit?: number;
}

export interface AssessmentQuestion {
  id: number;
  assessment_id: number;
  question_id: number;
  order: number;
  points: number;  // Override points for this question in the assessment
  time_limit?: number;  // Override time limit for this question in the assessment
  required: boolean;
  created_at: string;
  question: Question;  // Nested question object with original values
}

export interface AddQuestionToAssessmentRequest {
  order?: number;
  points?: number;
  time_limit?: number;
}

export interface UpdateQuestionSettingsRequest {
  points?: number;
  time_limit?: number;
}

export interface BulkUpdateQuestionSettingsRequest {
  updates: Array<{
    question_id: number;
    points?: number;
    time_limit?: number;
  }>;
}

export interface ReorderQuestionsRequest {
  question_orders: Array<{
    question_id: number;
    order: number;
  }>;
}

// Question Bank Questions Management
export interface AddQuestionsRequest {
  question_ids: number[];
}

export interface RemoveQuestionsRequest {
  question_ids: number[];
}

// User types
export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  size: number;
}

// Dashboard types
export interface DashboardStats {
  overview: {
    total_assessments: number;
    total_questions: number;
    total_question_banks: number;
    total_attempts: number;
    active_users: number;
  };
  metrics: {
    completion_rate: number;
    average_score: number;
    pass_rate: number;
  };
  trends: {
    assessments_change: number;
    attempts_change: number;
    score_change: number;
  };
}

export interface ActivityTrend {
  period: string;
  attempts: number;
  users: number;
  average_score: number;
}

export enum RecentActivityAction {
  CompletedAssessment = 'completed_assessment',
  StartedAssessment = 'started_assessment',
  CreatedQuestion = 'created_question',
  CreatedAssessment = 'created_assessment',
  PublishedAssessment = 'published_assessment',
}

export interface RecentActivity {
  id: number;
  user_id: string;
  user_name: string;
  action: RecentActivityAction;
  assessment_id?: number;
  assessment_title?: string;
  question_id?: number;
  question_bank_name?: string;
  score?: number;
  created_at: string;
  time_ago: string;
}

export interface QuestionDistribution {
  type: string;
  name: string;
  count: number;
  percentage: number;
}

export interface SubjectPerformance {
  subject_id?: number;
  subject_name: string;
  average_score: number;
}
