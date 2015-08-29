package graphconverter;

import java.util.HashMap;

import cpm.CPM;
import cpm.CPMLattice;

/**
 * @author davcem
 * @version 1.0
 * @since 2015-06-12
 * 
 * The CPMLatticeToGraphConverter converts the {@link CPMLattice} to graph structure with {@link Node}s and {@link Edge}s.
 * <p>
 * By initializing a new Instance of {@linkplain CPMLatticeToGraphConverter} and calling {@link #convertLattice()} the
 * nodes and edges for the graph are added to the {@link HashMap} within variables {@link #nodes} and {@link #edges}.
 * 
 */
public class CPMLatticeToGraphConverter {
	
	/** The cpm lattice. */
	private CPM cpmLattice;
	
	/** The nodes. */
	private HashMap<String, Node> nodes;
	
	/** The edges. */
	private HashMap<String, Edge> edges;
	
	/**  The volume array. */
	private HashMap<String, String> volume;
	
	/**  Counter for cell ids. */
	private int idCounter = 0;
	
	/**
	 * Instantiates a new {@linkplain CPMLatticeToGraphConverter}.
	 *
	 * @param latticeToConvert the lattice to convert
	 */
	public CPMLatticeToGraphConverter(CPM latticeToConvert){
		
		cpmLattice = latticeToConvert;
		nodes = new HashMap<String, Node>();
		edges = new HashMap<String, Edge>();
		volume = new HashMap<String, String>();
		
	}
	
	/**
	 * Procedure converts the given {@link CPMLattice} to the graph structure.
	 */
	public void convertLattice(){
		
		generateNodesFromLattice();
		
		generateEdgesFromLattice();
		
		generateNodesForCellsFromLattice();
		
	}

	/**
	 * Procedure generates the nodes from given {@link CPMLattice}.
	 */
	private void generateNodesFromLattice(){
		
		/*The generation of ids is tricky, because maybe later we need to sort them (not numbers strings!)
		 * so we need to know how many nodes are in lattice to attach leading zeros
		 * */
		double numberOfNodes = cpmLattice.getXMax() * cpmLattice.getYMax();
		
		int leadingZeros = (int) Math.log10(numberOfNodes) + 1 ;
		
		for(int i = 0;i < cpmLattice.getSigma().length; i++){
			
			for(int j = 0; j < cpmLattice.getSigma()[i].length; j++){
				
				/*Id should contain leading zero*/
				String format = ("%0"+leadingZeros+"d");
				String idFormatted = String.format(format, idCounter++);
				
				int cell = cpmLattice.getSigma()[i][j];
				
				String parentId = generateParentIdFromCell(cell);

				Node node = new Node(idFormatted,i, j, String.valueOf(cell), parentId);				
				
				nodes.put(node.getIndex(), node);
				
			}	
		}
	}
	
	/**
	 * Procedure generates the edges from given {@link CPMLattice}.
	 */
	private void generateEdgesFromLattice(){
		
		for(int i = 0;i < cpmLattice.getSigma().length; i++){
			
			for(int j = 0; j < cpmLattice.getSigma()[i].length; j++){
				
				Node node = nodes.get(Node.createIndexFromCoordinates(i, j));
				
				if(node != null){
					
					createEdgesFromNeighbours(node, i, j);
					
				}				
			}
		}
	}
	
	/**
	 * Procedure generates the edges from node neighbors.
	 *
	 * @param start the start
	 * @param i the i
	 * @param j the j
	 */
	private void createEdgesFromNeighbours(Node start, int i, int j){
		
		int startI = (i - 1 < 0) ? i : i-1;
		int startJ = (j - 1 < 0) ? j : j-1;
		int endI =   (i + 1 >= cpmLattice.getXMax()) ? i : i+1;
		int endJ =   (j + 1 >= cpmLattice.getYMax()) ? j : j+1;
		
		for (int rowIndex=startI; rowIndex<=endI; rowIndex++) {
			
		    for (int columnIndex=startJ; columnIndex<=endJ; columnIndex++) {
		    	
		    	if(!(rowIndex==i && columnIndex==j) ){
		    	
			    	Node end = nodes.get(Node.createIndexFromCoordinates(rowIndex, columnIndex));
			    	
			    	if(end != null){
			    		
			    		Edge edge = new Edge(start, end);
			    		
			    		//reverseEdge is only generated, because we must no add an edge if the edge already
			    		//exists (edge a->b == edge a<-b)
			    		Edge reverseEdge = new Edge(end, start);
			    		    		
			    		if(!edges.containsKey(edge.getName()) && !edges.containsKey(reverseEdge.getName())){
			    			
			    			edges.put(edge.getName(), edge);
			    			
			    		}
			    	}
		    	}
		    }
		}
	}
	
	/**
	 * Generate nodes for cells from lattice.
	 */
	private void generateNodesForCellsFromLattice() {
		
		for(int i = 0; i < cpmLattice.getArea().length; i++){
			
			String id = generateParentIdFromCell(i);
			
			Node cell = new Node(id, -1, -1, Integer.toString(i), id );
			
			cell.setArea(cpmLattice.getArea()[i]);
			
			nodes.put(cell.getId(), cell);
			
		}
	}
	
	/**
	 * Generates the parent id from given cell.
	 * As initially the cells are not really represented in the lattice 
	 * we take the number of lattice sites + the id of cell for the overall id.
	 * 
	 *
	 * @param cell the cell
	 * @return the string
	 */
	private String generateParentIdFromCell(int cell){
		
		int id = cpmLattice.getXMax() * cpmLattice.getYMax() + cell;
		
		return String.valueOf(id);
	}

	/**
	 * Gets the nodes.
	 *
	 * @return the nodes
	 */
	public HashMap<String, Node> getNodes() {
		return nodes;
	}

	/**
	 * Gets the edges.
	 *
	 * @return the edges
	 */
	public HashMap<String, Edge> getEdges() {
		return edges; 
	}

	/**
	 * Gets the volume.
	 *
	 * @return the volume
	 */
	public HashMap<String, String> getVolume() {
		return volume;
	}

	/**
	 * Sets the nodes.
	 *
	 * @param nodes the nodes
	 */
	public void setNodes(HashMap<String, Node> nodes) {
		this.nodes = nodes;
	}

	/**
	 * Sets the edges.
	 *
	 * @param edges the edges
	 */
	public void setEdges(HashMap<String, Edge> edges) {
		this.edges = edges;
	}
	
}