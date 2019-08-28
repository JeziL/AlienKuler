import React, { Component } from 'react';
import { Input, Pagination, Modal, Select, Col, Row, Button, Icon } from 'antd';
import CardMatrix from './CardMatrix';
import './App.css';
const ipcRenderer = window.ipcRenderer;
const { Search } = Input;
const { Option } = Select;

class App extends Component {
  state = {
    term: "",
    themes: [],
    page: 1,
    limit: 20,
    total: 0,
    loading: false,
    favFlags: [],
    sort: 'like_count',
    time: 'all',
    status: 'index',
    lastState: {}
  };

  componentDidMount() {
    this.searchInput.focus();
    this.fetchThemes();
  }

  fetchFavFlags = themes => {
    return ipcRenderer.sendSync('APP_FAVFLAGS', themes);
  };

  fetchThemes = () => {
    this.setState({ loading: true });
    let url;
    if (this.state.status === 'search') {
      url = `https://kuler.adobe.com/api/v2/search?q={"term":"${this.state.term}"}&startIndex=${(this.state.page - 1) * this.state.limit}&maxNumber=${this.state.limit}`;
    } else if (this.state.status === 'index') {
      url = `https://kuler.adobe.com/api/v2/themes?filter=public&sort=${this.state.sort}&time=${this.state.time}&startIndex=${(this.state.page - 1) * this.state.limit}&maxNumber=${this.state.limit}`;
    } else if (this.state.status === 'heart') {
      const { themes, total } = ipcRenderer.sendSync('APP_GETFAVS', { page: this.state.page, limit: this.state.limit });
      this.setState({ themes: themes, total: total, favFlags: new Array(themes.length).fill(true) });
      this.setState({ loading: false });
      return;
    }
    fetch(url, {
      headers: {
        'x-api-key': '7810788A1CFDC3A717C58F96BC4DD8B4',
      }
    }).then(response => response.json())
      .then(json => {
        if (json.code) {
          Modal.error({
            title: json.code,
            content: json.message
          });
        } else {
          const flags = this.fetchFavFlags(json.themes);
          this.setState({ themes: json.themes, total: json.totalCount, favFlags: flags });
        }
        this.setState({ loading: false });
      });
  };

  onSearch = term => {
    this.setState({ term: term, status: 'search', page: 1, lastState: {} }, () => this.fetchThemes());
  }

  onPageChange = page => {
    this.setState({ page: page }, () => this.fetchThemes());
  };

  onSortChange = value => {
    this.setState({ sort: value, status: 'index', page: 1, lastState: {} }, () => this.fetchThemes());
  };

  onTimeChange = value => {
    this.setState({ time: value, status: 'index', page: 1, lastState: {} }, () => this.fetchThemes());
  };

  onHeartToggle = () => {
    if (this.state.status !== 'heart') {
      this.setState({ lastState: this.state, status: 'heart', page: 1 }, () => this.fetchThemes());
    } else {
      this.setState(this.state.lastState, () => {
        this.setState({ lastState: {} });
      });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="Search">
          <Row gutter={8}>
            <Col span={17}>
              <Search
                ref={input => this.searchInput = input}
                placeholder="使用颜色、情境或关键字搜索，例如海洋、葡萄酒、月光、幸运、水..."
                onChange={term => this.setState({ term: term.target.value })} allowClear
                onSearch={this.onSearch} enterButton
              />
            </Col>
            <Col span={3}>
              <Select defaultValue="like_count" style={{ width: 100 }}
                onChange={this.onSortChange} disabled={this.state.term.length > 0}
              >
                <Option value="like_count">最受欢迎</Option>
                <Option value="create_time">最新创建</Option>
                <Option value="view_count">最多查看</Option>
                <Option value="random">随机</Option>
              </Select>
            </Col>
            <Col span={3}>
              <Select defaultValue="all" style={{ width: 100 }}
                onChange={this.onTimeChange} disabled={this.state.term.length > 0}
              >
                <Option value="all">所有时间</Option>
                <Option value="month">本月</Option>
                <Option value="week">本周</Option>
              </Select>
            </Col>
            <Col span={1}>
              <Button shape="round" onClick={this.onHeartToggle}>
                <Icon type="heart" theme={(this.state.status === 'heart') ? "twoTone" : "outlined" } twoToneColor="#eb2f96" />
              </Button>
            </Col>
          </Row>
        </div>
        <CardMatrix themes={this.state.themes} loading={this.state.loading} favFlags={this.state.favFlags} />
        <div className='Pagination'>
          <Pagination showQuickJumper current={this.state.page} defaultPageSize={20} total={this.state.total} onChange={this.onPageChange}
          />
        </div>
      </div>
    );
  }
}

export default App;
