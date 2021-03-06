import { StyleSheet } from 'react-native'
import { dimension, color } from 'styles'

const WIDTH = dimension.fullWidth
const HEIGHT = dimension.fullHeight * 0.14
const ARTWORK_SIZE = dimension.fullHeight * 0.07
const ARTWORK_MARGIN_HORIZONTAL = dimension.fullWidth * 0.05
const TEXT_CONTAINER_MAX_WIDTH = dimension.fullWidth * 0.5
const PLAY_BTN_MARGIN_RIGHT = ARTWORK_MARGIN_HORIZONTAL
const PLAY_BTN_SIZE = dimension.fullWidth * 0.11
export const TRACKER_WIDTH = dimension.fullWidth

export default StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: color.background
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  artwork: {
    height: ARTWORK_SIZE,
    width: ARTWORK_SIZE,
    marginHorizontal: ARTWORK_MARGIN_HORIZONTAL,
    borderRadius: 4
  },
  textContainer: {
    maxWidth: TEXT_CONTAINER_MAX_WIDTH
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  playButton: {
    marginRight: PLAY_BTN_MARGIN_RIGHT,
    height: PLAY_BTN_SIZE,
    width: PLAY_BTN_SIZE
  }
})
