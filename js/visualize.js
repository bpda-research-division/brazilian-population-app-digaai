/*
 * Filename: visualize.js
 * Authors: Dharmesh Tarapore <dharmesh@cs.bu.edu>, Aaron Elliot, and Brian Tan <brian.lin.tan@gmail.com>
 * Description: Visualizing ACS estimates.
 */

const STATE_MAP_KEYS = Object.freeze({
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
});

const dataCategoryConfigs = [
    { name: "population", isMonetaryValue: false, requiresPieChart: true },
    { name: "age detail", isMonetaryValue: false, requiresPieChart: true },
    { name: "age summary", isMonetaryValue: false, requiresPieChart: true },
    { name: "gender", isMonetaryValue: false, requiresPieChart: true },
    { name: "marriage", isMonetaryValue: false, requiresPieChart: true },
    { name: "citizen", isMonetaryValue: false, requiresPieChart: true },
    { name: "enter time", isMonetaryValue: false, requiresPieChart: true},
    { name: "education", isMonetaryValue: false, requiresPieChart: true },
    { name: "civilian labor force", isMonetaryValue: false, requiresPieChart: true },
    { name: "unemployed", isMonetaryValue: false, requiresPieChart: true },
    { name: "employment type", isMonetaryValue: false, requiresPieChart: true },
    { name: "employment by industry", isMonetaryValue: false, requiresPieChart: true },
    { name: "employment by occupation", isMonetaryValue: false, requiresPieChart: true },
    { name: "population for whom poverty status is determined", isMonetaryValue: false, requiresPieChart: true },
    { name: "individuals below poverty", isMonetaryValue: false, requiresPieChart: true },
    { name: "income", isMonetaryValue: true, requiresPieChart: false },
    { name: "business", isMonetaryValue: false, requiresPieChart: true },
    { name: "occupied housing units", isMonetaryValue: false, requiresPieChart: false},
    { name: "total number of families", isMonetaryValue: false, requiresPieChart: true},
    { name: "families in poverty", isMonetaryValue: false, requiresPieChart: true},
    { name: "owner occupied units", isMonetaryValue: false, requiresPieChart: true },
    { name: "monthly ownership costs", isMonetaryValue: false, requiresPieChart: true },
    { name: "gross rent", isMonetaryValue: false, requiresPieChart: true },
    { name: "crowded units", isMonetaryValue: false, requiresPieChart: false },
    { name: "median household income",isMonetaryValue: true, requiresPieChart: false},
    { name: "median family income", isMonetaryValue: true, requiresPieChart: false},
    { name: "brazilian immigrants vs brazilian immigrants business owners", isMonetaryValue: false, requiresPieChart: true},
    { name: "brazilian immigrant business owners by type", isMonetaryValue: false, requiresPieChart: true },
    { name: "english proficiency", isMonetaryValue: false, requiresPieChart: true },
];

const MapTooltipDataType = Object.freeze({
    WHOLE: Symbol("whole"),
    PERCENTAGE: Symbol("percentage")
});

//#region Initialize Data

let mapData = null,
    csvData = null,
    formattedData = null,
    graphData = null;

let currFeature = 0,
    lockedState = "25",
    currState = "25",
    currGroup = "population",
    currGroupName = "Population",
    lastStateRef = null,
    lastStateHighlightColor = null,
    mapTooltipDataTypeState = MapTooltipDataType.WHOLE;

// Define map and graph svgs with tooltips
let mapSvg = d3.select("#map").attr("width", "100%").attr("height", "100%"),
    mapSvgPath = d3.geoPath(),
    barSvg = d3.select("#bar"),
    pieSvg = d3.select("#pie");

let mapTip = d3.tip()
                .attr("class", "tip")
                .offset([-8, 0])
                // .html(d => csvData[currFeature][""] + " : " + numberWithComma(csvData[currFeature][d.id])),
                .html(d => d),
    barTip = d3.tip()
                .attr("class", "tip")
                .offset([-8, 0])
                .html(d => d[""] + " : " + d[currState].displayValue),
    pieTip = d3.tip()
                .attr("class", "tip")
                .offset([-8, 0]) 
                .html(d => d.data[""] + " : " + d.data[currState].percentage); //come back here and with new formatted data

mapSvg.call(mapTip);
barSvg.call(barTip);
pieSvg.call(pieTip);

// Load data
d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "resources/digaaiDataSheet.csv")
    .await(dataReady);

//#endregion

//#region Data Visualize Methods

// Load the map
function showMap(map, mapPath, mapTooltip = MapTooltipDataType.WHOLE) {
    map.selectAll("g").remove();
    map.selectAll("path").remove();
    let mapColor = null;

    color = d3.scaleLinear()
                .domain([0, rowSum(csvData[currFeature])])
                .range(['#c6dbef', '#2d0894']);
    mapColor = (d) => {
        if (d.id === lockedState)
            return "orange";
        else
            return color(csvData[currFeature][d.id].value);
    };

    mapTooltipDataTypeState = mapTooltip;

    map.append("g")
            .attr("class", "state-inner")
            .selectAll("path")
            .data(topojson.feature(mapData, mapData.objects.states).features)
            .enter().append("path")
            .attr("id", d => "state" + d.id.toString())
            .attr("fill", d => mapColor(d))
            .attr("d", mapPath)
            .on("mouseover", mouseOverMapHandler)
            .on("mouseleave", mouseLeaveMapHandler)
            .on("click", clickMapHandler);

    map.append("path")
            .datum(topojson.mesh(mapData, mapData.objects.states, (a, b) => a !== b))
            .attr("class", "states")
            .attr("d", mapPath);

    lastStateRef = map.select("#state" + lockedState.toString());
    lastStateHighlightColor = color(csvData[currFeature][lockedState].value);
}

// Load the bar chart
function showBarChart(barChart) {
    //There is probably a better way to handle resizing the chart
    let chartWidth, 
        chartHeight, 
        barWidth, 
        barHeight,
        barMargin = { top: 20, right: 0, bottom: 100, left: 50 },
        screenWidth = parseInt(document.body.clientWidth);
    
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

    let x = d3.scaleBand().rangeRound([0, barWidth]).padding(0.1);
    let y = d3.scaleLinear().rangeRound([barHeight, 0]);
    x.domain(graphData.map(d => d[""]));
    y.domain([0, columnMax(graphData, currState)]);

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
        .attr("opacity", "0"); //hides x-axis values

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

    g.selectAll(".bar")
        .data(graphData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[""]))
        .attr("y", d => y(d[currState].value))
        .attr("width", x.bandwidth())
        .attr("height", d => barHeight - y(d[currState].value))
        // .attr("fill", d => barColor(d[""])) //to enable comment out css .bar fill color
        .on("click", clickDataPointHandler)
        .on("mouseover", barTip.show)
        .on("mouseout", barTip.hide);

    //Set display values in Bar Chart section
    if (mapTooltipDataTypeState === MapTooltipDataType.WHOLE) {
        document.getElementById("dataCategory").innerHTML = csvData[currFeature][""].toUpperCase();
        document.getElementById("dataValue").innerHTML = csvData[currFeature][currState].displayValue;
    }
}

// Load the pie chart
function showPieChart(pieChart) {
    let pieWidth, 
        pieHeight, 
        pieRadius,
        pieMargin = { top: 0, right: 0, bottom: 0, left: 0 },
        screenWidth = parseInt(document.body.clientWidth);

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

    pieChart.attr("width", pieWidth);
    pieChart.attr("height", pieHeight);

    pieWidth = pieWidth - pieMargin.left - pieMargin.right;
    pieHeight = pieHeight - pieMargin.top - pieMargin.bottom;
    pieRadius = Math.min(pieWidth, pieHeight) / 2;
    
    // Clean last output
    pieChart.selectAll("g").remove();

    // If pie chart is not required, do not draw
    let currentDataCategory = dataCategoryConfigs.find(config => config.name === currGroup);
    if (!currentDataCategory.requiresPieChart) return;
    
    g = pieChart.append("g").attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")"),
    pieColor = d3.scaleOrdinal(d3.schemeCategory20c);

    pie = d3.pie()
            .sort(null)
            .value(d => d[currState].value);
    
    piePath = d3.arc()
                .outerRadius(pieRadius - 10)
                .innerRadius(0);


    arc = g.selectAll(".arc")
                .data(pie(graphData))
                .enter().append("g")
                .attr("class", "arc");

    arc.append("path")
        .attr("d", piePath)
        .attr("fill", d => pieColor(d.data[""]))
        .on("click", clickPieHandler)
        .on("mouseover", pieTip.show)
        .on("mouseout", pieTip.hide);

    wid = graphData.length * 12;
        x = d3.scaleBand().rangeRound([0, wid]).padding(0.1);
        x.domain(graphData.map(d => d[""]));

    if (mapTooltipDataTypeState === MapTooltipDataType.PERCENTAGE) {
        document.getElementById("dataCategory").innerHTML = csvData[currFeature][""].toUpperCase();
        document.getElementById("dataValue").innerHTML = csvData[currFeature][currState].percentage; 
    }
}

function setFeature(currGroupVal, currGroupNameVal) {
    document.getElementById("displayedCategory").innerHTML = toDisplayCase(currGroupVal);
    document.getElementById("dropdownMenuButton").innerHTML = currGroupNameVal.toUpperCase();
    currGroup = currGroupVal;
    graphData = getGroup(csvData, currGroup, true);
    showMap(mapSvg, mapSvgPath);
    redrawDataHandler();
}   

// Get state color as a percentage of the whole
function stateMapColor(d) {
    c = csvData[currFeature][d.id].value;
    return mapColor(c);
}

//#endregion

//#region Data Helper Methods

// After data is loaded, load the map
function dataReady(error, us, data) {
    if (error) throw error;
    mapData = us;
    csvData = dataPreprocess(data);
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
    formatData(data);
    return data;
}

// Calculates the value and % of data
function formatData(data) {
    let currentGroups, 
        stateGroupTotal,
        tempVal,
        tempPercentage;

    for (let i = 0; i < dataCategoryConfigs.length; i++) {
        //for each category, get the collective groups for example:
        //for "age summary" category, grab data on "0 to 20," "21 to 34," etc.
        currentGroups = getGroup(data, dataCategoryConfigs[i].name, false);
        for (let state in STATE_MAP_KEYS) {
            //for each state calculate the total sum of values per group 
            stateGroupTotal = d3.sum(currentGroups, d => d[state]);
            for (let groupIndex = 0; groupIndex < currentGroups.length; groupIndex++) {
                //for each state, calculate the percentage a particular group is to the sum of all the related groups within the category
                tempVal = currentGroups[groupIndex][state];
                tempPercentage = Math.round((tempVal / stateGroupTotal) * 100);
                tempPercentage = (isNaN(tempPercentage) ? 0 : tempPercentage) + "%";
                
                currentGroups[groupIndex][state] = {
                    value: tempVal,
                    displayValue: dataCategoryConfigs[i].isMonetaryValue ? '$' + numberWithComma(tempVal) : numberWithComma(tempVal),
                    percentage: tempPercentage
                };
            }
        }
    }
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
        case "employment by industry": start = 45; end = 53;
            break;
        case "employment by occupation": start = 53; end = 59; 
            break;
        case "population for whom poverty status is determined": start = 59; end = 61;
            break;
        case "individuals below poverty": start = 61; end = 63;
            break;
        case "income": start = 63; end = 65;
            break;
        case "business": start = 66; end = 68; 
            break;
        case "occupied housing units": start = 68; end = 69;
            break;
        case "total number of families": start = 69; end = 70;
            break;
        case "families in poverty": start = 70; end = 72;
            break;
        case "owner occupied units": start = 72; end = 74;
            break;
        case "monthly ownership costs": start = 75; end = 81;
            break;
        case "gross rent": start = 82; end = 89;
            break;
        case "crowded units": start = 89; end = 90;
            break;
        case "median household income": start = 90; end = 91;
            break;
        case "median family income": start = 91; end = 92;
            break;
        case "brazilian immigrants vs brazilian immigrants business owners": start = 92; end = 94; 
            break;
        case "brazilian immigrant business owners by type": start = 94; end = 96;
            break;
        case "english proficiency": start = 96; end = 102;
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
    document.getElementById("stateHeader").innerHTML = mapToState(currState);
    showBarChart(barSvg);
    showPieChart(pieSvg);
}
window.addEventListener("resize", redrawDataHandler);

function mouseOverMapHandler(d, i) {
    let toolTipMessage;
    switch (mapTooltipDataTypeState) {
        case MapTooltipDataType.WHOLE: 
            toolTipMessage = csvData[currFeature][""] + " : " + csvData[currFeature][d.id].displayValue; 
            break;
        case MapTooltipDataType.PERCENTAGE:
            toolTipMessage = csvData[currFeature][""] + " : " + csvData[currFeature][d.id].percentage;
            break;
        default:
            toolTipMessage = csvData[currFeature][""] + " : " + csvData[currFeature][d.id].displayValue;
            break;
    }
    mapTip.show(toolTipMessage, i);
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
    document.getElementById("dataContainer").scrollIntoView();
}

function clickDataPointHandler(d, i) {
    csvData.forEach((e, i) => {
        if(e[""] == d[""]) currFeature = i;
    });

    document.getElementById("dataCategory").innerHTML = d[""].toUpperCase();
    document.getElementById("dataValue").innerHTML = d[currState].displayValue;
    showMap(mapSvg, mapSvgPath, MapTooltipDataType.WHOLE);
    document.getElementById("titleContainer").scrollIntoView();
}

function clickPieHandler(d, i) {
    csvData.forEach((e, i) => {
        if(e[""] == d.data[""]) currFeature = i;
    });

    document.getElementById("dataCategory").innerHTML = d.data[""].toUpperCase();
    document.getElementById("dataValue").innerHTML = d.data[currState].percentage;
    showMap(mapSvg, mapSvgPath, MapTooltipDataType.PERCENTAGE);
    document.getElementById("titleContainer").scrollIntoView();
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
    let sum = 0,
        value= 0;

    for(let key in data) {
        //for some reason 11 in the csv data does not correspond to any state
        if(key && key !== "11") {
            value = data[key].value;
            sum = sum + value/5;
        }
    }
    
    return sum;
}

function columnMax(group, state) {
    m = -Infinity;
    for(i = 0; i < group.length; ++i) {
        v = group[i][state].value; 
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