package cytoscapeconverter;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import graphconverter.Node;

import java.awt.*;
import java.lang.reflect.Type;

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

        //the id of the cell is related to the "color" code
		int color = Integer.valueOf(node.getCell());
		int cellid = Integer.valueOf(node.getId());

		// if our cell is of type ECM
		color = (color == 0) ? 1 : color;

        int modulo = Integer.valueOf(node.getCell()) % 2;

        String lightColor  = "#96e0e0";
        String darkColor  = "#91243e";

        // Compute a color gradient for
        // all light and dark cells if maxsigma(=cellcount) > 2
        if(modulo == 0){

            data.addProperty("color", "#"+getColorGradient(lightColor, color, false)); // color gradient light cells

        }else {

            data.addProperty("color", "#"+getColorGradient(darkColor, color, true)); // color gradient dark cells
        }
        
        String parentColor;

        // The parent color is only needed if we use compound node
        // while we differentiate only between the light and the dark cellular bricks visualized as nodes
        if(modulo == 0){
        	
        	parentColor = lightColor;
        	
        }else{
        	
        	parentColor = darkColor;
        }
        
        data.addProperty("parentcolor", parentColor);
        
        JsonObject object = new JsonObject();
        object.add("data", data);
        
        return object;
	}

    /**
     * Make a color lighter.
     *
     * @param colorStr  Color hexcode as String to make lighter
     * @param fraction  Darkness fraction
     * @return          Lighter color as rgb hexcode String again
     */
    private String getColorGradient(String colorStr, int fraction, boolean setDarker) {


        if (setDarker) {fraction = fraction*(-1); }
        Color colorCode = new Color(
                Integer.valueOf( colorStr.substring( 1, 3 ), 16 ),
                Integer.valueOf( colorStr.substring( 3, 5 ), 16 ),
                Integer.valueOf( colorStr.substring( 5, 7 ), 16 ));

       return String.format("%06X", Integer.valueOf(colorCode.getRGB())+fraction*10).substring(2);
    }

}
