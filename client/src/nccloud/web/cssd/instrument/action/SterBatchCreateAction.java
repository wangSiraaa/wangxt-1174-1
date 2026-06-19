package nccloud.web.cssd.instrument.action;

import nccloud.framework.core.exception.ExceptionUtils;
import nccloud.framework.core.json.IJson;
import nccloud.framework.service.ServiceLocator;
import nccloud.framework.web.action.itf.ICommonAction;
import nccloud.framework.web.container.IRequest;
import nccloud.framework.web.container.SessionContext;
import nccloud.framework.web.container.ClientInfo;
import nccloud.framework.web.json.JsonFactory;
import nc.itf.cssd.instrument.ICSSDInstrumentService;
import nc.vo.cssd.instrument.SterilizationBatchVO;

import java.util.List;
import java.util.Map;

public class SterBatchCreateAction implements ICommonAction {

    @Override
    public Object doAction(IRequest request) {
        try {
            IJson json = JsonFactory.create();
            @SuppressWarnings("unchecked")
            Map<String, Object> map = json.fromJson(request.read(), Map.class);

            ClientInfo clientInfo = SessionContext.getInstance().getClientInfo();
            String pkGroup = clientInfo.getPk_group();
            String pkOrg = clientInfo.getPk_org();

            String batchVOJson = map != null ? (String) map.get("batchData") : null;
            @SuppressWarnings("unchecked")
            List<String> pkList = map != null ? (List<String>) map.get("pkInstrpkgs") : null;

            if (batchVOJson == null || batchVOJson.isEmpty()) {
                ExceptionUtils.wrapBusinessException("灭菌批次数据不能为空");
            }
            if (pkList == null || pkList.isEmpty()) {
                ExceptionUtils.wrapBusinessException("请选择要灭菌的器械包");
            }

            SterilizationBatchVO batchVO = json.fromJson(batchVOJson, SterilizationBatchVO.class);
            if (batchVO == null) {
                ExceptionUtils.wrapBusinessException("灭菌批次数据解析失败");
            }
            batchVO.setPk_group(pkGroup);
            batchVO.setPk_org(pkOrg);

            String[] pkInstrpkgs = pkList.toArray(new String[0]);

            ICSSDInstrumentService service = ServiceLocator.find(ICSSDInstrumentService.class);
            SterilizationBatchVO result = service.createSterilizationBatch(batchVO, pkInstrpkgs);

            return result;
        } catch (Exception e) {
            ExceptionUtils.wrapException(e);
            return null;
        }
    }
}
