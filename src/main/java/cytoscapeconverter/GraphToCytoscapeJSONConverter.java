package cytoscapeconverter;

import graphconverter.CPMLatticeToGraphConverter;
import graphconverter.Edge;
import graphconverter.Node;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 * @author davcem
 * @version 1.0
 * @since 2015-06-12
 * 
 * The class GraphToCytoscapeJSONConverter is the main class for conversion of an {@link CPMLatticeToGraphConverter} to
 * {@link String} in JSON representation.
 * <p>
 * The conversion can be done by creating a new instance @see {@link GraphToCytoscapeJSONConverter} and calling the
 * procedure {@link #convertGraphToCytoscapeJSON(CPMLatticeToGraphConverter)}.
 * 
 */
public class GraphToCytoscapeJSONConverter {
	
	/** The gson. */
	private Gson gson;
	
	/**
	 * Instantiates a new graph to GraphToCytoscapeJSONConverter.
	 */
	public GraphToCytoscapeJSONConverter(){
		
		gson = new GsonBuilder()
		.registerTypeAdapter(Node.class, new NodeJSONAdapter())
		.registerTypeAdapter(Edge.class, new EdgeJSONAdapter())
		.setPrettyPrinting().create();
		
	}
	
	/**
	 * Convert a graph to cytoscape json.
	 *
	 * @param converter {@link CPMLatticeToGraphConverter} which holds the cpm lattice in graph structure
	 * @return the string The representation of the graph in cytoscape json notation.
	 */
	public String convertGraphToCytoscapeJSON(CPMLatticeToGraphConverter converter){
		
		JsonObject subRoot = new JsonObject();
		
		/*We have to get the values without keys, because gson writes the keys in front of json object*/
		JsonElement nodeElements = gson.toJsonTree(converter.getNodes().values());
		JsonElement edgeElements = gson.toJsonTree(converter.getEdges().values());
		
		subRoot.add("nodes", nodeElements);	
		subRoot.add("edges", edgeElements);
		
		/*We further add our array with the volume of the cells (given by index of array)*/
		
		JsonObject root = new JsonObject();
		root.add("elements", subRoot);
		
        return gson.toJson(root);
		
	}
}
