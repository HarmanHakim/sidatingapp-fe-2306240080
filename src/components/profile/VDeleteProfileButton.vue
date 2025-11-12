<script setup lang="ts">
import VButton from '../common/VButton.vue'
import { useUserProfileStore } from '@/stores/profile/profile.store'
import { toast } from 'vue-sonner'

const emit = defineEmits(['deleted'])

const { profileId } = defineProps({
  profileId: {
    type: String,
    required: true,
  },
})

const userProfileStore = useUserProfileStore()

const deleteProfile = async () => {
  try {
    await userProfileStore.deleteProfile(profileId)
    toast.success('Profile deleted successfully')
    // Emit after successful deletion
    emit('deleted', profileId)
  } catch (error) {
    toast.error('Failed to delete profile')
  }
}
</script>

<template>
  <VButton @click="deleteProfile" class="del-button">Hapus</VButton>
</template>

<style scoped>
@reference "@/assets/main.css";

.del-button {
  @apply bg-rose-600 hover:bg-rose-800 text-white
}
</style>