<template>
  <el-card class="box-card messager">
    <div slot="header" class="clearfix">
      <span>Messanger</span>
      <el-button
        v-if="currentMassanger != 'VideoMessager'"
        class="btn-messager"
        type="text"
        @click="onClickWebRTCcall"
        >WebRTC call</el-button
      >
      <el-button
        v-if="currentMassanger == 'VideoMessager'"
        class="btn-messager"
        type="text"
        @click="onClickTextMessages"
        >Back to messages</el-button
      >
    </div>
    <div class="body">
      <component
        :is="currentMassanger"
        :current="current"
        ref="messanger"
      ></component>
    </div>
  </el-card>
</template>

<script>
import TextMessager from "./TextMessager";
import VideoMessager from "./VideoMessager";

export default {
  name: "Messenger",

  components: {
    TextMessager,
    VideoMessager,
  },

  props: {
    current: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      currentMassanger: "VideoMessager",
    };
  },

  methods: {
    incomingCall(offer) {
      const messanger = this.$refs.messanger;
      this.currentMassanger = "VideoMessager";
      if (messanger.incoming) {
        messanger.incoming(offer);
      }
    },
    sendIceCandidate(candidate) {
      const messanger = this.$refs.messanger;
      if (messanger.addCandidate) {
        messanger.addCandidate(candidate);
      }
    },
    answerCall(answer) {
      const messanger = this.$refs.messanger;
      if (messanger.answer) {
        messanger.answer(answer);
      }
    },
    onClickWebRTCcall() {
      this.currentMassanger = "VideoMessager";
    },
    onClickTextMessages() {
      this.currentMassanger = "TextMessager";
    },
  },
};
</script>

<style lang="scss">
.messager {
  width: 100%;
}

.btn-messager {
  float: right;
  padding: 3px 0;
}
</style>
