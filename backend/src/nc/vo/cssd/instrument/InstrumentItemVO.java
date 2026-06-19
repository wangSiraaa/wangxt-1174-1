package nc.vo.cssd.instrument;

import nc.vo.pub.SuperVO;
import nc.vo.pub.lang.UFDateTime;
import nc.vo.pub.lang.UFDouble;
import nc.md.model.MetaDataException;
import nc.vo.pubapp.pattern.model.meta.entity.vo.IVOMeta;
import nc.vo.pubapp.pattern.model.meta.entity.vo.VOMetaFactory;

public class InstrumentItemVO extends SuperVO {
    private static final long serialVersionUID = 1L;

    private String pk_instritem;
    private String pk_instrpkg;
    private String instrument_code;
    private String instrument_name;
    private String instrument_spec;
    private UFDouble plan_qty;
    private UFDouble actual_qty;
    private UFDouble lack_qty;
    private Integer lack_flag;
    private String remark;

    private String pk_group;
    private String pk_org;
    private String creator;
    private UFDateTime creationtime;
    private String modifier;
    private UFDateTime modifiedtime;
    private Integer dr = 0;
    private UFDateTime ts;

    public static final String PK_INSTRITEM = "pk_instritem";
    public static final String PK_INSTRPKG = "pk_instrpkg";
    public static final String INSTRUMENT_CODE = "instrument_code";
    public static final String INSTRUMENT_NAME = "instrument_name";
    public static final String INSTRUMENT_SPEC = "instrument_spec";
    public static final String PLAN_QTY = "plan_qty";
    public static final String ACTUAL_QTY = "actual_qty";
    public static final String LACK_QTY = "lack_qty";
    public static final String LACK_FLAG = "lack_flag";

    @Override
    public String getTableName() {
        return "cssd_instritem";
    }

    @Override
    public String getPKFieldName() {
        return "pk_instritem";
    }

    @Override
    public String getParentPKFieldName() {
        return "pk_instrpkg";
    }

    @Override
    public IVOMeta getMetaData() {
        return VOMetaFactory.getInstance().getVOMeta("cssd.instrument_b");
    }

    public String getPk_instritem() {
        return pk_instritem;
    }

    public void setPk_instritem(String pk_instritem) {
        this.pk_instritem = pk_instritem;
    }

    public String getPk_instrpkg() {
        return pk_instrpkg;
    }

    public void setPk_instrpkg(String pk_instrpkg) {
        this.pk_instrpkg = pk_instrpkg;
    }

    public String getInstrument_code() {
        return instrument_code;
    }

    public void setInstrument_code(String instrument_code) {
        this.instrument_code = instrument_code;
    }

    public String getInstrument_name() {
        return instrument_name;
    }

    public void setInstrument_name(String instrument_name) {
        this.instrument_name = instrument_name;
    }

    public String getInstrument_spec() {
        return instrument_spec;
    }

    public void setInstrument_spec(String instrument_spec) {
        this.instrument_spec = instrument_spec;
    }

    public UFDouble getPlan_qty() {
        return plan_qty;
    }

    public void setPlan_qty(UFDouble plan_qty) {
        this.plan_qty = plan_qty;
    }

    public UFDouble getActual_qty() {
        return actual_qty;
    }

    public void setActual_qty(UFDouble actual_qty) {
        this.actual_qty = actual_qty;
    }

    public UFDouble getLack_qty() {
        return lack_qty;
    }

    public void setLack_qty(UFDouble lack_qty) {
        this.lack_qty = lack_qty;
    }

    public Integer getLack_flag() {
        return lack_flag;
    }

    public void setLack_flag(Integer lack_flag) {
        this.lack_flag = lack_flag;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getPk_group() {
        return pk_group;
    }

    public void setPk_group(String pk_group) {
        this.pk_group = pk_group;
    }

    public String getPk_org() {
        return pk_org;
    }

    public void setPk_org(String pk_org) {
        this.pk_org = pk_org;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public UFDateTime getCreationtime() {
        return creationtime;
    }

    public void setCreationtime(UFDateTime creationtime) {
        this.creationtime = creationtime;
    }

    public String getModifier() {
        return modifier;
    }

    public void setModifier(String modifier) {
        this.modifier = modifier;
    }

    public UFDateTime getModifiedtime() {
        return modifiedtime;
    }

    public void setModifiedtime(UFDateTime modifiedtime) {
        this.modifiedtime = modifiedtime;
    }

    public Integer getDr() {
        return dr;
    }

    public void setDr(Integer dr) {
        this.dr = dr;
    }

    public UFDateTime getTs() {
        return ts;
    }

    public void setTs(UFDateTime ts) {
        this.ts = ts;
    }
}
