package cytoscapeconverter;

import graphconverter.Node;

import java.lang.reflect.Type;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

/**
 * @author davcem
 * @version 1.0
 * @since 2015-06-12
 * 
 * The class NodeJSONAdapter is the representation of an {@link JsonSerializer}
 * for the {@link Node} object.
 * <p>
 * By the implementation of the {@link JsonSerializer} the function {@link #serialize(Node, Type, JsonSerializationContext)}
 * is called between conversation of nodes into {@link JsonElement}.
 */ 
public class NodeJSONAdapter implements JsonSerializer<Node> {

	@Override
	public JsonElement serialize(Node node, Type type,
			JsonSerializationContext context) {
		
		JsonObject data = new JsonObject();
        data.addProperty("id", node.getId());
        data.addProperty("x", node.getX());
        data.addProperty("y", node.getY());
        data.addProperty("index", node.getIndex());
        data.addProperty("cell", node.getCell());
        data.addProperty("ancestor", node.getParent());
        data.addProperty("area", node.getVolume());

        //the id of the cell is the "color" code
		int color = Integer.valueOf(node.getCell());
		
		//if our cell is of type ECM
		color = (color == 0) ? 1 : color;
       
        data.addProperty("color", String.format("#%06X", (16777216-750000) / color^4)); // for maxSigma > 2
        
        int modulo = Integer.valueOf(node.getCell()) % 2;
        
        String parentColor;
        
        //The parent color is only needed if we use compound nodes
        if(modulo == 0){
        	
        	parentColor = "#96e0e0"; // "light" cells
        	
        }else{
        	
        	parentColor = "#91243e"; // "dark" cells
        }
        
        data.addProperty("parentcolor", parentColor);
        
        JsonObject object = new JsonObject();
        object.add("data", data);
        
        return object;
	}
}
