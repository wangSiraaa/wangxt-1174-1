import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';

const { NCButton, NCTable, NCTableColumn, NCModal, NCFormControl } = base;

class QualityNursePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            lackList: [],
            releaseList: [],
            showDetailModal: false,
            currentPkg: null,
            unpassReason: '',
            activeTab: 'release'
        };
    }

    componentDidMount() {
        this.loadReleaseList();
        this.loadLackList();
    }

    loadReleaseList = () => {
        ajax({
            url: '/nccloud/cssd.instrument.queryList.do',
            method: 'POST',
            data: {},
            success: (res) => {
                if (res.success && res.data) {
                    this.setState({ listData: res.data.filter(r => r.package_status === 4 || r.package_status === 5 || r.package_status === 6) });
                }
            }
        });
    };

    loadLackList = () => {
        ajax({
            url: '/nccloud/cssd.lackrecord.queryList.do',
            method: 'POST',
            data: {},
            success: (res) => {
                if (res.success && res.data) {
                    this.setState({ lackList: res.data });
                }
            }
        });
    };

    loadReleaseRecords = () => {
        ajax({
            url: '/nccloud/cssd.releaserecord.queryList.do',
            method: 'POST',
            data: {},
            success: (res) => {
                if (res.success && res.data) {
                    this.setState({ releaseList: res.data });
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

    handleConfirmRelease = (pkg) => {
        if (pkg.is_sent === 1) {
            toast({ color: 'danger', content: '已发往手术室的器械包不能修改灭菌批号和放行状态' });
            return;
        }
        if (pkg.lack_flag === 1) {
            toast({ color: 'danger', content: '该器械包存在缺件，请先处理缺件后再放行' });
            return;
        }
        this.setState({ showDetailModal: true, currentPkg: pkg, unpassReason: '' });
    };

    handleReleasePass = () => {
        const { currentPkg } = this.state;
        ajax({
            url: '/nccloud/cssd.instrument.confirmRelease.do',
            method: 'POST',
            data: { pkInstrpkg: currentPkg.pk_instrpkg, releaseResult: 1 },
            success: (res) => {
                if (res.success) {
                    toast({ color: 'success', content: '放行通过' });
                    this.setState({ showDetailModal: false, currentPkg: null });
                    this.loadReleaseList();
                    this.loadReleaseRecords();
                } else {
                    toast({ color: 'danger', content: res.error ? res.error.message : '操作失败' });
                }
            }
        });
    };

    handleReleaseUnpass = () => {
        const { currentPkg, unpassReason } = this.state;
        if (!unpassReason || unpassReason.trim() === '') {
            toast({ color: 'warning', content: '请输入不通过原因' });
            return;
        }
        ajax({
            url: '/nccloud/cssd.instrument.confirmRelease.do',
            method: 'POST',
            data: { pkInstrpkg: currentPkg.pk_instrpkg, releaseResult: 0, unpassReason },
            success: (res) => {
                if (res.success) {
                    toast({ color: 'success', content: '已退回重配' });
                    this.setState({ showDetailModal: false, currentPkg: null, unpassReason: '' });
                    this.loadReleaseList();
                    this.loadReleaseRecords();
                } else {
                    toast({ color: 'danger', content: res.error ? res.error.message : '操作失败' });
                }
            }
        });
    };

    handleResolveLack = (pkLackrecord) => {
        const result = window.prompt('请输入处理结果：');
        if (result !== null && result.trim() !== '') {
            ajax({
                url: '/nccloud/cssd.instrument.resolveLack.do',
                method: 'POST',
                data: { pkLackrecord, handleResult: result },
                success: (res) => {
                    if (res.success) {
                        toast({ color: 'success', content: '缺件已处理' });
                        this.loadLackList();
                        this.loadReleaseList();
                    } else {
                        toast({ color: 'danger', content: res.error ? res.error.message : '操作失败' });
                    }
                }
            });
        }
    };

    getLackStatusText = (status) => {
        const map = { 0: '待处理', 1: '处理中', 2: '已解决' };
        return map[status] || '未知';
    };

    render() {
        const { listData, lackList, releaseList, showDetailModal, currentPkg, unpassReason, activeTab } = this.state;

        return (
            <div className="page-container" style={{ padding: '20px' }}>
                <h2 style={{ marginBottom: '16px' }}>质控护士 - 器械包放行管理</h2>

                <div style={{ marginBottom: '16px', borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div
                            onClick={() => this.setState({ activeTab: 'release' })}
                            style={{
                                padding: '8px 16px',
                                cursor: 'pointer',
                                borderBottom: activeTab === 'release' ? '2px solid #1890ff' : '2px solid transparent',
                                color: activeTab === 'release' ? '#1890ff' : '#333',
                                fontWeight: activeTab === 'release' ? 'bold' : 'normal'
                            }}
                        >
                            待放行器械包
                        </div>
                        <div
                            onClick={() => { this.setState({ activeTab: 'lack' }); this.loadLackList(); }}
                            style={{
                                padding: '8px 16px',
                                cursor: 'pointer',
                                borderBottom: activeTab === 'lack' ? '2px solid #1890ff' : '2px solid transparent',
                                color: activeTab === 'lack' ? '#1890ff' : '#333',
                                fontWeight: activeTab === 'lack' ? 'bold' : 'normal'
                            }}
                        >
                            缺件记录
                        </div>
                        <div
                            onClick={() => { this.setState({ activeTab: 'record' }); this.loadReleaseRecords(); }}
                            style={{
                                padding: '8px 16px',
                                cursor: 'pointer',
                                borderBottom: activeTab === 'record' ? '2px solid #1890ff' : '2px solid transparent',
                                color: activeTab === 'record' ? '#1890ff' : '#333',
                                fontWeight: activeTab === 'record' ? 'bold' : 'normal'
                            }}
                        >
                            放行记录
                        </div>
                    </div>
                </div>

                {activeTab === 'release' && (
                    <NCTable data={listData} bordered>
                        <NCTableColumn title="包号" dataIndex="package_code" />
                        <NCTableColumn title="包名称" dataIndex="package_name" />
                        <NCTableColumn title="手术室" dataIndex="operation_room" />
                        <NCTableColumn title="灭菌批次号" dataIndex="sterilization_batchno" />
                        <NCTableColumn
                            title="状态"
                            dataIndex="package_status"
                            render={(text) => {
                                const colorMap = { 5: 'green', 6: 'blue', 9: 'red', 3: 'orange' };
                                return <span style={{ color: colorMap[text] || '#333' }}>{this.getStatusText(text)}</span>;
                            }}
                        />
                        <NCTableColumn title="是否缺件" dataIndex="lack_flag" render={(text) => text === 1 ? '是' : '否'} />
                        <NCTableColumn title="是否已发出" dataIndex="is_sent" render={(text) => text === 1 ? '是' : '否'} />
                        <NCTableColumn title="放行时间" dataIndex="release_time" />
                        <NCTableColumn
                            title="操作"
                            render={(text, record) => (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {record.package_status === 4 && (
                                        <NCButton colors="primary" onClick={() => this.handleConfirmRelease(record)}>
                                            放行检查
                                        </NCButton>
                                    )}
                                </div>
                            )}
                        />
                    </NCTable>
                )}

                {activeTab === 'lack' && (
                    <NCTable data={lackList} bordered>
                        <NCTableColumn title="器械包号" dataIndex="package_code" />
                        <NCTableColumn title="器械编码" dataIndex="instrument_code" />
                        <NCTableColumn title="器械名称" dataIndex="instrument_name" />
                        <NCTableColumn title="缺失数量" dataIndex="lack_qty" />
                        <NCTableColumn
                            title="处理状态"
                            dataIndex="handle_status"
                            render={(text) => {
                                const colorMap = { 0: 'orange', 2: 'green' };
                                return <span style={{ color: colorMap[text] || '#333' }}>{this.getLackStatusText(text)}</span>;
                            }}
                        />
                        <NCTableColumn title="处理人" dataIndex="pk_handler" />
                        <NCTableColumn title="处理时间" dataIndex="handle_time" />
                        <NCTableColumn title="处理结果" dataIndex="handle_result" />
                        <NCTableColumn
                            title="操作"
                            render={(text, record) => (
                                record.handle_status !== 2 ? (
                                    <NCButton colors="primary" onClick={() => this.handleResolveLack(record.pk_lackrecord)}>
                                        处理缺件
                                    </NCButton>
                                ) : null
                            )}
                        />
                    </NCTable>
                )}

                {activeTab === 'record' && (
                    <NCTable data={releaseList} bordered>
                        <NCTableColumn title="器械包号" dataIndex="package_code" />
                        <NCTableColumn title="灭菌批次号" dataIndex="sterilization_batchno" />
                        <NCTableColumn
                            title="放行结果"
                            dataIndex="release_result"
                            render={(text) => (
                                <span style={{ color: text === 1 ? 'green' : 'red' }}>
                                    {text === 1 ? '放行通过' : '未通过'}
                                </span>
                            )}
                        />
                        <NCTableColumn title="质控护士" dataIndex="pk_qualitynurse" />
                        <NCTableColumn title="放行时间" dataIndex="release_time" />
                        <NCTableColumn title="未通过原因" dataIndex="unpass_reason" />
                        <NCTableColumn title="备注" dataIndex="remark" />
                    </NCTable>
                )}

                <NCModal
                    show={showDetailModal}
                    onClose={() => this.setState({ showDetailModal: false })}
                    size="xl"
                >
                    <NCModal.Header>
                        <NCModal.Title>放行检查 - {currentPkg?.package_code}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div><strong>包名称：</strong>{currentPkg?.package_name}</div>
                            <div><strong>手术室：</strong>{currentPkg?.operation_room}</div>
                            <div><strong>灭菌批次号：</strong>{currentPkg?.sterilization_batchno}</div>
                            <div><strong>状态：</strong>{this.getStatusText(currentPkg?.package_status)}</div>
                        </div>

                        <h4 style={{ marginTop: '0', marginBottom: '8px' }}>器械明细：</h4>
                        <NCTable data={currentPkg?.children?.cssd_instritem || []} bordered size="sm">
                            <NCTableColumn title="器械编码" dataIndex="instrument_code" />
                            <NCTableColumn title="器械名称" dataIndex="instrument_name" />
                            <NCTableColumn title="规格型号" dataIndex="instrument_spec" />
                            <NCTableColumn title="计划数量" dataIndex="plan_qty" />
                            <NCTableColumn title="实配数量" dataIndex="actual_qty" />
                            <NCTableColumn
                                title="是否缺件"
                                dataIndex="lack_flag"
                                render={(text) => text === 1 ? <span style={{ color: 'red' }}>是</span> : '否'}
                            />
                        </NCTable>

                        {currentPkg?.package_status === 4 && (
                            <div style={{ marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px' }}>不通过原因（选择不通过时必填）：</label>
                                <NCFormControl
                                    value={unpassReason}
                                    onChange={(v) => this.setState({ unpassReason: v })}
                                    placeholder="请输入不通过原因"
                                    rows={3}
                                />
                            </div>
                        )}

                        {currentPkg?.is_sent === 1 && (
                            <div style={{ marginTop: '16px', padding: '12px', background: '#fff2e8', color: '#fa541c', borderRadius: '4px' }}>
                                ⚠️ 该器械包已发往手术室，灭菌批号和放行状态不可修改
                            </div>
                        )}
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton onClick={() => this.setState({ showDetailModal: false })}>关闭</NCButton>
                        <NCButton colors="danger2" onClick={this.handleReleaseUnpass}>不通过（退回重配）</NCButton>
                        <NCButton colors="success" onClick={this.handleReleasePass}>放行通过</NCButton>
                    </NCModal.Footer>
                </NCModal>
            </div>
        );
    }
}

export default createPage({})(QualityNursePage);
