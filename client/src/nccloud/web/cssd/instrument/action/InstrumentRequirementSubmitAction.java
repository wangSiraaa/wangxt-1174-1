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
import nc.vo.cssd.instrument.AggInstrumentPackageVO;

import java.util.Map;

public class InstrumentRequirementSubmitAction implements ICommonAction {

    @Override
    public Object doAction(IRequest request) {
        try {
            IJson json = JsonFactory.create();
            @SuppressWarnings("unchecked")
            Map<String, Object> map = json.fromJson(request.read(), Map.class);

            ClientInfo clientInfo = SessionContext.getInstance().getClientInfo();
            String pkGroup = clientInfo.getPk_group();
            String pkOrg = clientInfo.getPk_org();

            String aggVOJson = map != null ? (String) map.get("billData") : null;
            if (aggVOJson == null || aggVOJson.isEmpty()) {
                ExceptionUtils.wrapBusinessException("器械包数据不能为空");
            }

            AggInstrumentPackageVO aggVO = json.fromJson(aggVOJson, AggInstrumentPackageVO.class);
            if (aggVO == null) {
                ExceptionUtils.wrapBusinessException("器械包数据解析失败");
            }
            aggVO.getParentVO().setPk_group(pkGroup);
            aggVO.getParentVO().setPk_org(pkOrg);

            ICSSDInstrumentService service = ServiceLocator.find(ICSSDInstrumentService.class);
            AggInstrumentPackageVO result = service.submitRequirement(aggVO);

            return result;
        } catch (Exception e) {
            ExceptionUtils.wrapException(e);
            return null;
        }
    }
}
