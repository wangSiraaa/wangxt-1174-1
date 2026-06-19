package nc.impl.cssd.instrument;

import nc.bs.dao.BaseDAO;
import nc.bs.framework.common.InvocationInfoProxy;
import nc.bs.logging.Logger;
import nc.impl.pubapp.pattern.data.IRowSet;
import nc.impl.pubapp.pattern.data.bill.BillQuery;
import nc.impl.pubapp.pattern.data.bill.BillUpdate;
import nc.itf.cssd.instrument.ICSSDInstrumentService;
import nc.jdbc.framework.processor.ColumnProcessor;
import nc.vo.cssd.instrument.AggInstrumentPackageVO;
import nc.vo.cssd.instrument.CSSDInstrumentConstant;
import nc.vo.cssd.instrument.InstrumentItemVO;
import nc.vo.cssd.instrument.InstrumentPackageVO;
import nc.vo.cssd.instrument.LackRecordVO;
import nc.vo.cssd.instrument.ReleaseRecordVO;
import nc.vo.cssd.instrument.SterilizationBatchVO;
import nc.vo.pub.BusinessException;
import nc.vo.pub.SuperVO;
import nc.vo.pub.VOStatus;
import nc.vo.pub.lang.UFDateTime;
import nc.vo.pub.lang.UFDouble;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.framework.core.exception.ExceptionUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class CSSDInstrumentServiceImpl implements ICSSDInstrumentService {

    private BaseDAO dao = new BaseDAO();

    @Override
    public AggInstrumentPackageVO submitRequirement(AggInstrumentPackageVO aggVO) throws BusinessException {
        try {
            validateSubmitRequirement(aggVO);
            fillAuditFields(aggVO, true);
            aggVO.getParentVO().setPackage_status(CSSDInstrumentConstant.PACKAGE_STATUS_REQUIRED);
            aggVO.getParentVO().setIs_released(CSSDInstrumentConstant.NO);
            aggVO.getParentVO().setIs_sent(CSSDInstrumentConstant.NO);
            aggVO.getParentVO().setLack_flag(CSSDInstrumentConstant.NO);
            aggVO.getParentVO().setRequire_time(new UFDateTime());

            SuperVO[] children = aggVO.getChildrenVO();
            if (children != null) {
                for (SuperVO child : children) {
                    InstrumentItemVO item = (InstrumentItemVO) child;
                    item.setStatus(VOStatus.NEW);
                    fillChildAuditFields(item, true);
                    item.setLack_flag(CSSDInstrumentConstant.NO);
                    if (item.getActual_qty() == null) {
                        item.setActual_qty(UFDouble.ZERO_DBL);
                    }
                    if (item.getLack_qty() == null) {
                        item.setLack_qty(UFDouble.ZERO_DBL);
                    }
                    if (item.getPlan_qty() == null) {
                        item.setPlan_qty(UFDouble.ZERO_DBL);
                    }
                }
            }

            BillUpdate<AggInstrumentPackageVO> update = new BillUpdate<>();
            AggInstrumentPackageVO[] result = update.insert(new AggInstrumentPackageVO[]{aggVO});
            return result[0];
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Logger.error("提交器械包需求失败", e);
            throw new BusinessException("提交器械包需求失败：" + e.getMessage(), e);
        }
    }

    @Override
    public AggInstrumentPackageVO registerCleaning(String pkInstrpkg) throws BusinessException {
        try {
            AggInstrumentPackageVO aggVO = queryByPk(pkInstrpkg);
            if (aggVO == null) {
                ExceptionUtils.wrapBusinessException("器械包不存在");
            }
            InstrumentPackageVO headVO = aggVO.getParentVO();
            if (headVO.getPackage_status() != CSSDInstrumentConstant.PACKAGE_STATUS_REQUIRED) {
                ExceptionUtils.wrapBusinessException("当前状态不允许登记清洗");
            }

            headVO.setPackage_status(CSSDInstrumentConstant.PACKAGE_STATUS_CLEANING);
            headVO.setPk_disinfector(InvocationInfoProxy.getInstance().getUserId());
            fillAuditFields(aggVO, false);

            BillUpdate<AggInstrumentPackageVO> update = new BillUpdate<>();
            AggInstrumentPackageVO[] result = update.update(
                new AggInstrumentPackageVO[]{aggVO},
                new AggInstrumentPackageVO[]{queryByPk(pkInstrpkg)}
            );
            return result[0];
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Logger.error("登记清洗失败", e);
            throw new BusinessException("登记清洗失败：" + e.getMessage(), e);
        }
    }

    @Override
    public SterilizationBatchVO createSterilizationBatch(SterilizationBatchVO batchVO, String[] pkInstrpkgs) throws BusinessException {
        try {
            if (pkInstrpkgs == null || pkInstrpkgs.length == 0) {
                ExceptionUtils.wrapBusinessException("请选择要灭菌的器械包");
            }

            batchVO.setStatus(VOStatus.NEW);
            batchVO.setBatch_status(CSSDInstrumentConstant.BATCH_STATUS_RUNNING);
            batchVO.setStart_time(new UFDateTime());
            batchVO.setPk_operator(InvocationInfoProxy.getInstance().getUserId());
            fillBatchAuditFields(batchVO, true);

            dao.insertVO(batchVO);

            String pkSterbatch = batchVO.getPk_sterbatch();
            for (String pkInstrpkg : pkInstrpkgs) {
                AggInstrumentPackageVO aggVO = queryByPk(pkInstrpkg);
                if (aggVO == null) continue;

                InstrumentPackageVO headVO = aggVO.getParentVO();
                if (headVO.getPackage_status() != CSSDInstrumentConstant.PACKAGE_STATUS_CLEANING) {
                    continue;
                }

                headVO.setPk_sterbatch(pkSterbatch);
                headVO.setSterilization_batchno(batchVO.getBatch_no());
                headVO.setPackage_status(CSSDInstrumentConstant.PACKAGE_STATUS_STERILIZING);
                headVO.setPk_disinfector(InvocationInfoProxy.getInstance().getUserId());
                headVO.setSterilize_time(new UFDateTime());
                fillAuditFields(aggVO, false);

                BillUpdate<AggInstrumentPackageVO> update = new BillUpdate<>();
                update.update(new AggInstrumentPackageVO[]{aggVO}, new AggInstrumentPackageVO[]{queryByPk(pkInstrpkg)});
            }

            return batchVO;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Logger.error("创建灭菌批次失败", e);
            throw new BusinessException("创建灭菌批次失败：" + e.getMessage(), e);
        }
    }

    @Override
    public SterilizationBatchVO finishSterilizationBatch(String pkSterbatch, Integer result, String failureReason) throws BusinessException {
        try {
            SterilizationBatchVO batchVO = querySterBatchByPk(pkSterbatch);
            if (batchVO == null) {
                ExceptionUtils.wrapBusinessException("灭菌批次不存在");
            }
            if (batchVO.getBatch_status() != CSSDInstrumentConstant.BATCH_STATUS_RUNNING) {
                ExceptionUtils.wrapBusinessException("灭菌批次状态不正确");
            }

            batchVO.setBatch_status(CSSDInstrumentConstant.BATCH_STATUS_FINISHED);
            batchVO.setSterilize_result(result);
            batchVO.setEnd_time(new UFDateTime());
            batchVO.setPk_operator(InvocationInfoProxy.getInstance().getUserId());
            if (CSSDInstrumentConstant.STERILIZE_RESULT_FAIL == result) {
                batchVO.setBatch_status(CSSDInstrumentConstant.BATCH_STATUS_FAILED);
                batchVO.setFailure_reason(failureReason);
            }
            fillBatchAuditFields(batchVO, false);
            dao.updateVO(batchVO);

            String condition = "pk_sterbatch = ? and dr = 0";
            nc.jdbc.framework.SQLParameter param = new nc.jdbc.framework.SQLParameter();
            param.addParam(pkSterbatch);
            Collection<InstrumentPackageVO> packages = dao.retrieveByClause(InstrumentPackageVO.class, condition, param);

            if (packages != null) {
                for (InstrumentPackageVO pkg : packages) {
                    if (CSSDInstrumentConstant.STERILIZE_RESULT_FAIL == result) {
                        pkg.setPackage_status(CSSDInstrumentConstant.PACKAGE_STATUS_FAILED);
                    } else {
                        pkg.setPackage_status(CSSDInstrumentConstant.PACKAGE_STATUS_WAIT_RELEASE);
                    }
                    pkg.setModifier(InvocationInfoProxy.getInstance().getUserId());
                    pkg.setModifiedtime(new UFDateTime());
                    dao.updateVO(pkg);
                }
            }

            return batchVO;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Logger.error("完成灭菌批次失败", e);
            throw new BusinessException("完成灭菌批次失败：" + e.getMessage(), e);
        }
    }

    @Override
    public AggInstrumentPackageVO registerLack(String pkInstrpkg, String[] pkInstritems) throws BusinessException {
        try {
            AggInstrumentPackageVO aggVO = queryByPk(pkInstrpkg);
            if (aggVO == null) {
                ExceptionUtils.wrapBusinessException("器械包不存在");
            }

            InstrumentPackageVO headVO = aggVO.getParentVO();
            if (headVO.getIs_sent() != null && headVO.getIs_sent() == CSSDInstrumentConstant.YES) {
                ExceptionUtils.wrapBusinessException("已发往手术室的器械包不能登记缺件，请联系手术室退回");
            }

            boolean hasLack = false;
            SuperVO[] children = aggVO.getChildrenVO();
            if (children != null && pkInstritems != null) {
                for (SuperVO child : children) {
                    InstrumentItemVO item = (InstrumentItemVO) child;
                    for (String pkItem : pkInstritems) {
                        if (pkItem.equals(item.getPk_instritem())) {
                            item.setLack_flag(CSSDInstrumentConstant.YES);
                            UFDouble lack = item.getPlan_qty().sub(item.getActual_qty() == null ? UFDouble.ZERO_DBL : item.getActual_qty());
                            if (lack.compareTo(UFDouble.ZERO_DBL) < 0) {
                                lack = UFDouble.ZERO_DBL;
                            }
                            item.setLack_qty(lack);
                            item.setStatus(VOStatus.UPDATED);
                            hasLack = true;

                            LackRecordVO lackRecord = new LackRecordVO();
                            lackRecord.setStatus(VOStatus.NEW);
                            lackRecord.setPk_instrpkg(pkInstrpkg);
                            lackRecord.setPackage_code(headVO.getPackage_code());
                            lackRecord.setPk_instritem(item.getPk_instritem());
                            lackRecord.setInstrument_code(item.getInstrument_code());
                            lackRecord.setInstrument_name(item.getInstrument_name());
                            lackRecord.setLack_qty(lack);
                            lackRecord.setHandle_status(CSSDInstrumentConstant.LACK_STATUS_WAIT);
                            lackRecord.setPk_group(headVO.getPk_group());
                            lackRecord.setPk_org(headVO.getPk_org());
                            lackRecord.setCreator(InvocationInfoProxy.getInstance().getUserId());
                            lackRecord.setCreationtime(new UFDateTime());
                            lackRecord.setModifier(InvocationInfoProxy.getInstance().getUserId());
                            lackRecord.setModifiedtime(new UFDateTime());
                            lackRecord.setDr(0);
                            dao.insertVO(lackRecord);
                        }
                    }
                }
            }

            if (hasLack) {
                headVO.setLack_flag(CSSDInstrumentConstant.YES);
                headVO.setPackage_status(CSSDInstrumentConstant.PACKAGE_STATUS_LACK);
                fillAuditFields(aggVO, false);

                BillUpdate<AggInstrumentPackageVO> update = new BillUpdate<>();
                AggInstrumentPackageVO[] result = update.update(
                    new AggInstrumentPackageVO[]{aggVO},
                    new AggInstrumentPackageVO[]{queryByPk(pkInstrpkg)}
                );
                return result[0];
            }

            return aggVO;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Logger.error("登记缺件失败", e);
            throw new BusinessException("登记缺件失败：" + e.getMessage(), e);
        }
    }

    @Override
    public AggInstrumentPackageVO resolveLack(String pkLackrecord, String handleResult) throws BusinessException {
        try {
            LackRecordVO lackRecord = (LackRecordVO) dao.retrieveByPK(LackRecordVO.class, pkLackrecord);
            if (lackRecord == null) {
                ExceptionUtils.wrapBusinessException("缺件记录不存在");
            }

            lackRecord.setHandle_status(CSSDInstrumentConstant.LACK_STATUS_RESOLVED);
            lackRecord.setPk_handler(InvocationInfoProxy.getInstance().getUserId());
            lackRecord.setHandle_time(new UFDateTime());
            lackRecord.setHandle_result(handleResult);
            lackRecord.setModifier(InvocationInfoProxy.getInstance().getUserId());
            lackRecord.setModifiedtime(new UFDateTime());
            dao.updateVO(lackRecord);

            String condition = "pk_instrpkg = ? and handle_status = ? and dr = 0";
            nc.jdbc.framework.SQLParameter param = new nc.jdbc.framework.SQLParameter();
            param.addParam(lackRecord.getPk_instrpkg());
            param.addParam(CSSDInstrumentConstant.LACK_STATUS_WAIT);
            Collection<LackRecordVO> pendingLacks = dao.retrieveByClause(LackRecordVO.class, condition, param);

            AggInstrumentPackageVO aggVO = queryByPk(lackRecord.getPk_instrpkg());
            if (pendingLacks == null || pendingLacks.isEmpty()) {
                InstrumentPackageVO headVO = aggVO.getParentVO();
                headVO.setLack_flag(CSSDInstrumentConstant.NO);
                if (headVO.getPackage_status() == CSSDInstrumentConstant.PACKAGE_STATUS_LACK) {
                    if (headVO.getSterilization_batchno() != null) {
                        headVO.setPackage_status(CSSDInstrumentConstant.PACKAGE_STATUS_WAIT_RELEASE);
                    } else {
                        headVO.setPackage_status(CSSDInstrumentConstant.PACKAGE_STATUS_REQUIRED);
                    }
                }
                fillAuditFields(aggVO, false);

                BillUpdate<AggInstrumentPackageVO> update = new BillUpdate<>();
                AggInstrumentPackageVO[] result = update.update(
                    new AggInstrumentPackageVO[]{aggVO},
                    new AggInstrumentPackageVO[]{queryByPk(lackRecord.getPk_instrpkg())}
                );
                return result[0];
            }

            return aggVO;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Logger.error("处理缺件失败", e);
            throw new BusinessException("处理缺件失败：" + e.getMessage(), e);
        }
    }

    @Override
    public ReleaseRecordVO confirmRelease(String pkInstrpkg, Integer result, String unpassReason) throws BusinessException {
        try {
            AggInstrumentPackageVO aggVO = queryByPk(pkInstrpkg);
            if (aggVO == null) {
                ExceptionUtils.wrapBusinessException("器械包不存在");
            }

            InstrumentPackageVO headVO = aggVO.getParentVO();

            if (CSSDInstrumentConstant.YES == headVO.getIs_sent()) {
                ExceptionUtils.wrapBusinessException("已发往手术室的器械包不能修改灭菌批号和放行状态");
            }

            if (headVO.getPackage_status() != CSSDInstrumentConstant.PACKAGE_STATUS_WAIT_RELEASE) {
                ExceptionUtils.wrapBusinessException("当前状态不允许放行确认");
            }

            if (headVO.getLack_flag() != null && headVO.getLack_flag() == CSSDInstrumentConstant.YES) {
                ExceptionUtils.wrapBusinessException("器械包存在未处理的缺件，请先处理缺件后再放行");
            }

            if (headVO.getPk_sterbatch() != null) {
                SterilizationBatchVO batchVO = querySterBatchByPk(headVO.getPk_sterbatch());
                if (batchVO != null && batchVO.getSterilize_result() != null
                        && batchVO.getSterilize_result() == CSSDInstrumentConstant.STERILIZE_RESULT_FAIL) {
                    ExceptionUtils.wrapBusinessException("灭菌批次失败，不能发放该器械包");
                }
            }

            ReleaseRecordVO releaseRecord = new ReleaseRecordVO();
            releaseRecord.setStatus(VOStatus.NEW);
            releaseRecord.setPk_instrpkg(pkInstrpkg);
            releaseRecord.setPackage_code(headVO.getPackage_code());
            releaseRecord.setPk_sterbatch(headVO.getPk_sterbatch());
            releaseRecord.setSterilization_batchno(headVO.getSterilization_batchno());
            releaseRecord.setRelease_type(CSSDInstrumentConstant.RELEASE_TYPE_NORMAL);
            releaseRecord.setRelease_result(result);
            releaseRecord.setPk_qualitynurse(InvocationInfoProxy.getInstance().getUserId());
            releaseRecord.setRelease_time(new UFDateTime());
            if (CSSDInstrumentConstant.RELEASE_RESULT_UNPASS == result) {
                releaseRecord.setUnpass_reason(unpassReason);
            }
            releaseRecord.setPk_group(headVO.getPk_group());
            releaseRecord.setPk_org(headVO.getPk_org());
            releaseRecord.setCreator(InvocationInfoProxy.getInstance().getUserId());
            releaseRecord.setCreationtime(new UFDateTime());
            releaseRecord.setModifier(InvocationInfoProxy.getInstance().getUserId());
            releaseRecord.setModifiedtime(new UFDateTime());
            releaseRecord.setDr(0);
            dao.insertVO(releaseRecord);

            if (CSSDInstrumentConstant.RELEASE_RESULT_PASS == result) {
                headVO.setIs_released(CSSDInstrumentConstant.YES);
                headVO.setPackage_status(CSSDInstrumentConstant.PACKAGE_STATUS_RELEASED);
                headVO.setPk_qualitynurse(InvocationInfoProxy.getInstance().getUserId());
                headVO.setRelease_time(new UFDateTime());
            } else {
                headVO.setPackage_status(CSSDInstrumentConstant.PACKAGE_STATUS_RETURNED);
            }
            fillAuditFields(aggVO, false);

            BillUpdate<AggInstrumentPackageVO> update = new BillUpdate<>();
            update.update(new AggInstrumentPackageVO[]{aggVO}, new AggInstrumentPackageVO[]{queryByPk(pkInstrpkg)});

            return releaseRecord;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Logger.error("确认放行失败", e);
            throw new BusinessException("确认放行失败：" + e.getMessage(), e);
        }
    }

    @Override
    public AggInstrumentPackageVO sendToOperationRoom(String pkInstrpkg) throws BusinessException {
        try {
            AggInstrumentPackageVO aggVO = queryByPk(pkInstrpkg);
            if (aggVO == null) {
                ExceptionUtils.wrapBusinessException("器械包不存在");
            }

            InstrumentPackageVO headVO = aggVO.getParentVO();
            if (headVO.getIs_released() == null || headVO.getIs_released() != CSSDInstrumentConstant.YES) {
                ExceptionUtils.wrapBusinessException("未放行的器械包不能发往手术室");
            }
            if (headVO.getIs_sent() != null && headVO.getIs_sent() == CSSDInstrumentConstant.YES) {
                ExceptionUtils.wrapBusinessException("器械包已发往手术室");
            }

            headVO.setIs_sent(CSSDInstrumentConstant.YES);
            headVO.setPackage_status(CSSDInstrumentConstant.PACKAGE_STATUS_SENT);
            fillAuditFields(aggVO, false);

            BillUpdate<AggInstrumentPackageVO> update = new BillUpdate<>();
            AggInstrumentPackageVO[] result = update.update(
                new AggInstrumentPackageVO[]{aggVO},
                new AggInstrumentPackageVO[]{queryByPk(pkInstrpkg)}
            );
            return result[0];
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Logger.error("发送器械包到手术室失败", e);
            throw new BusinessException("发送器械包到手术室失败：" + e.getMessage(), e);
        }
    }

    @Override
    public AggInstrumentPackageVO[] queryByCondition(String pkOrg, String pkGroup, Integer status) throws BusinessException {
        try {
            StringBuilder condition = new StringBuilder(" dr = 0 ");
            nc.jdbc.framework.SQLParameter param = new nc.jdbc.framework.SQLParameter();

            if (pkGroup != null && !pkGroup.isEmpty()) {
                condition.append(" and pk_group = ? ");
                param.addParam(pkGroup);
            }
            if (pkOrg != null && !pkOrg.isEmpty()) {
                condition.append(" and pk_org = ? ");
                param.addParam(pkOrg);
            }
            if (status != null) {
                condition.append(" and package_status = ? ");
                param.addParam(status);
            }
            condition.append(" order by creationtime desc ");

            BillQuery<AggInstrumentPackageVO> query = new BillQuery<>(AggInstrumentPackageVO.class);
            AggInstrumentPackageVO[] result = query.query(condition.toString(), param);
            return result;
        } catch (Exception e) {
            Logger.error("查询器械包失败", e);
            throw new BusinessException("查询器械包失败：" + e.getMessage(), e);
        }
    }

    @Override
    public SterilizationBatchVO[] querySterBatchByCondition(String pkOrg, String pkGroup, Integer status) throws BusinessException {
        try {
            StringBuilder condition = new StringBuilder(" dr = 0 ");
            nc.jdbc.framework.SQLParameter param = new nc.jdbc.framework.SQLParameter();

            if (pkGroup != null && !pkGroup.isEmpty()) {
                condition.append(" and pk_group = ? ");
                param.addParam(pkGroup);
            }
            if (pkOrg != null && !pkOrg.isEmpty()) {
                condition.append(" and pk_org = ? ");
                param.addParam(pkOrg);
            }
            if (status != null) {
                condition.append(" and batch_status = ? ");
                param.addParam(status);
            }
            condition.append(" order by creationtime desc ");

            Collection<SterilizationBatchVO> result = dao.retrieveByClause(SterilizationBatchVO.class, condition.toString(), param);
            return result.toArray(new SterilizationBatchVO[0]);
        } catch (Exception e) {
            Logger.error("查询灭菌批次失败", e);
            throw new BusinessException("查询灭菌批次失败：" + e.getMessage(), e);
        }
    }

    @Override
    public LackRecordVO[] queryLackRecords(String pkOrg, String pkGroup, Integer status) throws BusinessException {
        try {
            StringBuilder condition = new StringBuilder(" dr = 0 ");
            nc.jdbc.framework.SQLParameter param = new nc.jdbc.framework.SQLParameter();

            if (pkGroup != null && !pkGroup.isEmpty()) {
                condition.append(" and pk_group = ? ");
                param.addParam(pkGroup);
            }
            if (pkOrg != null && !pkOrg.isEmpty()) {
                condition.append(" and pk_org = ? ");
                param.addParam(pkOrg);
            }
            if (status != null) {
                condition.append(" and handle_status = ? ");
                param.addParam(status);
            }
            condition.append(" order by creationtime desc ");

            Collection<LackRecordVO> result = dao.retrieveByClause(LackRecordVO.class, condition.toString(), param);
            return result.toArray(new LackRecordVO[0]);
        } catch (Exception e) {
            Logger.error("查询缺件记录失败", e);
            throw new BusinessException("查询缺件记录失败：" + e.getMessage(), e);
        }
    }

    @Override
    public ReleaseRecordVO[] queryReleaseRecords(String pkOrg, String pkGroup) throws BusinessException {
        try {
            StringBuilder condition = new StringBuilder(" dr = 0 ");
            nc.jdbc.framework.SQLParameter param = new nc.jdbc.framework.SQLParameter();

            if (pkGroup != null && !pkGroup.isEmpty()) {
                condition.append(" and pk_group = ? ");
                param.addParam(pkGroup);
            }
            if (pkOrg != null && !pkOrg.isEmpty()) {
                condition.append(" and pk_org = ? ");
                param.addParam(pkOrg);
            }
            condition.append(" order by creationtime desc ");

            Collection<ReleaseRecordVO> result = dao.retrieveByClause(ReleaseRecordVO.class, condition.toString(), param);
            return result.toArray(new ReleaseRecordVO[0]);
        } catch (Exception e) {
            Logger.error("查询放行记录失败", e);
            throw new BusinessException("查询放行记录失败：" + e.getMessage(), e);
        }
    }

    @Override
    public AggInstrumentPackageVO queryByPk(String pkInstrpkg) throws BusinessException {
        try {
            BillQuery<AggInstrumentPackageVO> query = new BillQuery<>(AggInstrumentPackageVO.class);
            AggInstrumentPackageVO[] result = query.queryByPks(new String[]{pkInstrpkg});
            return (result != null && result.length > 0) ? result[0] : null;
        } catch (Exception e) {
            Logger.error("根据主键查询器械包失败", e);
            throw new BusinessException("查询器械包失败：" + e.getMessage(), e);
        }
    }

    @Override
    public SterilizationBatchVO querySterBatchByPk(String pkSterbatch) throws BusinessException {
        try {
            return (SterilizationBatchVO) dao.retrieveByPK(SterilizationBatchVO.class, pkSterbatch);
        } catch (Exception e) {
            Logger.error("根据主键查询灭菌批次失败", e);
            throw new BusinessException("查询灭菌批次失败：" + e.getMessage(), e);
        }
    }

    private void validateSubmitRequirement(AggInstrumentPackageVO aggVO) throws BusinessException {
        InstrumentPackageVO headVO = aggVO.getParentVO();
        if (headVO.getPackage_code() == null || headVO.getPackage_code().trim().isEmpty()) {
            ExceptionUtils.wrapBusinessException("器械包编号不能为空");
        }
        if (headVO.getPackage_name() == null || headVO.getPackage_name().trim().isEmpty()) {
            ExceptionUtils.wrapBusinessException("器械包名称不能为空");
        }
        if (headVO.getOperation_room() == null || headVO.getOperation_room().trim().isEmpty()) {
            ExceptionUtils.wrapBusinessException("手术室不能为空");
        }
        if (headVO.getRequire_date() == null) {
            ExceptionUtils.wrapBusinessException("需求日期不能为空");
        }

        SuperVO[] children = aggVO.getChildrenVO();
        if (children == null || children.length == 0) {
            ExceptionUtils.wrapBusinessException("器械包明细不能为空");
        }
    }

    private void fillAuditFields(AbstractBill aggVO, boolean isNew) {
        InstrumentPackageVO head = (InstrumentPackageVO) aggVO.getParent();
        String userId = InvocationInfoProxy.getInstance().getUserId();
        UFDateTime now = new UFDateTime();
        if (isNew) {
            head.setCreator(userId);
            head.setCreationtime(now);
            if (head.getPk_group() == null) {
                head.setPk_group(InvocationInfoProxy.getInstance().getGroupId());
            }
            if (head.getPk_org() == null) {
                head.setPk_org(InvocationInfoProxy.getInstance().getPk_org());
            }
        }
        head.setModifier(userId);
        head.setModifiedtime(now);
    }

    private void fillChildAuditFields(SuperVO vo, boolean isNew) {
        InstrumentItemVO item = (InstrumentItemVO) vo;
        String userId = InvocationInfoProxy.getInstance().getUserId();
        UFDateTime now = new UFDateTime();
        if (isNew) {
            item.setCreator(userId);
            item.setCreationtime(now);
            item.setPk_group(InvocationInfoProxy.getInstance().getGroupId());
            item.setPk_org(InvocationInfoProxy.getInstance().getPk_org());
        }
        item.setModifier(userId);
        item.setModifiedtime(now);
    }

    private void fillBatchAuditFields(SterilizationBatchVO vo, boolean isNew) {
        String userId = InvocationInfoProxy.getInstance().getUserId();
        UFDateTime now = new UFDateTime();
        if (isNew) {
            vo.setCreator(userId);
            vo.setCreationtime(now);
            if (vo.getPk_group() == null) {
                vo.setPk_group(InvocationInfoProxy.getInstance().getGroupId());
            }
            if (vo.getPk_org() == null) {
                vo.setPk_org(InvocationInfoProxy.getInstance().getPk_org());
            }
        }
        vo.setModifier(userId);
        vo.setModifiedtime(now);
    }
}
