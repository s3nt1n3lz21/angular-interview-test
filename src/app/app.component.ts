import { Component } from '@angular/core';
import * as d3 from 'd3';
import { event as d3Event } from 'd3-selection';
import * as R from 'ramda';
import { ApiService } from './services/api.service';

function getScoreColour(score: number | null, defaultColor = 'LightGray') {
    if (R.isNil(score) || Number.isNaN(score) || score > 10) {
        return defaultColor;
    }
    if (score <= 2.5) {
        return '#ce181f';
    }
    if (score <= 5) {
        return '#f47721';
    }
    if (score <= 7.5) {
        return '#ffc709';
    }
    return '#d6e040';
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'globe-demo';

  private countryData;
  public countryDetails: string | undefined;

  constructor(private readonly apiService: ApiService) {
    this.apiService.getCountries().subscribe(x => {
      let entitledCountries = {}
      const keys = Object.keys(x);
      keys.forEach((key) => {
        if (x[key].entitled) {
          entitledCountries[key] = x[key]
        }
      })
      this.countryData = entitledCountries
      this.loadGlobe();
    })
  }

  private loadGlobe() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const sensitivity = 75;

    const projection = d3.geoOrthographic()
      .scale(400)
      .center([0, 0])
      .rotate([0, -30])
      .translate([width / 2, height / 2]);


    const initialScale = projection.scale();
    let path = d3.geoPath().projection(projection);

    const svg = d3.select('#globe')
      .append('svg')
      .attr('width', width - 20)
      .attr('height', height - 20);

    const globe = svg.append('circle')
      .attr('fill', '#ADD8E6')
      .attr('stroke', '#000')
      .attr('stroke-width', '0.2')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', initialScale);

    svg.call(d3.drag().on('drag', () => {
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();
      projection.rotate([
        rotate[0] + d3Event.dx * k,
        rotate[1] - d3Event.dy * k
      ]);
      path = d3.geoPath().projection(projection);
      svg.selectAll('path').attr('d', path);
    }))
      .call(d3.zoom().on('zoom', () => {
        if (d3Event.transform.k > 0.3) {
          projection.scale(initialScale * d3Event.transform.k);
          path = d3.geoPath().projection(projection);
          svg.selectAll('path').attr('d', path);
          globe.attr('r', projection.scale());
        }
        else {
          d3Event.transform.k = 0.3;
        }
      }));

    const map = svg.append('g');

    d3.json('assets/ne_110m_admin_0_countries.json', (err, d) => {
      map.append('g')
        .attr('class', 'countries')
        .selectAll('path')
        .data(d.features)
        .enter().append('path')
        .attr('class', (d: any) => 'country_' + this.getValidISOA2(d))
        .attr('d', path)
        .attr('fill', (d: any) => getScoreColour(this.getCountryScore(this.getValidISOA2(d))))
        .style('stroke', 'black')
        .style('stroke-width', 0.3)
        .on('mouseleave', (d: any) => this.clearDetails())
        .on('mouseover', (d: any) => this.showDetails(this.getValidISOA2(d), d.properties.NAME));
    });

  }

  private getValidISOA2(data: any) {
    if (data.properties.ISO_A2 != -99) {
      return data.properties.ISO_A2
    }
    if (data.properties.WB_A2 != -99) {
      return data.properties.WB_A2
    }
    if (data.properties.SOV_A3 != -99) {
      return data.properties.SOV_A3
    } else {
      return data.properties.NAME
    }
  }

  private getCountryScore(countryCode: string): number | undefined {
    const country = this.countryData[countryCode.slice(0,2)];
    return country ? country.score : undefined;
  }

  private clearDetails() {
    this.countryDetails = undefined;
  }

  private showDetails(countryCode: string, countryName: string) {
    const country = this.countryData[countryCode];
    if (!country) {
      this.countryDetails = undefined;
      return;
    }
    this.countryDetails = `${countryName}: ${country.score.toFixed(2)}`;
  }
}

// POSSIBLE IMPROVEMENTS:
// - Create interface datatypes for the Countries and adminCountries in a models folder
// - Figure out a better way to handle cases when the data is undefined/-99 and add more fallbacks
// - Possibly load the adminCountries by calling an API 
// - Split out the D3.js code for the world out into its own component that can be reused and passed different data
// - Write some tests to check each functions does what its supposed to
// - Add parameters to allow the user to change the colours/theme
// - Improve the styles/increase the font of the details in the top right
// - Highlight/improve the styles of the country on hover
// - Consider using tooltips for the details on hover, e.g. show country name and score
// - Provide a key/legend as to what the different colours mean
// - Cache data using an interceptor
// - Make countries clickable and then route to details about the country