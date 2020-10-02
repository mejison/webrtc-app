<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>Users</span>
    </div>
    <div v-for="(item, key) in items" :key="key" class="text item">
      <el-card shadow="never"> {{ item.username }} </el-card>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "UserList",

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {};
  },
};
</script>

<style lang="scss">
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>
