import { StoreState } from 'types'

export const getCurrent = (state: StoreState) => ({
  songId: state.current.songId,
  playlistId: state.current.playlistId
})

export const getIsPlaying = (state: StoreState) => state.current.isPlaying

export const getPlaybackPosition = (state: StoreState) =>
  Math.floor(state.current.positionMillis / 1000)

export const getSongDuration = (state: StoreState) =>
  Math.floor(state.current.durationMillis / 1000)
