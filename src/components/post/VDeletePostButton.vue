<script setup lang="ts">
import VButton from '../common/VButton.vue'
import { ref } from 'vue'
import { usePostStore } from '@/stores/post/post.store'
import type { DeletePostRequest } from '@/interfaces/post.interface'
import { toast } from 'vue-sonner'

const postStore = usePostStore()

const deletePostRequest = ref<DeletePostRequest | undefined>()

const { postId } = defineProps({
    postId: {
        type: String,
        required: true,
    },
})

const deletePost =async () => {
    deletePostRequest.value = { id: postId }
    const removed = await postStore.deletePost(deletePostRequest.value)
    if (removed) {
        toast.success('Post deleted successfully')
        window.location.href = '/posts'
    }
}
</script>

<template>
    <VButton @click="deletePost" class="del-button">Hapus</VButton>
</template>

<style scoped>
@reference "@/assets/main.css";

    .del-button {
        @apply bg-rose-600 hover:bg-rose-800 text-white
    }
</style>
