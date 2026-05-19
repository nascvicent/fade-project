export interface Tag {
  id: string;
  name: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  objective: string;
  summary: string;
  scheduledDate: string;
  discipline: string;
  contents: string;
  resources: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SmartAssistRequest {
  title: string;
  discipline: string;
  summary: string;
}

export interface SmartAssistResponse {
  contents: string;
  relatedTopics: string[];
  tags: string[];
}

export interface LessonPlanFormData {
  title: string;
  objective: string;
  summary: string;
  scheduledDate: string;
  discipline: string;
  contents: string;
  resources: string;
  tags: string[];
}
