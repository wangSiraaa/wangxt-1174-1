import React, { Component } from 'react';
import { Table, Button, Modal, Input, Tabs, Space, message, Tag, Alert } from 'antd';
import { ajax, STATUS_MAP, LACK_STATUS_MAP } from '../../mock/api';

const STATUS_COLORS = { 0: 'default', 1: 'processing', 2: 'processing', 3: 'warning', 4: 'warning', 5: 'success', 6: 'blue', 7: 'error', 9: 'error' };
const LACK_COLORS = { 0: 'warning', 1: 'processing', 2: 'success' };

class QualityNursePage extends Component {
    state = {
        listData: [], lackList: [], releaseList: [],
        showDetailModal: false, currentPkg: null, unpassReason: '',
        activeTab: 'release'
    };

    componentDidMount() { this.loadReleaseList(); this.loadLackList(); }

    loadReleaseList = () => {
        ajax({ url: '/nccloud/cssd.instrument.queryList.do', data: {}, success: (res) => {
            if (res.success) this.setState({ listData: res.data.filter(r => [4, 5, 6, 7, 9].includes(r.package_status)) });
        }});
    };
    loadLackList = () => {
        ajax({ url: '/nccloud/cssd.lackrecord.queryList.do', data: {}, success: (res) => { if (res.success) this.setState({ lackList: res.data }); } });
    };
    loadReleaseRecords = () => {
        ajax({ url: '/nccloud/cssd.releaserecord.queryList.do', data: {}, success: (res) => { if (res.success) this.setState({ releaseList: res.data }); } });
    };

    handleConfirmRelease = (pkg) => {
        if (pkg.is_sent === 1) { message.error('已发往手术室的器械包不能修改灭菌批号和放行状态'); return; }
        if (pkg.lack_flag === 1) { message.error('该器械包存在缺件，请先处理缺件后再放行'); return; }
        this.setState({ showDetailModal: true, currentPkg: pkg, unpassReason: '' });
    };

    handleReleasePass = () => {
        const { currentPkg } = this.state;
        ajax({ url: '/nccloud/cssd.instrument.confirmRelease.do', data: { pkInstrpkg: currentPkg.pk_instrpkg, releaseResult: 1 }, success: (res) => {
            if (res.success) { message.success('放行通过'); this.setState({ showDetailModal: false, currentPkg: null }); this.loadReleaseList(); this.loadReleaseRecords(); }
            else { message.error(res.error?.message || '操作失败'); }
        }});
    };

    handleReleaseUnpass = () => {
        const { currentPkg, unpassReason } = this.state;
        if (!unpassReason || !unpassReason.trim()) { message.warning('请输入不通过原因'); return; }
        ajax({ url: '/nccloud/cssd.instrument.confirmRelease.do', data: { pkInstrpkg: currentPkg.pk_instrpkg, releaseResult: 0, unpassReason }, success: (res) => {
            if (res.success) { message.success('已退回重配'); this.setState({ showDetailModal: false, currentPkg: null, unpassReason: '' }); this.loadReleaseList(); this.loadReleaseRecords(); }
            else { message.error(res.error?.message || '操作失败'); }
        }});
    };

    handleResolveLack = (pkLackrecord) => {
        const result = window.prompt('请输入处理结果：');
        if (result !== null && result.trim() !== '') {
            ajax({ url: '/nccloud/cssd.instrument.resolveLack.do', data: { pkLackrecord, handleResult: result }, success: (res) => {
                if (res.success) { message.success('缺件已处理'); this.loadLackList(); this.loadReleaseList(); }
                else { message.error(res.error?.message || '操作失败'); }
            }});
        }
    };

    releaseColumns = [
        { title: '包号', dataIndex: 'package_code', width: 130 },
        { title: '包名称', dataIndex: 'package_name', width: 150 },
        { title: '手术室', dataIndex: 'operation_room', width: 100 },
        { title: '灭菌批次号', dataIndex: 'sterilization_batchno', width: 140 },
        { title: '状态', dataIndex: 'package_status', width: 110, render: (v) => <Tag color={STATUS_COLORS[v]}>{STATUS_MAP[v]}</Tag> },
        { title: '缺件', dataIndex: 'lack_flag', width: 60, render: (v) => v === 1 ? <Tag color="warning">是</Tag> : '否' },
        { title: '已发出', dataIndex: 'is_sent', width: 70, render: (v) => v === 1 ? <Tag color="blue">是</Tag> : '否' },
        { title: '放行时间', dataIndex: 'release_time', width: 160 },
        {
            title: '操作', key: 'action', width: 120,
            render: (_, record) => record.package_status === 4 ? <Button type="primary" size="small" onClick={() => this.handleConfirmRelease(record)}>放行检查</Button> : null
        }
    ];

    lackColumns = [
        { title: '器械包号', dataIndex: 'package_code', width: 130 },
        { title: '器械编码', dataIndex: 'instrument_code', width: 100 },
        { title: '器械名称', dataIndex: 'instrument_name', width: 120 },
        { title: '缺失数量', dataIndex: 'lack_qty', width: 80 },
        { title: '处理状态', dataIndex: 'handle_status', width: 100, render: (v) => <Tag color={LACK_COLORS[v]}>{LACK_STATUS_MAP[v]}</Tag> },
        { title: '处理人', dataIndex: 'pk_handler', width: 100 },
        { title: '处理时间', dataIndex: 'handle_time', width: 160 },
        { title: '处理结果', dataIndex: 'handle_result', ellipsis: true },
        {
            title: '操作', key: 'action', width: 100,
            render: (_, record) => record.handle_status !== 2 ? <Button type="primary" size="small" onClick={() => this.handleResolveLack(record.pk_lackrecord)}>处理缺件</Button> : null
        }
    ];

    recordColumns = [
        { title: '器械包号', dataIndex: 'package_code', width: 130 },
        { title: '灭菌批次号', dataIndex: 'sterilization_batchno', width: 140 },
        { title: '放行结果', dataIndex: 'release_result', width: 100, render: (v) => <Tag color={v === 1 ? 'success' : 'error'}>{v === 1 ? '放行通过' : '未通过'}</Tag> },
        { title: '质控护士', dataIndex: 'pk_qualitynurse', width: 120 },
        { title: '放行时间', dataIndex: 'release_time', width: 160 },
        { title: '未通过原因', dataIndex: 'unpass_reason', ellipsis: true },
    ];

    tabItems = [
        { key: 'release', label: '待放行器械包', children: null },
        { key: 'lack', label: '缺件记录', children: null },
        { key: 'record', label: '放行记录', children: null }
    ];

    render() {
        const { listData, lackList, releaseList, showDetailModal, currentPkg, unpassReason, activeTab } = this.state;

        const tabContent = {
            release: <Table dataSource={listData} columns={this.releaseColumns} rowKey="pk_instrpkg" bordered size="small" pagination={{ pageSize: 10 }} childrenColumnName="__no_tree__" />,
            lack: <Table dataSource={lackList} columns={this.lackColumns} rowKey="pk_lackrecord" bordered size="small" pagination={{ pageSize: 10 }} />,
            record: <Table dataSource={releaseList} columns={this.recordColumns} rowKey="pk_releaserecord" bordered size="small" pagination={{ pageSize: 10 }} />
        };

        const items = this.tabItems.map(t => ({ ...t, children: tabContent[t.key] }));

        return (
            <div className="cssd-page-container">
                <h2 style={{ marginBottom: 16 }}>质控护士 — 器械包放行管理</h2>

                <Tabs items={items} activeKey={activeTab} onChange={(k) => { this.setState({ activeTab: k }); if (k === 'lack') this.loadLackList(); if (k === 'record') this.loadReleaseRecords(); }} />

                <Modal title={<>放行检查 — {currentPkg?.package_code}</>} open={showDetailModal} onCancel={() => this.setState({ showDetailModal: false })} width={720}
                    footer={[
                        <Button key="close" onClick={() => this.setState({ showDetailModal: false })}>关闭</Button>,
                        <Button key="unpass" danger onClick={this.handleReleaseUnpass}>不通过（退回重配）</Button>,
                        <Button key="pass" type="primary" style={{ background: '#52c41a' }} onClick={this.handleReleasePass}>放行通过</Button>
                    ]}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        <div><strong>包名称：</strong>{currentPkg?.package_name}</div>
                        <div><strong>手术室：</strong>{currentPkg?.operation_room}</div>
                        <div><strong>灭菌批次号：</strong>{currentPkg?.sterilization_batchno || '—'}</div>
                        <div><strong>状态：</strong><Tag color={STATUS_COLORS[currentPkg?.package_status]}>{STATUS_MAP[currentPkg?.package_status]}</Tag></div>
                    </div>

                    <h4 style={{ marginBottom: 8 }}>器械明细：</h4>
                    <Table dataSource={currentPkg?._details?.cssd_instritem || []} bordered size="small" pagination={false} rowKey="pk_instritem"
                        columns={[
                            { title: '器械编码', dataIndex: 'instrument_code', width: 100 },
                            { title: '器械名称', dataIndex: 'instrument_name', width: 120 },
                            { title: '规格型号', dataIndex: 'instrument_spec', width: 100 },
                            { title: '计划数量', dataIndex: 'plan_qty', width: 80 },
                            { title: '实配数量', dataIndex: 'actual_qty', width: 80 },
                            { title: '缺件', dataIndex: 'lack_flag', width: 60, render: (v) => v === 1 ? <Tag color="error">是</Tag> : '否' }
                        ]}
                    />

                    {currentPkg?.package_status === 4 && (
                        <div style={{ marginTop: 16 }}>
                            <label>不通过原因（选择不通过时必填）：</label>
                            <Input.TextArea value={unpassReason} onChange={e => this.setState({ unpassReason: e.target.value })} rows={2} placeholder="请输入不通过原因" />
                        </div>
                    )}

                    {currentPkg?.is_sent === 1 && (
                        <Alert style={{ marginTop: 16 }} type="warning" showIcon message="该器械包已发往手术室，灭菌批号和放行状态不可修改" />
                    )}
                </Modal>
            </div>
        );
    }
}

export default QualityNursePage;
