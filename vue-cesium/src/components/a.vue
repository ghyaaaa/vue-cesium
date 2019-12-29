<template>
  <div class="open" @click="open()">打开新窗口带参数</div>
</template>

<script>
export default {
  methods: {
    open () {
      const {href} = this.$router.resolve({
        path: '/haha',
        query: {
          pdf: 77
        }
      })
      window.open(href, '_blank')
    }
  }  
}
</script>