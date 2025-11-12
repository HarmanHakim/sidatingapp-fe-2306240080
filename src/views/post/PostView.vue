<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VButton from '@/components/common/VButton.vue'
import VPostFilterDropdown from '@/components/post/VPostFilterDropdown.vue'
import VPostCard from '@/components/post/VPostCard.vue'
import type { Post } from '@/interfaces/post.interface'
import { usePostStore } from '@/stores/post/post.store'

const postStore = usePostStore()

const posts = ref<Post[]>([])

const filterModel = ref({ user: '', sort: 'desc' })

onMounted(async () => {
  await postStore.fetchPosts()
  posts.value = postStore.posts 
})

const handleDeleted = async (id?: string) => {
  console.log('[PostList] handleDeleted triggered for', id)
  if (id) {
    posts.value = posts.value.filter(p => p.id !== id)
  }

  await postStore.fetchPosts()
  posts.value = postStore.posts
}

const handleLiked = async () => {
  await postStore.fetchPosts()
  posts.value = postStore.posts
}

const handleFiltered = (filteredPosts: Post[]) => {
  posts.value = filteredPosts
}
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4 overflow-y-auto">
    <div class="mx-auto w-full max-w-4xl">
      <div class="flex flex-col gap-6">
        <div class="flex justify-between items-center">
          <h1 class="text-pink-600 font-bold text-2xl">Posts</h1>
          <RouterLink to="/posts/add">
            <VButton class="add-button">Buat Post Baru</VButton>
          </RouterLink>
        </div>

        <VPostFilterDropdown v-model="filterModel" @filtered="handleFiltered" />

        <div v-if="postStore.loading" class="text-center py-12 text-gray-500">
          Memuat post...
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VPostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
            @deleted="handleDeleted"
            @liked="handleLiked"
          />
        </div>

        <div v-if="!postStore.loading && posts.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">Belum ada post. Buat post pertama Anda!</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "@/assets/main.css";

.add-button {
  @apply bg-pink-600 hover:bg-pink-800 text-white;
}
</style>
