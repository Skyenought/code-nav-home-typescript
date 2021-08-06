import React, {CSSProperties, useState} from "react";
import {ICover, IdefaultHome, IlistGrid} from "types/index";
import {Avatar, Card, List, Input, message, Drawer, Button, Tabs, Tooltip, Image, Switch} from 'antd';
import {navigate} from "@reach/router"
import {PictureOutlined, SearchOutlined, GithubOutlined} from '@ant-design/icons';
import logo from '../assets/logo.png';
import baidu from '../assets/baidu.png';
import google from '../assets/google.png';
import defaultHome from "../constant/defaultHome";
import defaultTabPane, {DEFAULT_COVER} from "../constant/defaultTabPane";
import {CURRENT_COVER, GHOST_OPEN, PROJECT_GITHUB, SEARCH_ALL_OPEN, WEB_HOST} from "../constant";
import axios from 'axios'
import './index.css';
import './ghost.css';



const { Search } = Input;

const listGrid: IlistGrid = {
  gutter: 28,
  xxl: 4,
  xl: 4,
  lg: 4,
  md: 3,
  sm: 2,
  xs: 1
}

const gridStyle: CSSProperties = {
  width: '25%',
  textAlign: 'center',
  fontSize: '13px',
  color: '#555'
}


const localStorage: Storage = window.localStorage


export default () => {
  const [ tabKey, setTabKey ] = useState('myLike')

  const [ maskOpened, setMaskOpened ] = useState(false)
  // 设置壁纸是否开源被看见
  const [ drawerVisible, setDrawerVisible ] = useState(false)
  // 展示网址的数据
  const [ template, setTemplate]: IdefaultHome | any = useState(defaultHome)
  // 是否使用baidu
  const [ isBaidu, setIsBaidu ] = useState(true)

  // 开启万能搜索
  const currentSearchAll = localStorage.getItem(SEARCH_ALL_OPEN) ? JSON.parse(localStorage.getItem(SEARCH_ALL_OPEN)) : true
  const [ searchAll, setSearchAll ] = useState(currentSearchAll)

  // 当前封面
  const currentCover = localStorage.getItem(CURRENT_COVER) ? JSON.parse(localStorage.getItem(CURRENT_COVER)) : DEFAULT_COVER
  const [ cover, setCover ] = useState(currentCover)

  // 透明模式
  const currentGhostClose = localStorage.getItem(GHOST_OPEN) ? JSON.parse(localStorage.getItem(GHOST_OPEN)) : false
  const [ ghostClose, setGhostClose ] = useState(currentGhostClose)

  const doSearch = (value: string) => {
    if (value.length < 1) {
      message.error('请输入搜索内容')
      return
    }

    // 将注释去除可访问到Search组件的页面

    /*if (searchAll) {
      navigate(`/search?q=${value}`);
      return;
    }*/

    if (searchAll) {
      if (isBaidu) {
        navigate(`https://www.baidu.com/s?wd=${value}`)
      } else {
        navigate(`https://www.google.com/search?q=${value}`)
      }
      return
    }

    /*if (isBaidu) {
      window.open(`https://www.baidu.com/s?wd=${value}`);
    } else {
      window.open(`https://www.google.com/search?q=${value}`);
    }*/
  }


  const changeCover = async (cover: ICover) => {
    if (cover.type === 'api') {
      const hide = message.loading('获取壁纸中..', 0);
      const response = await axios.get(`https://bird.ioliu.cn/v1/?url=${cover.api}`).finally(() => hide())
      if (response.data && response.data.imgurl) {
        cover.src = response.data.imgurl
        cover.preview = response.data.imgurl
        message.success('切换成功')
      } else {
        message.error('请求异常，请刷新重试');
        return;
      }
    } else {
      setDrawerVisible(false)
    }

    const newCover = {...cover}
    setCover(newCover)
    localStorage.setItem(CURRENT_COVER, JSON.stringify(newCover))
  }


  const toggleSearchAll = (e: any) => {
    localStorage.setItem(SEARCH_ALL_OPEN, JSON.stringify(!searchAll))
    setSearchAll(!searchAll)
    if (searchAll) {
      message.success('已开启万能搜索');
    } else {
      message.success('已关闭万能搜索');
    }
  }


  const toggleGhost = (checked: boolean, e: any) => {
    localStorage.setItem(GHOST_OPEN, JSON.stringify(checked))
    setGhostClose(checked)
  }


  const onClose = (e: any) => {
    setDrawerVisible(false)
  }


  const renderViewByTabKey = template.keyContentMap[tabKey].map((resource: any, index: number) =>
    <a href={resource.link} target="_blank" key={index}>
      <Card.Grid style={gridStyle}>
        <Avatar shape="square" src={resource.icon} />
        <div className="resource-name">{resource.name}</div>
      </Card.Grid>
    </a>
  )

  // 搜索框中的图标
  const drawerTitle = (
    <div className="drawer-title">
      <a href={WEB_HOST} target="_blank">
        <Avatar src={logo} shape="square" style={{ marginRight: 12 }} />
        <span className="site-title">编程导航</span>
      </a>
    </div>
  )

  const DrawerTabPanes = defaultTabPane.map((item: any, index: number) => {
    // @ts-ignore
    return (
      <Tabs.TabPane tab={item.name} key={item.key}>
        <List
          rowKey="id"
          grid={listGrid}
          dataSource={item.list}
          renderItem={(cover: ICover, index) => {
            return (
              <List.Item key={index} style={{marginBottom: 28}}>
                <Card
                  hoverable
                  key={index}
                  cover={<Image alt={cover.name} preview={false} placeholder
                                src={cover.preview} />}
                  bodyStyle={{padding: 12, textAlign: 'center'}}
                  onClick={() => changeCover(cover)}

                >
                  {cover.name}
                </Card>
              </List.Item>
            );
          }}
        />
      </Tabs.TabPane>
    )
  })

  const SearchLogo = () => (
    <div style={{ textAlign: 'center', margin: '104px 0 34px' }}>
      <img src={ isBaidu ?  baidu : google} alt={isBaidu ? 'baidu' : 'google'} className="search-logo"
           onClick={() => setIsBaidu(!isBaidu)}/>
    </div>
  )

  const SearchBox = () => (
    <div className="search-wrapper">
      <Search enterButton={<Button type={ghostClose ? 'primary' : 'ghost'}><SearchOutlined /></Button>} size="large"
              className="search"
              suffix={
                <Tooltip title={`${searchAll ? '关闭' : '开启'}万能搜索`} placement="left">
                  <img className={`search-all-switch${searchAll ? '' : ' close'}`} src={logo} width={28} alt="万能搜索"
                       onClick={toggleSearchAll} />
                </Tooltip>
              }
              onSearch={doSearch} onFocus={() => setMaskOpened(true)}
              onBlur={() => setMaskOpened(false)}
      />
    </div>
  )

  const WebSiteDisplayBox = () => (
    <div className={'card-wrapper' + (maskOpened ? ' hidden' : '')}>
      {
        template.keyList.length > 0 &&
        <Card className="card" bordered={false}>
          {renderViewByTabKey}
        </Card>
      }
    </div>
  )

  const BottomRightButtons = () => (
    <div className="fix-group">
      <Switch
        checkedChildren="白底"
        unCheckedChildren="透明"
        checked={ghostClose}
        onChange={toggleGhost}
      />
      <Tooltip title="切换封面">
        <Button type={ghostClose ? 'primary' : 'ghost'} size="small" shape="round" icon={<PictureOutlined />}
                style={{marginLeft: 8}}
                onClick={() => setDrawerVisible(true)} />
      </Tooltip>
      <Tooltip title="项目详情">
        <Button type={ghostClose ? 'primary' : 'ghost'} size="small" shape="round" icon={<GithubOutlined />}
                style={{marginLeft: 8}}
                onClick={() => window.open(PROJECT_GITHUB)} />
      </Tooltip>
    </div>
  )

  const ToggleBackgroundPage = () => (
    <Drawer
      title={drawerTitle}
      placement="top"
      closable={true}
      height={document.body.clientHeight}
      headerStyle={{padding: 16, background: 'rgba(0, 0, 0, 0.5)'}}
      bodyStyle={{background: '#f5f5f5'}}
      visible={drawerVisible}
      onClose={onClose}
    >
      <div className="drawer-wrapper">
        <Tabs defaultActiveKey="1" type="card" centered>
          {DrawerTabPanes}
        </Tabs>
      </div>
    </Drawer>
  )

  const Background = () => (
    <div>
      <div className={'mask' + (maskOpened ? '' : ' hidden')} />
      {
        cover.type === 'iframe' ?
          <iframe className="bg" title="myIframe" src={cover.src} marginWidth={0} marginHeight={0} /> :
          <img className="bg" src={cover.src} alt="bg" />
      }
    </div>
  )



  return (
    <div className={`index ${ghostClose ? '' : 'ghost'}`}>
      {/*图片logo*/}
      <SearchLogo />
      {/*搜索框*/}
      <SearchBox />
      {/* 网页展示框 */}
      <WebSiteDisplayBox />
      {/* 右下侧按钮 */}
      <BottomRightButtons />
      {/*切换背景的页面*/}
      <ToggleBackgroundPage />
      {/*背景图片*/}
      <Background />
    </div>
  )
}

