import React, { Component } from 'react';
import { Card, Icon, Rate, Row, Col, Statistic, message } from 'antd';
const { Meta } = Card;
const ipcRenderer = window.ipcRenderer;

class ThemeCard extends Component {
  state = { heart: false };

  componentDidMount() {
    this.setState({ heart: this.props.heart });

    message.config({
      duration: 2,
      maxCount: 1
    });
  }

  onActionClick = (theme, action) => {
    if (action === 'left' || action === 'right') {
      ipcRenderer.send('LFX_SETLIGHT', { align: action, theme: theme });
      ipcRenderer.on('LFX_SETLIGHT_RESULT', (_, arg) => {
        if (arg === 0) {
          message.success('设置成功');
        } else {
          message.error(`设置失败：${arg}`);
        }
      });
    } else if (action === 'heart') {
      const result = ipcRenderer.sendSync('APP_HEART', {
        theme: theme,
        action: this.state.heart ? 'unheart' : 'heart'
      });
      if (result === 0) {
        this.setState({ heart: !this.state.heart });
      } else {
        message.error('收藏失败');
      }
    }
  }

  render() {
    const theme = this.props.theme;

    return (
      <Card bordered={false} cover={
        <div className='Palette'>
          {
            theme.swatches.map((swatch, i) => {
              return (
                <div className='Color' key={`${theme.id}-${i}`} style={{ backgroundColor: `#${swatch.hex}` }}><br /></div>
              );
            })
          }
        </div>
      }
        actions={[
          <Icon type="vertical-right" key="left" onClick={() => this.onActionClick(theme, 'left')} />,
          <Icon type="vertical-left" key="right" onClick={() => this.onActionClick(theme, 'right')} />,
          <Icon type="heart" key="heart"
            onClick={() => this.onActionClick(theme, 'heart')}
            theme={(this.state.heart) ? "twoTone" : "outlined"} twoToneColor="#eb2f96"
          />
        ]}>
        <Meta title={theme.name} description={
          <div>
            <p className="Author">{theme.author.name}</p>
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
