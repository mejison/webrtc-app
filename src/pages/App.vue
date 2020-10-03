<template>
  <div class="app">
    <el-row>
      <el-col>
        <el-card>
          <span>My name: {{ me.username }}</span>
        </el-card>
      </el-col>
    </el-row>
    <br />
    <el-row :gutter="20">
      <el-col :span="10">
        <user-list
          :items="usersWithoutMe"
          :current="currentUser"
          @select="onSelectCurrentUser"
        />
      </el-col>
      <el-col :span="14">
        <messenger ref="messager" :current="currentUser" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { UserList, Messenger } from "@/components";
import { mapActions, mapGetters } from "vuex";
import * as api from "@/api";
import Pusher from "pusher-js";

export default {
  name: "App",

  components: {
    UserList,
    Messenger,
  },

  data() {
    return {
      activeIndex: "1",
      currentUser: null,
      pusher: null,
      channel: null,
    };
  },

  mounted() {
    this.getAllUsers();
    this.initAuthUser();
    this.initPusher();
  },

  methods: {
    ...mapActions("user", ["getAllUsers"]),
    ...mapActions("auth", ["getMe"]),
    onSelectCurrentUser(user) {
      this.currentUser = user;
    },
    handleSelect() {},
    initAuthUser() {
      let token = this.$cookies.get("token");
      if (!token) {
        api.generateRandomUser().then(({ data }) => {
          const [user] = data.results;
          api
            .signup({
              username: `${user.name.first} ${user.name.last}`,
              email: user.email,
              password: `${new Date() * 1}`,
            })
            .then(({ data: { user } }) => {
              this.$cookies.set("token", user.token);
              this.getAllUsers();
              this.getMe();
            });
        });
        return;
      }
      this.getMe();
    },
    initPusher() {
      this.pusher = new Pusher("d587330e72dd836c4532", {
        cluster: "eu",
      });
    },
    pusherSubscriptions() {
      this.channel = this.pusher.subscribe(`user-${this.me.id}`);
      this.channel.bind("new-offer", (data) => {
        this.$refs.messager.incomingCall(data);
      });
      this.channel.bind("new-answer", (data) => {
        this.$refs.messager.answerCall(data);
      });
      this.channel.bind("send-ice-candidate", (data) => {
        this.$refs.messager.sendIceCandidate(data);
      });
    },
  },

  computed: {
    ...mapGetters({
      me: "auth/user",
    }),
    ...mapGetters({
      users: "user/all",
    }),
    usersWithoutMe() {
      return this.users.filter((user) => {
        return user.id != this.me.id;
      });
    },
  },

  watch: {
    usersWithoutMe() {
      this.currentUser = this.usersWithoutMe[0];
    },
    me() {
      this.pusherSubscriptions();
    },
  },
};
</script>
