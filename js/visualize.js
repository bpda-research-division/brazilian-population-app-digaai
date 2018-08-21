/*
 * Filename: visualize.js
 * Authors: Dharmesh Tarapore <dharmesh@cs.bu.edu> and Aaron Elliot
 * Description: Visualizing ACS estimates.
 */

var mapData = null,
    chartData = null

var currFeature = 0;
var currState = "01";
var currGroup = "population";

// Define map and graph svgs
var mapSvg = d3.select("#map").attr("width", "100%").attr("height", "100%"),
    mapPath = d3.geoPath(),
    mapColor = null;
var barSvg = d3.select("#bar"),
    barMargin = {top: 20, right: 50, bottom: 100, left: 100},
    barWidth = +barSvg.attr("width") - barMargin.left - barMargin.right,
    barHeight = +barSvg.attr("height") - barMargin.top - barMargin.bottom;

var pieSvg = d3.select("#pie"),
    pieMargin = {top: 0, right: 0, bottom: 100, left: 0},
    pieWidth = +pieSvg.attr("width") - pieMargin.left - pieMargin.right,
    pieHeight = +pieSvg.attr("height") - pieMargin.top - pieMargin.bottom,
    pieRadius = Math.min(pieWidth, pieHeight) / 2;

// Define tooltips for map and graphs
var mapTip = d3.tip()
                .attr("class", "tip")
                .offset([-8, 0])
                .html(d => chartData[currFeature][""] + " : " + chartData[currFeature][d.id]);

var barTip = d3.tip()
                .attr("class", "tip")
                .offset([-8, 0])
                .html(d => d[""] + " : " + d[currState]);

// it would be better for this to display a percentage rather than value
var pieTip = d3.tip()
                .attr("class", "tip")
                .offset([-8, 0]) 
                .html(d => d.data[""] + " : " + d.data.percentage); 
mapSvg.call(mapTip);
barSvg.call(barTip);
pieSvg.call(pieTip);

function toTitleCase(str) {
    if(str == "citizen") {
        return "Citizenship Status";
    } else if(str == "marriage") {
        return "Marital Status";
    } else if(str == "enter time") {
        return "Time of Entry to the United States"
    } else if(str == "unemployed") {
        return "Unemployment Statistics"
    } else if(str == "business") {
        return "Business Owners";
    }
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function toDisplayCase(str) {
    if(str == "citizen") {
        return "CITIZEN STATUS";
    } else if(str == "marriage") {
        return "MARITAL STATUS";
    } else if(str == "enter time") {
        return "TIME OF ENTRY TO THE UNITED STATES"
    } else if(str == "unemployed") {
        return "UNEMPLOYMENT STATISTICS"
    } else if(str == "business") {
        return "BUSINESS OWNERS";
    }

    return str.toUpperCase();
}


// // Resizes the map to fit the screen    
// function redraw() {
//     // document.body.clientWidth may not work in all browsers
// 	// may cause an error. It works in Chrome and Edge for sure

//     // Extract the width and height that was computed by CSS.
//     var width = parseInt(document.body.clientWidth*3/5);
//     var height = parseInt(document.body.clientWidth*3/5*.62);

//     // Use the extracted size to set the size of an SVG element.
//     mapSvg.attr("width", width).attr("height", height);
// }
// // Call redraw the first time
// redraw();
// // Call redraw after resize
// window.addEventListener("resize", redraw);


// Get the correct rows from all data for these features
function getGroup(data, group, changeFeature = false) {
    start = 0;
    end = 0;
    switch(group) {
        case "population": start = 0; end = 1;
            break;
        case "age detail": start = 1; end = 19;
            break;
        case "age summary": start = 19; end = 23;
            break;
        case "gender": start = 23; end = 25;
            break;
        case "marriage": start = 25; end = 30;
            break;
        case "citizen": start = 30; end = 32;
            break;
        case "enter time": start = 32; end = 34;
            break;
        case "education": start = 34; end = 37;
            break;
        case "civilian labor force": start = 37; end = 39;
            break;
        case "unemployed": start = 39; end = 41;
            break;
        case "employment type": start = 41; end = 45;
            break;
        case "employment by industry": start = 45; end = 52;
            break;
        case "employment by occupation": start = 52; end = 60;
            break;
        case "income": start = 60; end = 62;
            break;
        case "business": start = 62; end = 64;
            break;
        default:
            break;
    }
    if(changeFeature) {
        currFeature = d3.min([d3.max([start, currFeature]), end - 1]);
    }
    return data.slice(start, end);
}

// util function
function rowSum(data) {
    s = 0;
    for(var k in data) {
        if(k) {
            v = data[k];
            s = s+v/5;
        }
    }
    return s;
}

function columnMax(group, state) {
    m = -Infinity;
    for(i = 0; i < group.length; ++i) {
        v = group[i][state];
        if(m < v) m = v;
    }
    return m;
}

// Removes any extra ',' from the data and converts to float
function dataPreprocess(data) {
    console.log(data);
    rst = {};
    for(i = 0; i < data.length; ++i) {
        for(var k in data[i]) {
            if(k) {
                numStr = data[i][k].replace(/[,]/g, '');
                data[i][k] = parseFloat(numStr);
            }                 
        }
    }
    return data;
}

// Get state color as a percentage of the whole
function stateMapColor(d) {
    c = chartData[currFeature][d.id]
    return mapColor(c);
}

// Load data
d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "resources/all_data.csv")
    .await(dataReady);

// Reload maps and tip for state mouse-over
function mouseOver(d, i) {
    mapTip.show(d, i);
    currState = d.id;
    document.getElementById("displayedState").innerHTML = d.id;
    showBarChart();
    showPieChart();
}

// After data is loaded, load the map
function dataReady(error, us, data) {
    if (error) throw error;
    mapData = us;
    chartData = dataPreprocess(data);
    var defaultState = 25; 
    currState = defaultState;
    document.getElementById("displayedState").innerHTML = defaultState;
    setFeature("age summary", "Ages Grouped");
}

// Reload the map for this feature
function clickFeature(d, i) {
    chartData.forEach((e, i) => {
        if(e[""] == d[""]) currFeature = i;
    });
    showMap();
}

// Same as above
function clickPie(d, i) {
    clickFeature(d.data, i);
}

// Load the map
function showMap() {
    mapSvg.selectAll("g").remove();
    mapSvg.selectAll("path").remove();
    mapColor = null;

    color = d3.scaleLinear()
                .domain([0, rowSum(chartData[currFeature])])
                .range(['#c6dbef', '#2d0894']);
    mapColor = (d) => { 
        return color(chartData[currFeature][d.id])
    };

    mapSvg.append("g")
            .attr("class", "state-inner")
            .selectAll("path")
            .data(topojson.feature(mapData, mapData.objects.states).features)
            .enter().append("path")
            .attr("fill", d => mapColor(d))
            .attr("d", mapPath)
            .on("mouseover", mouseOver)
            .on("mouseleave", mapTip.hide);

    mapSvg.append("path")
            .datum(topojson.mesh(mapData, mapData.objects.states, (a, b) => a !== b))
            .attr("class", "states")
            .attr("d", mapPath);
    
    setFeature
}

// Load the bar chart
function showBarChart() {
    // Clean last output
    barSvg.select("g").remove();

    data = getGroup(chartData, currGroup);

    x = d3.scaleBand().rangeRound([0, barWidth]).padding(0.1),
    y = d3.scaleLinear().rangeRound([barHeight, 0]);

    x.domain(data.map(d => d[""]));
    y.domain([0, columnMax(data, currState)]);

    let g = barSvg.append("g")
                    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

    g.append("g")
        .attr("transform", "translate(0," + barHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[""]))
        .attr("y", d => y(d[currState]))
        .attr("width", x.bandwidth())
        .attr("height", d => barHeight - y(d[currState]))
        .on("click", clickFeature)
        .on("mouseover", barTip.show)
        .on("mouseout", barTip.hide);
}

// Load the pie chart
function showPieChart() {
    // Clean last output
    pieSvg.selectAll("g").remove();
    
    data = getGroup(chartData, currGroup);
    
    g = pieSvg.append("g").attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")"),
    pieColor = d3.scaleOrdinal(d3.schemeCategory20c);

    var tots = d3.sum(data, function(d) { 
            return d[currState]; 
        });

    // God have mercy on my soul.
    // I'm so, so sorry for this.
    data.forEach(function(d) {
        d.percentage = d[currState]  / tots;
        d.percentage = (d.percentage * 100).toFixed(2);
        d.percentage = d.percentage + "%";
    });

    pie = d3.pie()
            .sort(null)
            .value(d => d[currState]);
    
    piePath = d3.arc()
                .outerRadius(pieRadius - 10)
                .innerRadius(0);


    arc = g.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");

    arc.append("path")
        .attr("d", piePath)
        .attr("fill", d => pieColor(d.data[""]))
        .on("click", clickPie)
        .on("mouseover", pieTip.show)
        .on("mouseout", pieTip.hide);
    
    wid = data.length * 12;
    x = d3.scaleBand().rangeRound([0, wid]).padding(0.1);
    x.domain(data.map(d => d[""]));

    barSize = x.bandwidth();
    g = g.append("g").attr("transform", "translate(" + -pieWidth / 4 + "," + pieHeight / 2 + ")")
    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("x", d => x(d[""]))
        .attr("y", 6)
        .attr("width", barSize)
        .attr("height", barSize)
        .attr("fill", d => pieColor(d[""]));
    
    g.append("g")
        .attr("class", "pie-axis")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", -barSize / 2)
        .attr("x", 10 + barSize)
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");
}

// Update for feature click
function setFeature(currCategoryAlias, currCategoryName) {
    var currCategory = document.getElementById("displayedCategory");
    currCategory.innerHTML = toDisplayCase(currCategoryAlias);
    var dropdownMenuButton = document.getElementById("dropdownMenuButton");
    dropdownMenuButton.innerHTML = currCategoryName.toUpperCase();
    // dropDownEle = d3.select("#selectFeature");
    // dropDownEle.classed("show", false);
    currGroup = currCategoryAlias;
    getGroup(chartData, currCategoryAlias, true);
    showMap();
    showBarChart();
    showPieChart();
}   