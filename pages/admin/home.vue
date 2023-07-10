<template>
  <div class="admin_wrapper_home">
    <header id="admin_wrapper_home_header">
      <div class="container">
        <h1>Admin Dashboard</h1>
        <nav>
          <NuxtLink href="/">Home</NuxtLink>
          <NuxtLink href="#add-desiese">Add Desiese</NuxtLink>
          <NuxtLink href="#add-food">Add Food</NuxtLink>
          <NuxtLink @click.prevent="logout">Logout</NuxtLink>
        </nav>
      </div>
    </header>
    <section
      id="add-desiese"
      class="admin_wrapper_home_desiese"
      style="padding-top: 5rem"
    >
      <div class="container">
        <h3>Add Desiese related to a meal</h3>
        <form @submit.prevent="addDisease">
          <div class="meal_desies">
            <label for="desiese">
              <input
                type="text"
                id="desiese"
                placeholder="Add Desiese of a meal"
                v-model="disease"
              />
            </label>
            <button :disabled="diseaseLoading" type="submit">{{diseaseLoading ? "Loading" : "ADD DESIESE"}}</button>
          </div>
        </form>
        <h3>All Desiese</h3>
        <div v-if="error">
          <p>{{ error.message }}</p>
        </div>
        <div v-else-if="pending">
          <p>Loading</p>
        </div>
        <div v-else-if="diseases" class="medical_wrap">
          <!-- ///////////////////////// -->
          <div v-for="disease in diseases" :key="disease.id">
            <label for="medical_issus">{{ disease.name }}</label>
            <span>x</span>
          </div>
          <!-- //////////////////////////// -->
        </div>
      </div>
    </section>
    <section
      id="add-food"
      class="admin_wrapper_home_food"
      style="padding-top: 5rem"
    >
      <div class="container">
        <h3>Add Food to the Food Gallery</h3>
        <form @submit.prevent="addFood">
          <div>
            <!-- <label for="name">Food Name</label> -->
            <input
              type="text"
              id="name"
              placeholder="Name of Meal"
              v-model="foodName"
            />
          </div>

          <div>
            <!-- <label for="prise">Prise Food</label> -->
            <input
              type="text"
              id="prise"
              placeholder="Prise of Meal"
              v-model.number="foodPrice"
            />
          </div>

          <div>
            <label for="foodimg">Food Image</label>
            <input type="file" id="foodimg" @change="loadFile" />
          </div>

          <div class="select">
            <label for="diseases">Select Diseases</label>
            <select multiple v-model="selected_diseases">
              <option
                v-for="disease in diseases"
                :key="disease.id"
                :value="disease.id"
              >
                {{ disease.name }}
              </option>
            </select>
          </div>

          <div>
            <button :disabled="foodLoading" type="submit">
              {{ foodLoading ? "Loading" : "Add Food" }}
            </button>
          </div>
        </form>
        <div class="wrap_food_edit">
          <div class="food_gallery_wrap">
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
                    <span>₦</span><span id="amount">{{ food.price }}</span>
                  </p>
                  <button class="buyFood">Delete food</button>
                </div>
              </div>
            </div>
            <!-- //////////////////////////////////////////////////// -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { Disease, Food } from "@prisma/client";

definePageMeta({
  middleware: "admin-auth",
});

const { useAccessToken } = useAuth();
const token = useAccessToken();

const disease = ref("");
const selected_diseases = ref<string[]>([]);
const diseases = ref<Disease[] | null>(null);

const foods = ref<Food[] | null>([]);

const {
  data: foodData,
  pending: foodPending,
  error: foodError,
} = await useLazyFetch("/api/data/food", {
  headers: {
    authorization: `Bearer ${token.value}`,
  },
});
if (!foodError.value) {
  foods.value = foodData.value;
}

const { data, error, pending } = await useFetch("/api/data/disease");
if (!error.value) {
  diseases.value = data.value;
}

let imageFile: any = null;
const foodName = ref("");
const foodPrice = ref(0);

function loadFile(event: any) {
  imageFile = event.target.files[0];
}

const diseaseLoading = ref(false);
async function addDisease() {
  try {
    diseaseLoading.value = true;
    const data = await $fetch("/api/data/disease", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token.value}`,
      },
      body: {
        name: disease.value
      }
    });

    disease.value = "";
    alert("Added Disease");
    diseases.value?.push(data.newDisease);
  } catch (err: any) {
    alert("Error adding Disease");
    diseaseLoading.value = false;
  }
}

const foodLoading = ref(false);
async function addFood() {
  try {
    foodLoading.value = true;
    const form = new FormData();
    form.append("name", foodName.value);
    form.append("price", foodPrice.value.toString());
    form.append("diseaseIds", JSON.stringify(selected_diseases.value));
    if (imageFile === null) {
      alert("Select an image please");
      return;
    }
    form.append("image", imageFile);

    const data = await $fetch("/api/data/food", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token.value}`,
      },
      body: form,
    });

    alert("Added food");
    foodLoading.value = false;
    foodName.value = "";
    foodPrice.value = 0;
    selected_diseases.value = [];

    foods.value?.push(data);
  } catch (err: any) {
    alert("Error adding food");
    foodLoading.value = false;
  }
}

const { logout } = useAuth();
</script>
<style lang="scss" scoped>
.admin_wrapper_home {
  width: 100%;
  min-height: 100vh;
  background: url(~/assets/imgs/pexels-cottonbro-studio-3338497.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  //   overflow: hidden;
  position: relative;

  #admin_wrapper_home_header {
    position: fixed !important;
    top: 0 !important;
    left: 0;
    right: 0;
    box-shadow: 1px 1px 5px rgba($color: black, $alpha: 0.5);

    & > .container {
      display: flex;
      justify-content: space-between;
      align-items: center;

      & > nav {
        width: 50%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    & > div > h1 {
      padding: 1rem 0;
    }
  }

  &_food {
    min-height: 100vh;
    background: url(~/assets/imgs/pexels-rajesh-tp-1624487.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;

    h3 {
      margin: 1rem 0;
    }

    form {
      display: flex;
      //   flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 0.5rem;

      & > div {
        flex: 0 1 300px !important;
      }

      & > div:not(:last-child) {
        width: 100%;
        height: fit-content;
        display: flex;
        align-items: center;

        & * {
          display: block;
          border: none;
        }

        & > label {
          width: 30%;
          height: 100%;
          border-radius: 5px 0 0 5px;
          background: red;
          color: white;
          padding: 0.9rem 1rem;
        }

        & > input {
          width: 100%;
          border-radius: 5px;
          color: black;
          padding: 1rem;
        }

        &:hover {
          & > label {
            background: white;
            color: red;
          }
        }
      }

      & > div:nth-child(3) {
        width: 40%;
        height: fit-content;
        display: flex;
        align-items: center;
        position: relative;

        & * {
          display: block;
          border: none;
        }

        & > input {
          width: 100%;
          border-radius: 0 5px 5px 0;
          color: black;
          padding: 1rem;
        }

        & > label {
          text-align: center;
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 5px;
          background: red;
          color: white;
          padding: 0.9rem 1rem;

          &:hover {
            background: white;
            color: red;
          }
        }
      }

      & > div:last-child {
        width: 40%;

        button {
          display: block;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 1rem;
          background: red;
          color: white;

          &:hover {
            background: white;
            color: red;
          }
        }
      }

      .select {
        &,
        & * {
          display: block !important;
        }
        width: 50% !important;
        & select,
        & label {
          width: 100% !important;
          height: fit-content;
        }

        & select {
          margin-top: 0.5rem;
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }

    .food_gallery_wrap {
      display: grid;
      grid-template: auto / repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      padding: 2rem 0 1rem 0;

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
      }
    }
  }

  &_desiese {
    height: 100vh;
    background: url(~/assets/imgs/pexels-cottonbro-studio-3338497.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;

    form {
      margin: 1rem 0;
    }

    .meal_desies {
      width: 100%;

      & > label,
      & > button {
        display: block;
        height: fit-content;
        margin: 0.5rem 0;
        width: 50% !important;

        & input {
          display: block;
          width: 100%;
          padding: 1rem;
          border: none;
          border-radius: 5px;
          color: black;
        }
      }

      button {
        padding: 1rem;
        background: red;
        color: white;
        border: none;
        border-radius: 5px;

        &:hover {
          background: white;
          color: red;
        }
      }
    }

    .medical_wrap {
      width: 100%;
      max-height: 50vh;
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

        & > span {
          background: white;
          color: red !important;
          border: none;
          text-align: center;
          display: block;
          width: fit-content;
          height: fit-content;
          padding: 0.3rem 0.5rem;
          box-shadow: 1px 1px 5px white;
          border-radius: 5px;
        }

        &:hover {
          background: white;
          color: red !important;

          & > span {
            background: red;
            color: white !important;
          }
        }
      }
    }
  }
}
</style>
