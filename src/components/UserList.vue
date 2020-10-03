<template>
  <el-card class="box-card" v-if="current">
    <div slot="header" class="clearfix">
      <span>Users</span>
    </div>
    <div
      v-for="(item, key) in items"
      :key="key"
      class="text item"
      @click="onClickSelectUser(item)"
    >
      <el-card
        :class="{ active: current.id == item.id }"
        class="chat-item"
        shadow="never"
      >
        {{ item.username }}
      </el-card>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "UserList",

  props: {
    current: {
      type: Object,
      default: () => {},
    },
    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {};
  },

  methods: {
    onClickSelectUser(user) {
      this.$emit("select", user);
    },
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

.chat-item {
  &.active {
    border: 2px solid #333;
  }
}
</style>
