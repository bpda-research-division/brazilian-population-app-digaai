/*
 * Filename: visualize.js
 * Authors: Dharmesh Tarapore <dharmesh@cs.bu.edu> and Aaron Elliot
 * Description: Visualizing ACS estimates.
 */

const STATE_MAP_KEYS = {
    "01": "ALABAMA",
    "02": "ALASKA",
    "04": "ARIZONA",
    "05": "ARKANSAS",
    "06": "CALIFORNIA",
    "08": "COLORADO",
    "09": "CONNECTICUT",
    "10": "DELAWARE",
    "12": "FLORIDA",
    "13": "GEORGIA",
    "15": "HAWAII",
    "16": "IDAHO",
    "17": "ILLINOIS",
    "18": "INDIANA",
    "19": "IOWA",
    "20": "KANSAS",
    "21": "KENTUCKY",
    "22": "LOUISIANA",
    "23": "MAINE",
    "24": "MARYLAND",
    "25": "MASSACHUSETTS",
    "26": "MICHIGAN",
    "27": "MINNESOTA",
    "28": "MISSISSIPPI",
    "29": "MISSOURI",
    "30": "MONTANA",
    "31": "NEBRASKA",
    "32": "NEVADA",
    "33": "NEW HAMPSHIRE",
    "34": "NEW JERSEY",
    "35": "NEW MEXICO",
    "36": "NEW YORK",
    "37": "NORTH CAROLINA",
    "38": "NORTH DAKOTA",
    "39": "OHIO",
    "40": "OKLAHOMA",
    "41": "OREGON",
    "42": "PENNSYLVANIA",
    "44": "RHODE ISLAND",
    "45": "SOUTH CAROLINA",
    "46": "SOUTH DAKOTA",
    "47": "TENNESSEE",
    "48": "TEXAS",
    "49": "UTAH",
    "50": "VERMONT",
    "51": "VIRGINIA",
    "53": "WASHINGTON",
    "54": "WEST VIRGINIA",
    "55": "WISCONSIN",
    "56": "WYOMING"
};

//#region Initialize Data

let mapData = null;
let chartData = null;

let currFeature = 0;
let lockedState = "25";
let currState = "25";
let currGroup = "population";
let currGroupName = "Population";
let lastStateRef = null;
let lastStateHighlightColor = null;

// Define map and graph svgs with tooltips
let mapSvg = d3.select("#map").attr("width", "100%").attr("height", "100%");
let mapSvgPath = d3.geoPath();
let barSvg = d3.select("#bar");
let pieSvg = d3.select("#pie");

let mapTip = d3.tip()
                .attr("class", "tip")
                .offset([-8, 0])
                .html(d => chartData[currFeature][""] + " : " + chartData[currFeature][d.id]);

let barTip = d3.tip()
                .attr("class", "tip")
                .offset([-8, 0])
                .html(d => d[""] + " : " + d[currState]);

let pieTip = d3.tip()
                .attr("class", "tip")
                .offset([-8, 0]) 
                .html(d => d.data[""] + " : " + d.data.percentage); 

mapSvg.call(mapTip);
barSvg.call(barTip);
pieSvg.call(pieTip);

// Load data
d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "resources/all_data.csv")
    .await(dataReady);

//#endregion

//#region Data Visualize Methods

// Load the map
function showMap(map, mapPath) {
    map.selectAll("g").remove();
    map.selectAll("path").remove();
    let mapColor = null;

    color = d3.scaleLinear()
                .domain([0, rowSum(chartData[currFeature])])
                .range(['#c6dbef', '#2d0894']);
    mapColor = (d) => { 
        return color(chartData[currFeature][d.id])
    };

    map.append("g")
            .attr("class", "state-inner")
            .selectAll("path")
            .data(topojson.feature(mapData, mapData.objects.states).features)
            .enter().append("path")
            .attr("fill", d => mapColor(d))
            .attr("d", mapPath)
            .on("mouseover", mouseOverMapHandler)
            .on("mouseleave", mouseLeaveMapHandler)
            .on("click", clickMapHandler);

    map.append("path")
            .datum(topojson.mesh(mapData, mapData.objects.states, (a, b) => a !== b))
            .attr("class", "states")
            .attr("d", mapPath);
}

// Load the bar chart
function showBarChart(barChart) {
    //There is probably a better way to handle resizing the chart
    let chartWidth, chartHeight, barWidth, barHeight;
    let barMargin = { top: 20, right: 0, bottom: 100, left: 50 }; 
    let screenWidth = parseInt(document.body.clientWidth);
    
    if (screenWidth < 768) {
        chartWidth = barChart.attr("sm-width");
        chartHeight = barChart.attr("sm-height");
    } else if (screenWidth < 992) {
        chartWidth = barChart.attr("md-width");
        chartHeight = barChart.attr("md-height");
    } else {
        chartWidth = barChart.attr("lg-width");
        chartHeight = barChart.attr("lg-height");
    }

    barChart.attr("width", chartWidth);
    barChart.attr("height", chartHeight);
    barWidth = +chartWidth - barMargin.left - barMargin.right;
    barHeight = +chartHeight - barMargin.top - barMargin.bottom;  

    // Clean last output
    barChart.select("g").remove();

    let data = getGroup(chartData, currGroup);
    let x = d3.scaleBand().rangeRound([0, barWidth]).padding(0.1);
    let y = d3.scaleLinear().rangeRound([barHeight, 0]);
    x.domain(data.map(d => {
        console.log(d[""]);
        return d[""];
    }));
    y.domain([0, columnMax(data, currState)]);

    let barColor = d3.scaleOrdinal(d3.schemeCategory20c);

    let g = barChart.append("g")
                    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

    g.append("g")
        .attr("transform", "translate(0," + barHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start")
        .attr("opacity", "0"); //hides text

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
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[""]))
        .attr("y", d => y(d[currState]))
        .attr("width", x.bandwidth())
        .attr("height", d => barHeight - y(d[currState]))
        // .attr("fill", d => barColor(d[""])) //to enable comment out css .bar fill color
        .on("click", clickDataPointHandler)
        .on("mouseover", barTip.show)
        .on("mouseout", barTip.hide);

    //Set display values in Bar Chart section
    document.getElementById("dataCategory").innerHTML = chartData[currFeature][""].toUpperCase();
    document.getElementById("dataValue").innerHTML = numberWithComma(parseInt(chartData[currFeature][currState]));
}

// Load the pie chart
function showPieChart(pieChart) {
    let pieWidth, pieHeight, pieRadius;
    let pieMargin = { top: 0, right: 0, bottom: 0, left: 0 };
    let screenWidth = parseInt(document.body.clientWidth);

    if (screenWidth < 768) {
        pieWidth = +pieChart.attr("sm-width");
        pieHeight = +pieChart.attr("sm-height");
    } else if (screenWidth < 992) {
        pieWidth = +pieChart.attr("md-width");
        pieHeight = +pieChart.attr("md-height");
    } else {
        pieWidth = +pieChart.attr("lg-width");
        pieHeight = +pieChart.attr("lg-height");
    }

    pieChart.attr("width", "\{pieWidth\}");
    pieChart.attr("height", "\{pieHeight\}");

    pieWidth = pieWidth - pieMargin.left - pieMargin.right;
    pieHeight = pieHeight - pieMargin.top - pieMargin.bottom;
    pieRadius = Math.min(pieWidth, pieHeight) / 2;
    
    // Clean last output
    pieChart.selectAll("g").remove();
    
    data = getGroup(chartData, currGroup);
    
    g = pieChart.append("g").attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")"),
    pieColor = d3.scaleOrdinal(d3.schemeCategory20c);

    let tots = d3.sum(data, function(d) { 
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
        .on("click", clickPieHandler)
        .on("mouseover", pieTip.show)
        .on("mouseout", pieTip.hide);

    wid = data.length * 12;
        x = d3.scaleBand().rangeRound([0, wid]).padding(0.1);
        x.domain(data.map(d => d[""]));

    // if (data.length > 5) {
    //     barSize = x.bandwidth();
    //     g = g.append("g").attr("transform", "translate(" + -pieWidth / 4 + "," + pieHeight / 2 + ")")
    //     g.selectAll(".bar")
    //         .data(data)
    //         .enter().append("rect")
    //         .attr("x", d => x(d[""]))
    //         .attr("y", 6)
    //         .attr("width", barSize)
    //         .attr("height", barSize)
    //         .attr("fill", d => pieColor(d[""]));
        
    //     g.append("g")
    //         .attr("class", "pie-axis")
    //         .call(d3.axisBottom(x))
    //         .selectAll("text")
    //         .attr("y", -barSize / 2)
    //         .attr("x", 10 + barSize)
    //         .attr("transform", "rotate(90)")
    //         .style("text-anchor", "start");
    // } else {
    //     arc.append("text")
    //         .attr("class", "pie-label")
    //         .attr("text-anchor", "middle")
    //         .attr("x", d => {
    //             let a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
    //             d.cx = Math.cos(a) * (pieRadius - 45);
    //             return d.x = Math.cos(a) * (pieRadius + 30);
    //         })
    //         .attr("y", d => {
    //             let a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
    //             d.cy = Math.sin(a) * (pieRadius - 45);
    //             return d.y = Math.sin(a) * (pieRadius + 30);
    //         })
    //         .text(d => {
    //             // console.log(d);
    //             return d.data.percentage;
    //         })
    //         .each((d,i, element) => {
    //             let bbox = element[i].getBBox();
    //             d.sx = d.x - bbox.width/2 - 2;
    //             d.ox = d.x + bbox.width/2 + 2;
    //             d.sy = d.oy = d.y + 5;
    //         });

    //     arc.append("path")
    //         .attr("class", "pointer")
    //         .style("fill", "none")
    //         .style("stroke", "white")
    //         .attr("d", d => {
    //             if(d.cx > d.ox) {
    //                 return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
    //             } else {
    //                 return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
    //             }
    //         });
    // }

    document.getElementById("stateHeader").innerHTML = mapToState(currState);
}

function setFeature(currGroupVal, currGroupNameVal) {
    document.getElementById("displayedCategory").innerHTML = toDisplayCase(currGroupVal);
    document.getElementById("dropdownMenuButton").innerHTML = currGroupNameVal.toUpperCase();
    currGroup = currGroupVal;
    getGroup(chartData, currGroupVal, true);
    showMap(mapSvg, mapSvgPath);
    redrawDataHandler();
}   

// Get state color as a percentage of the whole
function stateMapColor(d) {
    c = chartData[currFeature][d.id]
    return mapColor(c);
}

//#endregion

//#region Data Helper Methods

// After data is loaded, load the map
function dataReady(error, us, data) {
    if (error) throw error;
    mapData = us;
    chartData = dataPreprocess(data);
    setFeature(currGroup, currGroupName);
}

// Removes any extra ',' from the data and converts to float
function dataPreprocess(data) {
    rst = {};
    for(i = 0; i < data.length; ++i) {
        for(let k in data[i]) {
            if(k) {
                numStr = data[i][k].replace(/[,]/g, '');
                data[i][k] = parseFloat(numStr);
            }                 
        }
    }
    return data;
}

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

//#endregion

//#region Event Handlers

// Add resize listener to redraw data charts  
function redrawDataHandler() {
    document.getElementById("displayedState").innerHTML = mapToState(currState);
    showBarChart(barSvg);
    showPieChart(pieSvg);
}
window.addEventListener("resize", redrawDataHandler);

function mouseOverMapHandler(d, i) {
    mapTip.show(d, i);
    currState = d.id;
    redrawDataHandler();
}

function mouseLeaveMapHandler(d, i) {
    mapTip.hide();
    currState = lockedState;
    redrawDataHandler();
}

function clickMapHandler(d, i, mapStates) {
    if(lastStateRef !== null)
        lastStateRef.attr("fill", lastStateHighlightColor);
        
    let currStateRef = d3.select(this);
    lastStateRef = currStateRef;
    lastStateHighlightColor = lastStateRef.attr("fill");
    currStateRef.attr("fill", "orange");

    lockedState = d.id;
    currState = lockedState;
    redrawDataHandler();
}

function clickDataPointHandler(d, i) {
    chartData.forEach((e, i) => {
        if(e[""] == d[""]) currFeature = i;
    });

    document.getElementById("dataCategory").innerHTML = d[""].toUpperCase();
    document.getElementById("dataValue").innerHTML = numberWithComma(parseInt(d[currState]));
    showMap(mapSvg, mapSvgPath);
}

function clickPieHandler(d, i) {
    chartData.forEach((e, i) => {
        if(e[""] == d.data[""]) currFeature = i;
    });

    document.getElementById("dataCategory").innerHTML = d.data[""].toUpperCase();
    document.getElementById("dataValue").innerHTML = d.data["percentage"];
    showMap(mapSvg, mapSvgPath);
}

//#endregion

//#region Utility Methods

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
        return "CITIZENSHIP STATUS";
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

function rowSum(data) {
    s = 0;
    for(let k in data) {
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

function numberWithComma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function mapToState(mapId) {
    return STATE_MAP_KEYS[mapId] || 'MASSACHUSETTS';
};
//#endregion