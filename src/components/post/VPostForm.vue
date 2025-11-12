<script setup lang="ts">
import { ref, onMounted, toRefs, watch, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import VInput from '../common/VInput.vue'
import VTextArea from '../common/VTextArea.vue'
import VButton from '../common/VButton.vue'
import type { CreatePostRequest } from '@/interfaces/post.interface'
import type { UserProfile } from '@/interfaces/profile.interface'
import { useUserProfileStore } from '@/stores/profile/profile.store'
import { isAdmin } from '@/lib/rbac'
import { getCurrentUser } from '@/lib/auth'

const router = useRouter()
const profileStore = useUserProfileStore()

const props = defineProps({
  action: {
    type: Function as PropType<(data: CreatePostRequest) => Promise<void>>,
    required: true,
  },
  postModel: {
    type: Object as PropType<CreatePostRequest>,
    required: true,
  },
})

const model = toRefs(props).postModel
const emit = defineEmits(['update:modelValue'])

watch(
  () => model,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
  { deep: true }
)

const profiles = ref<UserProfile[]>([])
const isLoadingProfiles = ref(false)
const isUserAdmin = isAdmin()

onMounted(async () => {
  if (isUserAdmin) {
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
    // Non-admin: force post with own user id
    const me = getCurrentUser()
    if (me?.id) {
      model.value.userProfileId = me.id
    }
  }
})

const handleSubmit = async () => {
  await props.action(model.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-6 py-4">
    <!-- User Dropdown (admins only) -->
    <div class="flex flex-col" v-if="isUserAdmin">
      <label for="userId" class="font-semibold text-gray-700 mb-2">User</label>
      <select
        v-model="model.userProfileId"
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

    <VInput v-model="model.imageUrl" id="imageUrl" name="imageUrl" label="Image URL" />
    <VTextArea v-model="model.caption" id="caption" name="caption" label="Caption" />

    <div class="flex justify-end gap-2 pt-4">
      <VButton @click="router.back()" type="button" class="bg-slate-600 hover:bg-slate-800 text-white">
        Kembali
      </VButton>
      <VButton type="submit" class="bg-pink-600 hover:bg-pink-800 text-white">
        Simpan
      </VButton>
    </div>
  </form>
</template>

<style scoped>
select:disabled {
  background-color: #f3f4f6;
  color: #374151;
}
</style>
