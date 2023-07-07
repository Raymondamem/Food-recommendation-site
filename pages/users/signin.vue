<template>
  <div class="usere_signup_wrapper">
    <div class="usere_signup_wrapper_form">
      <form action="/users/signup" method="post">
      <h1 style="text-align: center">User's SIgnIn</h1>
        <div>
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="eg:example@[gmail or yahoo].com"
          />
        </div>
        <div>
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="eg:XXXXXXXXXXX"
          />
        </div>
        <div style="margin-top: 1rem;">
          <button type="submit">SUBMIT</button>
        </div>
        <p class="hav_acc">
          <span>Don't have account? Create </span>
          <NuxtLink href="/users/">SignUp</NuxtLink>, 
          <NuxtLink href="/">Home</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() {},
});
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
        margin: auto;

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
        max-height: 22vh;
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