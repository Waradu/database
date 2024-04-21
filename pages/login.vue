<template>
  <div class="login">
    <form class="login-wrapper" @submit.prevent="login">
      <h1>
        <NuxtLink to="/">
          <Iconsax name="ArrowLeft" size="18" color="#ffffff40" thickness="3" />
        </NuxtLink>
        Admin Panel
      </h1>
      <div class="password">
        <input
          :type="showPassword ? 'text' : 'password'"
          name="password"
          id="password"
          v-model="password"
          placeholder="Password"
          @input="error_message = ''"
          required
        />
        <Iconsax
          :name="showPassword ? 'EyeSlash' : 'Eye'"
          class="eye"
          size="18"
          @click="togglePasswordVisibility"
        />
      </div>
      <div class="bottom">
        <p class="message" v-if="error_message != ''">{{ error_message }}</p>
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
const password = ref("");
const showPassword = ref(false);
const error_message = ref("");
const supabase = useSupabaseClient();
const user = useSupabaseUser()

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: "admin@waradu.dev",
    password: password.value,
  });

  if (error) {
    error_message.value = error.message;
  }
};

useHead({
  title: "Admin Panel",
});

watch(user, () => {
  if (user.value) {
    return navigateTo('/admin')
  }
}, { immediate: true })
</script>

<style>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .login-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    border-radius: 8px;
    gap: 20px;

    h1 {
      color: #ffffffbb;
      font-size: 28px;
    }

    input {
      width: 240px;
      height: 50px;
      padding-inline: 16px;
      border-radius: 12px;
      border: none;
      transition: 0.2s ease-in-out;
      cursor: text;
      font-weight: bold;
      font-size: 16px;
      letter-spacing: -1px;
      word-spacing: 1px;
      user-select: none;
      border: 1px solid #ffffff10;
      background-color: transparent;
      outline: none;
      color: #ffffffbb;
    }

    .password {
      position: relative;
      display: flex;
      align-items: center;

      .eye {
        position: absolute;
        right: 16px;
        cursor: pointer;
      }
    }
    .bottom {
      display: flex;
      flex-direction: column;
      gap: 5px;

      .message {
        padding-left: 2px;
        color: #ff6666aa;
      }

      button {
        width: 240px;
        height: 50px;
        border-radius: 12px;
        border: none;
        transition: 0.2s ease-in-out;
        cursor: pointer;
        font-weight: bold;
        font-size: 18px;
        letter-spacing: -1px;
        word-spacing: 1px;
        user-select: none;
        border: 1px solid #ffffff10;
        background-color: transparent;
        outline: none;
        color: #ffffffbb;

        &:hover {
          border: 1px solid #ffffff20;
          background-color: #ffffff05;
          color: #ffffffff;
        }
      }
    }
  }
}
</style>
