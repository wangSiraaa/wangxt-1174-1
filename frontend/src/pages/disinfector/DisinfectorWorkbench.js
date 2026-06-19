import React, { Component } from 'react';
import { Table, Button, Modal, Input, Select, Space, message, Tag, Popconfirm } from 'antd';
import { ajax, STATUS_MAP, BATCH_STATUS_MAP, STER_RESULT_MAP } from '../../mock/api';

const STATUS_COLORS = { 0: 'default', 1: 'processing', 2: 'processing', 3: 'warning', 4: 'warning', 5: 'success', 6: 'blue', 7: 'error', 9: 'error' };

class DisinfectorWorkbench extends Component {
    state = {
        listData: [], showBatchModal: false, showLackModal: false,
        selectedPks: [], batchForm: { batch_no: '', sterilizer_code: '', sterilizer_name: '', sterilize_type: 1 },
        currentPkg: null, selectedItemPks: [],
        showFinishModal: false, finishBatch: null, finishResult: 1, finishReason: '',
        batchList: []
    };

    componentDidMount() { this.loadList(); this.loadBatchList(); }

    loadList = () => {
        ajax({ url: '/nccloud/cssd.instrument.queryList.do', data: {}, success: (res) => { if (res.success) this.setState({ listData: res.data }); } });
    };
    loadBatchList = () => {
        ajax({ url: '/nccloud/cssd.sterbatch.queryList.do', data: {}, success: (res) => { if (res.success) this.setState({ batchList: res.data }); } });
    };

    handleRegisterCleaning = (pk) => {
        ajax({ url: '/nccloud/cssd.instrument.registerCleaning.do', data: { pkInstrpkg: pk }, success: (res) => {
            if (res.success) { message.success('登记清洗成功'); this.loadList(); }
            else { message.error(res.error?.message || '操作失败'); }
        }});
    };

    handleCreateBatch = () => {
        const { selectedPks, listData } = this.state;
        if (selectedPks.length === 0) { message.warning('请先选择要灭菌的器械包'); return; }
        const valid = listData.filter(r => selectedPks.includes(r.pk_instrpkg) && r.package_status === 1);
        if (valid.length === 0) { message.warning('所选器械包中没有"清洗中"状态的，请先登记清洗'); return; }
        this.setState({ showBatchModal: true, selectedPks: valid.map(r => r.pk_instrpkg), batchForm: { batch_no: '', sterilizer_code: '', sterilizer_name: '', sterilize_type: 1 } });
    };

    handleSubmitBatch = () => {
        const { batchForm, selectedPks } = this.state;
        if (!batchForm.batch_no || !batchForm.sterilizer_code) { message.warning('请填写批次号和灭菌器编码'); return; }
        ajax({ url: '/nccloud/cssd.sterbatch.create.do', data: { batchData: JSON.stringify(batchForm), pkInstrpkgs: selectedPks }, success: (res) => {
            if (res.success) { message.success('创建灭菌批次成功'); this.setState({ showBatchModal: false, selectedPks: [] }); this.loadList(); this.loadBatchList(); }
            else { message.error(res.error?.message || '操作失败'); }
        }});
    };

    handleOpenFinish = (record) => {
        this.setState({ showFinishModal: true, finishBatch: record, finishResult: 1, finishReason: '' });
    };

    handleSubmitFinish = () => {
        const { finishBatch, finishResult, finishReason } = this.state;
        if (finishResult === 0 && !finishReason.trim()) { message.warning('请输入失败原因'); return; }
        ajax({ url: '/nccloud/cssd.sterbatch.finish.do', data: { pkSterbatch: finishBatch.pk_sterbatch, sterilizeResult: finishResult, failureReason: finishResult === 0 ? finishReason : null }, success: (res) => {
            if (res.success) { message.success(finishResult === 1 ? '灭菌完成' : '已标记灭菌失败'); this.setState({ showFinishModal: false }); this.loadList(); this.loadBatchList(); }
            else { message.error(res.error?.message || '操作失败'); }
        }});
    };

    handleRegisterLack = (pkg) => {
        this.setState({ showLackModal: true, currentPkg: pkg, selectedItemPks: [] });
    };

    handleLackItemToggle = (itemPk, checked) => {
        this.setState(prev => {
            let sel = [...prev.selectedItemPks];
            if (checked) { if (!sel.includes(itemPk)) sel.push(itemPk); } else { sel = sel.filter(pk => pk !== itemPk); }
            return { selectedItemPks: sel };
        });
    };

    handleSubmitLack = () => {
        const { currentPkg, selectedItemPks } = this.state;
        if (selectedItemPks.length === 0) { message.warning('请选择缺件的器械'); return; }
        ajax({ url: '/nccloud/cssd.instrument.registerLack.do', data: { pkInstrpkg: currentPkg.pk_instrpkg, pkInstritems: selectedItemPks }, success: (res) => {
            if (res.success) { message.success('缺件登记成功'); this.setState({ showLackModal: false, currentPkg: null, selectedItemPks: [] }); this.loadList(); }
            else { message.error(res.error?.message || '操作失败'); }
        }});
    };

    handleSendToOR = (pk) => {
        ajax({ url: '/nccloud/cssd.instrument.sendToOR.do', data: { pkInstrpkg: pk }, success: (res) => {
            if (res.success) { message.success('已发往手术室'); this.loadList(); }
            else { message.error(res.error?.message || '操作失败'); }
        }});
    };

    pkgColumns = [
        { title: '包号', dataIndex: 'package_code', key: 'package_code', width: 140 },
        { title: '包名称', dataIndex: 'package_name', key: 'package_name', width: 150 },
        { title: '手术室', dataIndex: 'operation_room', key: 'operation_room', width: 100 },
        { title: '灭菌批次号', dataIndex: 'sterilization_batchno', key: 'sterilization_batchno', width: 140 },
        { title: '状态', dataIndex: 'package_status', key: 'package_status', width: 110, render: (v) => <Tag color={STATUS_COLORS[v]}>{STATUS_MAP[v]}</Tag> },
        { title: '缺件', dataIndex: 'lack_flag', key: 'lack_flag', width: 60, render: (v) => v === 1 ? <Tag color="warning">是</Tag> : '否' },
        {
            title: '操作', key: 'action', width: 280,
            render: (_, record) => (
                <Space size={4} wrap>
                    {record.package_status === 0 && <Button type="primary" size="small" onClick={() => this.handleRegisterCleaning(record.pk_instrpkg)}>登记清洗</Button>}
                    {record.package_status === 5 && record.is_sent !== 1 && (
                        <Popconfirm title="确认发放到手术室？" description="已发出后将不能修改灭菌批号" onConfirm={() => this.handleSendToOR(record.pk_instrpkg)} okText="确认发放" cancelText="取消">
                            <Button type="primary" size="small" style={{ background: '#52c41a' }}>发放手术室</Button>
                        </Popconfirm>
                    )}
                    {[0, 1, 2, 3, 4].includes(record.package_status) && <Button size="small" onClick={() => this.handleRegisterLack(record)}>登记缺件</Button>}
                </Space>
            )
        }
    ];

    batchColumns = [
        { title: '批次号', dataIndex: 'batch_no', key: 'batch_no', width: 140 },
        { title: '灭菌器', dataIndex: 'sterilizer_name', key: 'sterilizer_name', width: 100 },
        { title: '状态', dataIndex: 'batch_status', key: 'batch_status', width: 90, render: (v) => <Tag color={v === 1 ? 'success' : v === 2 ? 'error' : 'processing'}>{BATCH_STATUS_MAP[v]}</Tag> },
        { title: '结果', dataIndex: 'sterilize_result', key: 'sterilize_result', width: 80, render: (v) => v == null ? '未出结果' : <Tag color={v === 1 ? 'success' : 'error'}>{STER_RESULT_MAP[v]}</Tag> },
        { title: '开始时间', dataIndex: 'start_time', key: 'start_time', width: 160 },
        { title: '结束时间', dataIndex: 'end_time', key: 'end_time', width: 160 },
        { title: '失败原因', dataIndex: 'failure_reason', key: 'failure_reason', ellipsis: true },
        {
            title: '操作', key: 'action', width: 100,
            render: (_, record) => record.batch_status === 0 ? <Button type="primary" size="small" onClick={() => this.handleOpenFinish(record)}>出结果</Button> : null
        }
    ];

    render() {
        const { listData, selectedPks, showBatchModal, batchForm, showLackModal, currentPkg, selectedItemPks, batchList, showFinishModal, finishResult, finishReason } = this.state;

        return (
            <div className="cssd-page-container">
                <div className="cssd-page-header">
                    <h2>消毒员 — 清洗灭菌工作台</h2>
                    <Button type="primary" onClick={this.handleCreateBatch}>创建灭菌批次（已选 {selectedPks.length}）</Button>
                </div>

                <Table dataSource={listData} columns={this.pkgColumns} rowKey="pk_instrpkg" bordered size="small" childrenColumnName="__no_tree__"
                    rowSelection={{ type: 'checkbox', selectedRowKeys: selectedPks, onChange: (keys) => this.setState({ selectedPks: keys }) }}
                    pagination={{ pageSize: 10 }}
                />

                <h3 style={{ marginTop: 24 }}>灭菌批次管理</h3>
                <Table dataSource={batchList} columns={this.batchColumns} rowKey="pk_sterbatch" bordered size="small" pagination={{ pageSize: 5 }} />

                <Modal title="创建灭菌批次" open={showBatchModal} onCancel={() => this.setState({ showBatchModal: false })} onOk={this.handleSubmitBatch} okText="创建批次">
                    <div style={{ marginBottom: 12 }}><label>批次号 *</label><Input value={batchForm.batch_no} onChange={e => this.setState(prev => ({ batchForm: { ...prev.batchForm, batch_no: e.target.value } }))} placeholder="请输入灭菌批次号" /></div>
                    <div style={{ marginBottom: 12 }}><label>灭菌器编码 *</label><Input value={batchForm.sterilizer_code} onChange={e => this.setState(prev => ({ batchForm: { ...prev.batchForm, sterilizer_code: e.target.value } }))} placeholder="请输入灭菌器编码" /></div>
                    <div style={{ marginBottom: 12 }}><label>灭菌器名称</label><Input value={batchForm.sterilizer_name} onChange={e => this.setState(prev => ({ batchForm: { ...prev.batchForm, sterilizer_name: e.target.value } }))} placeholder="请输入灭菌器名称" /></div>
                    <div style={{ marginBottom: 12 }}><label>灭菌方式</label>
                        <Select value={batchForm.sterilize_type} onChange={v => this.setState(prev => ({ batchForm: { ...prev.batchForm, sterilize_type: v } }))}>
                            <Select.Option value={1}>压力蒸汽灭菌</Select.Option><Select.Option value={2}>环氧乙烷灭菌</Select.Option><Select.Option value={3}>等离子灭菌</Select.Option>
                        </Select>
                    </div>
                    <div style={{ color: '#888' }}>已选择 {selectedPks.length} 个器械包</div>
                </Modal>

                <Modal title="登记缺件" open={showLackModal} onCancel={() => this.setState({ showLackModal: false })} onOk={this.handleSubmitLack} okText="确认缺件">
                    <p style={{ color: '#666', marginBottom: 12 }}>请勾选缺失的器械（包号：{currentPkg?.package_code}）：</p>
                    <Table dataSource={currentPkg?._details?.cssd_instritem || []} bordered size="small" pagination={false} rowKey="pk_instritem"
                        rowSelection={{ type: 'checkbox', selectedRowKeys: selectedItemPks, onChange: (keys) => this.setState({ selectedItemPks: keys }) }}
                        columns={[
                            { title: '器械编码', dataIndex: 'instrument_code' }, { title: '器械名称', dataIndex: 'instrument_name' },
                            { title: '规格型号', dataIndex: 'instrument_spec' }, { title: '计划数量', dataIndex: 'plan_qty', width: 80 }, { title: '实配数量', dataIndex: 'actual_qty', width: 80 }
                        ]}
                    />
                </Modal>

                <Modal title="录入灭菌结果" open={showFinishModal} onCancel={() => this.setState({ showFinishModal: false })} onOk={this.handleSubmitFinish} okText="确认提交">
                    <div style={{ marginBottom: 12 }}>
                        <label>灭菌结果：</label>
                        <Select value={finishResult} onChange={v => this.setState({ finishResult: v })} style={{ width: 160 }}>
                            <Select.Option value={1}>✅ 合格</Select.Option><Select.Option value={0}>❌ 不合格</Select.Option>
                        </Select>
                    </div>
                    {finishResult === 0 && (
                        <div><label>失败原因：</label><Input.TextArea value={finishReason} onChange={e => this.setState({ finishReason: e.target.value })} rows={3} placeholder="请输入失败原因" /></div>
                    )}
                </Modal>
            </div>
        );
    }
}

export default DisinfectorWorkbench;
