# react-native-autorecyclerlistview

**_AutoRecyclerListView_** inspired by **_recyclerListView_** and **_react-native-autoscroll-flatlist_**

## Installation

### # Using yarn

     yarn add react-native-autorecyclerlistview

### # Using npm

     npm add react-native-autorecyclerlistview

## Demo

Code provided in **Example** folder.

## Usage

#### Simple usage


```js
...
import AutoRecyclerListView, { ListAutoRenderItem } from 'react-native-autorecyclerlistview'

const Sample = () => {
  const [data, setData] = useState<string[]>([])

  useEffect(() => {
    setInterval(() => {
      setData((prev) => [...prev, 'Hello world!'])
    }, 1000)
  }, [])

  const _renderItem: ListAutoRenderItem<string> = ({ item, index }) => {
    return (
      <View>
        <Text children={item} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <AutoRecyclerListView data={data} renderItem={_renderItem} />
    </View>
  )
}
```


## Props

Updating...

## License

[MIT](https://choosealicense.com/licenses/mit/)
