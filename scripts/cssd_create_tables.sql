-- ============================================================
-- 医院消毒供应中心(CSSD)器械包追踪系统 - 建表脚本
-- 数据库: Oracle/MySQL/达梦通用
-- ============================================================

-- 1. 器械包主表
CREATE TABLE cssd_instrpkg (
    pk_instrpkg           VARCHAR(36)    NOT NULL,
    package_code          VARCHAR(50)    NOT NULL,
    package_name          VARCHAR(200)   NOT NULL,
    package_type          VARCHAR(50),
    package_status        INTEGER        DEFAULT 0,
    pk_sterbatch          VARCHAR(36),
    sterilization_batchno VARCHAR(50),
    operation_room        VARCHAR(100)   NOT NULL,
    pk_operator_room      VARCHAR(36),
    pk_disinfector        VARCHAR(36),
    pk_qualitynurse       VARCHAR(36),
    require_date          DATE,
    require_time          TIMESTAMP,
    sterilize_time        TIMESTAMP,
    release_time          TIMESTAMP,
    remark                VARCHAR(500),
    is_released           INTEGER        DEFAULT 0,
    is_sent               INTEGER        DEFAULT 0,
    lack_flag             INTEGER        DEFAULT 0,
    pk_group              VARCHAR(36),
    pk_org                VARCHAR(36),
    creator               VARCHAR(36),
    creationtime          TIMESTAMP,
    modifier              VARCHAR(36),
    modifiedtime          TIMESTAMP,
    dr                    INTEGER        DEFAULT 0,
    ts                    TIMESTAMP,
    PRIMARY KEY (pk_instrpkg)
);

COMMENT ON TABLE cssd_instrpkg IS '器械包主表';
COMMENT ON COLUMN cssd_instrpkg.package_status IS '状态:0-已提交需求 1-清洗中 2-灭菌中 3-缺件待处理 4-待放行 5-已放行 6-已发往手术室 7-已退回 9-灭菌失败';
COMMENT ON COLUMN cssd_instrpkg.is_released IS '是否已放行:0-否 1-是';
COMMENT ON COLUMN cssd_instrpkg.is_sent IS '是否已发出:0-否 1-是';
COMMENT ON COLUMN cssd_instrpkg.lack_flag IS '是否有缺件:0-否 1-是';

CREATE INDEX idx_cssd_instrpkg_status ON cssd_instrpkg(package_status);
CREATE INDEX idx_cssd_instrpkg_code ON cssd_instrpkg(package_code);
CREATE INDEX idx_cssd_instrpkg_batch ON cssd_instrpkg(pk_sterbatch);
CREATE INDEX idx_cssd_instrpkg_org ON cssd_instrpkg(pk_org, dr);


-- 2. 器械包明细表
CREATE TABLE cssd_instritem (
    pk_instritem     VARCHAR(36)    NOT NULL,
    pk_instrpkg      VARCHAR(36)    NOT NULL,
    instrument_code  VARCHAR(50)    NOT NULL,
    instrument_name  VARCHAR(200)   NOT NULL,
    instrument_spec  VARCHAR(100),
    plan_qty         DECIMAL(18,2)  DEFAULT 0,
    actual_qty       DECIMAL(18,2)  DEFAULT 0,
    lack_qty         DECIMAL(18,2)  DEFAULT 0,
    lack_flag        INTEGER        DEFAULT 0,
    remark           VARCHAR(500),
    pk_group         VARCHAR(36),
    pk_org           VARCHAR(36),
    creator          VARCHAR(36),
    creationtime     TIMESTAMP,
    modifier         VARCHAR(36),
    modifiedtime     TIMESTAMP,
    dr               INTEGER        DEFAULT 0,
    ts               TIMESTAMP,
    PRIMARY KEY (pk_instritem)
);

COMMENT ON TABLE cssd_instritem IS '器械包明细表';
COMMENT ON COLUMN cssd_instritem.lack_flag IS '是否缺件:0-否 1-是';

CREATE INDEX idx_cssd_instritem_pkg ON cssd_instritem(pk_instrpkg);


-- 3. 灭菌批次表
CREATE TABLE cssd_sterbatch (
    pk_sterbatch         VARCHAR(36)    NOT NULL,
    batch_no             VARCHAR(50)    NOT NULL,
    sterilizer_code      VARCHAR(50),
    sterilizer_name      VARCHAR(100),
    sterilize_type       INTEGER        DEFAULT 1,
    start_time           TIMESTAMP,
    end_time             TIMESTAMP,
    batch_status         INTEGER        DEFAULT 0,
    sterilize_result     INTEGER,
    biological_indicator VARCHAR(100),
    chemical_indicator   VARCHAR(100),
    pk_operator          VARCHAR(36),
    failure_reason       VARCHAR(500),
    remark               VARCHAR(500),
    pk_group             VARCHAR(36),
    pk_org               VARCHAR(36),
    creator              VARCHAR(36),
    creationtime         TIMESTAMP,
    modifier             VARCHAR(36),
    modifiedtime         TIMESTAMP,
    dr                   INTEGER        DEFAULT 0,
    ts                   TIMESTAMP,
    PRIMARY KEY (pk_sterbatch)
);

COMMENT ON TABLE cssd_sterbatch IS '灭菌批次表';
COMMENT ON COLUMN cssd_sterbatch.sterilize_type IS '灭菌方式:1-压力蒸汽 2-环氧乙烷 3-等离子';
COMMENT ON COLUMN cssd_sterbatch.batch_status IS '状态:0-灭菌中 1-已完成 2-失败';
COMMENT ON COLUMN cssd_sterbatch.sterilize_result IS '灭菌结果:0-不合格 1-合格';

CREATE UNIQUE INDEX idx_cssd_sterbatch_no ON cssd_sterbatch(batch_no, dr);
CREATE INDEX idx_cssd_sterbatch_status ON cssd_sterbatch(batch_status);


-- 4. 缺件记录表
CREATE TABLE cssd_lackrecord (
    pk_lackrecord  VARCHAR(36)    NOT NULL,
    pk_instrpkg    VARCHAR(36)    NOT NULL,
    package_code   VARCHAR(50),
    pk_instritem   VARCHAR(36),
    instrument_code VARCHAR(50),
    instrument_name VARCHAR(200),
    lack_qty       DECIMAL(18,2)  DEFAULT 0,
    handle_status  INTEGER        DEFAULT 0,
    pk_handler     VARCHAR(36),
    handle_time    TIMESTAMP,
    handle_result  VARCHAR(500),
    remark         VARCHAR(500),
    pk_group       VARCHAR(36),
    pk_org         VARCHAR(36),
    creator        VARCHAR(36),
    creationtime   TIMESTAMP,
    modifier       VARCHAR(36),
    modifiedtime   TIMESTAMP,
    dr             INTEGER        DEFAULT 0,
    ts             TIMESTAMP,
    PRIMARY KEY (pk_lackrecord)
);

COMMENT ON TABLE cssd_lackrecord IS '缺件记录表';
COMMENT ON COLUMN cssd_lackrecord.handle_status IS '处理状态:0-待处理 1-处理中 2-已解决';

CREATE INDEX idx_cssd_lackrecord_pkg ON cssd_lackrecord(pk_instrpkg);
CREATE INDEX idx_cssd_lackrecord_status ON cssd_lackrecord(handle_status);


-- 5. 放行记录表
CREATE TABLE cssd_releaserecord (
    pk_releaserecord      VARCHAR(36)    NOT NULL,
    pk_instrpkg           VARCHAR(36)    NOT NULL,
    package_code          VARCHAR(50),
    pk_sterbatch          VARCHAR(36),
    sterilization_batchno VARCHAR(50),
    release_type          INTEGER        DEFAULT 0,
    release_result        INTEGER        NOT NULL,
    pk_qualitynurse       VARCHAR(36),
    release_time          TIMESTAMP,
    unpass_reason         VARCHAR(500),
    remark                VARCHAR(500),
    pk_group              VARCHAR(36),
    pk_org                VARCHAR(36),
    creator               VARCHAR(36),
    creationtime          TIMESTAMP,
    modifier              VARCHAR(36),
    modifiedtime          TIMESTAMP,
    dr                    INTEGER        DEFAULT 0,
    ts                    TIMESTAMP,
    PRIMARY KEY (pk_releaserecord)
);

COMMENT ON TABLE cssd_releaserecord IS '放行记录表';
COMMENT ON COLUMN cssd_releaserecord.release_type IS '放行类型:0-正常放行 1-退回放行';
COMMENT ON COLUMN cssd_releaserecord.release_result IS '放行结果:0-未通过 1-通过';

CREATE INDEX idx_cssd_releaserecord_pkg ON cssd_releaserecord(pk_instrpkg);
CREATE INDEX idx_cssd_releaserecord_batch ON cssd_releaserecord(pk_sterbatch);
