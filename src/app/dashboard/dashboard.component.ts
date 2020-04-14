import { Component, OnInit } from "@angular/core";
import { PageName, RouteDescription } from "src/providers/constants";
import { iNavigation } from "src/providers/iNavigation";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color, Label } from "ng2-charts";
import { AjaxService } from "src/providers/ajax.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  MasterData: any;
  Region: string;
  State: string;
  City: string;
  SO: string;
  Subchannel: string;
  Chain: string;
  Catagory: string;
  Brand: string;
  ParentSku: string;
  TotalVisitedLine = {
    data: [],
    label: "Total store visited",
  };

  AvailableLine = {
    data: [],
    label: "Available",
  };

  OOSLine = {
    data: [],
    label: "Out of stock",
  };
  private Months = [
    { MonthNum: 1, Name: "JAN" },
    { MonthNum: 2, Name: "FEB" },
    { MonthNum: 3, Name: "MAR" },
    { MonthNum: 4, Name: "APR" },
    { MonthNum: 5, Name: "MAY" },
    { MonthNum: 6, Name: "JUN" },
    { MonthNum: 7, Name: "JUL" },
    { MonthNum: 8, Name: "AUG" },
    { MonthNum: 9, Name: "SEP" },
    { MonthNum: 10, Name: "OCT" },
    { MonthNum: 11, Name: "NOV" },
    { MonthNum: 12, Name: "DEC" },
  ];
  //  public lineChartData: ChartDataSets[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: "Series A" },
  //   { data: [28, 48, 40, 19, 86, 27, 90], label: "Series B" },
  //   {
  //     data: [180, 480, 770, 90, 1000, 270, 400],
  //     label: "Series C",
  //     yAxisID: "y-axis-1"
  //   }
  // ];

  public lineChartData: ChartDataSets[] = [
    this.TotalVisitedLine,
    this.AvailableLine,
    this.OOSLine,
  ];
  public lineChartLabels: Label[] = [
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
    "DEC",
  ];
  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: "y-axis-0",
          position: "left",
        },
        {
          id: "y-axis-1",
          position: "right",
          gridLines: {
            color: "rgba(255,0,0,0.3)",
          },
          ticks: {
            fontColor: "red",
          },
        },
      ],
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
            content: "LineAnno",
          },
        },
      ],
    },
  };

  constructor(
    private nav: iNavigation,
    private commonService: CommonService,
    private storage: ApplicationStorage,
    private http: AjaxService
  ) {}

  Pages: Array<RouteDescription> = [];

  ngOnInit() {
    this.Region = "";
    this.State = "";
    this.City = "";
    this.SO = "";
    this.Subchannel = "";
    this.Chain = "";
    this.Catagory = "";
    this.Brand = "";
    this.ParentSku = "";
    let LocalMasterData = this.storage.getMaster();
    if (IsValidType(LocalMasterData)) {
      this.MasterData = LocalMasterData;
    }
    let FilterModal: DashboardFilterModal = new DashboardFilterModal();
    this.GetDashboardData(FilterModal);
  }

  GetFilteredDashboardData() {
    let FilterModal: DashboardFilterModal = new DashboardFilterModal();
    FilterModal.Region = this.Region;
    FilterModal.State = this.State;
    FilterModal.City = this.City;
    FilterModal.BrandName = this.SO;
    FilterModal.SubChannel = this.Subchannel;
    FilterModal.ChainName = this.Chain;
    FilterModal.SegmentName = this.Catagory;
    FilterModal.BrandName = this.Brand;
    FilterModal.ParentSKU = this.ParentSku;
    this.GetDashboardData(FilterModal);
  }

  chartHovered(ele: any) {}

  GetDashboardData(FilteredModal: DashboardFilterModal) {
    this.http
      .post("Webportal/GetDashboardData", JSON.stringify(FilteredModal))
      .then((result) => {
        if (IsValidType(result)) {
          if (result.content.data) {
            let Data = JSON.parse(result.content.data);
            if (IsValidType(Data["Dashboard"])) {
              let DashboardData = Data["Dashboard"];
              this.BuildDashboard(DashboardData);
            }
          }
        } else {
          this.commonService.ShowToast(
            "Invalid result. Please contact to admin."
          );
        }
      })
      .catch((err) => {
        this.commonService.ShowToast("Server error. Please contact to admin.");
      });
  }

  BeZero() {
    let Values = [];
    let item = 1;
    while (item <= 12) {
      Values.push(item);
      item++;
    }
    return Values;
  }

  BuildDashboard(DashboardData: Array<DashboardFilterModal>) {
    let index = 0;
    let TotalVisitedLocalData: Array<any> = this.BeZero();
    let Available: Array<any> = this.BeZero();
    let OutofStock: Array<any> = this.BeZero();
    let Position = -1;
    while (index < DashboardData.length) {
      Position = DashboardData[index].MonthNum;
      if (Position <= 12 && Position > 0) {
        TotalVisitedLocalData[Position] = DashboardData[index].Total;
      }
      index++;
    }
    this.TotalVisitedLine = {
      data: TotalVisitedLocalData,
      label: "Total store visited",
    };

    this.AvailableLine = {
      data: Available,
      label: "Available",
    };

    this.OOSLine = {
      data: OutofStock,
      label: "Out of stock",
    };
    this.lineChartData = [
      this.TotalVisitedLine,
      this.AvailableLine,
      this.OOSLine,
    ];
  }

  SignOut() {
    this.storage.clear();
    this.nav.navigate("/", null);
  }

  public lineChartColors: Color[] = [
    {
      // grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
    {
      // dark grey
      backgroundColor: "rgba(77,83,96,0.2)",
      borderColor: "rgba(77,83,96,1)",
      pointBackgroundColor: "rgba(77,83,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,83,96,1)",
    },
    {
      // red
      backgroundColor: "rgba(255,0,0,0.3)",
      borderColor: "red",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
  ];
  public lineChartLegend = true;
  public lineChartType = "line";
}

class DashboardFilterModal {
  SegmentName: string = "";
  Region: string = "";
  State: string = "";
  City: string = "";
  Channel: string = "";
  SubChannel: string = "";
  ChainName: string = "";
  ParentSKU: string = "";
  Gid: string = "";
  BrandName: string = "";
  MonthNum: number = 0;
  isAvailable: boolean = false;
  Total: number = 0;
  CustomerCode: string = "";
}
