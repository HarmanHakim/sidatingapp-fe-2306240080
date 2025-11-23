import type { Post, PostQueryParams, CreatePostRequest, UpdatePostRequest, DeletePostRequest, LikePostRequest } from '@/interfaces/post.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import { defineStore } from 'pinia';
import axios from 'axios';
import { toast } from 'vue-sonner';
import { handleAuthError, getAuthToken } from '@/lib/auth';
import { useRouter } from 'vue-router';

const basePostUrl = import.meta.env.VITE_API_URL || 'http://2306240080-sidating-be1.hafizmuh.site' + '/posts';
console.log(basePostUrl)

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [] as Post[],
        loading: false,
        error: null as string | null,
    }),

    actions: {
        // Fetch all posts
        async fetchPosts(userId?: string, date?: string) {
            this.loading = true;
            this.error = null;
            const router = useRouter();
            const token = getAuthToken();
            try {
                const params: PostQueryParams = {};
                if (userId) params.userId = userId;
                if (date) params.date = date;

                const response = await axios.get<CommonResponseInterface<Post[]>>(basePostUrl, {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                this.posts = response.data.data;

                if (this.posts.length === 0) {
                    toast.warning('Data post kosong');
                } else {
                    toast.success('Data post berhasil dimuat');
                }

                return this.posts;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    await handleAuthError(error.response.status, router);
                }
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memuat post: ${this.error}`);
            } finally {
                this.loading = false;
            }
        },

        // Get post by ID
        async getPostById(postId: string) {
            this.loading = true;
            this.error = null;
            const router = useRouter();
            const token = getAuthToken();
            try {
                const response = await axios.get<CommonResponseInterface<Post>>(`${basePostUrl}/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data.data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    await handleAuthError(error.response.status, router);
                }
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memuat post: ${this.error}`);
                return null;
            } finally {
                this.loading = false;
            }
        },

        // Create new post
        async createPost(postData: CreatePostRequest) {
            this.loading = true;
            this.error = null;
            const router = useRouter();
            const token = getAuthToken();
            try {
                const response = await axios.post<CommonResponseInterface<Post>>(`${basePostUrl}/create`, postData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200 || response.status === 201) {
                    this.posts.push(response.data.data);
                    toast.success('Post berhasil dibuat');
                    return response.data.data;
                } else if (response.status === 400) {
                    toast.warning('Gagal membuat post: Data tidak valid');
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    await handleAuthError(error.response.status, router);
                }
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat membuat post: ${this.error}`);
            } finally {
                this.loading = false;
            }
        },

        // Update existing post
        async updatePost(postData: UpdatePostRequest) {
            this.loading = true;
            this.error = null;
            const router = useRouter();
            const token = getAuthToken();
            try {
                const response = await axios.put<CommonResponseInterface<Post>>(`${basePostUrl}/update`, postData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    toast.success('Post berhasil diperbarui');
                    const index = this.posts.findIndex(p => p.id === response.data.data.id);
                    if (index !== -1) this.posts[index] = response.data.data;
                    return response.data.data;
                } else if (response.status === 400) {
                    toast.warning('Gagal memperbarui post: Data tidak valid');
                } else if (response.status === 404) {
                    toast.warning('Post tidak ditemukan');
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    await handleAuthError(error.response.status, router);
                }
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memperbarui post: ${this.error}`);
            } finally {
                this.loading = false;
            }
        },

        // Delete a post
        async deletePost(deleteData: DeletePostRequest): Promise<boolean> {
            this.loading = true
            this.error = null
            const router = useRouter();
            const token = getAuthToken();

            try {
                const response = await axios.delete<CommonResponseInterface<null>>(`${basePostUrl}/delete`, {
                    data: deleteData,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.status === 200) {
                    return true
                } else if (response.status === 404) {
                    toast.warning('Post tidak ditemukan')
                    return false
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    await handleAuthError(error.response.status, router);
                }
                this.error = error instanceof Error ? error.message : 'Unknown error'
                toast.error(`Error saat menghapus post: ${this.error}`)
                return false
            } finally {
                this.loading = false
            }
            return false
        },

        // Like a post
        async likePost(postId: string, likeData: LikePostRequest) {
            this.loading = true;
            this.error = null;
            const router = useRouter();
            const token = getAuthToken();
            try {
                const response = await axios.post<CommonResponseInterface<null>>(`${basePostUrl}/${postId}/like`, likeData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    toast.success('Like berhasil');
                    return response.data.message
                } else if (response.status === 400) {
                    toast.warning('Gagal memberikan like: Data tidak valid');
                    return response.data.message
                } else {
                    return "Tidak ada respon dari server";
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    await handleAuthError(error.response.status, router);
                }
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memberikan like: ${this.error}`);
                return "Like gagal"
            } finally {
                this.loading = false;
            }
        },
    },
});
