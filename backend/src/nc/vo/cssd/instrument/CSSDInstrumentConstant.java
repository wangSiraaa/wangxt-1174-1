package nc.vo.cssd.instrument;

public class CSSDInstrumentConstant {

    public static final int PACKAGE_STATUS_REQUIRED = 0;
    public static final int PACKAGE_STATUS_CLEANING = 1;
    public static final int PACKAGE_STATUS_STERILIZING = 2;
    public static final int PACKAGE_STATUS_LACK = 3;
    public static final int PACKAGE_STATUS_WAIT_RELEASE = 4;
    public static final int PACKAGE_STATUS_RELEASED = 5;
    public static final int PACKAGE_STATUS_SENT = 6;
    public static final int PACKAGE_STATUS_RETURNED = 7;
    public static final int PACKAGE_STATUS_FAILED = 9;

    public static final int BATCH_STATUS_RUNNING = 0;
    public static final int BATCH_STATUS_FINISHED = 1;
    public static final int BATCH_STATUS_FAILED = 2;

    public static final int STERILIZE_RESULT_PASS = 1;
    public static final int STERILIZE_RESULT_FAIL = 0;

    public static final int RELEASE_RESULT_PASS = 1;
    public static final int RELEASE_RESULT_UNPASS = 0;

    public static final int YES = 1;
    public static final int NO = 0;

    public static final int LACK_STATUS_WAIT = 0;
    public static final int LACK_STATUS_HANDLING = 1;
    public static final int LACK_STATUS_RESOLVED = 2;

    public static final int RELEASE_TYPE_NORMAL = 0;
    public static final int RELEASE_TYPE_RETURN = 1;
}
