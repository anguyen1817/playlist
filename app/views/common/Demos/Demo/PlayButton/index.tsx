import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import * as audio from 'utils/audio'
import log from 'utils/logger'
import styles from './styles'

const playImg = require('../../../../../assets/images/play.png')
const pauseImg = require('../../../../../assets/images/pause.png')

type PlayButtonProps = {
  url: string
  onPress: () => void
  onFinish: () => void
  isPlaying: boolean
}

const PlayButton = ({ url, onPress, onFinish, isPlaying }: PlayButtonProps) => {
  const onButtonPress = async () => {
    onPress()

    if (isPlaying) {
      audio.stop()
    } else {
      await audio.play(url)
      audio.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    }
  }

  const onPlaybackStatusUpdate = (status: audio.PlaybackStatus) => {
    if (status.isLoaded) {
      if (status.didJustFinish && !status.isLooping) {
        onFinish()
      }
    } else {
      if (status.error) {
        log(`player error: ${status.error}`)
      }
    }
  }

  const buttonImg = isPlaying ? pauseImg : playImg

  return (
    <TouchableOpacity onPress={onButtonPress}>
      <Image style={styles.buttonImg} source={buttonImg} />
    </TouchableOpacity>
  )
}

export default PlayButton
