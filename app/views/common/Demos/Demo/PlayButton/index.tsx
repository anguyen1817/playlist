import React, { useEffect } from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { AVPlaybackStatus } from 'expo-av'
import * as audio from 'utils/audio'
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
  useEffect(() => {
    return () => {
      // stop playing on unmount
      console.log('unmounting', isPlaying)
      if (isPlaying) {
        audio.stop()
      }
    }
  }, [isPlaying])

  const onButtonPress = () => {
    if (isPlaying) {
      audio.stop()
    } else {
      audio.play(url, onPlaybackStatusUpdate)
    }

    onPress()
  }

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.didJustFinish && !status.isLooping) {
        onFinish()
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`)
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
