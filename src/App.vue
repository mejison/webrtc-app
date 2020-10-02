<template>
  <div id="app">
    <el-row class="navbar">
      <el-col>
        <navbar />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <router-view />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Navbar } from "@/components";
export default {
  name: "App",

  components: {
    Navbar,
  },
};
</script>
