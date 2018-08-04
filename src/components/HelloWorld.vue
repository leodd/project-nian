<template>
  <div class="hello">
    <masonary-layout
      ref="masonary"
      :width-of-item="200"
      :gap-between-item="15"
      :sizes="[
        {columns: 1},
        {mq: '500px', columns: 2},
        {mq: '700px', columns: 3},
        {mq: '900px', columns: 4},
        {mq: '1100px', columns: 5}
      ]"
      style="margin: 20px auto"
    >
      <test-block v-for="i in 20" :key="i"></test-block>
    </masonary-layout>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',

  data () {
    return {
      blocks: []
    }
  },

  mounted () {
    this.$refs.masonary.pack();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
