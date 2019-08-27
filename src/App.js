import React, { Component } from 'react';
import { Input, Pagination, Modal } from 'antd';
import CardMatrix from './CardMatrix';
import './App.css';
const { Search } = Input;

class App extends Component {
  state = { term: "", themes: [], page: 1, total: 0 };

  componentDidMount() {
    // const theme = { "author": { "id": "6760498", "guid": "1DF985A254B8EF9F0A4C98A4@AdobeID", "name": "sipelgadsipelgad" }, "comment": { "count": 0 }, "createdAt": "2015-09-08T00:36:03+00:00", "tags": [], "description": "", "harmony": { "baseSwatchIndex": 2, "rule": "triad", "sourceURL": "", "mood": "custom" }, "href": "https://color.adobe.com/Cyber-Prism-1-color-theme-6827238/", "originalTheme": "0", "access": { "visibility": "public", "rights": "read" }, "like": { "count": 0 }, "view": { "count": 1 }, "rating": { "count": 0, "overall": 0 }, "iccProfile": "", "swatches": [{ "name": "", "mode": "rgb", "values": [0.698039, 0.377585, 0.543313], "hex": "B2608B", "colorIndex": 1190 }, { "name": "", "mode": "rgb", "values": [1, 0.911561, 0.248655], "hex": "FFE83F", "colorIndex": 1380 }, { "name": "", "mode": "rgb", "values": [1, 0.34902, 0.685684], "hex": "FF59AF", "colorIndex": 1301 }, { "name": "", "mode": "rgb", "values": [0.2, 0.731737, 0.8], "hex": "33BBCC", "colorIndex": 965 }, { "name": "", "mode": "rgb", "values": [0.0431373, 0.623529, 0.698039], "hex": "0B9FB2", "colorIndex": 965 }], "name": "Cyber Prism 1", "id": "6827238", "editedAt": "2015-09-08T00:36:03+00:00" };
    // this.setState({ themes: Repeat(theme, 20) });
  }

  search = (term, page, limit) => {
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
        <CardMatrix themes={this.state.themes} />
        <div className='Pagination'>
          <Pagination showQuickJumper defaultCurrent={1} defaultPageSize={20} total={this.state.total} onChange={this.onPageChange} />
        </div>
      </div>
    );
  }
}

export default App;
