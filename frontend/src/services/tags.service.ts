import api from '@/lib/api';

export interface Tag {
  id: string;
  name: string;
}

export const tagsService = {
  /**
   * Get all available tags
   */
  async getAll(): Promise<Tag[]> {
    const response = await api.get('/tags');
    return response.data;
  },

  /**
   * Create a new tag (if you allow users to create custom tags)
   */
  async create(name: string): Promise<Tag> {
    const response = await api.post('/tags', { name });
    return response.data;
  },
};