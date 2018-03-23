// variables
var currFeature = 0;
var currGroup = "population";

var groups = ["population", "age detail", "age summary", "gender", "marriage", "citizen", 
              "enter time", "education", "civilian labor force", "unemployed", "employment type",
              "employment by industry", "employment by occupation", "income" ];

//UI function
function dropDown() {
    dropDownEle = d3.select("#selectFeature");
    if(dropDownEle.classed("show")) {
        dropDownEle.classed("show", false);
    } else {
        dropDownEle.classed("show", true);
        dropDownEle.selectAll("a")
                    .data(groups)
                    .enter().append("a")
                    .text(d => d)
                    .attr("href", "#")
                    .on("click", clickFeatureGroup);
    }
}

function clickFeatureGroup(d, i) {
    dropDownEle = d3.select("#selectFeature");
    dropDownEle.classed("show", false);
    currGroup = d;
	$('#clicked-state').text('You clicked: '+currState+' AND '+currGroup);
	
}
