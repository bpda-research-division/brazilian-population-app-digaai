<!DOCTYPE HTML>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <meta name="description" content="Visualizing The Brazilian Diaspora in the United States"/>
    <meta name="author" content="Dharmesh Tarapore"/>

    <title>Visualizing The Brazilian Diaspora</title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <!-- <link href="css/jumbotron.css" rel="stylesheet"> -->
    <!-- Custom styles for this project -->
    <link href="css/style1.css" rel="stylesheet">
  </head>

  <body>
    <main role="main">
      <div class="title-banner">
        <div class="header-title">
          <h1>VISUALIZING THE <span>BRAZILIAN</span> DIASPORA</h1>
        </div>
      </div>

      <div id="mapContainer" class="container-fluid map-container">
        <div class="row">
          <div class="col-12 col-md-6 order-md-2 map-graphic-container">
            <svg id="map" viewBox="0 0 960 600"></svg>
          </div>
          <div class="col-12 col-md-6 map-control-container">
              <div class="map-control category-dropdown-container">
                <h3>CATEGORIES</h3>
                <div class="dropdown">    
                  <button class="dropdown-toggle category-dropdown" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    CATEGORIES
                  </button>           
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#" onclick='setFeature("population", "Population")'>Population</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("age detail", "Ages")'>Ages</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("age summary", "Ages Grouped")'>Ages Grouped</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("gender", "Gender")'>Gender</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("marriage", "Marital Status")'>Marital Status</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("citizen", "Citizen Status")'>Citizen Status</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("enter time", "Entry Time")'>Entry Time</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("education", "Education")'>Education</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("civilian labor force", "Civilian Labor Force")'>Civilian Labor Force</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("unemployed", "Employment Status")'>Employment Status</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("employment type", "Employment Type")'>Employment Type</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("employment by industry", "Employment by Industry")'>Employment by Industry</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("employment by occupation", "Employment by Occupation")'>Employment by Occupation</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("income", "Yearly Income")'>Yearly Income</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("business", "Business Owners")'>Business Owners</a>
                  </div>
                </div>
              </div>
              <div class="map-control state-container">
                  <h3>STATE</h3>
                  <h2 id="displayedState"></h2>
              </div>
              <div class="map-control data-desc-info">
                  <h3>NOW SHOWING</h3>
                  <h2 id="displayedCategory"></h2>
              </div>  
          </div>
        </div>
      </div>

      <div class="container-fluid data-container">
        <div class="row">
          <div class="state-header">
            <h2 id="stateHeader"></h2>
          </div>
          <div class="col-12 col-md-6 bar-data-container">
            <div class="data-description">
              <h3 id="barDataCategory"></h3>
              <h1 id="barDataValue"></h1>
            </div>
            <div id="barChartContainer" class="bar-chart-container">
              <svg id="bar" 
                mobile-sm-width="300" 
                mobile-sm-height="250"
                mobile-md-width="350" 
                mobile-md-height="350"
                width="500" 
                height="400">
              </svg>
            </div>
          </div>
          <div class="col-12 col-md-6 pie-data-container">
            <div class="pie-chart-container">
              <svg id="pie" 
                mobile-sm-width="280" 
                mobile-sm-height="200"
                mobile-md-width="400" 
                mobile-md-height="400"
                width="400" 
                height="400">
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="container">
      <p>&copy; Digaai 2017-2018</p>
    </footer>


	<!-- various javascript libraries needed for webpage -->
	<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script>window.jQuery || document.write('<script src="../../../../assets/js/vendor/jquery-slim.min.js"><\/script>')</script>
    <script src="js/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    
    <!-- For the map and graph -->
    <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="https://d3js.org/topojson.v2.min.js"></script>
    <script src="js/d3-tip.js"></script>

    <script type="text/javascript" src="js/visualize.js"></script>

  </body>
</html>
