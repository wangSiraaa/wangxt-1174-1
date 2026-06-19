import React, { Component } from 'react';
import { Table, Button, Modal, Input, Select, DatePicker, Form, Space, message, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ajax, STATUS_MAP } from '../../mock/api';
import dayjs from 'dayjs';

const todayStr = dayjs().format('YYYY-MM-DD');

const STATUS_COLORS = { 0: 'default', 1: 'processing', 2: 'processing', 3: 'warning', 4: 'warning', 5: 'success', 6: 'blue', 7: 'error', 9: 'error' };

class OperationRequirementPage extends Component {
    state = {
        showModal: false,
        listData: [],
        formData: { package_code: '', package_name: '', package_type: '普通器械包', operation_room: '', require_date: todayStr, remark: '' },
        items: [{ key: '1', instrument_code: '', instrument_name: '', instrument_spec: '', plan_qty: 1 }]
    };
    itemKeyCounter = 2;

    componentDidMount() { this.loadList(); }

    loadList = () => {
        ajax({ url: '/nccloud/cssd.instrument.queryList.do', data: {}, success: (res) => { if (res.success) this.setState({ listData: res.data }); } });
    };

    handleSubmit = () => {
        const { formData, items } = this.state;
        if (!formData.package_code || !formData.package_name || !formData.operation_room || !formData.require_date) {
            message.warning('请填写必填项'); return;
        }
        if (items.length === 0 || !items[0].instrument_code) {
            message.warning('请添加器械明细'); return;
        }
        ajax({
            url: '/nccloud/cssd.instrument.submitRequirement.do',
            data: { billData: JSON.stringify({ parent: { ...formData, package_status: 0 }, _details: { cssd_instritem: items.map(it => ({ ...it, plan_qty: Number(it.plan_qty) || 1 })) } }) },
            success: (res) => {
                if (res.success) { message.success('提交成功'); this.setState({ showModal: false }); this.resetForm(); this.loadList(); }
                else { message.error(res.error?.message || '提交失败'); }
            }
        });
    };

    resetForm = () => {
        this.itemKeyCounter = 2;
        this.setState({
            formData: { package_code: '', package_name: '', package_type: '普通器械包', operation_room: '', require_date: todayStr, remark: '' },
            items: [{ key: '1', instrument_code: '', instrument_name: '', instrument_spec: '', plan_qty: 1 }]
        });
    };

    handleFormChange = (field, value) => { this.setState(prev => ({ formData: { ...prev.formData, [field]: value } })); };
    handleItemChange = (index, field, value) => {
        this.setState(prev => { const items = [...prev.items]; items[index] = { ...items[index], [field]: value }; return { items }; });
    };
    addItem = () => { this.setState(prev => ({ items: [...prev.items, { key: String(this.itemKeyCounter++), instrument_code: '', instrument_name: '', instrument_spec: '', plan_qty: 1 }] })); };
    removeItem = (index) => { this.setState(prev => ({ items: prev.items.filter((_, i) => i !== index) })); };

    columns = [
        { title: '包号', dataIndex: 'package_code', key: 'package_code', width: 140 },
        { title: '包名称', dataIndex: 'package_name', key: 'package_name', width: 160 },
        { title: '包类型', dataIndex: 'package_type', key: 'package_type', width: 110 },
        { title: '手术室', dataIndex: 'operation_room', key: 'operation_room', width: 110 },
        { title: '需求日期', dataIndex: 'require_date', key: 'require_date', width: 110 },
        { title: '灭菌批次号', dataIndex: 'sterilization_batchno', key: 'sterilization_batchno', width: 140 },
        {
            title: '状态', dataIndex: 'package_status', key: 'package_status', width: 110,
            render: (v) => <Tag color={STATUS_COLORS[v]}>{STATUS_MAP[v] || '未知'}</Tag>
        },
        { title: '是否缺件', dataIndex: 'lack_flag', key: 'lack_flag', width: 80, render: (v) => v === 1 ? <Tag color="warning">是</Tag> : '否' },
        { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true }
    ];

    render() {
        const { showModal, formData, items, listData } = this.state;
        return (
            <div className="cssd-page-container">
                <div className="cssd-page-header">
                    <h2>手术室 — 器械包需求管理</h2>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { this.resetForm(); this.setState({ showModal: true }); }}>提交器械包需求</Button>
                </div>

                <Table dataSource={listData} columns={this.columns} rowKey="pk_instrpkg" bordered size="small" pagination={{ pageSize: 10 }} childrenColumnName="__no_tree__" />

                <Modal title="提交器械包需求" open={showModal} onCancel={() => this.setState({ showModal: false })} width={720}
                    footer={[
                        <Button key="cancel" onClick={() => this.setState({ showModal: false })}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleSubmit}>提交</Button>
                    ]}
                >
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                        <Form.Item label="器械包编号" required><Input value={formData.package_code} onChange={e => this.handleFormChange('package_code', e.target.value)} placeholder="请输入器械包编号" /></Form.Item>
                        <Form.Item label="器械包名称" required><Input value={formData.package_name} onChange={e => this.handleFormChange('package_name', e.target.value)} placeholder="请输入器械包名称" /></Form.Item>
                        <Form.Item label="包类型">
                            <Select value={formData.package_type} onChange={v => this.handleFormChange('package_type', v)}>
                                <Select.Option value="普通器械包">普通器械包</Select.Option>
                                <Select.Option value="手术器械包">手术器械包</Select.Option>
                                <Select.Option value="专科器械包">专科器械包</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="手术室" required><Input value={formData.operation_room} onChange={e => this.handleFormChange('operation_room', e.target.value)} placeholder="请输入手术室名称" /></Form.Item>
                        <Form.Item label="需求日期" required><DatePicker style={{ width: '100%' }} value={formData.require_date ? dayjs(formData.require_date) : null} onChange={(_, ds) => this.handleFormChange('require_date', ds)} /></Form.Item>
                        <Form.Item label="备注"><Input.TextArea value={formData.remark} onChange={e => this.handleFormChange('remark', e.target.value)} placeholder="请输入备注" rows={2} /></Form.Item>
                    </Form>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 16 }}>
                        <h4 style={{ margin: 0 }}>器械明细</h4>
                        <Button size="small" icon={<PlusOutlined />} onClick={this.addItem}>添加器械</Button>
                    </div>
                    <Table dataSource={items} bordered size="small" pagination={false} rowKey="key"
                        columns={[
                            { title: '器械编码', render: (_, __, i) => <Input size="small" value={items[i].instrument_code} onChange={e => this.handleItemChange(i, 'instrument_code', e.target.value)} /> },
                            { title: '器械名称', render: (_, __, i) => <Input size="small" value={items[i].instrument_name} onChange={e => this.handleItemChange(i, 'instrument_name', e.target.value)} /> },
                            { title: '规格型号', render: (_, __, i) => <Input size="small" value={items[i].instrument_spec} onChange={e => this.handleItemChange(i, 'instrument_spec', e.target.value)} /> },
                            { title: '计划数量', width: 90, render: (_, __, i) => <InputNumber size="small" min={1} value={items[i].plan_qty} onChange={v => this.handleItemChange(i, 'plan_qty', v)} /> },
                            { title: '操作', width: 60, render: (_, __, i) => <Button size="small" danger icon={<DeleteOutlined />} onClick={() => this.removeItem(i)} /> }
                        ]}
                    />
                </Modal>
            </div>
        );
    }
}

function InputNumber({ value, onChange, ...rest }) {
    return <Input type="number" value={value} onChange={e => onChange(Number(e.target.value) || 0)} {...rest} />;
}

export default OperationRequirementPage;
