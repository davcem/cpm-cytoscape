package cpm;

/**
 * @author radiance
 * @version 1.0
 * @since 2015-30-11
 *
 * Represents the config for the (@link #CPMLattice)
 *
 */
public class CPMLatticeCalculationParams {

    /** Energy interaction for the ecm*/
    public double jEcm;

    /** Energy interaction for even cells */
    public double jLightCells;

    /** Energy interaction for other cells */
    public double jDarkCells;

    /** Energy interaction for even with odd cells */
    public double jOtherCells;

    /** The Lambda for area calculation. */
    public double lamdaArea;

    /** The factor for the targetArea of light cells*/
    public double targetAreaFactorLight;

    /** The factor for the targetArea of dark cells*/
    public double targetAreaFactorDark;


    /**
     * Instantiates a new derfault CPMLatticeCalculationsParrams object
     */
    public CPMLatticeCalculationParams() {

        jEcm = 16;
        jLightCells = 14;
        jDarkCells = 2;
        jOtherCells = 11;
        lamdaArea = 1;
        targetAreaFactorLight = 0.2;
        targetAreaFactorDark = 0.8;

    }

}
