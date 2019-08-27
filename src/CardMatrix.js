import React, { Component } from 'react';
import { Col, Row, Pagination } from 'antd';
import ThemeCard from './ThemeCard';
import { Repeat } from 'immutable';

class CardMatrix extends Component {
  state = { themes: [], page: 1, total: 300 };

  componentDidMount() {
    // TODO: HTTP Get.
    const theme = { "author": { "id": "6760498", "guid": "1DF985A254B8EF9F0A4C98A4@AdobeID", "name": "sipelgadsipelgad" }, "comment": { "count": 0 }, "createdAt": "2015-09-08T00:36:03+00:00", "tags": [], "description": "", "harmony": { "baseSwatchIndex": 2, "rule": "triad", "sourceURL": "", "mood": "custom" }, "href": "https://color.adobe.com/Cyber-Prism-1-color-theme-6827238/", "originalTheme": "0", "access": { "visibility": "public", "rights": "read" }, "like": { "count": 0 }, "view": { "count": 1 }, "rating": { "count": 0, "overall": 0 }, "iccProfile": "", "swatches": [{ "name": "", "mode": "rgb", "values": [0.698039, 0.377585, 0.543313], "hex": "B2608B", "colorIndex": 1190 }, { "name": "", "mode": "rgb", "values": [1, 0.911561, 0.248655], "hex": "FFE83F", "colorIndex": 1380 }, { "name": "", "mode": "rgb", "values": [1, 0.34902, 0.685684], "hex": "FF59AF", "colorIndex": 1301 }, { "name": "", "mode": "rgb", "values": [0.2, 0.731737, 0.8], "hex": "33BBCC", "colorIndex": 965 }, { "name": "", "mode": "rgb", "values": [0.0431373, 0.623529, 0.698039], "hex": "0B9FB2", "colorIndex": 965 }], "name": "Cyber Prism 1", "id": "6827238", "editedAt": "2015-09-08T00:36:03+00:00" };
    this.setState({ themes: Repeat(theme, 20) });
  }

  onPageChange = page => {
    this.setState({ page: page });
    // TODO: Fetch Data.
  };

  render() {
    return (
      <div className="CardMatrix">
        <Row gutter={16}>
          {
            this.state.themes.map(theme => {
              return (
                <Col span={6} style={{ marginBottom:'25px' }}>
                  <ThemeCard theme={theme} />
                </Col>
              );
            })
          }
        </Row>
        <div className="Pagination">
          <Pagination showQuickJumper defaultCurrent={1} defaultPageSize={20} total={this.state.total} onChange={this.onPageChange} />
        </div>
      </div>
    );
  }
}

export default CardMatrix;
