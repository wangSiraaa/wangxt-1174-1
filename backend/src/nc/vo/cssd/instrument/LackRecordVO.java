package nc.vo.cssd.instrument;

import nc.vo.pub.SuperVO;
import nc.vo.pub.lang.UFDateTime;
import nc.md.model.MetaDataException;
import nc.vo.pubapp.pattern.model.meta.entity.vo.IVOMeta;
import nc.vo.pubapp.pattern.model.meta.entity.vo.VOMetaFactory;

public class LackRecordVO extends SuperVO {
    private static final long serialVersionUID = 1L;

    private String pk_lackrecord;
    private String pk_instrpkg;
    private String package_code;
    private String pk_instritem;
    private String instrument_code;
    private String instrument_name;
    private UFDouble lack_qty;
    private Integer handle_status;
    private String pk_handler;
    private UFDateTime handle_time;
    private String handle_result;
    private String remark;

    private String pk_group;
    private String pk_org;
    private String creator;
    private UFDateTime creationtime;
    private String modifier;
    private UFDateTime modifiedtime;
    private Integer dr = 0;
    private UFDateTime ts;

    public static final String PK_LACKRECORD = "pk_lackrecord";
    public static final String PK_INSTRPKG = "pk_instrpkg";
    public static final String PACKAGE_CODE = "package_code";
    public static final String PK_INSTRITEM = "pk_instritem";
    public static final String INSTRUMENT_CODE = "instrument_code";
    public static final String INSTRUMENT_NAME = "instrument_name";
    public static final String LACK_QTY = "lack_qty";
    public static final String HANDLE_STATUS = "handle_status";
    public static final String PK_HANDLER = "pk_handler";
    public static final String HANDLE_TIME = "handle_time";
    public static final String HANDLE_RESULT = "handle_result";

    @Override
    public String getTableName() {
        return "cssd_lackrecord";
    }

    @Override
    public String getPKFieldName() {
        return "pk_lackrecord";
    }

    @Override
    public String getParentPKFieldName() {
        return null;
    }

    @Override
    public IVOMeta getMetaData() {
        return VOMetaFactory.getInstance().getVOMeta("cssd.lackrecord");
    }

    public String getPk_lackrecord() {
        return pk_lackrecord;
    }

    public void setPk_lackrecord(String pk_lackrecord) {
        this.pk_lackrecord = pk_lackrecord;
    }

    public String getPk_instrpkg() {
        return pk_instrpkg;
    }

    public void setPk_instrpkg(String pk_instrpkg) {
        this.pk_instrpkg = pk_instrpkg;
    }

    public String getPackage_code() {
        return package_code;
    }

    public void setPackage_code(String package_code) {
        this.package_code = package_code;
    }

    public String getPk_instritem() {
        return pk_instritem;
    }

    public void setPk_instritem(String pk_instritem) {
        this.pk_instritem = pk_instritem;
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

    public UFDouble getLack_qty() {
        return lack_qty;
    }

    public void setLack_qty(UFDouble lack_qty) {
        this.lack_qty = lack_qty;
    }

    public Integer getHandle_status() {
        return handle_status;
    }

    public void setHandle_status(Integer handle_status) {
        this.handle_status = handle_status;
    }

    public String getPk_handler() {
        return pk_handler;
    }

    public void setPk_handler(String pk_handler) {
        this.pk_handler = pk_handler;
    }

    public UFDateTime getHandle_time() {
        return handle_time;
    }

    public void setHandle_time(UFDateTime handle_time) {
        this.handle_time = handle_time;
    }

    public String getHandle_result() {
        return handle_result;
    }

    public void setHandle_result(String handle_result) {
        this.handle_result = handle_result;
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
