# WebRtcPlayer

example player for [RTSPtoWebRTC](https://github.com/deepch/RTSPtoWebRTC)

## Getting Started

install and run RTSPtoWebRTC server

```html
<script src="webrtcplayer.js"></script>

<video id="videoelement" autoplay controls muted style="width:600px;"></video>

<script>
WebRtcPlayer.setServer('localhost:8083');
let player = new WebRtcPlayer('videoelement','H264_PCMALAW');
</script>
```
the first step is to specify the server on which RTSPtoWebRTC is running

```javascript
WebRtcPlayer.setServer('localhost:8083');
```
next step create WebRtcPlayer
```javascript
let player = new WebRtcPlayer(videoElementId, stream_UUID  [,options]);
//videoElementId - id of video
//stream_UUID - name of srteam from RTSPtoWebRTC config
//options - Object with options
```
## methods
### destroy player
```javascript
player.destroy();
```
### load
```javascript
player.load(stream_UUID);
```
### getImageUrl
```javascript
player.getImageUrl();
```
return base64 encoded string image from videoelement
