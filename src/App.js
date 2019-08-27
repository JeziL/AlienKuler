import React, { Component } from 'react';
import { Input, Pagination, Modal } from 'antd';
import CardMatrix from './CardMatrix';
import './App.css';
const { Search } = Input;

class App extends Component {
  state = { term: "", themes: [], page: 1, total: 0, loading: false };

  componentDidMount() {
    //TODO: index
  }

  search = (term, page, limit) => {
    this.setState({ loading: true });
    fetch(`https://kuler.adobe.com/api/v2/search?q=%7B"term"%3A"${term}"%7D&startIndex=${page * limit}&maxNumber=${limit}`, {
      headers: {
        'x-api-key': '7810788A1CFDC3A717C58F96BC4DD8B4',
        'Sec-Fetch-Mode': 'no-cors'
      }
    }).then(response => response.json())
      .then(json => {
        if (json.code) {
          Modal.error({
            title: json.code,
            content: json.message
          });
        } else {
          this.setState({ themes: json.themes, page: page, total: json.totalCount });
        }
        this.setState({ loading: false });
      });
  };

  onSearch = term => {
    this.setState({ term: term });
    this.search(term, 1, 20);
  }

  onPageChange = page => {
    this.setState({ page: page });
    this.search(this.state.term, page, 20);
  };

  render() {
    return (
      <div className="App">
        <div className="Search">
          <Search placeholder="使用颜色、情境或关键字搜索，例如海洋、葡萄酒、月光、幸运、水..." onSearch={this.onSearch} enterButton />
        </div>
        <CardMatrix themes={this.state.themes} loading={this.state.loading} />
        <div className='Pagination'>
          <Pagination showQuickJumper defaultCurrent={1} defaultPageSize={20} total={this.state.total} onChange={this.onPageChange} />
        </div>
      </div>
    );
  }
}

export default App;
