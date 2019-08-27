import React, { Component } from 'react';
import { Card, Col, Row } from 'antd';
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
      }>
        <Meta title={theme.name} description={theme.author.name} />
      </Card>
    );
  }
}

export default ThemeCard;
