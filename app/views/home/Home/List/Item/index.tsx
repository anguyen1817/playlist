import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Text from 'views/common/Text'
import { HomeNavigationProps } from 'types'
import { color } from 'styles'
import styles, { ICON_SIZE } from './styles'

type ItemProps = {
  id: string
  title: string
  description: string
  icon: string
  colors: string[]
}

const Item = ({ id, title, description, icon, colors }: ItemProps) => {
  const navigation = useNavigation<HomeNavigationProps>()

  const goToPlaylist = (playlistId: string) => {
    navigation.navigate('Playlist', { playlistId })
  }

  const renderIcon = () => {
    return (
      <LinearGradient colors={colors} style={styles.iconBg}>
        <MaterialIcons name={icon} size={ICON_SIZE} color={color.accent} />
      </LinearGradient>
    )
  }

  const renderInfo = () => {
    return (
      <View style={styles.infoContainer}>
        <Text variation="body">{title}</Text>
        <Text variation="caption">{description}</Text>
      </View>
    )
  }

  return (
    <TouchableOpacity key={id} onPress={() => goToPlaylist(id)}>
      <View style={styles.container}>
        {renderIcon()}
        {renderInfo()}
      </View>
    </TouchableOpacity>
  )
}

export default Item
