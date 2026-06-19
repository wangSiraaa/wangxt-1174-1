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

public class InstrumentRegisterCleaningAction implements ICommonAction {

    @Override
    public Object doAction(IRequest request) {
        try {
            IJson json = JsonFactory.create();
            @SuppressWarnings("unchecked")
            Map<String, Object> map = json.fromJson(request.read(), Map.class);

            String pkInstrpkg = map != null ? (String) map.get("pkInstrpkg") : null;
            if (pkInstrpkg == null || pkInstrpkg.isEmpty()) {
                ExceptionUtils.wrapBusinessException("器械包主键不能为空");
            }

            ICSSDInstrumentService service = ServiceLocator.find(ICSSDInstrumentService.class);
            AggInstrumentPackageVO result = service.registerCleaning(pkInstrpkg);

            return result;
        } catch (Exception e) {
            ExceptionUtils.wrapException(e);
            return null;
        }
    }
}
