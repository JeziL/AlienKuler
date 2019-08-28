import React from 'react';
import ReactDOM from 'react-dom';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import './index.css';
import App from './App';

ReactDOM.render(<ConfigProvider locale={ zhCN }><App /></ConfigProvider>, document.getElementById('root'));
