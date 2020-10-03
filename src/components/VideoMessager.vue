<template>
  <div class="video-messager-wrapper">
    <div class="video-area">
      <div class="local-video">
        <video muted autoplay ref="local-video"></video>
      </div>
      <div class="remote-video">
        <video autoplay ref="remote-video"></video>
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
    onTrack(event) {
      const remoteVideo = this.$refs["remote-video"];
      remoteVideo.srcObject = event.streams[0];
      this.remoteVideo = event.streams[0];
    },
    onClickCall() {
      this.getAccessVideoAudio().then(() => {
        this.createPeerToPeerConnect().then(() => {
          setTimeout(() => {
            this.localStream.getTracks().forEach((track) => {
              this.peerConnect.addTrack(track, this.localStream);
            });

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
          }, 1500);
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

        this.peerConnect.icecandidate = this.onIceCandidate;
        this.peerConnect.ontrack = this.onTrack;
      });
    },
    onIceCandidate(peer, event) {
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
    },
    answer(answer) {
      this.peerConnect.setRemoteDescription(answer.sdp);
    },
    incoming(offer) {
      this.getAccessVideoAudio().then(() => {
        this.createPeerToPeerConnect().then(() => {
          this.peerConnect.setRemoteDescription(offer.sdp);
          setTimeout(() => {
            this.localStream.getTracks().forEach((track) => {
              this.peerConnect.addTrack(track, this.localStream);
            });
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
          }, 1500);
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
      display: flex;
      align-items: center;
      justify-content: center;

      video {
        width: 100%;
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
