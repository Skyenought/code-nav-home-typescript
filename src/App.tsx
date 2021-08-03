import React, {FC, ReactElement} from "react";
import {Spin} from 'antd'
import {Root, Routes} from "react-static";
import {Router} from 'components/Router'
import 'antd/dist/antd.min.css'
import './app.css'
/**
 * @Description
 * @Author: Leejiyun
 * @Date: 2021/8/2
 */


const App: FC = (): ReactElement => {
  const fallbackView = <div className="center-container"><Spin size="large" /></div>
  return (
    <Root>
      <React.Suspense fallback={fallbackView}>
        <Router>
          <Routes path="*" />
        </Router>
      </React.Suspense>
    </Root>
  )
}


export default App
