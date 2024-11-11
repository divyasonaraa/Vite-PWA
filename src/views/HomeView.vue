<script setup lang="ts">
import type { User, UserResult } from "@/models/user";
import { onMounted, ref } from "vue";
import { unescape } from "lodash";

interface UserWithAvatar extends User {
  avatar: string;
}

const users = ref<UserWithAvatar[]>([]);
const busy = ref(false);

// Expanded array of available avatar styles
const avatarStyles = [
  "avataaars", "bottts", "gridy", "identicon", "personas", "thumbs", "jdenticon",
  "micah", "miniavs", "open-peeps", "pixel-art", "progressive"
];

const getAvatarUrl = (username: string, index: number): string => {
  const style = avatarStyles[index % avatarStyles.length];
  return `https://api.dicebear.com/6.x/${style}/svg?seed=${username}`;
};

onMounted(async () => {
  busy.value = true;
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (response.status === 200) {
      const userResult = (await response.json());
      users.value = userResult.map((user : any, index : any) => ({
        ...user,
        avatar: getAvatarUrl(user.username, index)
      }));
    } else {
      throw new Error("Failed to load users...");
    }
  } catch (error) {
    console.error(error);
  } finally {
    busy.value = false;
  }
});
</script>

<template>
  <main class="p-2">
    <div v-if="busy" class="bg-gray-800 text-white text-lg p-2">Loading...</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      <div
        v-for="user in users"
        :key="user.id"
        class="rounded-xl border flex border-slate-300 bg-slate-200 hover:bg-slate-300 cursor-pointer"
      >
        <img 
          class="w-36 rounded-l-xl" 
          :src="user.avatar" 
          :alt="user.name"
          @error="user.avatar = 'https://api.dicebear.com/6.x/avataaars/svg?seed=placeholder'" 
        />
        <div class="p-1">
          <div class="text-lg font-bold">
            {{ unescape(user.name) }} ({{ user.username }})
          </div>
          <div>
            <span class="w-28 font-bold inline-block">Company:</span>{{ user.company.name }}
          </div>
          <div>
            <span class="w-28 font-bold inline-block">Email:</span>{{ user.email }}
          </div>
          <div>
            <span class="w-28 font-bold inline-block">Phone:</span>{{ user.phone }}
          </div>
          <div>
            <span class="w-28 font-bold inline-block">Website:</span>{{ user.website }}
          </div>
          <div>
            <span class="w-28 font-bold inline-block">Address:</span>{{ user.address?.city }}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
