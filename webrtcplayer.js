class WebRtcPlayer {
   static server = '127.0.0.1:8083';
   webrtc = null;
   webrtcSendChannel = null;
   webrtcSendChannelInterval = null;
   video = null;
   server=null;
   codecLink = null;
   rsdpLink = null;
   stream = new MediaStream();
   uuid = null;
   constructor(id,uuid) {
     this.server=WebRtcPlayer.server;
     this.video=document.getElementById(id);
     this.uuid=uuid;
     this.createLinks();
     this.play();
   }

   createLinks(){
     this.codecLink="//"+this.server+"/stream/codec/"+this.uuid
     this.rsdpLink="//"+this.server+"/stream/receiver/"+this.uuid
   }

   play(){
     this.webrtc = new RTCPeerConnection({
       iceServers: [{
         urls: ["stun:stun.l.google.com:19302"]
       }]
     });
     this.webrtc.onnegotiationneeded = this.handleNegotiationNeeded.bind(this);
     this.webrtc.ontrack = this.onTrack.bind(this);
     fetch(this.codecLink)
     .then((response) => {
       response.json().then((data) => {
        data.forEach((item, i) => {
          this.webrtc.addTransceiver(item.Type, {
            'direction': 'sendrecv'
          });
        });
        this.webrtcSendChannel = this.webrtc.createDataChannel('foo');
        this.webrtcSendChannel.onclose = (e) => console.log('sendChannel has closed', e);
        this.webrtcSendChannel.onopen = () => {
          this.webrtcSendChannel.send('ping');
          this.webrtcSendChannelInterval = setInterval(() => {
            if(this.webrtcSendChannel.readyState=='open'){
              this.webrtcSendChannel.send('ping');
            }else{
              this.destroy();
              this.play();
            }
          }, 1000)
        }
        this.webrtcSendChannel.onmessage = e => console.log(e.data);
       });
     })
     .catch((error) => {
       console.log(error);
     });
   }

   async handleNegotiationNeeded(){
     let offer = await this.webrtc.createOffer();
     await this.webrtc.setLocalDescription(offer);
     let formData = new FormData();
     formData.append('suuid',this.uuid);
     formData.append('data',btoa(this.webrtc.localDescription.sdp));
     fetch(this.rsdpLink,{
       method: 'POST',
       body: formData
     })
     .then((response)=>{
       response.text().then((data) => {
         this.webrtc.setRemoteDescription(new RTCSessionDescription({
               type: 'answer',
               sdp: atob(data)
             }))
       });
     })
     .catch((err)=>{
     })
   }

   onTrack(event){
     this.stream.addTrack(event.track);
     this.video.srcObject = this.stream;
     this.video.play();
   }

   load(uuid){
     this.destroy();
     this.uuid=uuid;
     this.createLinks();
     this.play();
   }

   destroy(){
     clearInterval(this.webrtcSendChannelInterval);
     this.webrtc.close();
     this.webrtc=null;
     this.webrtcSendChannel=null;
     this.video.srcObject = null;
     this.stream = new MediaStream();
   }

   getImageUrl(){
     let canvas = document.createElement("canvas");
     canvas.width = this.video.videoWidth;
     canvas.height = this.video.videoHeight;
     canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
     let dataURL = canvas.toDataURL();
     canvas.remove();
     return dataURL;
   }

   static setServer(serv){
      this.server= serv;
   }
}
