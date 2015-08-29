package cytoscapeconverter;

import graphconverter.Edge;

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
 * The class EdgeJSONAdapter is the representation of an {@link JsonSerializer}
 * for the {@link Edge} object.
 * <p>
 * By the implementation of the {@link JsonSerializer} the function {@link #serialize(Edge, Type, JsonSerializationContext)}
 * is called between conversation of edges into {@link JsonElement}.
 */ 
public class EdgeJSONAdapter implements JsonSerializer<Edge> {

	@Override
	public JsonElement serialize(Edge edge, Type type,
			JsonSerializationContext context) {
		
		JsonObject data = new JsonObject();
        data.addProperty("id", edge.getName());
        data.addProperty("source", edge.getStart().getId());
        data.addProperty("target", edge.getEnd().getId());
        
        JsonObject object = new JsonObject();
        object.add("data", data);
        
        return object;
	}
	
	

}
