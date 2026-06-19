package nccloud.web.cssd.instrument.action;

import nccloud.framework.core.exception.ExceptionUtils;
import nccloud.framework.core.json.IJson;
import nccloud.framework.service.ServiceLocator;
import nccloud.framework.web.action.itf.ICommonAction;
import nccloud.framework.web.container.IRequest;
import nccloud.framework.web.json.JsonFactory;
import nc.itf.cssd.instrument.ICSSDInstrumentService;
import nc.vo.cssd.instrument.AggInstrumentPackageVO;

import java.util.Map;

public class InstrumentResolveLackAction implements ICommonAction {

    @Override
    public Object doAction(IRequest request) {
        try {
            IJson json = JsonFactory.create();
            @SuppressWarnings("unchecked")
            Map<String, Object> map = json.fromJson(request.read(), Map.class);

            String pkLackrecord = map != null ? (String) map.get("pkLackrecord") : null;
            String handleResult = map != null ? (String) map.get("handleResult") : null;

            if (pkLackrecord == null || pkLackrecord.isEmpty()) {
                ExceptionUtils.wrapBusinessException("缺件记录主键不能为空");
            }

            ICSSDInstrumentService service = ServiceLocator.find(ICSSDInstrumentService.class);
            AggInstrumentPackageVO result = service.resolveLack(pkLackrecord, handleResult);

            return result;
        } catch (Exception e) {
            ExceptionUtils.wrapException(e);
            return null;
        }
    }
}
