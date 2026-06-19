package nc.vo.cssd.instrument;

import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nc.vo.pubapp.pattern.model.meta.entity.bill.BillMetaFactory;
import nc.vo.pubapp.pattern.model.meta.entity.bill.IBillMeta;

@nc.vo.annotation.AggVoInfo(parentVO = "nc.vo.cssd.instrument.InstrumentPackageVO")
public class AggInstrumentPackageVO extends AbstractBill {
    private static final long serialVersionUID = 1L;

    @Override
    public IBillMeta getMetaData() {
        return BillMetaFactory.getInstance().getBillMeta(AggInstrumentPackageVOMeta.class);
    }

    @Override
    public InstrumentPackageVO getParentVO() {
        return (InstrumentPackageVO) this.getParent();
    }
}
