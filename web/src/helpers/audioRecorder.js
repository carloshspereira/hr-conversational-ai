import { EventEmitter } from "eventemitter3"
import { audioContext } from "./utils.js"
import {
  createWorketFromSrc,
  registeredWorklets,
} from "./audioworkletRegistry.js"
import AudioProcessingWorklet from "./worklets/audioProcessing.js"

function arrayBufferToBase64(buffer) {
  var binary = ""
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

export class AudioRecorder extends EventEmitter {
  constructor() {
    super()
    this.sampleRate = 16000
    this.stream = undefined
    this.audioContext = undefined
    this.source = undefined
    this.recording = false
    this.recordingWorklet = undefined
    this.starting = null
    this.isMuted = false
  }

  async start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Could not request user media")
    }

    // eslint-disable-next-line no-async-promise-executor
    this.starting = new Promise(async (resolve) => {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.audioContext = await audioContext({ sampleRate: this.sampleRate })
      this.source = this.audioContext.createMediaStreamSource(this.stream)

      const workletName = "audio-recorder-worklet"
      const workletSrc = AudioProcessingWorklet

      if (!registeredWorklets.has(this.audioContext)) {
        registeredWorklets.set(this.audioContext, {})
      }

      const registry = registeredWorklets.get(this.audioContext)
      if (!registry[workletName]) {
        const src = createWorketFromSrc(workletName, workletSrc)
        await this.audioContext.audioWorklet.addModule(src)
        registry[workletName] = {
          node: new AudioWorkletNode(this.audioContext, workletName),
          handlers: [],
        }
      }

      this.recordingWorklet = registry[workletName].node

      this.recordingWorklet.port.onmessage = async (ev) => {
        const arrayBuffer = ev.data.data.int16arrayBuffer

        if (arrayBuffer) {
          const arrayBufferString = arrayBufferToBase64(arrayBuffer)
          console.log("🎤 Audio captured - size:", arrayBuffer.byteLength, "bytes")
          this.emit("data", arrayBufferString)
        }
      }
      this.source.connect(this.recordingWorklet)

      this.recording = true
      resolve()
      this.starting = null
    })
  }

  stop() {
    const handleStop = () => {
      this.source?.disconnect()
      this.stream?.getTracks().forEach((track) => track.stop())
      this.stream = undefined
      this.recordingWorklet = undefined
    }
    if (this.starting) {
      this.starting.then(handleStop)
      return
    }
    handleStop()
  }

  mute() {
    if (this.source && this.recordingWorklet && !this.isMuted) {
      this.source.disconnect(this.recordingWorklet)
      this.isMuted = true
    }
  }

  unmute() {
    if (this.source && this.recordingWorklet && this.isMuted) {
      this.source.connect(this.recordingWorklet)
      this.isMuted = false
    }
  }
}
