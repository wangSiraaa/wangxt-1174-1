import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast } from 'nc-lightapp-front';

const { NCFormControl, NCButton, NCDatePicker, NCTable, NCTableColumn, NCModal, NCSelect, NCOption } = base;

class OperationRequirementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            formData: {
                package_code: '',
                package_name: '',
                package_type: '普通器械包',
                operation_room: '',
                require_date: '',
                remark: ''
            },
            items: [
                { instrument_code: '', instrument_name: '', instrument_spec: '', plan_qty: 1, actual_qty: 0 }
            ],
            listData: []
        };
    }

    componentDidMount() {
        this.loadList();
    }

    loadList = () => {
        ajax({
            url: '/nccloud/cssd.instrument.queryList.do',
            method: 'POST',
            data: {},
            success: (res) => {
                if (res.success && res.data) {
                    this.setState({ listData: res.data });
                }
            }
        });
    };

    handleSubmit = () => {
        const { formData, items } = this.state;
        if (!formData.package_code || !formData.package_name || !formData.operation_room || !formData.require_date) {
            toast({ color: 'warning', content: '请填写必填项' });
            return;
        }
        if (items.length === 0 || !items[0].instrument_code) {
            toast({ color: 'warning', content: '请添加器械明细' });
            return;
        }

        const billData = {
            parent: {
                ...formData,
                package_status: 0
            },
            children: {
                cssd_instritem: items
            }
        };

        ajax({
            url: '/nccloud/cssd.instrument.submitRequirement.do',
            method: 'POST',
            data: { billData: JSON.stringify(billData) },
            success: (res) => {
                if (res.success) {
                    toast({ color: 'success', content: '提交成功' });
                    this.setState({ showModal: false });
                    this.resetForm();
                    this.loadList();
                } else {
                    toast({ color: 'danger', content: res.error ? res.error.message : '提交失败' });
                }
            }
        });
    };

    resetForm = () => {
        this.setState({
            formData: {
                package_code: '',
                package_name: '',
                package_type: '普通器械包',
                operation_room: '',
                require_date: '',
                remark: ''
            },
            items: [
                { instrument_code: '', instrument_name: '', instrument_spec: '', plan_qty: 1, actual_qty: 0 }
            ]
        });
    };

    handleFormChange = (field, value) => {
        this.setState(prev => ({
            formData: { ...prev.formData, [field]: value }
        }));
    };

    handleItemChange = (index, field, value) => {
        this.setState(prev => {
            const items = [...prev.items];
            items[index] = { ...items[index], [field]: value };
            return { items };
        });
    };

    addItem = () => {
        this.setState(prev => ({
            items: [...prev.items, { instrument_code: '', instrument_name: '', instrument_spec: '', plan_qty: 1, actual_qty: 0 }]
        }));
    };

    removeItem = (index) => {
        this.setState(prev => ({
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    getStatusText = (status) => {
        const statusMap = {
            0: '已提交需求',
            1: '清洗中',
            2: '灭菌中',
            3: '缺件待处理',
            4: '待放行',
            5: '已放行',
            6: '已发往手术室',
            7: '已退回',
            9: '灭菌失败'
        };
        return statusMap[status] || '未知';
    };

    render() {
        const { showModal, formData, items, listData } = this.state;

        return (
            <div className="page-container" style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>手术室 - 器械包需求管理</h2>
                    <NCButton colors="primary" onClick={() => this.setState({ showModal: true })}>
                        提交器械包需求
                    </NCButton>
                </div>

                <NCTable data={listData} bordered>
                    <NCTableColumn title="包号" dataIndex="package_code" key="package_code" />
                    <NCTableColumn title="包名称" dataIndex="package_name" key="package_name" />
                    <NCTableColumn title="包类型" dataIndex="package_type" key="package_type" />
                    <NCTableColumn title="手术室" dataIndex="operation_room" key="operation_room" />
                    <NCTableColumn title="需求日期" dataIndex="require_date" key="require_date" />
                    <NCTableColumn title="灭菌批次号" dataIndex="sterilization_batchno" key="sterilization_batchno" />
                    <NCTableColumn
                        title="状态"
                        dataIndex="package_status"
                        key="package_status"
                        render={(text) => {
                            const colorMap = { 5: 'green', 6: 'blue', 9: 'red', 3: 'orange' };
                            return <span style={{ color: colorMap[text] || '#333' }}>{this.getStatusText(text)}</span>;
                        }}
                    />
                    <NCTableColumn title="是否缺件" dataIndex="lack_flag" key="lack_flag" render={(text) => text === 1 ? '是' : '否'} />
                    <NCTableColumn title="备注" dataIndex="remark" key="remark" />
                </NCTable>

                <NCModal
                    show={showModal}
                    onClose={() => this.setState({ showModal: false })}
                    size="xl"
                >
                    <NCModal.Header>
                        <NCModal.Title>提交器械包需求</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px' }}>器械包编号 <span style={{ color: 'red' }}>*</span></label>
                                <NCFormControl
                                    value={formData.package_code}
                                    onChange={(v) => this.handleFormChange('package_code', v)}
                                    placeholder="请输入器械包编号"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px' }}>器械包名称 <span style={{ color: 'red' }}>*</span></label>
                                <NCFormControl
                                    value={formData.package_name}
                                    onChange={(v) => this.handleFormChange('package_name', v)}
                                    placeholder="请输入器械包名称"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px' }}>包类型</label>
                                <NCSelect value={formData.package_type} onChange={(v) => this.handleFormChange('package_type', v)}>
                                    <NCOption value="普通器械包">普通器械包</NCOption>
                                    <NCOption value="手术器械包">手术器械包</NCOption>
                                    <NCOption value="专科器械包">专科器械包</NCOption>
                                </NCSelect>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px' }}>手术室 <span style={{ color: 'red' }}>*</span></label>
                                <NCFormControl
                                    value={formData.operation_room}
                                    onChange={(v) => this.handleFormChange('operation_room', v)}
                                    placeholder="请输入手术室名称"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px' }}>需求日期 <span style={{ color: 'red' }}>*</span></label>
                                <NCDatePicker
                                    value={formData.require_date}
                                    onChange={(v) => this.handleFormChange('require_date', v)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px' }}>备注</label>
                                <NCFormControl
                                    value={formData.remark}
                                    onChange={(v) => this.handleFormChange('remark', v)}
                                    placeholder="请输入备注"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0 }}>器械明细</h4>
                            <NCButton onClick={this.addItem}>添加器械</NCButton>
                        </div>
                        <NCTable data={items} bordered>
                            <NCTableColumn title="器械编码" key="instrument_code" render={(text, record, index) => (
                                <NCFormControl
                                    value={record.instrument_code}
                                    onChange={(v) => this.handleItemChange(index, 'instrument_code', v)}
                                />
                            )} />
                            <NCTableColumn title="器械名称" key="instrument_name" render={(text, record, index) => (
                                <NCFormControl
                                    value={record.instrument_name}
                                    onChange={(v) => this.handleItemChange(index, 'instrument_name', v)}
                                />
                            )} />
                            <NCTableColumn title="规格型号" key="instrument_spec" render={(text, record, index) => (
                                <NCFormControl
                                    value={record.instrument_spec}
                                    onChange={(v) => this.handleItemChange(index, 'instrument_spec', v)}
                                />
                            )} />
                            <NCTableColumn title="计划数量" key="plan_qty" render={(text, record, index) => (
                                <NCFormControl
                                    type="number"
                                    value={record.plan_qty}
                                    onChange={(v) => this.handleItemChange(index, 'plan_qty', Number(v))}
                                />
                            )} />
                            <NCTableColumn title="操作" key="action" render={(text, record, index) => (
                                <NCButton colors="danger2" onClick={() => this.removeItem(index)}>删除</NCButton>
                            )} />
                        </NCTable>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton onClick={() => this.setState({ showModal: false })}>取消</NCButton>
                        <NCButton colors="primary" onClick={this.handleSubmit}>提交</NCButton>
                    </NCModal.Footer>
                </NCModal>
            </div>
        );
    }
}

export default createPage({})(OperationRequirementPage);
