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
      <div id="titleContainer" class="title-banner">
        <div class="title-banner-img">
          <img src="http://digaai.dharmeshtarapore.com:8080/wp-content/themes/digaai/img/diggai.png" alt="logo"/>     
        </div>
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
              <div class="map-control use-desc-info">
                <p>Choose a Category</p>
                <p>Hover over the map to see data by state</p>
                <p>Click on a state to explore data on graphs</p>
                <p>Click on graph to explore data on map</p>
              </div>
              <div class="map-control category-dropdown-container">
                <h3>CATEGORIES</h3>
                <div class="dropdown">    
                  <button class="dropdown-toggle category-dropdown" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    CATEGORIES
                  </button>           
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <span class="category-header">PERSONS</span>
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
                    <a class="dropdown-item" href="#" onclick='setFeature("income", "Personal Earnings")'>Personal Earnings</a>
                    <span class="category-header">HOUSEHOLDS &amp; FAMILIES</span>
                    <a class="dropdown-item" href="#" onclick='setFeature("occupied housing units", "Occupied Housing Units")'>Occupied Housing Units</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("total number of families", "Total Number of Families")'>Total Number of Families</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("families in poverty", "Families in Poverty")'>Families in Poverty</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("owner occupied units", "Owner Occupied Units")'>Owner Occupied Units</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("monthly ownership costs", "Monthly Ownership Costs")'>Monthly Ownership Costs</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("gross rent", "Gross Rent")'>Gross Rent</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("crowded units", "Crowded Units")'>Crowded Units</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("population for whom poverty status is determined", "Population for Whom Poverty Status is Determined")'>Population for Whom Poverty Status is Determined</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("individuals below poverty", "Individuals Below Poverty")'>Individuals Below Poverty</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("median household income", "Median Household Income")'>Median Household Income</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("median family income", "Median Family Income")'>Median Family Income</a>
                    <span class="category-header">BUSINESSES</span>
                    <a class="dropdown-item" href="#" onclick='setFeature("business", "Business Owners")'>Business Owners</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("brazilian immigrants vs brazilian immigrants business owners", "Brazilian Immigrants vs Brazilian Immigrant Business Owners")'>Brazilian Immigrants vs Brazilian Immigrant Business Owners</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("no. of brazilian immigrants who are self-employed in own incorporated business, professional practice, or farm", "No. of Brazilian Immigrants who are Self-employed in own Incorporated Business, Professional Practice, or Farm")'>No. of Brazilian Immigrants who are Self-employed in own Incorporated Business, Professional Practice, or Farm</a>
                    <a class="dropdown-item" href="#" onclick='setFeature("no. of brazilian immigrants who are self-employed in own unincorporated business, professional, practice, or farm", "No. of Brazilian Immigrants who are Self-Employed in own Unincorporated Business, Professional Practice, or Farm")'>No. of Brazilian Immigrants who are Self-Employed in own Unincorporated Business, Professional Practice, or Farm</a>
                    <a 
                      class="dropdown-item glossary-link" 
                      href="https://docs.google.com/document/d/1Tfw5pLRYWzpOczEd6GGPo4G1zRu5Uq47gUWXka2ZakA/edit"
                      target="_blank">
                      GLOSSARY
                    </a>
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

      <div id="dataContainer" class="container-fluid data-container">
        <div class="row">
          <div class="col-12 col-md-6 data-description">
              <h3 id="dataCategory"></h3>
              <h1 id="dataValue"></h1>
          </div>
          <div class="col-6 hidden-sm-down state-header">
            <h2 id="stateHeader"></h2>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6 bar-data-container">
            <div id="barChartContainer" class="bar-chart-container">
              <!-- Might be able to set width and height to 100% and leverage css media queries for sizing -->
              <svg id="bar" 
                sm-width="300" 
                sm-height="300"
                md-width="350" 
                md-height="350"
                lg-width="450" 
                lg-height="450">
              </svg>
            </div>
          </div>
          <div class="col-12 col-md-6 pie-data-container">
            <div class="pie-chart-container">
              <svg id="pie" 
                sm-width="270" 
                sm-height="270"
                md-width="270" 
                md-height="270"
                lg-width="350" 
                lg-height="350">
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="container-fluid footer-container">
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
