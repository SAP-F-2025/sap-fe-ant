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
  question_count?: number;
  total_points?: number;
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
  graded_by: number;
}

// Pagination
export interface PaginationParams {
  page?: number;
  size?: number;
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
