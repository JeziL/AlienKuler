import React, { Component } from 'react';
import { Col, Row, Spin } from 'antd';
import ThemeCard from './ThemeCard';

class CardMatrix extends Component {
  render() {
    return (
      <Spin spinning={this.props.loading}>
        <div className="CardMatrix">
          <Row gutter={16}>
            {
              this.props.themes.map(theme => {
                return (
                  <Col span={6} style={{ marginBottom:'25px' }}>
                    <ThemeCard theme={theme} />
                  </Col>
                );
              })
            }
          </Row>
        </div>
      </Spin>
    );
  }
}

export default CardMatrix;
