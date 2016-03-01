package cpm;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

public class CPMLatticeTest {
	
	/** Lattice under test*/
	CPMLattice lattice;
	
	/** Example of an ecm cell within lattice */
	int ecmCell = 0;
	
	/** Example of a dark cell within lattice */
	int darkCell = 3;
	
	/** Example of a light cell within lattice */
	int lightCell = 4;

	/** The default value is set to 0 so that dark cells can be decreased */
	int darkCellDecrease = 0;

	/** The default temperature*/
	double temperature = 10;

	/** The default ratio*/
	int cellRatio = 2;
	
	/**
	 * Default setup method for the CPMLattice.
	 * This method is only needed for default tests.
	 * */
	
	@Before
	public void createCPMLattice(){
		
		int newXMax = 50;
		int newYMax = 50;
		int newMcs = 100;
		int newMcSubsteps = newXMax * newYMax;
		int newSigmaMax = 4;
		double newInitialMatrixDensity = 0.5;
		CPMLatticeCalculationParams params = new CPMLatticeCalculationParams(temperature, cellRatio);
		
		lattice = new CPMLattice(newXMax, newYMax, newMcs, newMcSubsteps, newSigmaMax, 
				newInitialMatrixDensity, params);
		
	}
	
	/**
	 * Tests the initialization of the CPM lattice referring to the matrix density.
	 * <p>
	 * The number of ecm cells (int value = 0) must be smaller or equal to product of
	 * maximal cells and the matrix density
	 * 
	 * */
	@Test
	public void testInitializeLatticeDensity() {
		
		lattice.initializeLattice();
		
		//the lattice with cells
		int[][] sigma = lattice.getSigma();
		
		int[] numberOfCells = countNumberOfCellsInSigma(sigma, lattice.getSigmaMax());

		double maxNumberOfECMCells = Math.round(lattice.getXMax() * lattice.getYMax() * 
				lattice.getInitialMatrixDensity());
		
		assertTrue(numberOfCells[0] <= maxNumberOfECMCells);
		
	}
	
	/**
	 * Tests the initialization of the CPM lattice referring to the number/ area
	 * of given cells.
	 * <p>
	 * The number/ area for each cell must be equal to the intern area array in lattice.
	 * 
	 * */
	@Test
	public void testInitializeLatticeCellAreas() {
		
		lattice.initializeLattice();
		
		//the lattice with cells
		int[][] sigma = lattice.getSigma();
		
		int[] numberOfCells = countNumberOfCellsInSigma(sigma, lattice.getSigmaMax());
		
		assertArrayEquals(numberOfCells, lattice.getArea());		
		
	}
	
	@Test
	public void testGetTargetAreaForLightCell(){
		
		double targetArea = lattice.getParams().getTargetAreaFactorLight() * 
				lattice.getXMax() * lattice.getYMax();
		
		assertEquals(targetArea, lattice.getTargetAreaForCell(lightCell) ,0.0);
		
	}
	
	@Test
	public void testGetTargetAreaForDarkCell(){
		
		double targetArea = lattice.getParams().getTargetAreaFactorDark() * 
				lattice.getXMax() * lattice.getYMax();
		
		assertEquals(targetArea, lattice.getTargetAreaForCell(darkCell) ,0.0);
		
	}
	
	@Test
	public void testGetEnergyAdheasionForLightCells(){
		
		lattice.initializeLattice();
		
		assertEquals(lattice.getParams().getEnergyLightCells(), 
				lattice.getEnergyAdhesionForCells(lightCell, lightCell), 0.0);
		
	}
	
	@Test
	public void testGetEnergyAdheasionForDarkCells(){
		
		lattice.initializeLattice();
		
		assertEquals(lattice.getParams().getEnergyDarkCells(), 
				lattice.getEnergyAdhesionForCells(darkCell, darkCell), 0.0);
		
	}
	
	@Test
	public void testGetEnergyAdheasionForECMLight(){
		
		lattice.initializeLattice();
		
		assertEquals(lattice.getParams().getEnergyECM(), 
				lattice.getEnergyAdhesionForCells(ecmCell, lightCell), 0.0);
		
	}
	
	@Test
	public void testGetEnergyAdheasionForECMDark(){
		
		lattice.initializeLattice();
		
		assertEquals(lattice.getParams().getEnergyECM(), 
				lattice.getEnergyAdhesionForCells(ecmCell, darkCell), 0.0);
		
	}
	
	@Test
	public void testGetEnergyAdheasionForLightDark(){
		
		lattice.initializeLattice();
		
		assertEquals(lattice.getParams().getEnergyDifferentCells(), 
				lattice.getEnergyAdhesionForCells(lightCell, darkCell), 0.0);
		
	}
	
	/**
	 * Tests that the sum over all lattice sites is equal to the number of lattice sites.
	 * 
	 * */
	@Test
	public void testComputeLatticeSumCellAreas() {
		
		lattice.initializeLattice();
		
		lattice.computeCPM();
		
		//the lattice with cells
		int[] area = lattice.getArea();
		
		int sumArea = 0;
		
		for(int i = 0; i < area.length; i++){
			
			sumArea += area[i];
			
		}
		
		assertEquals(sumArea, lattice.getXMax() * lattice.getYMax());		
		
	}
	
	/**
	 * Helper Function is used for counting the number of different values in 2d sigma array.
	 * <p>
	 * 
	 * @param sigma The 2d sigma array to count number of different cells.
	 * @param maxSigma The max number of different cells in lattice.
	 * 
	 * @return numberOfCells int array with number of cells at given index for given cell.
	 * 
	 * */
	public int[] countNumberOfCellsInSigma(int[][] sigma, int maxSigma){
		
		/**create the array with length of number of cells (= maxSigma)*/
		int[] numberOfCells = new int[maxSigma];
		
		for(int i = 0; i < sigma.length; i++){
			
			for(int j = 0; j < sigma[0].length; j++){
				
				//increment the number for the cell in given numberOfCells array
				numberOfCells[sigma[i][j]]++;
				
			}
			
		}
		
		return numberOfCells;
		
	}

}
