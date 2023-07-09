<template>
  <div class="usere_signup_wrapper">
    <div class="usere_signup_wrapper_form">
      <form @submit.prevent="signup">
        <h1 style="text-align: center">User's SIgnUp</h1>
        <div>
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="eg:Raymond Amem"
            v-model="fullName"
          />
        </div>
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
        <h3>Medical Issues</h3>
        <div v-if="error">
          <p>{{ error.message }}</p>
        </div>
        <div v-else-if="pending">
          <p>Loading</p>
        </div>
        <div v-else-if="diseases" class="medical_wrap">
          <div v-for="disease in diseases" :key="disease.id">
            <label :for="disease.id">{{ disease.name }}</label>
            <input type="checkbox" :id="disease.id" :value="disease.id" v-model="selected_diseases" />
          </div>
        </div>
        <div> 
          <button type="submit">{{ loading ? "Loading" : "SUBMIT"}}</button>
        </div>
        <p class="hav_acc">
          <span>Already have account? </span>
          <NuxtLink href="/users/signin">SignIn </NuxtLink>, 
          <NuxtLink href="/">Home</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Disease } from '@prisma/client';

const { register } = useAuth();

const fullName = ref("");
const email = ref("");
const password = ref("");
const selected_diseases = ref<string[]>([]);
const diseases = ref<Disease[] | null>(null);

const loading = ref(false);

const { data, error, pending } = await useFetch("/api/data/disease");
if (!error.value) {
  diseases.value = data.value;
}

async function signup() {
  try {
    loading.value = true;
    const registered = await register({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
      diseaseIds: selected_diseases.value
    });
    loading.value = false;
    
    if (registered) {
      navigateTo("/users/home");
    }
  } catch (err: any) {
    loading.value = false;
    alert("Error Registering");
  }
}
</script>

<style lang="scss" scoped>
.usere_signup_wrapper {
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

      & *:not(label, div) {
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
        margin: 0.5rem 0;
        color: red;
      }

      button {
        background: red;
        color: white;
        width: 100%;
        margin: 0.5rem auto auto auto !important;

        &:hover {
          background: white;
          color: red;
        }
      }

      & > h3 {
        padding: 0.5rem 0 !important;
      }

      .medical_wrap {
        width: 100%;
        max-height: 24vh;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        padding: 1rem 0;
        overflow-x: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar {
          display: none !important;
        }

        & * {
          display: block;
        }

        & > div {
          width: fit-content;
          height: fit-content;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          gap: 0.5rem;
          border: none;
          border-radius: 5px;
          background: red;
          padding: 0.5rem;
          & * {
            color: white !important;
          }

          & > input[type="checkbox"] {
            border: none;
          }
        }
      }

      .hav_acc {
        display: block !important;
        padding: 1rem 0 !important;

        & > a,
        span {
          padding: 0 !important;
          display: inline !important;
        }

        & > a {
          &:hover {
            color: red;
            font-weight: bold;
          }
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