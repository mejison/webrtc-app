<template>
  <div class="app">
    <el-row :gutter="20">
      <el-col :span="10">
        <user-list :items="users" />
      </el-col>
      <el-col :span="14">
        <messenger />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { UserList, Messenger } from "@/components";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",

  components: {
    UserList,
    Messenger,
  },

  data() {
    return {
      activeIndex: "1",
    };
  },

  mounted() {
    this.getAllUsers();
  },

  methods: {
    ...mapActions("user", ["getAllUsers"]),
    handleSelect() {},
  },

  computed: {
    ...mapGetters({
      users: "user/all",
    }),
  },
};
</script>
