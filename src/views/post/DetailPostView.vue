<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format } from 'date-fns'
import VButton from '@/components/common/VButton.vue'
import VLikeButton from '@/components/post/VLikeButton.vue'
import VReplySection from '@/components/reply/VReplySection.vue'
import type { Post } from '@/interfaces/post.interface'
import { usePostStore } from '@/stores/post/post.store'
import type { UserProfile } from '@/interfaces/profile.interface'
import { useUserProfileStore } from '@/stores/profile/profile.store'
import { isAdmin } from '@/lib/rbac'
import { getCurrentUser } from '@/lib/auth'

const route = useRoute()
const router = useRouter()

const postStore = usePostStore()
const profileStore = useUserProfileStore()

const { id: postId } = route.params as { id: string }

const post = ref(undefined as undefined | Post)

const getPost = async () => {
  const getPostResponse = await postStore.getPostById(postId as string)
  post.value = getPostResponse ?? undefined
}

const handleLiked = () => {
  // Refresh post to get updated like count
  getPost()
}

const isLoadingProfiles = ref(false)
const profiles = ref<UserProfile[]>([])

const selectedUserId = ref('')
const isUserAdmin = isAdmin()

onMounted(async () => {
  await getPost()
  if (!post.value) {
    router.replace('/posts')
  }

  if (isUserAdmin) {
    // Admin: can pick any user from profiles
    try {
      isLoadingProfiles.value = true
      const result = await profileStore.fetchProfiles()
      profiles.value = result ?? []
    } catch (error) {
      console.error('Failed to load profiles:', error)
    } finally {
      isLoadingProfiles.value = false
    }
  } else {
    // Non-admin: force like with own user id
    const me = getCurrentUser()
    selectedUserId.value = me?.id ?? ''
  }

})
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4 overflow-y-auto">
    <div class="mx-auto w-full max-w-4xl flex flex-col gap-4 bg-white drop-shadow-xl rounded-2xl overflow-hidden">
      <!-- Post Image -->
      <div class="aspect-video overflow-hidden">
        <img
          :src="post?.imageUrl"
          :alt="post?.caption"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Post Content -->
      <div class="p-6 md:p-8">
        <div class="w-full flex justify-between items-start mb-6">
          <h1 class="text-pink-600 font-bold text-xl">Detail Post</h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          <div>
            <span class="text-sm text-gray-500">User ID</span>
            <p class="text-lg font-bold">{{ post?.userProfileId }}</p>
          </div>
          <div>
            <span class="text-sm text-gray-500">Dibuat Pada</span>
            <p class="text-lg font-bold">
              {{ post ? format(new Date(post.createdAt), 'EEEE, dd MMMM yyyy HH:mm') : "-" }}
            </p>
          </div>
          <div class="md:col-span-2">
            <span class="text-sm text-gray-500">Caption</span>
            <p class="text-lg font-bold">{{ post?.caption }}</p>
          </div>
          <div>
            <span class="text-sm text-gray-500">Total Likes</span>
            <p class="text-lg font-bold">{{ post?.likes.length || 0 }}</p>
          </div>
          <div>
            <span class="text-sm text-gray-500">User yang Like</span>
            <p class="text-lg font-bold">{{ post?.likes.join(", ") || "Belum ada" }}</p>
          </div>
        </div>

        <div class="flex gap-2 mb-6">
          <VLikeButton
            :postId="postId"
            :userId="selectedUserId"
            @liked="handleLiked"
            :disabled="!selectedUserId"
          />
          <!-- Only admins can select a user to like as -->
          <div class="flex-1" v-if="isUserAdmin">
            <select
              v-model="selectedUserId"
              id="userId"
              name="userId"
              class="border rounded-lg px-3 py-2 text-gray-800"
              :disabled="isLoadingProfiles"
            >
              <option value="" disabled selected>
                {{ isLoadingProfiles ? 'Loading users...' : 'Select a user' }}
              </option>
              <option
                v-for="user in profiles"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }} ({{ user.nickname }})
              </option>
            </select>
          </div>
        </div>

        <div class="flex gap-4">
          <VButton @click="router.back()" class="bg-slate-600 hover:bg-slate-800 text-white">Kembali</VButton>
          <RouterLink :to="`/posts/${postId}/edit`" class="w-full">
            <VButton class="bg-pink-600 hover:bg-pink-800 text-white w-full">Edit</VButton>
          </RouterLink>
        </div>

        <!-- Reply Section -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <VReplySection :postId="postId" />
        </div>
      </div>
    </div>
  </main>
</template>

<!-- no scoped styles -->

