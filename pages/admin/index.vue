<template>
  <div class="signup_wrapper">
    <div class="signup_wrapper_form">
      <form @submit.prevent="signin">
        <h1 style="text-align: center">Admin SIgnIn</h1>
        <div>
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="eg:example@[gmail or yahoo].com"
            v-model="email"
          />
        </div>
        <div>
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="eg:XXXXXXXXXXX"
            v-model="password"
          />
        </div>
        <button :disabled="loading" type="submit">{{ loading ? "Loading" : "SUBMIT"}}</button>
        <p style="text-align: center;">
          <NuxtLink href="/">Home</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { adminLogin } = useAuth();

const email = ref("");
const password = ref("");

const loading = ref(false);

async function signin() {
  try {
    loading.value = true;
    const loggedIn = await adminLogin({
      email: email.value,
      password: password.value
    });
    loading.value = false;
    if (loggedIn) {
      navigateTo("/admin/home");
    }
  } catch (err: any) {
    loading.value = false;
    alert("Error Registering");
  }
}
</script>

<style lang="scss" scoped>
.signup_wrapper {
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &_form {
    width: 100%;
    height: 100%;
    border: none;
  }

  &_form {
    background: url(~/assets/imgs/pexels-cottonbro-studio-3338497.jpg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    backdrop-filter: blur(50px);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    form {
      width: 50%;
      height: fit-content;
      display: block;
      z-index: 2;

      & *:not(label) {
        display: block;
        width: 100%;
        border: none;
        border-radius: 5px;
        padding: 1rem;
      }

      input {
        color: black;
      }

      & label {
        display: block;
        margin: 1rem 0;
        color: red;
      }

      button {
        background: red;
        color: white;
        width: 95%;
        margin: auto;

        &:hover {
          background: white;
          color: red;
        }
      }
    }

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(5px);
      border-radius: 0 0 1000px 0;
    }
  }
}
</style>