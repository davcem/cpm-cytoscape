package cpmservlet;

import graphconverter.CPMLatticeToGraphConverter;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cpm.CPMLattice;
import cpm.CPMLatticeCalculationParams;
import cytoscapeconverter.GraphToCytoscapeJSONConverter;
import jdk.nashorn.internal.parser.JSONParser;
import org.json.JSONObject;


/**
 * @author davcem
 * @version 1.0
 * @since 2015-06-12
 * 
 * The main servlet for the communication of frontend and backend
 * <p>
 * Within this servlet the CPM is initialized with an GET request and send back within response.
 * By sending a POST request the CPM is computed and send back as JSON.
 * 
 */
public class JSONCPMServlet extends HttpServlet {
 
    /** The Constant serialVersionUID. */
    private static final long serialVersionUID = 1L;
 
    /** The lattice. */
    CPMLattice lattice;
 
    /**
     * *************************************************
     * URL: /JSONServlet
     * doPost(): receives JSON data, parse it, map it and send back as JSON
     * **************************************************.
     *
     * @param request the request
     * @param response the response
     * @throws ServletException the servlet exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException{

		String method = request.getParameter("method");

		if(method.equals("manual")){


			createCPMLatticeFromParams(request);
			String elements = request.getParameter("elements");

			elements = "{\"elements\":" + elements + "}";

			JSONObject nodes  = new JSONObject(elements);

			//System.out.println(nodes);
			lattice.initialiseCPMFromUserInput(nodes);

			//addCPMToResponse(response);

		}
		else {
			createCPMLatticeFromParams(request);

			lattice.initializeLattice();

			addCPMToResponse(response);
		}

    }
    
    /**
     * *************************************************
     * URL: /JSONServlet
     * doPost(): send back the calculated CPM as JSON
     * **************************************************.
     *
     * @param request the request
     * @param response the response
     * @throws ServletException the servlet exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException{

		lattice.computeCPM();
		addCPMToResponse(response);

    	
    }

    
    /**
     * Creates the cpm lattice from request params.
     *
     * @param request the request
     */
    private void createCPMLatticeFromParams(HttpServletRequest request){
    	 	
    	String xMax = request.getParameter("xMax");
    	String yMax = request.getParameter("yMax");
    	String mcs = request.getParameter("mcs");
    	String mcSubsteps = request.getParameter("mcSubsteps");
    	String sigmaMax = request.getParameter("sigmaMax");
    	String matrixDensity = request.getParameter("matrixDensity");
    	String temperature = request.getParameter("temperature");

		String ratioDarkToLightCells = request.getParameter("ratioDarkToLightCells");
		String jEcm = request.getParameter("jEcm");
		String jLightCells = request.getParameter("jLightCells");
		String jDarkCells = request.getParameter("jDarkCells");
		String jDifferentCells = request.getParameter("jDifferentCells");
		String lambdaArea = request.getParameter("lambdaArea");
		String targetAreaFactorLight = request.getParameter("targetAreaFactorLight");
		String targetAreaFactorDark = request.getParameter("targetAreaFactorDark");
		String darkCellDecrease = request.getParameter("darkCellDecrease");

		//TODO add functionality to decide which profile of calculation params to use
    	CPMLatticeCalculationParams params = new CPMLatticeCalculationParams(
				Double.valueOf(jEcm), Double.valueOf(jLightCells), Double.valueOf(jDarkCells), Double.valueOf(jDifferentCells),
				Double.valueOf(lambdaArea), Double.valueOf(targetAreaFactorLight), Double.valueOf(targetAreaFactorDark),
				Integer.valueOf(darkCellDecrease), Double.valueOf(temperature), Integer.valueOf(ratioDarkToLightCells)
				);

    	lattice = new CPMLattice(Integer.valueOf(xMax), Integer.valueOf(yMax), 
    			Integer.valueOf(mcs), Integer.valueOf(mcSubsteps), 
    			Integer.valueOf(sigmaMax), Double.valueOf(matrixDensity), params);

    }
    
    /**
     * Adds the CPM data as json to the servlet response
     *
     * @param response the response
     */

	private void addCPMToResponse(HttpServletResponse response) throws ServletException, IOException{
	        
		response.setContentType("application/json");

		CPMLatticeToGraphConverter converter = new CPMLatticeToGraphConverter(
				lattice);

		converter.convertLattice();

		GraphToCytoscapeJSONConverter jsonConverter = new GraphToCytoscapeJSONConverter();

		String s = jsonConverter.convertGraphToCytoscapeJSON(converter);

		response.getWriter().write(s);
	    	
	}
}