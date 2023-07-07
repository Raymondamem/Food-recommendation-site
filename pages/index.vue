<template>
  <HeaderComponent />
  <div class="banner">
    <div class="container">
      <h1>
        Food recommendation site by Name ...... Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Repellendus optio adipisci doloremque
        error natus quod.
      </h1>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione atque
        saepe similique, suscipit cupiditate eius deserunt et laudantium ipsa,
        doloremque voluptatem inventore sint aliquid fuga enim ipsam quidem
        dolores rerum.
      </p>
    </div>
  </div>
</template>
<style lang="scss">
body {
  background: url(~/assets/imgs/pexels-rajesh-tp-1624487.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  min-height: 100vh;
}

.banner {
  .container {
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-start;
  }
}
</style>