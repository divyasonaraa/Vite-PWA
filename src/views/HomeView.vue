<script setup lang="ts">
import type { User, UserResult } from "@/models/user";
import { onMounted, reactive, ref } from "vue";
import { unescape } from "lodash";

const users = reactive(new Array<User>());
const busy = ref(false);

onMounted(async () => {
  busy.value = true;
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (response.status === 200) {
      const userResult = (await response.json()) as UserResult;
      console.log("userResult",userResult)
      users.splice(0, users.length, ...userResult);
    } else {
      throw "Failed to load users...";
    }
  } finally {
    busy.value = false;
  }
});

// Create our number formatter.
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",  
  minimumFractionDigits: 0,
});
</script>

<template>
  <main class="p-2">
    <h1 class="text-2xl font-bold">Users</h1>
    <div v-if="busy" class="bg-gray-800 text-white text-lg p-2">Loading...</div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      <div
        v-for="user in users"
        :key="user.id"
        class="rounded-xl border flex border-slate-300 bg-slate-200 hover:bg-slate-300 cursor-pointer"
      >
        <img class="w-36 rounded-l-xl" :src="user?.posterUrl" :alt="user.title" />
        <div class="p-1">
          <div class="text-lg font-bold">
            {{ unescape(user.name) }} ({{ user.username }})
          </div>
          <div>
            <span class="w-28 font-bold inline-block">Company:</span>{{ user.company.name }}
          </div>
          <div>
            <span class="w-28 font-bold inline-block">Email:</span
            >{{ user.email }}
          </div>  
          <div>
            <span class="w-28 font-bold inline-block">Phone:</span
            >{{ user.phone }}
          </div>
          <div>
            <span class="w-28 font-bold inline-block">Website:</span
            >{{ user.website }}
          </div>
           <div>
            <span class="w-28 font-bold inline-block">Address:</span
            >{{ user.address?.city }}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
