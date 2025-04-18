import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// API base URL - read from environment variable or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // You can add auth token here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle API errors
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Network Error:', error.message);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// API generic request function
export const apiRequest = async <T>(
    config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
    return apiClient(config);
};

// API endpoints
export const segmentApi = {
    // Get paginated segments
    getSegments: async (page = 1, limit = 10, active = true) => {
        return apiRequest({
            method: 'GET',
            url: '/api/v1/segment/get',
            params: { page, limit, active },
        });
    },

    // Create new segment
    createSegment: async (data: any) => {
        return apiRequest({
            method: 'POST',
            url: '/api/v1/segment/create',
            data,
        });
    },

    // Update segment status
    updateSegmentStatus: async (id: string, isActive: boolean) => {
        return apiRequest({
            method: 'PUT',
            url: '/api/v1/segment/update',
            params: { id },
            data: { IsActive: isActive },
        });
    },

    // Get segment by ID
    getSegmentById: async (id: string) => {
        return apiRequest({
            method: 'GET',
            url: `/api/v1/segment/${id}`,
        });
    },
};

export default apiClient; 