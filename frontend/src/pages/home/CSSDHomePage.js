import React, { Component } from 'react';
import { ConfigProvider, Tabs, Button, Space, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import OperationRequirementPage from '../operation/OperationRequirementPage';
import DisinfectorWorkbench from '../disinfector/DisinfectorWorkbench';
import QualityNursePage from '../quality/QualityNursePage';
import { resetMockData } from '../../mock/api';

const { Title, Text } = Typography;

class CSSDHomePage extends Component {
    state = { activeKey: 'operation', resetLoading: false };

    handleReset = () => {
        this.setState({ resetLoading: true });
        resetMockData();
        setTimeout(() => {
            this.setState({ resetLoading: false });
            window.location.reload();
        }, 300);
    };

    items = [
        {
            key: 'operation',
            label: '🏥 手术室（提交需求）',
            children: <OperationRequirementPage />
        },
        {
            key: 'disinfector',
            label: '🧹 消毒员（清洗灭菌）',
            children: <DisinfectorWorkbench />
        },
        {
            key: 'quality',
            label: '✅ 质控护士（放行确认）',
            children: <QualityNursePage />
        }
    ];

    render() {
        return (
            <ConfigProvider locale={zhCN}>
                <div style={{ background: 'linear-gradient(90deg, #1890ff 0%, #096dd9 100%)', padding: '16px 24px', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Title level={4} style={{ margin: 0, color: 'white' }}>医院消毒供应中心 — 器械包追踪系统</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>Central Sterile Supply Department · Instrument Package Tracking</Text>
                        </div>
                        <Space>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={this.handleReset}
                                loading={this.state.resetLoading}
                                size="small"
                                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}
                            >
                                重置演示数据
                            </Button>
                        </Space>
                    </div>
                </div>
                <div style={{ padding: '0 16px' }}>
                    <Tabs
                        activeKey={this.state.activeKey}
                        onChange={(k) => this.setState({ activeKey: k })}
                        items={this.items}
                        size="large"
                        style={{ background: 'white', padding: '0 16px', borderRadius: '0 0 8px 8px' }}
                    />
                </div>
            </ConfigProvider>
        );
    }
}

export default CSSDHomePage;
