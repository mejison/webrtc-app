<template>
  <el-menu :default-active="activeIndex" class="d-flex" mode="horizontal">
    <el-menu-item>WebRTC</el-menu-item>
    <el-menu-item class="ml-auto" index="sign-in"> SignIn </el-menu-item>
    <el-menu-item index="sign-up"> SignUp </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "navbar",

  data() {
    return {
      activeIndex: "1",
    };
  },
};
</script>
