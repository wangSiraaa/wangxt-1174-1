package nc.itf.cssd.instrument;

import nc.vo.cssd.instrument.AggInstrumentPackageVO;
import nc.vo.cssd.instrument.InstrumentPackageVO;
import nc.vo.cssd.instrument.LackRecordVO;
import nc.vo.cssd.instrument.ReleaseRecordVO;
import nc.vo.cssd.instrument.SterilizationBatchVO;
import nc.vo.pub.BusinessException;

public interface ICSSDInstrumentService {

    AggInstrumentPackageVO submitRequirement(AggInstrumentPackageVO aggVO) throws BusinessException;

    AggInstrumentPackageVO registerCleaning(String pkInstrpkg) throws BusinessException;

    SterilizationBatchVO createSterilizationBatch(SterilizationBatchVO batchVO, String[] pkInstrpkgs) throws BusinessException;

    SterilizationBatchVO finishSterilizationBatch(String pkSterbatch, Integer result, String failureReason) throws BusinessException;

    AggInstrumentPackageVO registerLack(String pkInstrpkg, String[] pkInstritems) throws BusinessException;

    AggInstrumentPackageVO resolveLack(String pkLackrecord, String handleResult) throws BusinessException;

    ReleaseRecordVO confirmRelease(String pkInstrpkg, Integer result, String unpassReason) throws BusinessException;

    AggInstrumentPackageVO sendToOperationRoom(String pkInstrpkg) throws BusinessException;

    AggInstrumentPackageVO[] queryByCondition(String pkOrg, String pkGroup, Integer status) throws BusinessException;

    SterilizationBatchVO[] querySterBatchByCondition(String pkOrg, String pkGroup, Integer status) throws BusinessException;

    LackRecordVO[] queryLackRecords(String pkOrg, String pkGroup, Integer status) throws BusinessException;

    ReleaseRecordVO[] queryReleaseRecords(String pkOrg, String pkGroup) throws BusinessException;

    AggInstrumentPackageVO queryByPk(String pkInstrpkg) throws BusinessException;

    SterilizationBatchVO querySterBatchByPk(String pkSterbatch) throws BusinessException;
}
