<template>
  <div class="video-messager-wrapper">
    <div class="video-area">
      <div class="local-video">
        <video muted autoplay ref="local-video"></video>
      </div>
      <div class="remote-video">
        <video ref="remote-video" autoplay></video>
      </div>
    </div>

    <button @click="onClickCall">call</button>
  </div>
</template>

<script>
import * as api from "@/api";
import { mapGetters } from "vuex";

export default {
  name: "VideoMessager",

  props: {
    current: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      peerConnect: null,
      localStream: null,
      remoteVideo: null,
    };
  },

  methods: {
    onAddStream(event) {
      console.log("onAddStream", event);
      const remoteVideo = this.$refs["remote-video"];
      remoteVideo.srcObject = event.stream;
      this.remoteVideo = event.stream;
    },
    onClickCall() {
      this.getAccessVideoAudio().then(() => {
        this.createPeerToPeerConnect().then(() => {
          setTimeout(() => {
            this.peerConnect.addStream(this.localStream);
          }, 1500);
          this.peerConnect
            .createOffer()
            .then((offer) => {
              return this.peerConnect.setLocalDescription(offer);
            })
            .then(() => {
              api.createOffer({
                caller: this.me.id,
                user_id: this.current.id,
                sdp: this.peerConnect.localDescription,
              });
            });
        });
      });
    },
    async getAccessVideoAudio() {
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      if (navigator.getUserMedia) {
        return await navigator.getUserMedia(
          { audio: true, video: true },
          (stream) => {
            const localVideo = this.$refs["local-video"];
            localVideo.srcObject = stream;
            this.localStream = stream;
          },
          (err) => {
            console.error(`The following error occurred: ${err.name}`);
          }
        );
      } else {
        console.error(`getUserMedia not supported`);
      }
    },
    async createPeerToPeerConnect() {
      return await api.getIceCandidate().then(async ({ data }) => {
        const { iceServers } = data.v;
        this.peerConnect = await new RTCPeerConnection({
          iceServers: [...iceServers],
        });
        this.peerConnect.onicecandidate = this.onIceCandidate;
        this.peerConnect.onaddtrack = this.onAddStream;
      });
    },
    onIceCandidate(event) {
      console.log(event);
      if (event.candidate) {
        const candidate = event.candidate;
        api.sendIceCandidate({
          user_id: this.current.id,
          candidate,
        });
      }
    },
    addCandidate(candidate) {
      this.peerConnect.addIceCandidate(candidate);
      console.log("addCandidate recived", candidate);
    },
    answer(answer) {
      this.peerConnect.setRemoteDescription(answer.sdp);
    },
    incoming(offer) {
      this.getAccessVideoAudio().then(() => {
        this.createPeerToPeerConnect().then(() => {
          setTimeout(() => {
            this.peerConnect.addStream(this.localStream);
          }, 1500);
          this.peerConnect.setRemoteDescription(offer.sdp);
          this.peerConnect.createAnswer().then((answer) => {
            api
              .createAnswer({
                user_id: offer.caller,
                sdp: answer,
              })
              .then(() => {
                this.peerConnect.setLocalDescription(answer);
              });
          });
        });
      });
    },
  },

  computed: {
    ...mapGetters({
      me: "auth/user",
    }),
  },
};
</script>

<style lang="scss">
.video-messager-wrapper {
  .video-area {
    margin-bottom: 50px;
    position: relative;

    .remote-video {
      width: 100%;
      min-height: 400px;
      background: #333;

      video {
        height: 100%;
      }
    }

    .local-video {
      position: absolute;
      z-index: 2;
      right: 15px;
      top: 15px;
      width: 200px;
      height: 150px;
      overflow: hidden;
      background: #222;
      border: 2px solid #fbff00;
      border-radius: 3px;

      video {
        height: 100%;
      }
    }
  }
}
</style>
