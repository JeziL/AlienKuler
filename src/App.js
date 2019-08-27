import React, { Component } from 'react';
import { Input } from 'antd';
import './App.css';
const { Search } = Input;

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Search">
          <Search placeholder="使用颜色、情境或关键字搜索，例如海洋、葡萄酒、月光、幸运、水..." onSearch={value => console.log(value)} enterButton />
        </div>
      </div>
    );
  }
}

export default App;
