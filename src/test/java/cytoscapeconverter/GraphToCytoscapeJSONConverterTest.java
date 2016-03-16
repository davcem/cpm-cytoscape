package cytoscapeconverter;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.json.JSONObject;
import org.junit.Test;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import graphconverter.CPMLatticeToGraphConverter;
import graphconverter.Node;
import cpm.CPMLattice;
import cpm.CPMLatticeCalculationParams;

public class GraphToCytoscapeJSONConverterTest {
	
	public CPMLattice createCPMLattice(int xMax, int yMax, int sigmaMax){
		
		CPMLattice lattice;
		
		/** The default temperature*/
		double temperature = 10;
		
		/** The default ratio*/
		int cellRatio = 2;
		
		CPMLatticeCalculationParams params = new CPMLatticeCalculationParams(temperature, cellRatio, 
				temperature, temperature, temperature, temperature, temperature, cellRatio, temperature, cellRatio);
		
		lattice = new CPMLattice(xMax, yMax, 100, 10, sigmaMax, 0.5, params);
		
		return lattice;
	}
	
	/**
	 * 
	 * */
	@Test
	public void testNumberOfNodesAndEdgesAfterJsonConverter(){
		
		//initial values for the cpm lattice
		int xMax = 10, yMax = 10, sigmaMax = 2;
		
		CPMLatticeToGraphConverter graphConverter = new CPMLatticeToGraphConverter(
				createCPMLattice(xMax, yMax,sigmaMax));
		
		GraphToCytoscapeJSONConverter  jsonConverter = new GraphToCytoscapeJSONConverter();
		
		graphConverter.convertLattice();
		
		//we need gson to convert the cytoscape json string back into an jsonobject
		Gson gson = new Gson();
		
		String jsonString = jsonConverter.convertGraphToCytoscapeJSON(graphConverter);
		
		//Jsonobject of the completed json conversion
		JsonObject jsonObject = gson.fromJson(jsonString, JsonObject.class);

		//get the "root" element of the jsonobject
		JsonObject elements = jsonObject.getAsJsonObject("elements");
		
		assertEquals(graphConverter.getNodes().values().size(), elements.getAsJsonArray("nodes").size());
		assertEquals(graphConverter.getEdges().values().size(), elements.getAsJsonArray("edges").size());
	
	}
	
	@Test
	public void compareConvertedNodeCollection(){
		
		//initial values for the cpm lattice
		int xMax = 10, yMax = 10, sigmaMax = 10;
		
		CPMLatticeToGraphConverter graphConverter = new CPMLatticeToGraphConverter(
				createCPMLattice(xMax, yMax,sigmaMax));
		
		GraphToCytoscapeJSONConverter  jsonConverter = new GraphToCytoscapeJSONConverter();
		
		graphConverter.convertLattice();
		
		//we need gson to convert the cytoscape json string back into an jsonobject
		Gson gson = new Gson();
		
		String jsonString = jsonConverter.convertGraphToCytoscapeJSON(graphConverter);
		
		//Jsonobject of the completed json conversion
		JsonObject jsonObject = gson.fromJson(jsonString, JsonObject.class);

		//get the "root" element of the jsonobject
		JsonObject elements = jsonObject.getAsJsonObject("elements");
		
		JsonArray nodes = elements.getAsJsonArray("nodes");
		
		Collection<Node> nodesCollection = new ArrayList<Node>();
		
		for (int i = 0; i < nodes.size();i++) {
			
			JsonObject data = (JsonObject)nodes.get(i);
			JsonObject jsonNode = data.getAsJsonObject("data");
			
			Node node = gson.fromJson(jsonNode, Node.class);
			
			nodesCollection.add(node);
		}
		
		//first only compare size of the two collections (must be equal)
		
		assertEquals(nodesCollection.size(), graphConverter.getNodes().values().size());
		
		//second: compare if every node from the graphConverter is contained in the nodesCollection
		
		Iterator<Node> iter = graphConverter.getNodes().values().iterator();
		
		boolean isEqual = true;
		
		while(iter.hasNext()){
			
			Node node = iter.next();
			
			if(!nodesCollection.contains(node)){
				
				isEqual = false;
				
			}
			
		}
		
		assertTrue(isEqual);

	}
	
	
	public void convertCollection(){
		
		CPMLatticeToGraphConverter converter = new CPMLatticeToGraphConverter(createCPMLattice(5,5,5));
		
		converter.convertLattice();
		
		List<Node> nodesList = new ArrayList<Node>(converter.getNodes().values());
		
		Collections.sort(nodesList);
		
		for(Node node : nodesList){
			
			System.out.println(node.getId());
		}

	}

}
