package nc.vo.cssd.instrument;

import nc.vo.pub.SuperVO;
import nc.vo.pub.lang.UFDateTime;
import nc.md.model.MetaDataException;
import nc.vo.pubapp.pattern.model.meta.entity.vo.IVOMeta;
import nc.vo.pubapp.pattern.model.meta.entity.vo.VOMetaFactory;

public class SterilizationBatchVO extends SuperVO {
    private static final long serialVersionUID = 1L;

    private String pk_sterbatch;
    private String batch_no;
    private String sterilizer_code;
    private String sterilizer_name;
    private Integer sterilize_type;
    private UFDateTime start_time;
    private UFDateTime end_time;
    private Integer batch_status;
    private Integer sterilize_result;
    private String biological_indicator;
    private String chemical_indicator;
    private String pk_operator;
    private String failure_reason;
    private String remark;

    private String pk_group;
    private String pk_org;
    private String creator;
    private UFDateTime creationtime;
    private String modifier;
    private UFDateTime modifiedtime;
    private Integer dr = 0;
    private UFDateTime ts;

    public static final String PK_STERBATCH = "pk_sterbatch";
    public static final String BATCH_NO = "batch_no";
    public static final String STERILIZER_CODE = "sterilizer_code";
    public static final String STERILIZER_NAME = "sterilizer_name";
    public static final String STERILIZE_TYPE = "sterilize_type";
    public static final String START_TIME = "start_time";
    public static final String END_TIME = "end_time";
    public static final String BATCH_STATUS = "batch_status";
    public static final String STERILIZE_RESULT = "sterilize_result";
    public static final String PK_OPERATOR = "pk_operator";
    public static final String FAILURE_REASON = "failure_reason";

    @Override
    public String getTableName() {
        return "cssd_sterbatch";
    }

    @Override
    public String getPKFieldName() {
        return "pk_sterbatch";
    }

    @Override
    public String getParentPKFieldName() {
        return null;
    }

    @Override
    public IVOMeta getMetaData() {
        return VOMetaFactory.getInstance().getVOMeta("cssd.sterbatch");
    }

    public String getPk_sterbatch() {
        return pk_sterbatch;
    }

    public void setPk_sterbatch(String pk_sterbatch) {
        this.pk_sterbatch = pk_sterbatch;
    }

    public String getBatch_no() {
        return batch_no;
    }

    public void setBatch_no(String batch_no) {
        this.batch_no = batch_no;
    }

    public String getSterilizer_code() {
        return sterilizer_code;
    }

    public void setSterilizer_code(String sterilizer_code) {
        this.sterilizer_code = sterilizer_code;
    }

    public String getSterilizer_name() {
        return sterilizer_name;
    }

    public void setSterilizer_name(String sterilizer_name) {
        this.sterilizer_name = sterilizer_name;
    }

    public Integer getSterilize_type() {
        return sterilize_type;
    }

    public void setSterilize_type(Integer sterilize_type) {
        this.sterilize_type = sterilize_type;
    }

    public UFDateTime getStart_time() {
        return start_time;
    }

    public void setStart_time(UFDateTime start_time) {
        this.start_time = start_time;
    }

    public UFDateTime getEnd_time() {
        return end_time;
    }

    public void setEnd_time(UFDateTime end_time) {
        this.end_time = end_time;
    }

    public Integer getBatch_status() {
        return batch_status;
    }

    public void setBatch_status(Integer batch_status) {
        this.batch_status = batch_status;
    }

    public Integer getSterilize_result() {
        return sterilize_result;
    }

    public void setSterilize_result(Integer sterilize_result) {
        this.sterilize_result = sterilize_result;
    }

    public String getBiological_indicator() {
        return biological_indicator;
    }

    public void setBiological_indicator(String biological_indicator) {
        this.biological_indicator = biological_indicator;
    }

    public String getChemical_indicator() {
        return chemical_indicator;
    }

    public void setChemical_indicator(String chemical_indicator) {
        this.chemical_indicator = chemical_indicator;
    }

    public String getPk_operator() {
        return pk_operator;
    }

    public void setPk_operator(String pk_operator) {
        this.pk_operator = pk_operator;
    }

    public String getFailure_reason() {
        return failure_reason;
    }

    public void setFailure_reason(String failure_reason) {
        this.failure_reason = failure_reason;
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
