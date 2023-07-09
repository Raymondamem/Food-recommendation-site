<template>
  <header>
    <div class="container">
      <div class="logo">
        <NuxtLink href="/">FRS</NuxtLink>
      </div>
      <nav>
        <NuxtLink href="/">Home</NuxtLink>
        <NuxtLink v-if="!user" href="/users/">User's Signup</NuxtLink>
        <NuxtLink v-if="!user" href="/users/signin">User's Signin</NuxtLink>
        <NuxtLink v-if="!user" href="/admin/">Admin Signin</NuxtLink>

        <NuxtLink v-if="user" @click.prevent="logout">Logout</NuxtLink>
      </nav>
      <NuxtLink to="/users/home">Order Food</NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const { useUser, logout } = useAuth();
const user = useUser();
</script>

<style lang="scss">
header {
  box-shadow: 1px 1px 5px 5px rgba(0, 0, 0, 0.5);
  position: -webkit-sticky !important;
  position: sticky !important;
  top: 0px !important;
  z-index: 5 !important;

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo a {
      display: block;
      font-size: 3rem;
      font-weight: bolder;
      text-decoration: none;
      margin: 0.5rem 0;

      &::first-letter {
        color: red;
        font-style: italic;
      }
    }

    nav {
      width: 40%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      a, button {
        text-decoration: none;
        position: relative;
        display: block;
        width: fit-content;
        height: fit-content;

        &:first-child {
          font-weight: bold;
        }

        &:first-child::after {
          background: red;
        }

        &::after {
          content: "";
          display: block;
          width: 100%;
          height: 2px;
          background: transparent;
          transition: all 0.3s ease-in-out;
        }

        &:hover {
          font-weight: bold;
        }

        &:hover::after {
          background: red;
        }
      }

      & + a {
        background: red;
        font-size: 1.2rem;
        text-decoration: none;
        padding: 0.5rem;
        border: none;
        border-radius: 5px;
        text-shadow: 0.5px 0.5px 0.5px 5px black;
        font-weight: bold;

        &:hover {
          background: white;
          color: red;
        }
      }
    }
  }
}
</style>