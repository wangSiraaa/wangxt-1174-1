const STORE_KEY = 'cssd_mock_data';

const STATUS_MAP = {
    0: '已提交需求', 1: '清洗中', 2: '灭菌中', 3: '缺件待处理',
    4: '待放行', 5: '已放行', 6: '已发往手术室', 7: '已退回', 9: '灭菌失败'
};
const BATCH_STATUS_MAP = { 0: '灭菌中', 1: '已完成', 2: '失败' };
const STER_RESULT_MAP = { 0: '不合格', 1: '合格' };
const LACK_STATUS_MAP = { 0: '待处理', 1: '处理中', 2: '已解决' };

function now() { return new Date().toLocaleString('zh-CN'); }
function today() { return new Date().toISOString().split('T')[0]; }

function genPk(store, prefix) {
    return prefix + '_' + String(store.counters[prefix]++).padStart(6, '0');
}

function getStore() {
    try {
        const raw = localStorage.getItem(STORE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return initStore();
}

function saveStore(store) {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function initStore() {
    const store = { packages: [], batches: [], lackRecords: [], releaseRecords: [], counters: { pkg: 1, item: 1, batch: 1, lack: 1, release: 1 } };
    seedData(store);
    saveStore(store);
    return store;
}

function seedData(store) {
    const batch1Pk = genPk(store, 'batch');
    const batch2Pk = genPk(store, 'batch');

    const mkItems = (pkPkg, list) => list.map(m => ({
        pk_instritem: genPk(store, 'item'), pk_instrpkg: pkPkg,
        instrument_code: m[0], instrument_name: m[1], instrument_spec: m[2],
        plan_qty: m[3], actual_qty: m[4] || 0, lack_qty: m[5] || 0, lack_flag: m[6] || 0
    }));

    const pkg1Pk = genPk(store, 'pkg');
    const pkg2Pk = genPk(store, 'pkg');
    const pkg3Pk = genPk(store, 'pkg');
    const pkg4Pk = genPk(store, 'pkg');
    const pkg5Pk = genPk(store, 'pkg');

    const pkgBase = (pk, code, name, type, or, status, extra) => ({
        pk_instrpkg: pk, package_code: code, package_name: name, package_type: type,
        package_status: status, pk_sterbatch: null, sterilization_batchno: null,
        operation_room: or, require_date: today(), require_time: now(),
        sterilize_time: null, release_time: null, remark: '',
        is_released: 0, is_sent: 0, lack_flag: 0,
        creator: 'nurse_zhang', creationtime: now(), dr: 0, ts: now(),
        ...extra,
        _details: { cssd_instritem: [] }
    });

    const pkg1 = pkgBase(pkg1Pk, 'PKG-2024-001', '基础手术器械包', '普通器械包', '手术室1号', 0);
    pkg1._details.cssd_instritem = mkItems(pkg1Pk, [
        ['S-001', '手术剪', '14cm', 2], ['S-002', '止血钳', '16cm', 4]
    ]);

    const pkg2 = pkgBase(pkg2Pk, 'PKG-2024-002', '腹腔镜器械包', '手术器械包', '手术室2号', 1);
    pkg2._details.cssd_instritem = mkItems(pkg2Pk, [
        ['F-001', '腹腔镜', '10mm', 1, 1], ['F-002', '抓钳', '5mm', 2, 2]
    ]);

    const pkg3 = pkgBase(pkg3Pk, 'PKG-2024-003', '骨科器械包', '专科器械包', '手术室3号', 4,
        { pk_sterbatch: batch1Pk, sterilization_batchno: 'STER-2024-001', sterilize_time: now() });
    pkg3._details.cssd_instritem = mkItems(pkg3Pk, [
        ['G-001', '骨锤', '标准', 1, 1], ['G-002', '骨凿', '8mm', 2, 2]
    ]);

    const pkg4 = pkgBase(pkg4Pk, 'PKG-2024-004', '缝合器械包', '普通器械包', '手术室1号', 5,
        { pk_sterbatch: batch1Pk, sterilization_batchno: 'STER-2024-001', sterilize_time: now(), is_released: 1, release_time: now() });
    pkg4._details.cssd_instritem = mkItems(pkg4Pk, [
        ['H-001', '持针器', '18cm', 2, 2]
    ]);

    const pkg5 = pkgBase(pkg5Pk, 'PKG-2024-005', '心脏手术器械包', '手术器械包', '手术室4号', 6,
        { pk_sterbatch: batch2Pk, sterilization_batchno: 'STER-2024-002', sterilize_time: now(), is_released: 1, release_time: now(), is_sent: 1 });
    pkg5._details.cssd_instritem = mkItems(pkg5Pk, [
        ['X-001', '心脏拉钩', '大号', 2, 2], ['X-002', '阻断钳', '标准', 1, 1]
    ]);

    const batch1 = {
        pk_sterbatch: batch1Pk, batch_no: 'STER-2024-001', sterilizer_code: 'DEV-A01',
        sterilizer_name: '灭菌器A', sterilize_type: 1, start_time: now(), end_time: now(),
        batch_status: 1, sterilize_result: 1, failure_reason: null,
        creator: 'disinfector_li', creationtime: now(), dr: 0, ts: now()
    };
    const batch2 = {
        pk_sterbatch: batch2Pk, batch_no: 'STER-2024-002', sterilizer_code: 'DEV-B01',
        sterilizer_name: '灭菌器B', sterilize_type: 2, start_time: now(), end_time: now(),
        batch_status: 1, sterilize_result: 1, failure_reason: null,
        creator: 'disinfector_li', creationtime: now(), dr: 0, ts: now()
    };

    const rel1 = {
        pk_releaserecord: genPk(store, 'release'), pk_instrpkg: pkg4Pk, package_code: 'PKG-2024-004',
        pk_sterbatch: batch1Pk, sterilization_batchno: 'STER-2024-001',
        release_type: 0, release_result: 1, pk_qualitynurse: 'nurse_qc_wang',
        release_time: now(), unpass_reason: null, remark: null
    };
    const rel2 = {
        pk_releaserecord: genPk(store, 'release'), pk_instrpkg: pkg5Pk, package_code: 'PKG-2024-005',
        pk_sterbatch: batch2Pk, sterilization_batchno: 'STER-2024-002',
        release_type: 0, release_result: 1, pk_qualitynurse: 'nurse_qc_wang',
        release_time: now(), unpass_reason: null, remark: null
    };

    store.packages = [pkg1, pkg2, pkg3, pkg4, pkg5];
    store.batches = [batch1, batch2];
    store.releaseRecords = [rel1, rel2];
}

function findPkg(store, pk) { return store.packages.find(p => p.pk_instrpkg === pk); }
function findBatch(store, pk) { return store.batches.find(b => b.pk_sterbatch === pk); }

function handleQueryList(store) {
    return { success: true, data: store.packages };
}

function handleSubmitRequirement(store, data) {
    const billData = typeof data.billData === 'string' ? JSON.parse(data.billData) : data.billData;
    const parent = billData.parent;
    const details = billData._details || {};
    const items = details.cssd_instritem || [];

    const pkPkg = genPk(store, 'pkg');
    const pkg = {
        pk_instrpkg: pkPkg, package_code: parent.package_code, package_name: parent.package_name,
        package_type: parent.package_type || '普通器械包', package_status: 0,
        pk_sterbatch: null, sterilization_batchno: null,
        operation_room: parent.operation_room, require_date: parent.require_date || today(),
        require_time: now(), sterilize_time: null, release_time: null,
        remark: parent.remark || '', is_released: 0, is_sent: 0, lack_flag: 0,
        creator: 'nurse_zhang', creationtime: now(), dr: 0, ts: now(),
        _details: {
            cssd_instritem: items.map(it => ({
                pk_instritem: genPk(store, 'item'), pk_instrpkg: pkPkg,
                instrument_code: it.instrument_code, instrument_name: it.instrument_name,
                instrument_spec: it.instrument_spec || '', plan_qty: Number(it.plan_qty) || 1,
                actual_qty: 0, lack_qty: 0, lack_flag: 0
            }))
        }
    };
    store.packages.unshift(pkg);
    saveStore(store);
    return { success: true, data: pkg };
}

function handleRegisterCleaning(store, data) {
    const pkg = findPkg(store, data.pkInstrpkg);
    if (!pkg) return { success: false, error: { message: '器械包不存在' } };
    if (pkg.package_status !== 0) return { success: false, error: { message: '只有"已提交需求"状态的器械包才能登记清洗' } };
    pkg.package_status = 1;
    pkg.ts = now();
    pkg._details.cssd_instritem.forEach(it => { it.actual_qty = it.plan_qty; });
    saveStore(store);
    return { success: true };
}

function handleRegisterLack(store, data) {
    const pkg = findPkg(store, data.pkInstrpkg);
    if (!pkg) return { success: false, error: { message: '器械包不存在' } };
    if (pkg.is_sent === 1) return { success: false, error: { message: '已发往手术室的器械包不能登记缺件' } };
    if (![0, 1, 2, 3, 4].includes(pkg.package_status)) return { success: false, error: { message: '当前状态不允许登记缺件' } };

    const pkItems = data.pkInstritems || [];
    if (pkItems.length === 0) return { success: false, error: { message: '请选择缺件器械' } };

    const items = pkg._details.cssd_instritem;
    pkItems.forEach(pkItem => {
        const item = items.find(i => i.pk_instritem === pkItem);
        if (item) {
            item.lack_flag = 1;
            item.lack_qty = item.plan_qty - item.actual_qty;
            if (item.lack_qty <= 0) item.lack_qty = item.plan_qty;
            item.actual_qty = item.plan_qty - item.lack_qty;
            store.lackRecords.push({
                pk_lackrecord: genPk(store, 'lack'), pk_instrpkg: pkg.pk_instrpkg,
                package_code: pkg.package_code, pk_instritem: item.pk_instritem,
                instrument_code: item.instrument_code, instrument_name: item.instrument_name,
                lack_qty: item.lack_qty, handle_status: 0,
                pk_handler: null, handle_time: null, handle_result: null
            });
        }
    });
    pkg.lack_flag = 1;
    pkg.package_status = 3;
    pkg.ts = now();
    saveStore(store);
    return { success: true };
}

function handleResolveLack(store, data) {
    const rec = store.lackRecords.find(r => r.pk_lackrecord === data.pkLackrecord);
    if (!rec) return { success: false, error: { message: '缺件记录不存在' } };
    if (rec.handle_status === 2) return { success: false, error: { message: '该缺件已处理' } };

    rec.handle_status = 2;
    rec.handle_time = now();
    rec.handle_result = data.handleResult || '已补齐';

    const pkg = findPkg(store, rec.pk_instrpkg);
    if (pkg) {
        const allResolved = store.lackRecords
            .filter(r => r.pk_instrpkg === pkg.pk_instrpkg)
            .every(r => r.handle_status === 2);
        if (allResolved) {
            pkg.lack_flag = 0;
            pkg.package_status = 1;
            pkg._details.cssd_instritem.forEach(it => {
                it.lack_flag = 0;
                it.lack_qty = 0;
                it.actual_qty = it.plan_qty;
            });
        }
        pkg.ts = now();
    }
    saveStore(store);
    return { success: true };
}

function handleConfirmRelease(store, data) {
    const pkg = findPkg(store, data.pkInstrpkg);
    if (!pkg) return { success: false, error: { message: '器械包不存在' } };

    if (pkg.is_sent === 1) {
        return { success: false, error: { message: '已发往手术室的器械包不能修改灭菌批号和放行状态' } };
    }
    if (pkg.lack_flag === 1) {
        return { success: false, error: { message: '器械包存在未处理的缺件，请先处理缺件后再放行' } };
    }
    if (pkg.pk_sterbatch) {
        const batch = findBatch(store, pkg.pk_sterbatch);
        if (batch && batch.sterilize_result === 0) {
            return { success: false, error: { message: '灭菌批次失败，不能发放该器械包' } };
        }
    }

    const releaseResult = Number(data.releaseResult);
    const record = {
        pk_releaserecord: genPk(store, 'release'), pk_instrpkg: pkg.pk_instrpkg,
        package_code: pkg.package_code, pk_sterbatch: pkg.pk_sterbatch,
        sterilization_batchno: pkg.sterilization_batchno,
        release_type: 0, release_result: releaseResult,
        pk_qualitynurse: 'nurse_qc_wang', release_time: now(),
        unpass_reason: releaseResult === 0 ? (data.unpassReason || '') : null,
        remark: null
    };

    if (releaseResult === 1) {
        pkg.package_status = 5;
        pkg.is_released = 1;
        pkg.release_time = now();
    } else {
        pkg.package_status = 7;
        pkg.is_released = 0;
        record.release_type = 1;
    }
    pkg.ts = now();

    store.releaseRecords.unshift(record);
    saveStore(store);
    return { success: true };
}

function handleSendToOR(store, data) {
    const pkg = findPkg(store, data.pkInstrpkg);
    if (!pkg) return { success: false, error: { message: '器械包不存在' } };
    if (pkg.package_status !== 5) return { success: false, error: { message: '只有"已放行"状态的器械包才能发往手术室' } };
    pkg.package_status = 6;
    pkg.is_sent = 1;
    pkg.ts = now();
    saveStore(store);
    return { success: true };
}

function handleSterBatchCreate(store, data) {
    const batchData = typeof data.batchData === 'string' ? JSON.parse(data.batchData) : data.batchData;
    const pkInstrpkgs = data.pkInstrpkgs || [];
    if (!batchData.batch_no) return { success: false, error: { message: '批次号不能为空' } };

    const pkBatch = genPk(store, 'batch');
    const batch = {
        pk_sterbatch: pkBatch, batch_no: batchData.batch_no,
        sterilizer_code: batchData.sterilizer_code || '',
        sterilizer_name: batchData.sterilizer_name || '',
        sterilize_type: batchData.sterilize_type || 1,
        start_time: now(), end_time: null,
        batch_status: 0, sterilize_result: null, failure_reason: null,
        creator: 'disinfector_li', creationtime: now(), dr: 0, ts: now()
    };

    pkInstrpkgs.forEach(pkPkg => {
        const pkg = findPkg(store, pkPkg);
        if (pkg && pkg.package_status === 1) {
            pkg.package_status = 2;
            pkg.pk_sterbatch = pkBatch;
            pkg.sterilization_batchno = batchData.batch_no;
            pkg.sterilize_time = now();
            pkg.ts = now();
        }
    });

    store.batches.unshift(batch);
    saveStore(store);
    return { success: true, data: batch };
}

function handleSterBatchFinish(store, data) {
    const batch = findBatch(store, data.pkSterbatch);
    if (!batch) return { success: false, error: { message: '灭菌批次不存在' } };
    if (batch.batch_status !== 0) return { success: false, error: { message: '该批次已出结果' } };

    const result = Number(data.sterilizeResult);
    batch.end_time = now();
    batch.sterilize_result = result;
    batch.failure_reason = result === 0 ? (data.failureReason || '') : null;

    if (result === 1) {
        batch.batch_status = 1;
        store.packages.forEach(pkg => {
            if (pkg.pk_sterbatch === batch.pk_sterbatch && pkg.package_status === 2) {
                pkg.package_status = 4;
                pkg.ts = now();
            }
        });
    } else {
        batch.batch_status = 2;
        store.packages.forEach(pkg => {
            if (pkg.pk_sterbatch === batch.pk_sterbatch) {
                pkg.package_status = 9;
                pkg.ts = now();
            }
        });
    }
    batch.ts = now();
    saveStore(store);
    return { success: true };
}

function handleSterBatchQueryList(store) {
    return { success: true, data: store.batches };
}

function handleLackRecordQueryList(store) {
    return { success: true, data: store.lackRecords };
}

function handleReleaseRecordQueryList(store) {
    return { success: true, data: store.releaseRecords };
}

const ROUTE_MAP = {
    'cssd.instrument.queryList': handleQueryList,
    'cssd.instrument.submitRequirement': handleSubmitRequirement,
    'cssd.instrument.registerCleaning': handleRegisterCleaning,
    'cssd.instrument.registerLack': handleRegisterLack,
    'cssd.instrument.resolveLack': handleResolveLack,
    'cssd.instrument.confirmRelease': handleConfirmRelease,
    'cssd.instrument.sendToOR': handleSendToOR,
    'cssd.sterbatch.create': handleSterBatchCreate,
    'cssd.sterbatch.finish': handleSterBatchFinish,
    'cssd.sterbatch.queryList': handleSterBatchQueryList,
    'cssd.lackrecord.queryList': handleLackRecordQueryList,
    'cssd.releaserecord.queryList': handleReleaseRecordQueryList,
};

export function ajax({ url, data = {}, success }) {
    const match = url.match(/cssd\.([^.]+)\.([^.]+)\.do/);
    if (!match) {
        setTimeout(() => success({ success: false, error: { message: '未知接口: ' + url } }), 100);
        return;
    }
    const routeKey = 'cssd.' + match[1] + '.' + match[2];
    const handler = ROUTE_MAP[routeKey];
    if (!handler) {
        setTimeout(() => success({ success: false, error: { message: '未注册接口: ' + routeKey } }), 100);
        return;
    }
    const store = getStore();
    let result;
    try {
        result = handler(store, data);
    } catch (e) {
        result = { success: false, error: { message: e.message } };
    }
    setTimeout(() => success(result), 150);
}

export function resetMockData() {
    localStorage.removeItem(STORE_KEY);
}

export { STATUS_MAP, BATCH_STATUS_MAP, STER_RESULT_MAP, LACK_STATUS_MAP };

if (typeof window !== 'undefined') {
    window.CSSDMock = {
        ajax,
        resetMockData,
        getStore,
        syncCall: (url, data) => {
            const match = url.match(/cssd\.([^.]+)\.([^.]+)\.do/);
            if (!match) return { success: false, error: { message: '未知接口: ' + url } };
            const routeKey = 'cssd.' + match[1] + '.' + match[2];
            const handler = ROUTE_MAP[routeKey];
            if (!handler) return { success: false, error: { message: '未注册接口: ' + routeKey } };
            const store = getStore();
            try {
                const result = handler(store, data);
                saveStore(store);
                return result;
            } catch (e) {
                return { success: false, error: { message: e.message } };
            }
        }
    };
}
