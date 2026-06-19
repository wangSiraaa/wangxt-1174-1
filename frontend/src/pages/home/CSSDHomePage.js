import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';

const { NCTabs, NCTabPane } = base;

class CSSDHomePage extends Component {
    state = {
        activeKey: 'operation'
    };

    render() {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    padding: '16px 24px',
                    background: 'linear-gradient(90deg, #1890ff 0%, #096dd9 100%)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                    <h1 style={{ margin: 0, fontSize: '20px' }}>医院消毒供应中心 - 器械包追踪系统</h1>
                    <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '13px' }}>
                        Central Sterile Supply Department - Instrument Package Tracking
                    </p>
                </div>

                <div style={{ flex: 1, overflow: 'auto' }}>
                    <NCTabs activeKey={this.state.activeKey} onChange={(k) => this.setState({ activeKey: k })}>
                        <NCTabPane tab={<span>🏥 手术室（提交需求）</span>} key="operation">
                            <iframe
                                src="./operation.html"
                                style={{ width: '100%', height: 'calc(100vh - 140px)', border: 'none' }}
                                title="手术室"
                            />
                        </NCTabPane>
                        <NCTabPane tab={<span>🧹 消毒员（清洗灭菌）</span>} key="disinfector">
                            <iframe
                                src="./disinfector.html"
                                style={{ width: '100%', height: 'calc(100vh - 140px)', border: 'none' }}
                                title="消毒员"
                            />
                        </NCTabPane>
                        <NCTabPane tab={<span>✅ 质控护士（放行确认）</span>} key="quality">
                            <iframe
                                src="./quality.html"
                                style={{ width: '100%', height: 'calc(100vh - 140px)', border: 'none' }}
                                title="质控护士"
                            />
                        </NCTabPane>
                    </NCTabs>
                </div>
            </div>
        );
    }
}

export default createPage({})(CSSDHomePage);
