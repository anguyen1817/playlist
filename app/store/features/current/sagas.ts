import { eventChannel, buffers, SagaIterator, EventChannel } from 'redux-saga'
import {
  call,
  select,
  put,
  spawn,
  takeLatest,
  take,
  StrictEffect
} from 'redux-saga/effects'
import * as audio from 'utils/audio'
import log from 'utils/logger'
import { songsSelectors, playlistsSelectors } from 'selectors'
import { actions } from './slice'
import { getCurrent } from './selectors'

const { getPlaylistSongIds } = playlistsSelectors
const { getSongWithId } = songsSelectors
const {
  play: playAction,
  pause: pauseAction,
  resume: resumeAction,
  next: nextAction,
  previous: previousAction,
  setCurrent,
  setIsPlaying,
  setPosition,
  setDuration
} = actions

enum PositionState {
  NotFound,
  AtTheBeginning,
  AtTheEnd,
  InTheMiddle
}

type SongPosition = { state: PositionState; index: number }

// WORKERS
function* play({
  payload: { songId, playlistId }
}: ReturnType<typeof playAction>): SagaIterator {
  try {
    log('playing song', songId)

    const { url } = yield select(getSongWithId, songId)
    const { durationMillis } = yield call(audio.play, url)

    yield put(setIsPlaying(true))
    yield put(setCurrent({ songId, playlistId }))
    yield put(setDuration(durationMillis))

    yield spawn(trackStatus, songId)
  } catch (error) {
    log('failed to play song', error)
  }
}

function* processStatus(
  channel: EventChannel<any>,
  status: audio.PlaybackStatus
): SagaIterator {
  if (!status.isLoaded) {
    log('song being unloaded')
    yield call(channel.close)
  } else {
    if (status.isPlaying) {
      yield put(setPosition(status.positionMillis))
    }

    if (status.didJustFinish && !status.isLooping) {
      log('finished playing song')
      yield put(nextAction())
      yield call(channel.close)
    }
  }
}

function* trackStatus(songId: string): SagaIterator {
  const channel = yield call(createStatusChannel)
  log(`start tracking status for ${songId}`)

  try {
    while (true) {
      const { status } = yield take(channel)
      yield call(processStatus, channel, status)
    }
  } finally {
    log(`stop tracking status for ${songId}`)
  }
}

function createStatusChannel() {
  return eventChannel<{ status: audio.PlaybackStatus }>((emitter) => {
    audio.setOnPlaybackStatusUpdate((status) => {
      emitter({ status })
    })

    return () => {}
  }, buffers.expanding())
}

function* pause(): SagaIterator {
  try {
    log('pausing song')
    yield call(audio.pause)
    yield put(setIsPlaying(false))
  } catch (error) {
    log('failed to pause song', error)
  }
}

function* resume(): SagaIterator {
  try {
    const isInitiated = yield call(audio.isInitiated)
    const { positionMillis, durationMillis } = yield call(audio.getStatus)

    const hasFinished =
      Math.floor(positionMillis / 1000) === Math.floor(durationMillis / 1000)

    if (isInitiated && !hasFinished) {
      log('resuming song')
      yield call(audio.resume)
    } else {
      log('playing from beginning as song is not initiated or has finished')
      const { songId } = yield select(getCurrent)
      const { url } = yield select(getSongWithId, songId)

      yield call(audio.play, url)
      yield spawn(trackStatus, songId)
    }

    yield put(setIsPlaying(true))
  } catch (error) {
    log('failed to resume song', error)
  }
}

function* getSongPosition(
  songId: string,
  songIds: string[]
): Generator<StrictEffect, SongPosition, any> {
  if (songIds.length === 0) {
    log('playlist has no songs')
    return { state: PositionState.NotFound, index: -1 }
  }

  const index = songIds.indexOf(songId)

  if (index === -1) {
    log('song is not in playlist')
    return { state: PositionState.NotFound, index }
  }

  if (index === 0) {
    log('song is the first song')
    return { state: PositionState.AtTheBeginning, index }
  }

  if (index === songIds.length - 1) {
    log('song is the last song')
    return { state: PositionState.AtTheEnd, index }
  }

  return { state: PositionState.InTheMiddle, index }
}

function* next(): SagaIterator {
  try {
    const { songId, playlistId } = yield select(getCurrent)
    const songIds = yield select(getPlaylistSongIds, playlistId)
    const { state, index }: SongPosition = yield call(
      getSongPosition,
      songId,
      songIds
    )

    switch (state) {
      case PositionState.AtTheEnd: {
        const { isPlaying } = yield call(audio.getStatus)

        if (!isPlaying) {
          yield put(setIsPlaying(false))
        } else {
          // toast
        }

        break
      }
      case PositionState.AtTheBeginning:
      case PositionState.InTheMiddle: {
        log('playing next song')
        const nextSongId = songIds[index + 1]
        yield put(playAction({ songId: nextSongId, playlistId }))
      }
    }
  } catch (error) {
    log('failed to play next song', error)
  }
}

function* previous(): SagaIterator {
  try {
    const { songId, playlistId } = yield select(getCurrent)
    const songIds = yield select(getPlaylistSongIds, playlistId)
    const { state, index }: SongPosition = yield call(
      getSongPosition,
      songId,
      songIds
    )

    switch (state) {
      case PositionState.AtTheBeginning: {
        log('reached beginning - replaying current song')
        yield put(playAction({ songId: songId, playlistId }))
        break
      }
      case PositionState.AtTheEnd:
      case PositionState.InTheMiddle: {
        log('playing previous song')
        const nextSongId = songIds[index - 1]
        yield put(playAction({ songId: nextSongId, playlistId }))
      }
    }
  } catch (error) {
    log('failed to play previous song', error)
  }
}

// WATCHERS
function* watchPlay() {
  yield takeLatest(playAction, play)
}

function* watchPause() {
  yield takeLatest(pauseAction, pause)
}

function* watchResume() {
  yield takeLatest(resumeAction, resume)
}

function* watchNext() {
  yield takeLatest(nextAction, next)
}

function* watchPrevious() {
  yield takeLatest(previousAction, previous)
}

export default {
  watchers: [
    watchPlay(),
    watchPause(),
    watchResume(),
    watchNext(),
    watchPrevious()
  ],
  workers: {
    play
  }
}
