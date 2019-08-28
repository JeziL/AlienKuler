import React, { Component } from 'react';
import { Col, Row, Spin } from 'antd';
import ThemeCard from './ThemeCard';

class CardMatrix extends Component {
  // componentWillReceiveProps(nextProps) {
  //   this.setState({ favFlags: nextProps.favFlags });
  // }

  render() {
    return (
      <Spin spinning={this.props.loading}>
        <div className="CardMatrix">
          <Row gutter={16}>
            {
              this.props.themes.map((theme, i) => {
                return (
                  <Col key={theme.id} span={6} style={{ marginBottom:'25px' }}>
                    <ThemeCard theme={theme} heart={this.props.favFlags[i]} />
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
