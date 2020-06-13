import React from 'react'
import { View, FlatList } from 'react-native'
import { useDispatch } from 'react-redux'
import { Song as SongType } from 'types'
import { currentActions } from 'actions'
import Song from './Song'
import styles from './styles'

type SongsProps = {
  songs: Array<SongType>
  playlistId: string
}

const { play } = currentActions

const Songs = ({ songs, playlistId }: SongsProps) => {
  const dispatch = useDispatch()

  const keyExtractor = (item: SongType, index: number) => {
    // using a combination of index and song id to allow duplicate songs
    return `${index}-${item.id}`
  }

  const renderSeparator = () => {
    return <View style={styles.separator} />
  }

  const renderItem = ({ item }: { item: SongType }) => {
    const onPress = () => {
      dispatch(play({ songId: item.id, playlistId }))
    }

    return <Song data={item} onPress={onPress} />
  }

  return (
    <FlatList
      style={styles.container}
      data={songs}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={renderSeparator}
      scrollEnabled={true}
    />
  )
}

export default Songs
