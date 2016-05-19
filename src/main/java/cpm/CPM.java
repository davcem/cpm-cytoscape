package cpm;

import org.json.JSONObject;

/**
 * @author davcem
 * @version 1.0
 * @since 2015-06-12
 * 
 * Represents an easy implementable interface for an CPM implementation (so the rest of the code could easily
 * work with that implementation).
 * <p>
 * The major principle of the CPM computation is that you call {@link #initializeLattice()} before you are able
 * to compute {@link #computeCPM()} a CPM implementation.
 * For the transformation of the CPM both the Sigma array {@link #getSigma()} and the Area array {@link #getArea() }must be public accessible.
 * For calculating visualization dimensions there are also {@link #getXMax()} and {@link #getYMax()} public available which represents
 * the dimensions of the Sigma array (X * Y).
 * 
 */
public interface CPM {
	
	/**
	 * Initializes the lattice which is used for the computation of the CPM Lattice
	 */
	public void initializeLattice();


	/**
	 * Initializes the lattice which is used for the computation of the CPM Lattice using nodes initialised by user
	 */
	public void initialiseCPMFromUserInput(String user_area);


	/**
	 * Computes the CPM according to the parameters of the lattice
	 */
	public void computeCPM();
	
	/**
	 * Gets the sigma array.
	 *
	 * @return the sigma
	 */
	public int[][] getSigma();
	
	/**
	 * Gets the area array.
	 *
	 * @return the area
	 */
	public int[] getArea();
	
	/**
	 * Gets the xMax.
	 *
	 * @return the xMax
	 */
	public int getXMax();

	/**
	 * Gets the yMax.
	 *
	 * @return the yMax
	 */
	public int getYMax();

}