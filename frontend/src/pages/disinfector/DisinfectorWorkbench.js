import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';

const { NCButton, NCTable, NCTableColumn, NCModal, NCFormControl, NCSelect, NCOption } = base;

class DisinfectorWorkbench extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            showBatchModal: false,
            selectedPks: [],
            batchForm: {
                batch_no: '',
                sterilizer_code: '',
                sterilizer_name: '',
                sterilize_type: 1
            },
            showLackModal: false,
            currentPkg: null,
            selectedItemPks: []
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

    handleRegisterCleaning = (pk) => {
        ajax({
            url: '/nccloud/cssd.instrument.registerCleaning.do',
            method: 'POST',
            data: { pkInstrpkg: pk },
            success: (res) => {
                if (res.success) {
                    toast({ color: 'success', content: '登记清洗成功' });
                    this.loadList();
                } else {
                    toast({ color: 'danger', content: res.error ? res.error.message : '操作失败' });
                }
            }
        });
    };

    handleSelectRow = (record, checked) => {
        this.setState(prev => {
            let selectedPks = [...prev.selectedPks];
            if (checked) {
                if (!selectedPks.includes(record.pk_instrpkg)) {
                    selectedPks.push(record.pk_instrpkg);
                }
            } else {
                selectedPks = selectedPks.filter(pk => pk !== record.pk_instrpkg);
            }
            return { selectedPks };
        });
    };

    handleSelectAll = (checked, records) => {
        if (checked) {
            this.setState({ selectedPks: records.map(r => r.pk_instrpkg) });
        } else {
            this.setState({ selectedPks: [] });
        }
    };

    handleCreateBatch = () => {
        if (this.state.selectedPks.length === 0) {
            toast({ color: 'warning', content: '请先选择要灭菌的器械包' });
            return;
        }
        const validList = this.state.listData.filter(r =>
            this.state.selectedPks.includes(r.pk_instrpkg) && r.package_status === 1
        );
        if (validList.length === 0) {
            toast({ color: 'warning', content: '所选器械包中没有处于"清洗中"状态的，请先登记清洗' });
            return;
        }
        this.setState({
            showBatchModal: true,
            selectedPks: validList.map(r => r.pk_instrpkg)
        });
    };

    handleBatchFormChange = (field, value) => {
        this.setState(prev => ({
            batchForm: { ...prev.batchForm, [field]: value }
        }));
    };

    handleSubmitBatch = () => {
        const { batchForm, selectedPks } = this.state;
        if (!batchForm.batch_no || !batchForm.sterilizer_code) {
            toast({ color: 'warning', content: '请填写批次号和灭菌器' });
            return;
        }
        ajax({
            url: '/nccloud/cssd.sterbatch.create.do',
            method: 'POST',
            data: {
                batchData: JSON.stringify(batchForm),
                pkInstrpkgs: selectedPks
            },
            success: (res) => {
                if (res.success) {
                    toast({ color: 'success', content: '创建灭菌批次成功' });
                    this.setState({ showBatchModal: false, selectedPks: [] });
                    this.loadList();
                } else {
                    toast({ color: 'danger', content: res.error ? res.error.message : '操作失败' });
                }
            }
        });
    };

    handleFinishBatch = (pkSterbatch, sterilizationBatchno) => {
        promptBox({
            color: 'warning',
            title: '确认灭菌结果',
            content: `请确认灭菌批次【${sterilizationBatchno}】是否成功？`,
            beSureBtnName: '成功',
            beSureBtnClick: () => {
                this.finishBatch(pkSterbatch, 1, null);
            },
            cancelBtnName: '失败',
            cancelBtnClick: () => {
                const reason = window.prompt('请输入失败原因：');
                if (reason !== null) {
                    this.finishBatch(pkSterbatch, 0, reason);
                }
            }
        });
    };

    finishBatch = (pkSterbatch, result, failureReason) => {
        ajax({
            url: '/nccloud/cssd.sterbatch.finish.do',
            method: 'POST',
            data: { pkSterbatch, sterilizeResult: result, failureReason },
            success: (res) => {
                if (res.success) {
                    toast({ color: 'success', content: result === 1 ? '灭菌完成' : '已标记灭菌失败' });
                    this.loadList();
                } else {
                    toast({ color: 'danger', content: res.error ? res.error.message : '操作失败' });
                }
            }
        });
    };

    handleRegisterLack = (pkg) => {
        this.setState({
            showLackModal: true,
            currentPkg: pkg,
            selectedItemPks: []
        });
    };

    handleLackItemSelect = (itemPk, checked) => {
        this.setState(prev => {
            let selectedItemPks = [...prev.selectedItemPks];
            if (checked) {
                if (!selectedItemPks.includes(itemPk)) {
                    selectedItemPks.push(itemPk);
                }
            } else {
                selectedItemPks = selectedItemPks.filter(pk => pk !== itemPk);
            }
            return { selectedItemPks };
        });
    };

    handleSubmitLack = () => {
        const { currentPkg, selectedItemPks } = this.state;
        if (selectedItemPks.length === 0) {
            toast({ color: 'warning', content: '请选择缺件的器械' });
            return;
        }
        ajax({
            url: '/nccloud/cssd.instrument.registerLack.do',
            method: 'POST',
            data: { pkInstrpkg: currentPkg.pk_instrpkg, pkInstritems: selectedItemPks },
            success: (res) => {
                if (res.success) {
                    toast({ color: 'success', content: '缺件登记成功' });
                    this.setState({ showLackModal: false, currentPkg: null, selectedItemPks: [] });
                    this.loadList();
                } else {
                    toast({ color: 'danger', content: res.error ? res.error.message : '操作失败' });
                }
            }
        });
    };

    handleSendToOR = (pk) => {
        promptBox({
            color: 'warning',
            title: '确认发放',
            content: '确认将该器械包发往手术室吗？已发出后将不能修改灭菌批号。',
            beSureBtnClick: () => {
                ajax({
                    url: '/nccloud/cssd.instrument.sendToOR.do',
                    method: 'POST',
                    data: { pkInstrpkg: pk },
                    success: (res) => {
                        if (res.success) {
                            toast({ color: 'success', content: '已发往手术室' });
                            this.loadList();
                        } else {
                            toast({ color: 'danger', content: res.error ? res.error.message : '操作失败' });
                        }
                    }
                });
            }
        });
    };

    render() {
        const { listData, showBatchModal, batchForm, showLackModal, currentPkg, selectedPks, selectedItemPks } = this.state;

        return (
            <div className="page-container" style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>消毒员 - 清洗灭菌工作台</h2>
                    <NCButton colors="primary" onClick={this.handleCreateBatch}>
                        创建灭菌批次 ({selectedPks.length})
                    </NCButton>
                </div>

                <NCTable
                    data={listData}
                    bordered
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedPks,
                        onSelect: (record, checked) => this.handleSelectRow(record, checked),
                        onSelectAll: (checked, records) => this.handleSelectAll(checked, records)
                    }}
                >
                    <NCTableColumn title="包号" dataIndex="package_code" key="package_code" />
                    <NCTableColumn title="包名称" dataIndex="package_name" key="package_name" />
                    <NCTableColumn title="手术室" dataIndex="operation_room" key="operation_room" />
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
                    <NCTableColumn
                        title="操作"
                        key="action"
                        render={(text, record) => (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {record.package_status === 0 && (
                                    <NCButton colors="primary" onClick={() => this.handleRegisterCleaning(record.pk_instrpkg)}>登记清洗</NCButton>
                                )}
                                {record.package_status === 5 && record.is_sent !== 1 && (
                                    <NCButton colors="success" onClick={() => this.handleSendToOR(record.pk_instrpkg)}>发放手术室</NCButton>
                                )}
                                {[0, 1, 2, 3, 4].includes(record.package_status) && (
                                    <NCButton colors="warning" onClick={() => this.handleRegisterLack(record)}>登记缺件</NCButton>
                                )}
                            </div>
                        )}
                    />
                </NCTable>

                <div style={{ marginTop: '24px' }}>
                    <h3>灭菌批次管理</h3>
                    <SterBatchList onFinish={this.handleFinishBatch} />
                </div>

                <NCModal
                    show={showBatchModal}
                    onClose={() => this.setState({ showBatchModal: false })}
                >
                    <NCModal.Header>
                        <NCModal.Title>创建灭菌批次</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '4px' }}>批次号 <span style={{ color: 'red' }}>*</span></label>
                            <NCFormControl
                                value={batchForm.batch_no}
                                onChange={(v) => this.handleBatchFormChange('batch_no', v)}
                                placeholder="请输入灭菌批次号"
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '4px' }}>灭菌器编码 <span style={{ color: 'red' }}>*</span></label>
                            <NCFormControl
                                value={batchForm.sterilizer_code}
                                onChange={(v) => this.handleBatchFormChange('sterilizer_code', v)}
                                placeholder="请输入灭菌器编码"
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '4px' }}>灭菌器名称</label>
                            <NCFormControl
                                value={batchForm.sterilizer_name}
                                onChange={(v) => this.handleBatchFormChange('sterilizer_name', v)}
                                placeholder="请输入灭菌器名称"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px' }}>灭菌方式</label>
                            <NCSelect value={batchForm.sterilize_type} onChange={(v) => this.handleBatchFormChange('sterilize_type', v)}>
                                <NCOption value={1}>压力蒸汽灭菌</NCOption>
                                <NCOption value={2}>环氧乙烷灭菌</NCOption>
                                <NCOption value={3}>等离子灭菌</NCOption>
                            </NCSelect>
                        </div>
                        <div style={{ marginTop: '16px', color: '#888' }}>
                            已选择 {selectedPks.length} 个器械包
                        </div>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton onClick={() => this.setState({ showBatchModal: false })}>取消</NCButton>
                        <NCButton colors="primary" onClick={this.handleSubmitBatch}>创建批次</NCButton>
                    </NCModal.Footer>
                </NCModal>

                <NCModal
                    show={showLackModal}
                    onClose={() => this.setState({ showLackModal: false })}
                >
                    <NCModal.Header>
                        <NCModal.Title>登记缺件 - {currentPkg?.package_code}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <p style={{ color: '#666' }}>请勾选缺失的器械：</p>
                        <NCTable data={currentPkg?.children?.cssd_instritem || []} bordered>
                            <NCTableColumn
                                title="选择"
                                key="select"
                                width={60}
                                render={(text, record) => (
                                    <input
                                        type="checkbox"
                                        checked={selectedItemPks.includes(record.pk_instritem)}
                                        onChange={(e) => this.handleLackItemSelect(record.pk_instritem, e.target.checked)}
                                    />
                                )}
                            />
                            <NCTableColumn title="器械编码" dataIndex="instrument_code" />
                            <NCTableColumn title="器械名称" dataIndex="instrument_name" />
                            <NCTableColumn title="规格型号" dataIndex="instrument_spec" />
                            <NCTableColumn title="计划数量" dataIndex="plan_qty" />
                            <NCTableColumn title="实配数量" dataIndex="actual_qty" />
                        </NCTable>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton onClick={() => this.setState({ showLackModal: false })}>取消</NCButton>
                        <NCButton colors="primary" onClick={this.handleSubmitLack}>确认缺件</NCButton>
                    </NCModal.Footer>
                </NCModal>
            </div>
        );
    }
}

class SterBatchList extends Component {
    state = { list: [] };

    componentDidMount() {
        this.loadList();
    }

    loadList = () => {
        ajax({
            url: '/nccloud/cssd.sterbatch.queryList.do',
            method: 'POST',
            data: {},
            success: (res) => {
                if (res.success && res.data) {
                    this.setState({ list: res.data });
                }
            }
        });
    };

    getStatusText = (status) => {
        const map = { 0: '灭菌中', 1: '已完成', 2: '失败' };
        return map[status] || '未知';
    };

    getResultText = (result) => {
        if (result === null || result === undefined) return '未出结果';
        return result === 1 ? '合格' : '不合格';
    };

    render() {
        const { list } = this.state;
        return (
            <NCTable data={list} bordered>
                <NCTableColumn title="批次号" dataIndex="batch_no" />
                <NCTableColumn title="灭菌器" dataIndex="sterilizer_name" />
                <NCTableColumn
                    title="状态"
                    dataIndex="batch_status"
                    render={(text) => {
                        const colorMap = { 1: 'green', 2: 'red' };
                        return <span style={{ color: colorMap[text] || '#333' }}>{this.getStatusText(text)}</span>;
                    }}
                />
                <NCTableColumn title="灭菌结果" dataIndex="sterilize_result" render={(text) => this.getResultText(text)} />
                <NCTableColumn title="开始时间" dataIndex="start_time" />
                <NCTableColumn title="结束时间" dataIndex="end_time" />
                <NCTableColumn title="失败原因" dataIndex="failure_reason" />
                <NCTableColumn
                    title="操作"
                    render={(text, record) => (
                        record.batch_status === 0 ? (
                            <NCButton colors="primary" onClick={() => this.props.onFinish(record.pk_sterbatch, record.batch_no)}>
                                出结果
                            </NCButton>
                        ) : null
                    )}
                />
            </NCTable>
        );
    }
}

export default createPage({})(DisinfectorWorkbench);
