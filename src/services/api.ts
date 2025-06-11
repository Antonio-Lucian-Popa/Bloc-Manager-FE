const API_BASE_URL = '/api/v1';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Association endpoints
  async getAssociations() {
    return this.request('/associations');
  }

  async createAssociation(data: any) {
    return this.request('/associations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAssociation(id: string) {
    return this.request(`/associations/${id}`);
  }

  async createBlock(associationId: string, data: any) {
    return this.request(`/associations/${associationId}/blocks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Block endpoints
  async getBlocks(associationId?: string) {
    const query = associationId ? `?associationId=${associationId}` : '';
    return this.request(`/blocks${query}`);
  }

  async getBlock(id: string) {
    return this.request(`/blocks/${id}`);
  }

  async createApartment(blockId: string, data: any) {
    return this.request(`/blocks/${blockId}/apartments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Apartment endpoints
  async getApartments(blockId?: string) {
    const query = blockId ? `?blockId=${blockId}` : '';
    return this.request(`/apartments${query}`);
  }

  async getApartment(id: string) {
    return this.request(`/apartments/${id}`);
  }

  // Expense endpoints
  async getExpenses(blockId?: string) {
    const query = blockId ? `?blockId=${blockId}` : '';
    return this.request(`/expenses${query}`);
  }

  async createExpense(data: any) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getApartmentExpenses(apartmentId: string) {
    return this.request(`/apartment-expenses?apartmentId=${apartmentId}`);
  }

  // Payment endpoints
  async getPayments(apartmentId?: string) {
    const query = apartmentId ? `?apartmentId=${apartmentId}` : '';
    return this.request(`/payments${query}`);
  }

  async createPayment(data: any) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Meter reading endpoints
  async getMeterReadings(apartmentId?: string) {
    const query = apartmentId ? `?apartmentId=${apartmentId}` : '';
    return this.request(`/meter-readings${query}`);
  }

  async createMeterReading(data: any) {
    return this.request('/meter-readings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Announcement endpoints
  async getAnnouncements(blockId?: string) {
    const query = blockId ? `?blockId=${blockId}` : '';
    return this.request(`/announcements${query}`);
  }

  async createAnnouncement(data: any) {
    return this.request('/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Repair request endpoints
  async getRepairRequests(blockId?: string, apartmentId?: string) {
    const params = new URLSearchParams();
    if (blockId) params.append('blockId', blockId);
    if (apartmentId) params.append('apartmentId', apartmentId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/repair-requests${query}`);
  }

  async createRepairRequest(data: any) {
    return this.request('/repair-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRepairRequest(id: string, data: any) {
    return this.request(`/repair-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // User role endpoints
  async inviteUser(data: any) {
    return this.request('/user-roles/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUsers() {
    return this.request('/users');
  }

  // Dashboard stats
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }
}

export const apiService = new ApiService();