import { Component, OnInit } from "@angular/core";
import { PageName, RouteDescription } from "src/providers/constants";
import { iNavigation } from "src/providers/iNavigation";
import { CommonService } from "src/providers/common-service/common.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color, Label } from "ng2-charts";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.sass"]
})
export class DashboardComponent implements OnInit {
  Pages: Array<RouteDescription> = [];
  chartLine = [];
  data = {
    labels: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC"
    ],
    datasets: [
      {
        label: "# of Votes",
        data: [50, 100, 60, 120, 80, 100, 60, 120, 60, 100, 80, 150],
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        borderColor: "rgba(255,99,132,.6)",
        borderWidth: 1
      }
    ]
  };
  data2 = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "# of Votes",
        data: [0.5, 0.8, 0.4, 0.6, 0.5, 0.3, 0.9],
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        borderColor: "rgba(255,99,132,.6)",
        borderWidth: 1
      }
    ]
  };
  options = {
    scales: {
      yAxes: [
        {
          ticks: {
            fontColor: "rgba(0,0,0,.6)",
            fontStyle: "bold",
            beginAtZero: true,
            maxTicksLimit: 8,
            padding: 10
          },
          gridLines: {
            drawTicks: true,
            drawBorder: true,
            display: true,
            color: "rgba(0,0,0,.1)"
            // zeroLineColor: 'transparent'
          }
        }
      ],
      xAxes: [
        {
          gridLines: {
            // zeroLineColor: 'transparent',
            display: true
          },
          ticks: {
            padding: 0,
            fontColor: "rgba(0,0,0,0.6)",
            fontStyle: "bold"
          }
        }
      ]
    },
    responsive: true
  };
  constructor(
    private nav: iNavigation,
    private commonService: CommonService,
    private storage: ApplicationStorage
  ) {}

  ngOnInit() {
    this.chartLine = new Chart("sales-line", {
      type: "line",
      data: this.data,
      options: this.options
    });
  }

  SignOut() {
    this.storage.clear();
    this.nav.navigate("/", null);
  }

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: "Series A" },
    { data: [28, 48, 40, 19, 86, 27, 90], label: "Series B" },
    {
      data: [180, 480, 770, 90, 1000, 270, 400],
      label: "Series C",
      yAxisID: "y-axis-1"
    }
  ];
  public lineChartLabels: Label[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July"
  ];
  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: "y-axis-0",
          position: "left"
        },
        {
          id: "y-axis-1",
          position: "right",
          gridLines: {
            color: "rgba(255,0,0,0.3)"
          },
          ticks: {
            fontColor: "red"
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: "line",
          mode: "vertical",
          scaleID: "x-axis-0",
          value: "March",
          borderColor: "orange",
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: "orange",
            content: "LineAnno"
          }
        }
      ]
    }
  };
  public lineChartColors: Color[] = [
    {
      // grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    },
    {
      // dark grey
      backgroundColor: "rgba(77,83,96,0.2)",
      borderColor: "rgba(77,83,96,1)",
      pointBackgroundColor: "rgba(77,83,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,83,96,1)"
    },
    {
      // red
      backgroundColor: "rgba(255,0,0,0.3)",
      borderColor: "red",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    }
  ];
  public lineChartLegend = true;
  public lineChartType = "line";
}
