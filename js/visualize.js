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

const MAP_TOOL_TIP_DATA_TYPE = Object.freeze({
    WHOLE: Symbol("whole"),
    PERCENTAGE: Symbol("percentage")
});

const dataCategoryConfigs = [
    { name: "population", isMonetaryValue: false, barChartFilter: ['Rest of Country'], requiresPieChart: true },
    { name: "population brazilian estimate", isMonetaryValue: false, barChartFilter :['Rest of Country (Brazilian Estimate)'], requiresPieChart: true },
    { name: "age detail", isMonetaryValue: false, barChartFilter: null, requiresPieChart: true },
    { name: "age summary", isMonetaryValue: false, barChartFilter: null, requiresPieChart: true },
    { name: "gender", isMonetaryValue: false, barChartFilter: null, requiresPieChart: true },
    { name: "marriage", isMonetaryValue: false, barChartFilter: null, requiresPieChart: true },
    { name: "citizen", isMonetaryValue: false, barChartFilter: null, requiresPieChart: true },
    { name: "enter time", isMonetaryValue: false, barChartFilter: null, requiresPieChart: true},
    { name: "education", isMonetaryValue: false, barChartFilter: null, requiresPieChart: true },
    { name: "civilian labor force", isMonetaryValue: false, barChartFilter: null, requiresPieChart: true },
    { name: "unemployed", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true },
    { name: "employment type", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true },
    { name: "employment by industry", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true },
    { name: "employment by occupation", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true },
    { name: "population for whom poverty status is determined", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true },
    { name: "individuals below poverty", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true },
    { name: "income", isMonetaryValue: true, barChartFilter: null,  requiresPieChart: false },
    { name: "business", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true },
    { name: "occupied housing units", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: false},
    { name: "total number of families", isMonetaryValue: false, barChartFilter: ['Rest of Country'], requiresPieChart: true},
    { name: "families in poverty", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true},
    { name: "owner occupied units", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true },
    { name: "monthly ownership costs", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true },
    { name: "gross rent", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true },
    { name: "crowded units", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: false },
    { name: "median household income",isMonetaryValue: true, barChartFilter: null,  requiresPieChart: false},
    { name: "median family income", isMonetaryValue: true, barChartFilter: null,  requiresPieChart: false},
    { name: "brazilian immigrants vs brazilian immigrants business owners", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true},
    { name: "brazilian immigrant business owners by type", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true },
    { name: "english proficiency", isMonetaryValue: false, barChartFilter: null,  requiresPieChart: true },
];

//Define more descriptive tool tips for a specific data category
const barToolTipLabels = {
    "Population": "The Total Number of Brazilian Immigrants in the State"
};

const pieToolTipLabels = {
    "Population": "The Share of Brazilian Immigrants in the State"
};

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
    mapTooltipDataTypeState = MAP_TOOL_TIP_DATA_TYPE.WHOLE;

// Define map and graph svgs with tooltips
let mapSvg = d3.select("#map").attr("width", "100%").attr("height", "100%"),
    mapSvgPath = d3.geoPath(),
    barSvg = d3.select("#bar"),
    pieSvg = d3.select("#pie");

let mapTip = d3.tip()
                .attr("class", "tip")
                .offset([-8, 0])
                .html(d => {
                    return d;
                }),
    barTip = d3.tip()
                .attr("class", "tip")
                .offset([-8, 0])
                .html(d => { 
                    let categoryName = d[""];
                    let label = barToolTipLabels[categoryName] || categoryName;
                    return label + " : " + d[currState].displayValue;
                }),
    pieTip = d3.tip()
                .attr("class", "tip")
                .offset([-8, 0]) 
                .html(d => {
                    let categoryName = d.data[""];
                    let label = pieToolTipLabels[categoryName] || categoryName;
                    return label + " : " + d.data[currState].percentage;
                }); 

mapSvg.call(mapTip);
barSvg.call(barTip);
pieSvg.call(pieTip);

// Load data
d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "https://digaai.com/vresources/")
    .await(dataReady);

//#endregion

//#region Data Visualize Methods

// Load the map
function showMap(map, mapPath, mapTooltip = MAP_TOOL_TIP_DATA_TYPE.WHOLE) {
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

    //Filter graphData  based on data config barChartFilters
    let currentDataCategoryConfig = dataCategoryConfigs.find(function(i) { return i.name === currGroup });
    let filteredGraphData = filterDataForDisplay(graphData, currentDataCategoryConfig.barChartFilter);
    x.domain(filteredGraphData.map(d => d[""]));
    y.domain([0, columnMax(filteredGraphData, currState)]);

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
        .data(filteredGraphData)
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
    if (mapTooltipDataTypeState === MAP_TOOL_TIP_DATA_TYPE.WHOLE) {
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

    if (mapTooltipDataTypeState === MAP_TOOL_TIP_DATA_TYPE.PERCENTAGE) {
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
        //for each category, get the collective groups. 
        //for example: for "age summary" category, grab data on "0 to 20," "21 to 34," etc.
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
        case "population": start = 0; end = 2;  
            break;
        case "age detail": start = 2; end = 20;
            break;
        case "age summary": start = 20; end = 24;
            break;
        case "gender": start = 24; end = 26;
            break;
        case "marriage": start = 26; end = 31;
            break;
        case "citizen": start = 31; end = 33;
            break;
        case "enter time": start = 33; end = 35;
            break;
        case "education": start = 35; end = 38;
            break;
        case "civilian labor force": start = 38; end = 40;
            break;
        case "unemployed": start = 40; end = 42;
            break;
        case "employment type": start = 42; end = 46;
            break;
        case "employment by industry": start = 46; end = 54;
            break;
        case "employment by occupation": start = 54; end = 60; 
            break;
        case "population for whom poverty status is determined": start = 60; end = 62;
            break;
        case "individuals below poverty": start = 62; end = 64;
            break;
        case "income": start = 64; end = 66;
            break;
        case "business": start = 67; end = 69; 
            break;
        case "occupied housing units": start = 69; end = 70;
            break;
        case "total number of families": start = 70; end = 72;
            break;
        case "families in poverty": start = 72; end = 74;
            break;
        case "owner occupied units": start = 74; end = 76;
            break;
        case "monthly ownership costs": start = 77; end = 83;
            break;
        case "gross rent": start = 84; end = 91;
            break;
        case "crowded units": start = 91; end = 92;
            break;
        case "median household income": start = 92; end = 93;
            break;
        case "median family income": start = 93; end = 94;
            break;
        case "brazilian immigrants vs brazilian immigrants business owners": start = 94; end = 96; 
            break;
        case "brazilian immigrant business owners by type": start = 96; end = 98;
            break;
        case "english proficiency": start = 98; end = 104;
            break;
        case "population brazilian estimate": start = 104; end = 106;
            break;
        default:
            break;
    }

    if(changeFeature) 
        currFeature = start;

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
    let categoryName = csvData[currFeature][""];
    let label = "";
    switch (mapTooltipDataTypeState) {
        case MAP_TOOL_TIP_DATA_TYPE.WHOLE: 
            label = barToolTipLabels[categoryName] || categoryName;
            toolTipMessage = label + " : " + csvData[currFeature][d.id].displayValue; 
            break;
        case MAP_TOOL_TIP_DATA_TYPE.PERCENTAGE:
            label = pieToolTipLabels[categoryName] || categoryName;
            toolTipMessage = label + " : " + csvData[currFeature][d.id].percentage;
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
    showMap(mapSvg, mapSvgPath, MAP_TOOL_TIP_DATA_TYPE.WHOLE);
    document.getElementById("titleContainer").scrollIntoView();
}

function clickPieHandler(d, i) {
    csvData.forEach((e, i) => {
        if(e[""] == d.data[""]) currFeature = i;
    });

    document.getElementById("dataCategory").innerHTML = d.data[""].toUpperCase();
    document.getElementById("dataValue").innerHTML = d.data[currState].percentage;
    showMap(mapSvg, mapSvgPath, MAP_TOOL_TIP_DATA_TYPE.PERCENTAGE);
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

function filterDataForDisplay(data, filterOptions) {
    if (!filterOptions || !filterOptions.length) return data;

    let filteredData = data.filter(function(i) {
        return filterOptions.indexOf(i[""]) < 0;
    });

    return filteredData;
}

//#endregion