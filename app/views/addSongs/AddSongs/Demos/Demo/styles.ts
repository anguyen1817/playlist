import { StyleSheet } from 'react-native'
import { dimension } from 'styles'

const CHECK_IMG_SIZE = dimension.fullWidth * 0.09
const CHECK_IMG_MARGIN_RIGHT = dimension.fullWidth * 0.05
const TEXT_CONTAINER_MAX_WIDTH = dimension.fullWidth * 0.6
export const ICON_SIZE = dimension.fullWidth * 0.1

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  infoContainer: {
    justifyContent: 'center',
    maxWidth: TEXT_CONTAINER_MAX_WIDTH
  },
  checkImg: {
    height: CHECK_IMG_SIZE,
    width: CHECK_IMG_SIZE,
    marginRight: CHECK_IMG_MARGIN_RIGHT
  }
})
