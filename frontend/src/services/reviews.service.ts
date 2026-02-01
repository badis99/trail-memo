import api from '@/lib/api';

export interface CreateReviewDto {
  actualOutcome: string;
  lessonsLearned: string;
  wouldDoDiff?: string;
}

export interface Review {
  id: string;
  decisionId: string;
  actualOutcome: string;
  lessonsLearned: string;
  wouldDoDiff?: string;
  reviewedAt: string;
}

export const reviewsService = {
  async create(decisionId: string, data: CreateReviewDto) {
    const response = await api.post(`/decisions/${decisionId}/review`, data);
    return response.data;
  },
};