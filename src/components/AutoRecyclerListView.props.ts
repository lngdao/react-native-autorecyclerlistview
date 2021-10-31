import { TextStyle, ViewStyle } from 'react-native'
import { BaseDataProvider, BaseLayoutProvider } from 'recyclerlistview'

export interface AutoRecyclerListViewProps<T extends unknown> {
  data: T[]
  renderItem: ({
    item,
    index,
  }: {
    item: T
    index: number
  }) => React.ReactElement
  autoScroll?: boolean
  style?: object | number
  containerStyle?: ViewStyle
  newItemsTextStyle?: TextStyle
  newItemsViewStyle?: ViewStyle
  showNewItemsPopup?: boolean
  maxItemAllow?: number
  timeDelayMax?: number
  newItemsText?: (items: number) => string
  renderNewItemsComponent?: (items: number) => React.ReactElement
  dataProvider?: BaseDataProvider
  rowRenderer?: (
    type: string | number,
    data: any,
    index: number,
    extendedState?: object
  ) => JSX.Element | JSX.Element[] | null
  layoutProvider?: BaseLayoutProvider
}

export type AutoRecyclerListViewHandler = {
  scrollToTop: () => void
  clearTimeDelay: () => void
}
