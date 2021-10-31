import React from 'react'
import { View, Image, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const LiveScreen = () => {
  return (
    <View style={{ position: 'absolute', width, height }}>
      <Image
        style={{ width: '100%', height: '100%' }}
        source={require('../assets/img_live.jpg')}
      />
    </View>
  )
}

export default LiveScreen
