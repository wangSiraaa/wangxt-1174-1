package nc.vo.cssd.instrument;

import nc.vo.pub.SuperVO;
import nc.vo.pub.lang.UFDate;
import nc.vo.pub.lang.UFDateTime;
import nc.md.model.MetaDataException;
import nc.vo.pubapp.pattern.model.meta.entity.vo.IVOMeta;
import nc.vo.pubapp.pattern.model.meta.entity.vo.VOMetaFactory;

public class InstrumentPackageVO extends SuperVO {
    private static final long serialVersionUID = 1L;

    private String pk_instrpkg;
    private String package_code;
    private String package_name;
    private String package_type;
    private Integer package_status;
    private String pk_sterbatch;
    private String sterilization_batchno;
    private String operation_room;
    private String pk_operator_room;
    private String pk_disinfector;
    private String pk_qualitynurse;
    private UFDate require_date;
    private UFDateTime require_time;
    private UFDateTime sterilize_time;
    private UFDateTime release_time;
    private String remark;
    private Integer is_released;
    private Integer is_sent;
    private Integer lack_flag;

    private String pk_group;
    private String pk_org;
    private String creator;
    private UFDateTime creationtime;
    private String modifier;
    private UFDateTime modifiedtime;
    private Integer dr = 0;
    private UFDateTime ts;

    public static final String PK_INSTRPKG = "pk_instrpkg";
    public static final String PACKAGE_CODE = "package_code";
    public static final String PACKAGE_NAME = "package_name";
    public static final String PACKAGE_TYPE = "package_type";
    public static final String PACKAGE_STATUS = "package_status";
    public static final String PK_STERBATCH = "pk_sterbatch";
    public static final String STERILIZATION_BATCHNO = "sterilization_batchno";
    public static final String OPERATION_ROOM = "operation_room";
    public static final String PK_OPERATOR_ROOM = "pk_operator_room";
    public static final String PK_DISINFECTOR = "pk_disinfector";
    public static final String PK_QUALITYNURSE = "pk_qualitynurse";
    public static final String REQUIRE_DATE = "require_date";
    public static final String REQUIRE_TIME = "require_time";
    public static final String STERILIZE_TIME = "sterilize_time";
    public static final String RELEASE_TIME = "release_time";
    public static final String REMARK = "remark";
    public static final String IS_RELEASED = "is_released";
    public static final String IS_SENT = "is_sent";
    public static final String LACK_FLAG = "lack_flag";

    @Override
    public String getTableName() {
        return "cssd_instrpkg";
    }

    @Override
    public String getPKFieldName() {
        return "pk_instrpkg";
    }

    @Override
    public String getParentPKFieldName() {
        return null;
    }

    @Override
    public IVOMeta getMetaData() {
        return VOMetaFactory.getInstance().getVOMeta("cssd.instrument");
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

    public String getPackage_name() {
        return package_name;
    }

    public void setPackage_name(String package_name) {
        this.package_name = package_name;
    }

    public String getPackage_type() {
        return package_type;
    }

    public void setPackage_type(String package_type) {
        this.package_type = package_type;
    }

    public Integer getPackage_status() {
        return package_status;
    }

    public void setPackage_status(Integer package_status) {
        this.package_status = package_status;
    }

    public String getPk_sterbatch() {
        return pk_sterbatch;
    }

    public void setPk_sterbatch(String pk_sterbatch) {
        this.pk_sterbatch = pk_sterbatch;
    }

    public String getSterilization_batchno() {
        return sterilization_batchno;
    }

    public void setSterilization_batchno(String sterilization_batchno) {
        this.sterilization_batchno = sterilization_batchno;
    }

    public String getOperation_room() {
        return operation_room;
    }

    public void setOperation_room(String operation_room) {
        this.operation_room = operation_room;
    }

    public String getPk_operator_room() {
        return pk_operator_room;
    }

    public void setPk_operator_room(String pk_operator_room) {
        this.pk_operator_room = pk_operator_room;
    }

    public String getPk_disinfector() {
        return pk_disinfector;
    }

    public void setPk_disinfector(String pk_disinfector) {
        this.pk_disinfector = pk_disinfector;
    }

    public String getPk_qualitynurse() {
        return pk_qualitynurse;
    }

    public void setPk_qualitynurse(String pk_qualitynurse) {
        this.pk_qualitynurse = pk_qualitynurse;
    }

    public UFDate getRequire_date() {
        return require_date;
    }

    public void setRequire_date(UFDate require_date) {
        this.require_date = require_date;
    }

    public UFDateTime getRequire_time() {
        return require_time;
    }

    public void setRequire_time(UFDateTime require_time) {
        this.require_time = require_time;
    }

    public UFDateTime getSterilize_time() {
        return sterilize_time;
    }

    public void setSterilize_time(UFDateTime sterilize_time) {
        this.sterilize_time = sterilize_time;
    }

    public UFDateTime getRelease_time() {
        return release_time;
    }

    public void setRelease_time(UFDateTime release_time) {
        this.release_time = release_time;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Integer getIs_released() {
        return is_released;
    }

    public void setIs_released(Integer is_released) {
        this.is_released = is_released;
    }

    public Integer getIs_sent() {
        return is_sent;
    }

    public void setIs_sent(Integer is_sent) {
        this.is_sent = is_sent;
    }

    public Integer getLack_flag() {
        return lack_flag;
    }

    public void setLack_flag(Integer lack_flag) {
        this.lack_flag = lack_flag;
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
