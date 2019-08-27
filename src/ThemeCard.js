import React, { Component } from 'react';
import { Card, Col, Row } from 'antd';
const { Meta } = Card;

class ThemeCard extends Component {
    render() {
        const theme = this.props.theme;

        return (
            <Card bordered={false} cover={
                <Row type="flex" justify="center">
                    {
                        theme.swatches.map(swatch => {
                            return (
                                <Col span={4} style={{height:'60px', backgroundColor:`#${swatch.hex}`}}></Col>
                            );
                        })
                    }
                </Row>
            }>
                <Meta title={theme.name} description={theme.author.name} />
            </Card>
        );
    }
}

export default ThemeCard;
