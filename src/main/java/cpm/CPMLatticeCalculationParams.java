package cpm;

/**
 * The Class CPMLatticeCalculationParams.
 *
 * @author radiance
 * @version 1.0
 * @since 2015-30-11
 * 
 * Represents the calculation config for the (@link #CPMLattice)
 */
public class CPMLatticeCalculationParams {

    /**  Energy interaction for the ecm. */
    private double jEcm;

    /**  Energy interaction for even cells. */
    private double jLightCells;

    /**  Energy interaction for other cells. */
    private double jDarkCells;

    /**  Energy interaction for even with odd cells. */
    private double jDifferentCells;

    /** The lambda for area calculation. */
    private double lambdaArea;

    /**  The factor for the targetArea of light cells. */
    private double targetAreaFactorLight;

    /**  The factor for the targetArea of dark cells. */
    private double targetAreaFactorDark;
    
	/** The beta or temperature within the lattice */
	private double temperature;

	/**
     * Instantiates a new default CPMLatticeCalculationsParrams object.
     * 
     * @param temperature the temperature within the lattice
     */
    public CPMLatticeCalculationParams(double temperature) {
    	
    	//TODO - if calculation param profiles are build remove this constructor
        this.jEcm = jEcm; // 16;
        this.jLightCells = jLightCells; // 14;
        this.jDarkCells = jDarkCells; // 2;
        this.jDifferentCells = jDifferentCells; // 11;
        this.lambdaArea = lambdaArea; // 0.05;
        this.targetAreaFactorLight = targetAreaFactorLight; // 0.4;
        this.targetAreaFactorDark = targetAreaFactorDark; // 0.4;
        this.temperature = temperature;
    }
    
	/**
	 * Instantiates a new CPM lattice calculation params with given params
	 *
	 * @param jEcm the j ecm
	 * @param jLightCells the j light cells
	 * @param jDarkCells the j dark cells
	 * @param jOtherCells the j other cells
	 * @param lambdaArea the lambda area
	 * @param targetAreaFactorLight the target area factor light
	 * @param targetAreaFactorDark the target area factor dark
	 * @param temperature the temperature within the lattice
	 */
	public CPMLatticeCalculationParams(double jEcm, double jLightCells,
			double jDarkCells, double jOtherCells, double lambdaArea,
			double targetAreaFactorLight, double targetAreaFactorDark, double temperature) {
		this.jEcm = jEcm;
		this.jLightCells = jLightCells;
		this.jDarkCells = jDarkCells;
		this.jDifferentCells = jOtherCells;
		this.lambdaArea = lambdaArea;
		this.targetAreaFactorLight = targetAreaFactorLight;
		this.targetAreaFactorDark = targetAreaFactorDark;
		this.temperature = temperature;
	}

	/**
	 * Gets the j ecm.
	 *
	 * @return the jEcm
	 */
	public double getEnergyECM() {
		return jEcm;
	}


	/**
	 * Gets the j light cells.
	 *
	 * @return the jLightCells
	 */
	public double getEnergyLightCells() {
		return jLightCells;
	}


	/**
	 * Gets the j dark cells.
	 *
	 * @return the jDarkCells
	 */
	public double getEnergyDarkCells() {
		return jDarkCells;
	}


	/**
	 * Gets the j other cells.
	 *
	 * @return the jOtherCells
	 */
	public double getEnergyDifferentCells() {
		return jDifferentCells;
	}


	/**
	 * Gets the lambda area.
	 *
	 * @return the lambdaArea
	 */
	public double getLambdaArea() {
		return lambdaArea;
	}


	/**
	 * Gets the target area factor light.
	 *
	 * @return the targetAreaFactorLight
	 */
	public double getTargetAreaFactorLight() {
		return targetAreaFactorLight;
	}


	/**
	 * Gets the target area factor dark.
	 *
	 * @return the targetAreaFactorDark
	 */
	public double getTargetAreaFactorDark() {
		return targetAreaFactorDark;
	}
	
    /**
	 * @return the temperature
	 */
	public double getTemperature() {
		return temperature;
	}

}
