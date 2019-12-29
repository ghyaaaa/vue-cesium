<template>
  <div>
    nihao + {{list}}
  </div>
</template>

<script>
export default {
  data: {
    list: ''
  },
  created() {
    this.getParams();
  },
  methods: {
    getParams() {
      // 取到路由带过来的参数
      const routerParams = this.$route.query.pdf;
      console.log("接受的pdf的值：", routerParams);
      this.list = routerParams
     }
  } 
}
</script>