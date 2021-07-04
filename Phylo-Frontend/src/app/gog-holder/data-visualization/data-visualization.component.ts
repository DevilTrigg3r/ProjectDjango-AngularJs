import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
// Models
import { Marker } from '../../models/marker';

@Component({
  selector: 'app-data-visualization',
  templateUrl: './data-visualization.component.html',
  styleUrls: ['./data-visualization.component.css']
})
export class DataVisualizationComponent implements OnInit, OnChanges {

  readonly latitude: number = 180;
  readonly longitude: number= 360;

  statesData = []
  speciesData = []

  speciesBarChartId = "species-bar";
  countriesPieChartId = "countries-pie";
  scatterChartId = "coord-scatter";

  private svg;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  private marginHistogram = {top: 10, right: 30, bottom: 30, left: 40};
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;

  @Input() markersList: Marker[];
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.markersList !== 'undefined') {
      this.markersList = changes.markersList.currentValue;

      this.statesData = []
      this.speciesData = []
      for (let index = 0; index < this.markersList.length; index++) {
        this.checkIfIndexExists(this.statesData, this.markersList[index].country);
        this.checkIfIndexExists(this.speciesData, this.markersList[index].scientific_name);
      }

      this.resetCharts(this.speciesBarChartId, this.countriesPieChartId);

      this.drawBarChart(this.speciesBarChartId);
      this.drawPieChart(this.countriesPieChartId);
      this.coordsDispersion(this.scatterChartId);
      
    }
  }

  // Bar methods
  private drawBarChart(speciesBarChartId) {
      this.createBarSvg(speciesBarChartId);
      this.drawBars(this.speciesData);
  }

  private createBarSvg(plotId: string): void {
    this.svg = d3.select(`figure#${plotId}`)
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")")
  }
  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
    .range([0, this.width])
    .domain(data.map(d => d.variable))
    .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-15)")
    .style("text-anchor", "end")

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
    .domain([0, this.getHighestVal(data)])
    .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
    .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.variable))
    .attr("y", d => y(d.occurrences))
    .attr("width", x.bandwidth())
    .attr("height", (d) => this.height - y(d.occurrences))
    .attr("fill", "#d04a35")
  }

  // Pie chart methods
  private drawPieChart(countriesPieChartId) {
    this.createPieSvg(countriesPieChartId);
    this.createColors(this.statesData);
    this.drawPie();
  }

  private createPieSvg(plotId: string): void {
    this.svg = d3.select(`figure#${plotId}`)
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );
  }

  private createColors(data): void {
    this.colors = d3.scaleOrdinal
    /*
    .domain(data.map(d => d.occurrences.toString()))
    .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);*/
  }

  private drawPie(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.occurrences));

    // Build the pie chart
    this.svg
    .selectAll('pieces')
    .data(pie(this.statesData))
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius)
    )
    .attr('fill', (d, i) => (this.colors(i)))
    .attr("stroke", "#121926")
    .style("stroke-width", "1px")
    .style("fill", this.randomColors());

    // Add labels
    const labelLocation = d3.arc()
    .innerRadius(100)
    .outerRadius(this.radius);

    this.svg
    .selectAll('pieces')
    .data(pie(this.statesData))
    .enter()
    .append('text')
    .text(d => d.data.variable)
    .attr("transform", d => "translate(" + labelLocation.centroid(d) + ")")
    .style("text-anchor", "middle")
    .style("font-size", 15)
  }

 // Scatter
 private drawScatterChart(scatterChartId, data) {
  this.createScatterSvg(scatterChartId);
  this.drawPlot(data);
}

 private createScatterSvg(plotId: string): void {
  this.svg = d3.select(`figure#${plotId}`)
  .append("svg")
  .attr("width", this.width + (this.margin * 2))
  .attr("height", this.height + (this.margin * 2))
  .append("g")
  .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
}

 private drawPlot(data): void {
   console.log(data[0].latitude)
    // Add X axis
    const x = d3.scaleLinear()
    .domain([-90, 90])
    .range([ 0, this.width ]);
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([-180, 180])
    .range([ this.height, 0]);
    this.svg.append("g")
    .call(d3.axisLeft(y));

    // Add dots
    const dots = this.svg.append('g');
    dots.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.latitude))
    .attr("cy", d => y(d.longitude))
    .attr("r", 7)
    .style("opacity", .5)
    .style("fill", "#69b3a2");
}

  coordsDispersion(scatterChartId: string) {
    if(this.markersList[0]) {
      let speciesCoords =[]
      
      for (let index = 0; index < this.markersList.length; index++) {
    
        if(speciesCoords[this.markersList[index].specie_id] && this.markersList[index].specie_id) {
          speciesCoords[this.markersList[index].specie_id].
          push({specie_id: this.markersList[index].specie_id,
                scientific_name: this.markersList[index].scientific_name,
                latitude: this.markersList[index].latitude,
                longitude: this.markersList[index].longitude});
        } else {
          speciesCoords[this.markersList[index].specie_id] = [];
          speciesCoords[this.markersList[index].specie_id].
          push({specie_id: this.markersList[index].specie_id,
                scientific_name: this.markersList[index].scientific_name,
                latitude: this.markersList[index].latitude,
                longitude: this.markersList[index].longitude});
        }
      }
      speciesCoords = speciesCoords.filter(Boolean);
      for (let index = 0; index < speciesCoords.length; index++) {
        this.resetScatters(this.scatterChartId, speciesCoords[index][0].specie_id, speciesCoords[index][0].scientific_name);
        this.drawScatterChart(`${this.scatterChartId}-${index+1}`, speciesCoords[index]);
      }
    }
  }

  randomColors() {
    var golden_ratio_conjugate = 0.618033988749895;
    var h = Math.random();
  
    var hslToRgb = function (h, s, l){
        var r, g, b;
  
        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
  
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
  
        return '#'+Math.round(r * 255).toString(16)+Math.round(g * 255).toString(16)+Math.round(b * 255).toString(16);
    };
    
    return function(){
      h += golden_ratio_conjugate;
      h %= 1;
      return hslToRgb(h, 0.5, 0.60);
    };
  };

  private resetCharts(speciesBarChartId, countriesPieChartId) {
    document.getElementById(speciesBarChartId) ? document.getElementById(speciesBarChartId).remove() : null;    
    let speciesBarChart = document.createElement("figure");
    speciesBarChart.id = speciesBarChartId
    document.getElementById("bar-plot").appendChild(speciesBarChart);

    document.getElementById(countriesPieChartId) ? document.getElementById(countriesPieChartId).remove() : null;    
    let countriesPieChart = document.createElement("figure");
    countriesPieChart.id = countriesPieChartId
    document.getElementById("pie-plot").appendChild(countriesPieChart);
  }

  private resetScatters(scatterChartId, specie_id, scientific_name) {
    document.getElementById(`holder-${scatterChartId}-${specie_id}`) ? document.getElementById(`holder-${scatterChartId}-${specie_id}`).remove() : null; 
    let plotHolder = document.createElement("div");
    plotHolder.id = `holder-${scatterChartId}-${specie_id}`;

    let subTitle = document.createElement("h5");
    subTitle.textContent = `Coordinates dispersion for ${scientific_name}`
   
    let scatterChart = document.createElement("figure");
    scatterChart.id = `${scatterChartId}-${specie_id}`;

    plotHolder.appendChild(subTitle);
    plotHolder.appendChild(scatterChart);

    document.getElementById("scatter-plot").appendChild(plotHolder);
  }

  genCoordIntervals() {
    let latIntervals = this.splitRanges(90, -90, 10);
    let longIntervals = this.splitRanges(180, -180, 10);
  }

  getHighestVal(array) {
    if(array[0]) {
      let maxValue = array[0].occurrences;
      for (let index = 1; index < array.length; index++) {
        if(array[index].occurrences > maxValue) {
          maxValue = array[index].occurrences
        }
      }
      return maxValue;
    }
    return 0;
  }

  checkIfIndexExists(array, compareVal) {
    let flag = false;
    for (let index = 0; index < array.length; index++) {
      if(array[index].variable == compareVal) {
        array[index].occurrences++;
        flag = true;
      }
    }
    if(!flag) {
      array.push({variable: compareVal, occurrences: 1})
    }
  }

  splitRanges(maxVal, minVal, columns) {
    if(maxVal > minVal) {
      let firstFlag = true
      let nTotal = Math.abs(maxVal) + Math.abs(minVal)
      let ranges = nTotal / columns
  
      let currVal = minVal
      let intervals = []
      let tmpVal = 0;
      while(currVal < maxVal) {
        if(firstFlag) {
          currVal = currVal+ranges
          intervals.push([minVal, currVal, this.numsBetweenRange(minVal, currVal)])
          firstFlag = false
        } else {
          tmpVal = currVal + 1
          currVal = tmpVal + ranges
          if(currVal < maxVal) {
          intervals.push([tmpVal, currVal, this.numsBetweenRange(tmpVal, currVal)])
          } else {
            intervals.push([tmpVal, maxVal, this.numsBetweenRange(tmpVal, maxVal)])
          }
        }
      }
      return intervals
    }
    return []
  }

  numsBetweenRange(numA: number, numB: number) {
    return Math.abs(numA - numB)
  }
}
