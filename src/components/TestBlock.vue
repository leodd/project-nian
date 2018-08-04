<template>
  <div class="block"></div>
</template>

<script>
  export default {
    name: "TestBlock",

    mounted () {
      this.$el.style.height = `${Math.floor(Math.random() * (900 - 300)) + 300}px`
    }
  }
</script>

<style lang="scss">
  .block {
    background-color: #000;
    border-radius: 10px;
    width: 200px;
  }
</style>
