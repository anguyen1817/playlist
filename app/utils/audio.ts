import { Audio, AVPlaybackStatus } from 'expo-av'

export type PlaybackStatus = AVPlaybackStatus

type OnPlaybackStatusUpdateType = (status: PlaybackStatus) => void

let playbackInstance: Audio.Sound | null = null

const checkInstance = () => {
  if (playbackInstance === null) {
    throw new Error('playback not initiated')
  }
}

export const play = async (uri: string) => {
  if (playbackInstance !== null) {
    await reset()
  }

  playbackInstance = new Audio.Sound()
  const source = { uri }
  const initialStatus = { shouldPlay: true }
  const status = await playbackInstance.loadAsync(source, initialStatus)

  return status
}

export const setOnPlaybackStatusUpdate = async (
  onPlaybackStatusUpdate: OnPlaybackStatusUpdateType
) => {
  checkInstance()
  await playbackInstance?.setProgressUpdateIntervalAsync(1000)
  playbackInstance?.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
}

export const pause = () => {
  checkInstance()
  return playbackInstance?.pauseAsync()
}

export const resume = () => {
  checkInstance()
  return playbackInstance?.playAsync()
}

export const stop = () => {
  checkInstance()
  return playbackInstance?.stopAsync()
}

export const getStatus = () => {
  checkInstance()
  return playbackInstance?.getStatusAsync()
}

// unload the current media from memory and reset instance
export const reset = async () => {
  checkInstance()
  await playbackInstance?.unloadAsync()
  playbackInstance = null
}

export const isInitiated = () => playbackInstance !== null
