<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import VPostForm from '@/components/post/VPostForm.vue'
import type { CreatePostRequest } from '@/interfaces/post.interface'  
import { usePostStore } from '@/stores/post/post.store'
import { toast } from 'vue-sonner'

const router = useRouter()

const postStore = usePostStore()

const postModel = reactive<CreatePostRequest>({
  userProfileId: '',
  imageUrl: '',
  caption: '',
})


const addPost = async (bodyRequest: CreatePostRequest) => {
  const createPostResponse = await postStore.createPost(bodyRequest)

  if (createPostResponse) {
    toast.success('Post created successfully')
    router.push('/posts')
  } else {
    toast.error('Failed to create post')
  }
}
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4 overflow-y-auto">
    <div
      class="mx-auto w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col gap-4"
    >
      <h1 class="text-pink-600 font-bold text-xl">Tambah Post</h1>
      <VPostForm :postModel="postModel" :action="addPost" />
    </div>
  </main>
</template>

<style scoped>
/* view specific overrides (none) */
</style>
