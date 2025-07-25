import api from '../utils/axios';
import toast from 'react-hot-toast';

// 인증 관련 API
export const authAPI = {
  // 기존 이메일/비밀번호 로그인 제거 - Google OAuth2만 사용

  // 로그아웃
  logout: () => api.post('/auth/logout'),
  // 토큰 재발급
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // 401 오류이고, 재시도한 요청이 아닐 경우
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await authAPI.refreshToken(refreshToken);
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;

          // 새로운 토큰 저장
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // API 인스턴스와 원래 요청의 헤더 업데이트
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // 실패했던 요청 재시도
          return api(originalRequest);
        } catch (refreshError) {
          // 리프레시 토큰이 유효하지 않은 경우
          console.error('Unable to refresh token:', refreshError);
          // 로컬 스토리지 정리
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          // 로그인 페이지로 리디렉션
          window.location.href = '/login'; 
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export const userAPI = {
  // 기존 회원가입 제거 - Google OAuth2로만 가입

  // 사용자 정보 조회
  getUser: async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  // 기존 사용자 정보 업데이트 제거 - OAuth2 등록 완성으로 대체

  // 이메일 알림 설정 업데이트
  updateEmailAlertSetting: async (userId, isEmailAlertEnabled) => {
    const response = await api.patch(`/api/users/${userId}/email-alert?isEmailAlertEnabled=${isEmailAlertEnabled}`);
    return response.data;
  },

  // 이메일 알림 설정 조회
  getEmailSettings: async (userId) => {
    const response = await api.get(`/api/users/${userId}/email-settings`);
    return response.data;
  },

  // 이메일 알림 설정 업데이트
  updateEmailSettings: async (userId, settings) => {
    const response = await api.put(`/api/users/${userId}/email-settings`, settings);
    return response.data;
  },

  // 계정 삭제
  deleteUser: async (userId) => {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  },
};

// 구독 관련 API
export const subscriptionAPI = {
  // 사용자의 구독 목록 조회
  getSubscriptions: async (userId) => {
    const response = await api.get(`/api/subscriptions/user/${userId}`);
    return response.data;
  },

  // 구독 생성
  createSubscription: async (subscriptionData) => {
    const response = await api.post('/api/subscriptions', subscriptionData);
    return response.data;
  },

  // 구독 수정
  updateSubscription: async (subscriptionId, subscriptionData) => {
    const response = await api.put(`/api/subscriptions/${subscriptionId}`, subscriptionData);
    return response.data;
  },

  // 구독 삭제
  deleteSubscription: async (subscriptionId) => {
    const response = await api.delete(`/api/subscriptions/${subscriptionId}`);
    return response.data;
  },

  // 구독 일시정지/재개
  togglePause: async (subscriptionId) => {
    const response = await api.patch(`/api/subscriptions/${subscriptionId}/pause`);
    return response.data;
  },
};

// 알림 관련 API
export const notificationAPI = {
  // 사용자별 알림 조회
  getNotifications: async (userId) => {
    const response = await api.get(`/api/notifications/user/${userId}`);
    return response.data;
  },

  // 읽지 않은 알림 개수 조회
  getUnreadCount: async (userId) => {
    const response = await api.get(`/api/notifications/user/${userId}/unread-count`);
    return response.data.unreadCount;
  },

  // 알림 읽음 처리
  markAsRead: async (notificationId, userId) => {
    const response = await api.put(`/api/notifications/${notificationId}/read/user/${userId}`);
    return response.data;
  },

  // 모든 알림 읽음 처리
  markAllAsRead: async (userId) => {
    const response = await api.put(`/api/notifications/user/${userId}/mark-all-read`);
    return response.data;
  },

  // 알림 삭제
  deleteNotification: async (notificationId, userId) => {
    const response = await api.delete(`/api/notifications/${notificationId}/user/${userId}`);
    return response.data;
  },

  // 모든 알림 삭제
  clearAllNotifications: async (userId) => {
    const response = await api.delete(`/api/notifications/user/${userId}/clear-all`);
    return response.data;
  },

  // 알림 생성 (테스트용)
  createNotification: async (userId, notificationData) => {
    const response = await api.post(`/api/notifications/user/${userId}`, notificationData);
    return response.data;
  },

  // 결제일 기반 알림 생성 (관리자용)
  generatePaymentNotifications: async () => {
    const response = await api.post('/api/notifications/generate-payment-notifications');
    return response.data;
  },
};

// 에러 처리 유틸리티
export const handleApiError = (error) => {
  let errorMessage;
  
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.response?.status === 401) {
    errorMessage = '인증이 필요합니다. 다시 로그인해주세요.';
  } else if (error.response?.status === 403) {
    errorMessage = '권한이 없습니다.';
  } else if (error.response?.status === 404) {
    errorMessage = '요청한 리소스를 찾을 수 없습니다.';
  } else if (error.response?.status >= 500) {
    errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  } else if (error.code === 'ECONNABORTED') {
    errorMessage = '요청 시간이 초과되었습니다.';
  } else {
    errorMessage = '알 수 없는 오류가 발생했습니다.';
  }
  
  // 토스트로 에러 메시지 표시
  toast.error(errorMessage);
  
  return errorMessage;
};

// 성공 메시지 표시 유틸리티
export const showSuccessMessage = (message) => {
  toast.success(message);
};

// 에러 메시지 표시 유틸리티
export const showErrorMessage = (message) => {
  toast.error(message);
};

// 정보 메시지 표시 유틸리티
export const showInfoMessage = (message) => {
  toast(message, { icon: 'ℹ️' });
};
