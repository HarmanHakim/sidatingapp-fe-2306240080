import type {
  CreateReplyRequest,
  DeleteReplyRequest,
  Reply,
  ReplyResponse,
  UpdateReplyRequest
} from '@/interfaces/reply.interface';
import { getAuthToken } from '@/lib/auth';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BE2_API_URL || 'http://localhost:8081/api';

const getHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: token ? `Bearer ${token}` : ''
  };
};

export const replyService = {
  async getAllReplies(): Promise<Reply[]> {
    const response = await axios.get<ReplyResponse>(`${API_URL}/replies`, {
      headers: getHeaders()
    });
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  async getRepliesByPostId(postId: string): Promise<Reply[]> {
    const response = await axios.get<ReplyResponse>(`${API_URL}/replies`, {
      params: { postId },
      headers: getHeaders()
    });
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  async getReplyById(id: string): Promise<Reply> {
    const response = await axios.get<ReplyResponse>(`${API_URL}/replies/${id}`, {
      headers: getHeaders()
    });
    return response.data.data as Reply;
  },

  async createReply(request: CreateReplyRequest): Promise<Reply> {
    const response = await axios.post<ReplyResponse>(`${API_URL}/replies/create`, request, {
      headers: getHeaders()
    });
    return response.data.data as Reply;
  },

  async updateReply(request: UpdateReplyRequest): Promise<Reply> {

    console.log('Updating reply with userProfileId:', request);

    const response = await axios.put<ReplyResponse>(`${API_URL}/replies/${request.id}`, {
      content: request.content,
      userProfileId: request.userProfileId
    }, {
      headers: getHeaders()
    });
    return response.data.data as Reply;
  },

  async deleteReply(request: DeleteReplyRequest): Promise<void> {
    await axios.delete(`${API_URL}/replies/${request.id}`, {
      params: {
        userProfileId: request.userProfileId
      },
      headers: getHeaders()
    });
  }
};
