package graphconverter;

import graphconverter.Node;

/**
 * The Class Edge.
 *
 * @author davcem
 * @version 1.0
 * @since 2015-06-12
 * 
 * Class represents an edge.
 * <p>
 * An edge is given by a {@link #name}, a {@link Node} {@link #setStart(Node)} and {@link Node} {@link #setEnd(Node)}.
 */

public class Edge {
	
	/**The name of the edge.*/
	private String name;
	
	/**The start node of the edge.*/
	private Node start;
	
	/**The end node of the edge.*/
	private Node end;
	
	/**
	 * Instantiates a new {@linkplain Edge}.
	 *
	 * @param start the start
	 * @param end the end
	 */
	public Edge(Node start, Node end){
		
		this.start = start;
		this.end = end;
		this.setName();
		
	}
	
	/**
	 * Gets the name.
	 *
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * Gets the start.
	 *
	 * @return the start
	 */
	public Node getStart() {
		return start;
	}

	/**
	 * Gets the end.
	 *
	 * @return the end
	 */
	public Node getEnd() {
		return end;
	}

	/**
	 * Sets the start.
	 *
	 * @param start the new start
	 */
	public void setStart(Node start) {
		
		this.start = start;
		
		setName();
	}

	/**
	 * Sets the end.
	 *
	 * @param end the new end
	 */
	public void setEnd(Node end) {
		
		this.end = end;
		
		setName();
	}
	
	/**
	 * Generates the name of the edge which is the id of the {@link Node} start
	 * + "-" and the id of the {@link Node} end.
	 */
	private void setName(){
		
		this.name = start.getId() + "-" + end.getId();
	}
	
	/**
	 * Function checks if {@link Edge} is equal to this {@link Edge}.
	 *
	 * @param object the object
	 * 
	 * @return true if {@link Object} is instance of {@link Edge} and if the {@link #name}s of the {@link Edge}s
	 * are identical, or if {@link Edge}s have the same {@link #start} and {@link #end} {@link Node}s.
	 * 
	 * @return false otherwise
	 */
	@Override
	public boolean equals(Object object){
		
		if(object instanceof Edge){
			
			Edge edge = (Edge) object;
			
			//edges are identical if name is identical
			//or edge with node a -> node b and node b -> node a
			if(this.getName().equals(edge.getName()) ||
					(this.end.getId() + "-" + this.start.getId()).equals(edge.getName())){		

	                return true;
	        }	
		}

		return false;
		
	}
	
	/**
	 * Function returns hashCode of this {@link Edge}.
	 * 
	 * @return the hashcode of given {@link Edge}, which is the {@link Integer} value of the {@link #name}
	 **/
	@Override
    public int hashCode() {
        return Integer.valueOf(name);
    }
}
