<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VPostUpdateForm from '@/components/post/VPostUpdateForm.vue'
import type { UpdatePostRequest } from '@/interfaces/post.interface'
import { toast } from 'vue-sonner'
import { usePostStore } from '@/stores/post/post.store'


const route = useRoute()
const router = useRouter()

const postStore = usePostStore()

const { id: postId } = route.params as { id: string }

const postModel = reactive<UpdatePostRequest>({
  id: '',
  imageUrl: '',
  caption: ''
})

onMounted(async () => {
  const getPostResponse = await postStore.getPostById(postId as string)
 
  if (!getPostResponse) {
    router.replace('/posts')
    return
  }

  postModel.id = getPostResponse.id || ''
  postModel.imageUrl = getPostResponse.imageUrl || ''
  postModel.caption = getPostResponse.caption || ''
})


const updatePost = async (bodyRequest: UpdatePostRequest) => {
  const updatedPost = await postStore.updatePost(bodyRequest)
  if (updatedPost) {
    toast.success('Post updated successfully')
  } else {
    toast.error('Failed to update post')
  }
  router.push('/posts')
}
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4 overflow-y-auto">
    <div class="mx-auto w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col gap-4">
      <h1 class="text-pink-600 font-bold text-xl">Edit Post</h1>
      <VPostUpdateForm :postModel="postModel" :action="updatePost" />
    </div>
  </main>
</template>

<style scoped>
/* view specific overrides (none) */
</style>
