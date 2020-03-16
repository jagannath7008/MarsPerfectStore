import { Component, OnInit } from "@angular/core";
import { PageName, RouteDescription } from "src/providers/constants";
import { iNavigation } from "src/providers/iNavigation";
import { CommonService } from "src/providers/common-service/common.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { Chart } from 'chart.js';

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
  constructor(private nav: iNavigation,
    private commonService: CommonService,
    private storage: ApplicationStorage) {}

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
}
