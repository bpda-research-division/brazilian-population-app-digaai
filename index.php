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
    <link href="css/jumbotron.css" rel="stylesheet">
    <!-- Custom styles for this project -->
    <link href="css/style1.css" rel="stylesheet">
  </head>

  <body>
      <!-- This makes the top navbar -->
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <a class="navbar-brand" href="#">Visualizing the Brazilian Diaspora</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul class="nav navbar-nav mr-auto">

         <!-- each nav-item is an item in the navbar -->
            <!-- Link to Digaii -->
          <!--li class="nav-item active">
            <a class="nav-link" target="_blank" href="https://www.digaai.com/">Digaai Mainpage <span class="sr-only">(current)</span></a>
          </li-->

            <!-- Jumps to the book section -->          
          <!--li class="nav-item">
            <a class="nav-link" href="https://www.digaai.com/lancamento-livro-brasileiros-nos-estados-unidos/" target="_blank">Brasileiros nos Estados Unidos _ Meio Século (Re)fazendo a América</a>
          </li-->

            <!-- Dropdown menu for feature selection -->                    
          <li class="dropdown">
            <a class="dropdown-toggle nav-link" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Categories <span class="caret"></span></a>

            <ul class="dropdown-menu">
              <li class="dropdown-menu-option"><a  onclick='setFeature("population")'>Population</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("age detail")'>Ages</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("age summary")'>Ages Grouped</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("gender")'>Gender</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("marriage")'>Marital Status</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("citizen")'>Citizen Status</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("enter time")'>Entry Time</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("education")'>Education</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("civilian labor force")'>Civilian Labor Force</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("unemployed")'>Employment Status</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("employment type")'>Employment Type</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("employment by industry")'>Employment by Industry</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("employment by occupation")'>Employment by Occupation</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("income")'>Yearly Income</a></li>
              <li class="dropdown-menu-option"><a  onclick='setFeature("business")'>Business Owners</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>

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
                  <div class="map-control state-drop-down">
                      <h3>STATE</h3>
                  </div>
                  <div class="map-control data-desc-info">
                      <h3>NOW SHOWING</h3>
                  </div>  
              </div>
          </div>
      </div>

      <div class="container-fluid data-container">
        <div class="row">
          <div class="col-12 order-md-2 bar-graph-container">
            <svg id="bar" width="480" height = "300"></svg>
          </div>
          <div class="col-12 pie-graph-container">
            <svg id="pie" width="480" height = "350"></svg>
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
