import React, {useState} from 'react';
import {Avatar, Col, Layout, Menu, Row} from "antd";
import Search from "antd/es/input/Search";
import {Header} from "antd/es/layout/layout";
import {useLocation} from "@reach/router";
import {parse} from "query-string";
import {createFromIconfontCN} from '@ant-design/icons';
import logo from '../../assets/logo.png';
import {WEB_HOST} from "../../constant";


const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2316101_26mu1eoa684h.js',
})


export default () => {
  const location = useLocation()
  const searchParams = parse(location.search)
  // 使用的搜索引擎 ???
  const [ current, setCurrent ] = useState('baidu')
  // 搜索时输入的文字
  const [ searchText, setSearchText ] = useState(searchParams['q'])

  const handleClick = (e: any) => {
    setCurrent(e.key)
  }

  const toNav = () => {
    window.open(WEB_HOST)
  }

  return (
    <div>
      <Layout>
        <Header style={{ zIndex: 10 }}>
          <Row align="middle" justify="center">
            <Col xl={1} lg={2} md={2} sm={3} xs={4}>
              <div onClick={toNav} style={{ cursor: 'pointer' }}><Avatar shape="square" src={logo} /></div>
            </Col>
            <Col xl={7} lg={8} md={10} sm={11} xs={20}>
              <Search
                enterButton
                style={{ display: 'block' }}
                size="large"
                defaultValue={searchText}
                onSearch={ value => setSearchText(value) }/>

            </Col>
            <Col xl={16} lg={14} md={12} sm={10} xs={24}>
              <Menu theme="dark" mode="horizontal" onClick={handleClick}
                    selectedKeys={[current]} style={{ float: 'right' }} >
                <Menu.Item key="baidu"><IconFont type="icon-baidu" /></Menu.Item>
                <Menu.Item key="bing"><IconFont type="icon-bing" /></Menu.Item>
                <Menu.Item key="bilibili"><IconFont type="icon-bilibili-line" /></Menu.Item>
                <Menu.Item key="code" onClick={toNav}><IconFont type="" /></Menu.Item>
              </Menu>
            </Col>
          </Row>
        </Header>
        {
          current === "baidu" &&
          <iframe src={`https://www.baidu.com/s?wd=${searchText}`}
                  style={{border: "none", width: '100%', height: '100vh', position: 'fixed', top: -32, zIndex: 1}} />
        }
        {
          current === "bing" &&
          <iframe src={`https://cn.bing.com/search?q=${searchText}`}
                  style={{border: "none", width: '100%', height: '100vh', position: 'fixed', top: -32, zIndex: 1}} />
        }
        {
          current === "bilibili" &&
          <iframe src={`https://search.bilibili.com/all?keyword=${searchText}`}
                  style={{border: "none", width: '100%', height: '100vh', position: 'fixed', top: -32, zIndex: 1}} />
        }
      </Layout>
    </div>
  )
}
