package cpm;

import java.util.Arrays;
import org.junit.Test;

public class CPMLatticeCalculationTest {
	
	@Test
	public void testCPMLatticeComputationDefault(){
		
		CPMLattice lattice = createDefaultCPMLattice();
		
		lattice.initializeLattice();
		
		lattice.computeCPM();
		
		System.out.println(Arrays.toString(lattice.getArea()));
	}
	
	private CPMLatticeCalculationParams getCalculationParams(){

	        int jEcm = 16;
	        int jLightCells = 14;
	        int jDarkCells = 2;
	        int jDifferentCells = 11;
	        
	        double lambdaArea = 1;
	        
	        double targetAreaFactorLight = 0.3;
	        double targetAreaFactorDark = 0.2;
	        
	        double newTemperature = 10;
	        
	        int cellRatio = 2;
	        
	        CPMLatticeCalculationParams params = 
	        		new CPMLatticeCalculationParams(jEcm, jLightCells, jDarkCells, 
	        				jDifferentCells, lambdaArea, targetAreaFactorLight, targetAreaFactorDark,
	        				newTemperature, cellRatio);
	        
	        return params;
		
	}
	
	private CPMLattice createDefaultCPMLattice(){
		
		CPMLatticeCalculationParams params = new CPMLatticeCalculationParams(10, 2);
		
		return createDefaultCPMLatticeWithParams(params);
	}
	
	private CPMLattice createDefaultCPMLatticeWithParams(CPMLatticeCalculationParams params){
		
		int newXMax = 50;
		int newYMax = 50;
		int newMcs = 5000;
		int newMcSubsteps = 100;
		int newSigmaMax = 2;
		double newInitialMatrixDensity = 0.8;
		
		
		CPMLattice lattice = new CPMLattice(newXMax, newYMax, newMcs, newMcSubsteps, newSigmaMax, 
				newInitialMatrixDensity, params);
		
		return lattice;
		
	}
	


}
