import React from 'react'
import { View, Text, Image } from 'react-native'
import { dimensions } from '../utils/utils'

const { width } = dimensions

const CommentItem = ({ data }: any) => {
  return (
    <View
      onLayout={(event) => {
        const dms = event.nativeEvent
      }}
      style={{
        flex: 1,
        padding: 10,
        flexDirection: 'row',
      }}
    >
      <Image
        style={{
          width: 30,
          height: 30,
          marginRight: 8,
          alignSelf: 'flex-start',
        }}
        source={require('../assets/img_avt.png')}
      />
      <View
        style={{
          maxWidth: width - 58,
          borderRadius: 20,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
        }}
        children={<Text style={{ flexShrink: 1, color: 'white' }} children={data} />}
      />
    </View>
  )
}

export default CommentItem
