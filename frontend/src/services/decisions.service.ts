import api from '@/lib/api';
import { Tag } from './tags.service';
import { Review } from './reviews.service';

export interface CreateDecisionDto {
  title: string;
  context: string;
  expectedOutcome: string;
  tagIds?: string[];
}

export interface UpdateDecisionDto {
  title?: string;
  context?: string;
  expectedOutcome?: string;
  tagIds?: string[];
}

export interface DecisionTag {
  decisionId: string;
  tagId: string;
  tag: Tag;
}

export interface Decision {
  id: string;
  userId: string;
  title: string;
  context: string;
  expectedOutcome: string;
  status: 'PENDING' | 'REVIEWED';
  createdAt: string;
  updatedAt: string;
  review?: Review;
  tags: DecisionTag[];
}

export const decisionsService = {
  /**
   * Get all decisions for the current user
   * @param filters - Optional filters (status, tagId, search)
   */
  async getAll(filters?: {
    status?: 'PENDING' | 'REVIEWED';
    tagId?: string;
    search?: string;
  }): Promise<Decision[]> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tagId) params.append('tagId', filters.tagId);
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const url = queryString ? `/decisions?${queryString}` : '/decisions';
    
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Get a single decision by ID
   */
  async getById(id: string): Promise<Decision> {
    const response = await api.get(`/decisions/${id}`);
    return response.data;
  },

  /**
   * Create a new decision
   */
  async create(data: CreateDecisionDto): Promise<Decision> {
    const response = await api.post('/decisions', data);
    return response.data;
  },

  /**
   * Update a decision (only if status is PENDING)
   */
  async update(id: string, data: UpdateDecisionDto): Promise<Decision> {
    const response = await api.patch(`/decisions/${id}`, data);
    return response.data;
  },

  /**
   * Delete a decision
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/decisions/${id}`);
  },

  /**
   * Get decisions grouped by month (for timeline view)
   */
  async getTimeline(): Promise<Record<string, Decision[]>> {
    const decisions = await this.getAll();
    
    // Group by month
    const grouped: Record<string, Decision[]> = {};
    
    decisions.forEach((decision) => {
      const date = new Date(decision.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      
      grouped[monthKey].push(decision);
    });
    
    return grouped;
  },

  /**
   * Get statistics for dashboard
   */
  async getStats(): Promise<{
    total: number;
    pending: number;
    reviewed: number;
    reviewRate: number;
  }> {
    const decisions = await this.getAll();
    
    const total = decisions.length;
    const pending = decisions.filter(d => d.status === 'PENDING').length;
    const reviewed = decisions.filter(d => d.status === 'REVIEWED').length;
    const reviewRate = total > 0 ? (reviewed / total) * 100 : 0;
    
    return { total, pending, reviewed, reviewRate };
  },
};