export interface ICover  {
  src: string
  preview: string
  type?: 'api'
  api?: string
  name? :string
}

export interface IlistGrid {
  gutter: number
  xxl: number
  xl: number
  lg: number
  md: number
  sm: number
  xs: number
}

export interface IgridStyle {
  width: string,
  textAlign: string,
  fontSize: string,
  color: string
}

export interface IdefaultHome {
  keyList: IkeyList[]
  keyContentMap: object
}

export interface IkeyList {
  key: string
  tab: string
}

export interface ImyLikeList {
  icon: string
  link: string
  name: string
}
