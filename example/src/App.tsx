import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import AutoRecyclerListView from 'react-native-autorecyclerlistview'
import CommentItem from './components/CommentItem'
import LiveScreen from './components/LiveScreen'
import { dimensions, randomString } from './utils/utils'

const { width } = dimensions

const App = () => {
  let interval = useRef<NodeJS.Timer | null>(null)
  const scrollRef = useRef<React.ElementRef<typeof AutoRecyclerListView>>(null)

  const [dataComment, setDataComment] = useState<any[]>([
    'Hello world!',
    'Hello world!',
  ])

  const addNewComment = () => {
    setDataComment((prev) => [...prev, randomString()])
  }

  useEffect(() => {
    interval.current = setInterval(addNewComment, 1000)

    // return () => clearInterval(interval.current)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <LiveScreen />
      <View style={{ position: 'absolute', width, height: 300, bottom: 20 }}>
        <AutoRecyclerListView
          ref={scrollRef}
          data={dataComment}
          renderItem={({ item }) => <CommentItem data={item} />}
          newItemsText={(itemCount) => `${itemCount} new comments`}
        />
      </View>
    </View>
  )
}

export default App
