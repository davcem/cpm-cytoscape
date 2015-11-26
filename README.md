# cpm-cytoscape #

__In Silico Modeling for Tumor Growth Visualization__

A science project by 
F. Jeanquartier, C. Jean-Quartier, D. Cemernek, with the Holzinger Group, Research Unit HCI-KDD.
Get in contact with one of the developers via mail [f.jeanquartier[at]hci-kdd.org](mailto:f.jeanquartier[at]hci-kdd.org)

<img src="img/cpm-cytoscape-with-line-chart-overlay.png" width="780" alt="The cpm-cytoscape webapp provides a ui for initialization and stepwise simulation computation. The left part shows the initialization, the right part the state after performing Monte Carlo step computations. A toggleable overlay is showing the traditional growth as line chart for comparing two different cell growth rates" />
<img src="img/cpm-cytoscape-simulation-run-with-more-than-two-cells.png" width="780" alt="Here we see the computed result of a simulation run with other initialize values than the defaults." />



## Overview of the app ##

This is app is for the purpose of scientific simulation and visual analysis of tumor growth.
 
The app makes use of the Cellular Potts Model (CPM) implemented in Java.  
The html5 frontend makes use of the cytoscape.js library for visualization output.

- CPM Model

The CPM model is a popular lattice-based, multi-particle cell-based formalism, also used for modeling tumor growth, first described by Graner & Glazier 1992.

- Cytoscape Visualization

We make use of the graph theory and visualization library [Cytoscape.js](http://js.cytoscape.org) to create simulation output in html.


## How to Run and Deploy cpm-cytoscape in silico simulation app ##

The app can be easily deployed by making use of the WAR file. 
Another option is to deploy the whole source. 
We further encourage developers developers to revise existing.

### Prerequisites ###

To run this app you need a Java capable webserver such as Apache Tomcat and at least java version 1.7 to run the app.

### Option 1 : WAR file ###

Download the latest WAR file 'cpm-cytoscape.war' from `https://github.com/davcem/cpm-cytoscape/tree/master/target/cpm-cytoscape.war`. 
Deploy the war file on your Java capable Webserver such as Tomcat and start the server.
Open a webbrowser and type in the url to the deployed webapp such as `http://localhost:8080/cpm-cytoscape/` and start playing around with the app.

### Option 2 : Deploy the source ###

Download the latest sources from `https://github.com/davcem/cpm-cytoscape/tree/master/bin/src/main`.
Create a webapp folder on your Java capable Webserver such as Tomcat and start start the server. 
Open a webbrowser and type in the url to the deployed webapp such as `http://localhost:8080/cpm-cytoscape/` and start playing around with the app.


## Contribute to our project ##

We __encourage__ you to have a look at our source code, give us [feedback](mailto:f.jeanquartier[at]hci-kdd.org) and contribute to the cpm-cytoscape project to foster in silico simulation in cancer research!


## Demo - coming until 2016 ##

The app is already running and can be easily deployed. 
However, we know, that not every clinician and/or scientist is able to run his own web servlet or respectively java capable webserver. 
Therefore, we further plan to provide an online version by end of 2015, always running the newest stable version to try it out.

## License

The content of this project itself is licensed under the [Creative Commons Attribution 3.0 license](http://creativecommons.org/licenses/by/3.0/us/deed.en_US), and the underlying source code used to format and display that content is licensed under the [MIT license](http://opensource.org/licenses/mit-license.php).