<script setup lang="ts">
import { format } from 'date-fns'
import VButton from '@/components/common/VButton.vue'
import VDeletePostButton from '@/components/post/VDeletePostButton.vue'
import VLikeButton from '@/components/post/VLikeButton.vue'
import type { Post } from '@/interfaces/post.interface'

const props = defineProps<{
  post: Post
}>()

const emit = defineEmits<{
  liked: []
}>()


const handleLiked = () => {
  emit('liked')
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <!-- Post Image -->
    <div class="aspect-square overflow-hidden">
      <img 
        :src="props.post.imageUrl" 
        :alt="props.post.caption"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
    
    <!-- Post Content -->
    <div class="p-4">
      <p class="text-gray-800 text-sm mb-3 line-clamp-3">{{ post.caption }}</p>
      
      <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>User: {{ props.post.userProfileName }}</span>
        <span>{{ format(new Date(props.post.createdAt), 'dd MMM yyyy') }}</span>
      </div>
      
      <!-- Actions -->
      <div class="flex gap-2">
        <RouterLink :to="`/posts/${props.post.id}`" class="flex-1">
          <VButton class="detail-button w-full">Lihat</VButton>
        </RouterLink>
        <RouterLink :to="`/posts/${props.post.id}/edit`" class="flex-1">
          <VButton class="edit-button w-full">Edit</VButton>
        </RouterLink>
        <VDeletePostButton
          :postId="props.post.id"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/main.css";

  .detail-button{ @apply bg-blue-600 hover:bg-blue-800 text-white }
  .edit-button{ @apply bg-yellow-400 hover:bg-yellow-600 text-white } 
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
