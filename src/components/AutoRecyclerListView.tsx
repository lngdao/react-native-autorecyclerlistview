import * as React from 'react'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useCallback,
  Ref,
} from 'react'
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native'
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from 'recyclerlistview'
import _ from 'lodash'
import { AutoRecyclerListViewHandler, AutoRecyclerListViewProps } from './AutoRecyclerListView.props'

// TODO: Intergate cyclerListView [√]
// TODO: Freeze scroll [√]
// TODO: Time delay [√]
// TODO: Render specific item [√]
// TODO: Animation new item popup [√]
// TODO: Update props [√]
// TODO: Split type.ts file [X]
// TODO: Refactor [X]

const { width } = Dimensions.get('window')

const DEFAULT_DELAY = 0
const MAX_ITEM = 200

const dataProviderMaker = (data: any) =>
  new DataProvider((r1, r2) => !_.isEqual(r1, r2)).cloneWithRows(data)

const AutoRecyclerListView = forwardRef(
  <T extends unknown>(
    props: AutoRecyclerListViewProps<T>,
    ref: Ref<AutoRecyclerListViewHandler>
  ) => {
    const {
      data,
      style,
      containerStyle,
      newItemsTextStyle,
      newItemsViewStyle,
      showNewItemsPopup = true,
      autoScroll = true,
      maxItemAllow = MAX_ITEM,
      timeDelayMax = DEFAULT_DELAY,
      renderItem,
      newItemsText,
      renderNewItemsComponent,
      dataProvider,
      layoutProvider,
      rowRenderer,
      ...recyclerListProps
    } = props

    const [isTopItemCovered, setIsTopItemCovered] = useState<boolean>(false)
    const [enableScrollToEnd, setEnableScrollToEnd] =
      useState<boolean>(autoScroll)
    const [newItemsCount, setNewItemsCount] = useState<number>(2)
    const currentScrollRef = useRef<number>(0)
    const scrollRef = useRef<RecyclerListView<any, any>>(null)
    const [defaultLayoutProvider] = useState(
      new LayoutProvider(
        (i) => 0,
        (type, dim) => {
          dim.width = width
          dim.height = 1
        }
      )
    )

    let timeDelayScroll: NodeJS.Timeout

    let scrollHeight = useRef<number>(0)
    let contentHeight = useRef<number>(0)
    let currentScroll = useRef<number>(0)
    let prevData = useRef<Array<T>>(
      data.length > maxItemAllow ? data.slice(0, maxItemAllow) : data
    )
    const prevDataCount = useRef<number>(data.length)
    const _newItemsTopStyle = useRef(new Animated.Value(0)).current

    const defaultDataProvider = useMemo(() => {
      if (data.length > maxItemAllow) {
        prevData.current = prevData.current
          .slice(1)
          .concat(data.slice(data.length - 1))
      } else {
        prevData.current = [...data]
      }

      if (!isTopItemCovered) {
        prevDataCount.current = data.length
      }
      setNewItemsCount(data.length - prevDataCount.current)
      return dataProviderMaker(prevData.current)
    }, [data])

    const scrollToNew = () => {
      let newOffset = contentHeight.current - scrollHeight.current
      scrollRef.current?.scrollToOffset(0, newOffset, true)
    }

    const onLayout = (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout
      scrollHeight.current = height

      if (!!scrollRef.current && enableScrollToEnd) {
        scrollToNew()
      }
    }

    const onContentSizeChange = (width: number, height: number) => {
      contentHeight.current = height
    }

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      currentScrollRef.current = event.nativeEvent.contentOffset.y

      const prevScroll = currentScroll.current
      currentScroll.current = event.nativeEvent.contentOffset.y
      const isScrollingDown = prevScroll <= currentScroll.current
      const scrollEnd = contentHeight.current - scrollHeight.current
      const isEndOfList = currentScroll.current >= Math.floor(scrollEnd - 10)

      if (isEndOfList) {
        prevDataCount.current = data.length
        setNewItemsCount(0)
      }
      setEnableScrollToEnd(
        !autoScroll
          ? false
          : (enableScrollToEnd && isScrollingDown) || isEndOfList
      )

      if (timeDelayMax != DEFAULT_DELAY && !isScrollingDown) {
        if (!!timeDelayScroll) clearTimeout(timeDelayScroll)
        timeDelayScroll = setTimeout(() => {
          setEnableScrollToEnd(true)
        }, timeDelayMax)
      }
    }

    const onVisibleIndicesChanged = (all: number[]) => {
      let topItemCovered = !all.includes(data.length - 1)
      setIsTopItemCovered(topItemCovered)
    }

    useImperativeHandle(ref, () => ({
      scrollToTop: () => {
        scrollToNew()
      },
      clearTimeDelay: () => {
        clearTimeout(timeDelayScroll)
      },
    }))

    useEffect(() => {
      Animated.timing(_newItemsTopStyle, {
        toValue: 15,
        duration: 200,
        useNativeDriver: false,
      }).start()
    }, [newItemsCount])

    useEffect(() => {
      if (enableScrollToEnd) {
        scrollToNew()
      }
    }, [contentHeight.current])

    const renderDefaultNewItemsPopup = useCallback(() => {
      return !!renderNewItemsComponent &&
        React.isValidElement(renderNewItemsComponent(newItemsCount)) ? (
        renderNewItemsComponent(newItemsCount)
      ) : (
        <Animated.View
          style={[
            styles.newItemsPopup,
            { top: _newItemsTopStyle },
            newItemsViewStyle,
          ]}
        >
          <Text
            style={[styles.newItemsText, newItemsTextStyle]}
            children={
              !!newItemsText
                ? newItemsText(newItemsCount)
                : `${newItemsCount} new items`
            }
          />
        </Animated.View>
      )
    }, [newItemsCount])

    const defaultRowRenderer = useCallback(
      (type: string | number, data: T, index: number) => {
        return renderItem({ item: data, index })
      },
      []
    )

    if (!data.length) return null

    return (
      <View style={[styles.container, containerStyle]}>
        <RecyclerListView
          ref={scrollRef}
          style={[styles.list, style]}
          dataProvider={dataProvider ?? defaultDataProvider}
          rowRenderer={rowRenderer ?? defaultRowRenderer}
          layoutProvider={layoutProvider ?? defaultLayoutProvider}
          forceNonDeterministicRendering
          canChangeSize
          onScroll={onScroll}
          onVisibleIndicesChanged={onVisibleIndicesChanged}
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
            onLayout,
            onContentSizeChange,
          }}
          {...recyclerListProps}
        />
        {newItemsCount > 0 && !enableScrollToEnd && showNewItemsPopup && (
          <TouchableWithoutFeedback
            onPress={() => {
              setEnableScrollToEnd(true)
            }}
            children={renderDefaultNewItemsPopup()}
          />
        )}
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  newItemsPopup: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, .3)',
    position: 'absolute',
    borderRadius: 100,
    alignSelf: 'center',
  },
  newItemsText: {
    color: 'rgb(255,255,255)',
  },
})

export default React.memo(AutoRecyclerListView)
