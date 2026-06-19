package nccloud.web.cssd.instrument.action;

import nccloud.framework.core.exception.ExceptionUtils;
import nccloud.framework.core.json.IJson;
import nccloud.framework.service.ServiceLocator;
import nccloud.framework.web.action.itf.ICommonAction;
import nccloud.framework.web.container.IRequest;
import nccloud.framework.web.json.JsonFactory;
import nc.itf.cssd.instrument.ICSSDInstrumentService;
import nc.vo.cssd.instrument.SterilizationBatchVO;

import java.util.Map;

public class SterBatchFinishAction implements ICommonAction {

    @Override
    public Object doAction(IRequest request) {
        try {
            IJson json = JsonFactory.create();
            @SuppressWarnings("unchecked")
            Map<String, Object> map = json.fromJson(request.read(), Map.class);

            String pkSterbatch = map != null ? (String) map.get("pkSterbatch") : null;
            Integer result = map != null && map.get("sterilizeResult") != null
                    ? (Integer) map.get("sterilizeResult") : null;
            String failureReason = map != null ? (String) map.get("failureReason") : null;

            if (pkSterbatch == null || pkSterbatch.isEmpty()) {
                ExceptionUtils.wrapBusinessException("灭菌批次主键不能为空");
            }
            if (result == null) {
                ExceptionUtils.wrapBusinessException("灭菌结果不能为空");
            }

            ICSSDInstrumentService service = ServiceLocator.find(ICSSDInstrumentService.class);
            SterilizationBatchVO ret = service.finishSterilizationBatch(pkSterbatch, result, failureReason);

            return ret;
        } catch (Exception e) {
            ExceptionUtils.wrapException(e);
            return null;
        }
    }
}
