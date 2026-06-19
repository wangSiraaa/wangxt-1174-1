package nc.vo.cssd.instrument;

import nc.vo.pub.SuperVO;
import nc.vo.pub.lang.UFDateTime;
import nc.md.model.MetaDataException;
import nc.vo.pubapp.pattern.model.meta.entity.vo.IVOMeta;
import nc.vo.pubapp.pattern.model.meta.entity.vo.VOMetaFactory;

public class ReleaseRecordVO extends SuperVO {
    private static final long serialVersionUID = 1L;

    private String pk_releaserecord;
    private String pk_instrpkg;
    private String package_code;
    private String pk_sterbatch;
    private String sterilization_batchno;
    private Integer release_type;
    private Integer release_result;
    private String pk_qualitynurse;
    private UFDateTime release_time;
    private String unpass_reason;
    private String remark;

    private String pk_group;
    private String pk_org;
    private String creator;
    private UFDateTime creationtime;
    private String modifier;
    private UFDateTime modifiedtime;
    private Integer dr = 0;
    private UFDateTime ts;

    public static final String PK_RELEASERECORD = "pk_releaserecord";
    public static final String PK_INSTRPKG = "pk_instrpkg";
    public static final String PACKAGE_CODE = "package_code";
    public static final String PK_STERBATCH = "pk_sterbatch";
    public static final String STERILIZATION_BATCHNO = "sterilization_batchno";
    public static final String RELEASE_TYPE = "release_type";
    public static final String RELEASE_RESULT = "release_result";
    public static final String PK_QUALITYNURSE = "pk_qualitynurse";
    public static final String RELEASE_TIME = "release_time";
    public static final String UNPASS_REASON = "unpass_reason";

    @Override
    public String getTableName() {
        return "cssd_releaserecord";
    }

    @Override
    public String getPKFieldName() {
        return "pk_releaserecord";
    }

    @Override
    public String getParentPKFieldName() {
        return null;
    }

    @Override
    public IVOMeta getMetaData() {
        return VOMetaFactory.getInstance().getVOMeta("cssd.releaserecord");
    }

    public String getPk_releaserecord() {
        return pk_releaserecord;
    }

    public void setPk_releaserecord(String pk_releaserecord) {
        this.pk_releaserecord = pk_releaserecord;
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

    public Integer getRelease_type() {
        return release_type;
    }

    public void setRelease_type(Integer release_type) {
        this.release_type = release_type;
    }

    public Integer getRelease_result() {
        return release_result;
    }

    public void setRelease_result(Integer release_result) {
        this.release_result = release_result;
    }

    public String getPk_qualitynurse() {
        return pk_qualitynurse;
    }

    public void setPk_qualitynurse(String pk_qualitynurse) {
        this.pk_qualitynurse = pk_qualitynurse;
    }

    public UFDateTime getRelease_time() {
        return release_time;
    }

    public void setRelease_time(UFDateTime release_time) {
        this.release_time = release_time;
    }

    public String getUnpass_reason() {
        return unpass_reason;
    }

    public void setUnpass_reason(String unpass_reason) {
        this.unpass_reason = unpass_reason;
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
