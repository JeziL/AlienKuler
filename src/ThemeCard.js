import React, { Component } from 'react';
import { Card, Icon, Rate, Row, Col, Statistic } from 'antd';
const { Meta } = Card;

class ThemeCard extends Component {
  render() {
    const theme = this.props.theme;

    return (
      <Card bordered={false} cover={
        <div className='Palette'>
          {
            theme.swatches.map(swatch => {
              return (
                <div className='Color' style={{ backgroundColor: `#${swatch.hex}` }}><br /></div>
              );
            })
          }
        </div>
      }
        actions={[
          <Icon type="vertical-right" key="left" />,
          <Icon type="vertical-left" key="right" />,
          <Icon type="heart" key="heart" />
        ]}>
        <Meta title={theme.name} description={
          <div>
            <p>{theme.author.name}</p>
            <Rate disabled defaultValue={theme.rating.overall} />
            <span className="ant-rate-text">{`(${theme.rating.count})`}</span>
            <Row style={{marginTop: '10px'}}>
              <Col span={12}>
                <Statistic title="" value={theme.like.count} prefix={<Icon type="like" />}
                  valueStyle={{color: 'rgba(0, 0, 0, 0.45)', fontSize: '16px'}} />
              </Col>
              <Col span={12}>
                <Statistic title="" value={theme.view.count} prefix={<Icon type="eye" />}
                  valueStyle={{color: 'rgba(0, 0, 0, 0.45)', fontSize: '16px'}} />
              </Col>
            </Row>
          </div>
        } />
      </Card>
    );
  }
}

export default ThemeCard;
