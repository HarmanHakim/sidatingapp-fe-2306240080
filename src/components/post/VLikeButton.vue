<script setup lang="ts">
import { ref } from 'vue'
import VButton from '../common/VButton.vue'
import { usePostStore } from '@/stores/post/post.store'
import type { Post, LikePostRequest } from '@/interfaces/post.interface'
import { toast } from 'vue-sonner'

const postStore = usePostStore()

const likePostRequest = ref<LikePostRequest>()
const likePostResponse = ref<string>()
const post = ref(undefined as undefined | Post)

const props = defineProps({
    postId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})


const emit = defineEmits(['liked'])

const likePost = async () => {
    likePostRequest.value = { 
        id: props.postId,
        userProfileId: props.userId 
    }
    const response = await postStore.likePost(props.postId as string, likePostRequest.value)
    likePostResponse.value = response ?? undefined 
}

const toggleLike = async () => {
    await likePost()
    toast.success(likePostResponse)
    
    emit('liked')
}

</script>

<template>
    <VButton 
        @click="toggleLike" 
        :class="[
            'like-button', 'bg-gray-300 hover:bg-gray-400'
        ]"
    >❤️ Like Post
        {{ post?.likeCount }}
    </VButton>
</template>

<style scoped>
@reference "@/assets/main.css";

    .like-button {
        @apply text-white transition-colors duration-200 flex items-center gap-2
    }
</style>
