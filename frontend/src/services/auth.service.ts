import api from '@/lib/api';

export interface SignUpDto {
  name: string;
  email: string;
  password: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpDto) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  async signIn(data: SignInDto) {
    const response = await api.post('/auth/signin', data);
    if (response.data.accessToken) {
      // Store in both localStorage AND cookie
      localStorage.setItem('access_token', response.data.accessToken);
      
      // Set cookie for middleware
      document.cookie = `access_token=${response.data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    }
    return response.data;
  },

  signOut() {
    localStorage.removeItem('access_token');
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/login';
  },

  getToken() {
    return localStorage.getItem('access_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};