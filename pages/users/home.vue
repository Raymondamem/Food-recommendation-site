<template>
  <div class="foodGalleryMainWrapper">
    <HeaderComponent />
    <div class="container">
      <div class="foodGalleryMainWrapper_header">
        <h3>Food Gallery</h3>
        <form @submit.prevent="searchFood">
          <input
            type="search" 
            name="food-search" 
            placeholder="Search food"
            v-model="searchQuery"
          />
        </form>
      </div>
      <div v-if="error">
        <p style="color: red; font-size: larger;">{{ error.message }}</p>
      </div>
      <div v-else-if="pending">
        <p style="color: red; font-size: larger;">Loading</p>
      </div>
      <div v-else-if="data?.length === 0">
        <p style="color: red; font-size: larger;">EMPTY</p>
      </div>
      <div v-else-if="data" class="food_gallery_wrap">
        <!-- /////////////////////////////////////////////////// -->
        <div v-for="food in foods" :key="food.id" class="food_item">
          <div>
            <img
              :src="`/uploads/${food.imagePath}`"
              :alt="`${food.name} image`"
            />
          </div>
          <div>
            <p class="nameOfFood">
              {{ food.name }}
            </p>
            <div>
              <p class="prizeOfFood">
                <span>₦</span><span id="amount">{{food.price}}</span>
              </p>
              <button class="buyFood">Buy</button>
            </div>
          </div>
        </div>
        <!-- //////////////////////////////////////////////////// -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Food } from '@prisma/client';

definePageMeta({
  middleware: "regular-auth"
});

const { useAccessToken } = useAuth();
const accessToken = useAccessToken();

const foods = ref<Food[] | null>([]);

const searchQuery = ref("");
async function searchFood(e: any) {
  
  if (searchQuery.value.length > 0) {
    const data = await $fetch("/api/data/search", {
      query: {q: searchQuery.value},
      headers: {
        authorization: `Bearer ${accessToken.value}`
      }
    });

    foods.value = data;
  } else {
    const data = await $fetch("/api/data/food", {
      query: {recommend: "YES"},
      headers: {
        authorization: `Bearer ${accessToken.value}`
      }
    });

    foods.value = data;
  }
}

const {data, pending, error} = await useLazyFetch("/api/data/food", {
  query: {
    recommend: "YES"
  },
  headers: {
    authorization: `Bearer ${accessToken.value}`
  }
});

if (!error.value) {
  foods.value = data.value;
}

</script>
<style lang="scss">
.foodGalleryMainWrapper {
  padding-bottom: 5rem;
  position: relative;

  &_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    position: sticky !important;
    top: 10%;
    z-index: 5;

    h3 {
      font-weight: bold;
      font-size: 2rem;
      margin: 1rem 0 !important;
      flex: 0 1 250px;
    }

    & > form {
      width: 50%;
      flex: 0 1 350px;
      margin: .5rem 0;

      input {
        width: 100%;
        border: none;
        border-radius: 15px;
        color: black;
        padding: 1rem;
      }
    }
  }

  .food_gallery_wrap {
    display: grid;
    grid-template: auto / repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;

    & .food_item {
      max-width: 300px;
      height: fit-content;
      position: relative;

      &,
      & * {
        border: none;
        border-radius: 15px;
      }

      & > div {
        &:first-child {
          width: 100%;
          height: 100%;

          & > img {
            width: 100%;
            height: 400px;
            object-fit: cover;
          }
        }

        &:last-child {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0.2rem 0.2rem 0.2rem;
          position: absolute;
          left: 0;
          bottom: 0;
          right: 0 !important;
          width: 100% !important;
          z-index: 2;
          backdrop-filter: blur(5px);
          border-radius: 50px 50px 15px 15px;
          height: 40%;

          & > p {
            width: 90%;
            height: 50%;
            margin: auto;
            overflow: hidden;
            padding: 0.5rem 0;
            border-radius: none !important;
          }

          & > div {
            width: 90%;
            height: 50%;
            margin: auto;
            display: flex;
            justify-content: space-between;
            align-items: center;

            & > p {
              font-weight: bolder;
              font-size: 1.5rem;
              border-radius: none !important;
            }

            button {
              border: none;
              border-radius: 5px;
              padding: 0.5rem;
              background: red;

              &:hover {
                background: white;
                color: red;
              }
            }
          }

          &:hover {
            height: 100%;
            border-radius: 15px;
            right: 0 !important;

            & > div {
              height: 30%;
            }

            & > p {
              height: 70%;
              overflow-x: hidden;
              overflow-y: scroll;
              border-radius: none !important;

              &::-webkit-scrollbar {
                display: none;
              }
            }
          }
        }
      }

      // &::before {
      //   content: "+";
      //   display: block;
      //   position: absolute;
      //   top: 5%;
      //   right: 0;
      //   background: red;
      //   font-size: 1.5rem;
      //   font-weight: bolder;
      //   padding: 0.5rem 1rem 0.5rem 0.5rem;
      //   border: none;
      //   border-radius: 15px 0 0 15px;
      //   transition: all 0.3s ease-in-out !important;
      // }

      // &:hover {
        // &::before {
        //   background: white !important;
        //   color: red !important;
        //   width: 50% !important;
        // }
      // }
    }
  }
}
</style>
