package nc.vo.cssd.instrument;

import nc.vo.pubapp.pattern.model.meta.entity.bill.AbstractBillMeta;

public class AggInstrumentPackageVOMeta extends AbstractBillMeta {
    public AggInstrumentPackageVOMeta() {
        this.init();
    }

    private void init() {
        this.setParent(InstrumentPackageVO.class);
        this.addChildren(InstrumentItemVO.class);
    }
}
