import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import * as _ from "lodash";
import { DatePipe } from "@angular/common";
import { IGrid } from "src/providers/Generic/Interface/IGrid";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormControl } from "@angular/forms";
import {
  CommonService,
  IsValidType,
  ExportToExcel
} from "src/providers/common-service/common.service";
import * as $ from "jquery";
import { JourneyPlan, Employee, PostParam } from "src/providers/constants";
import { iNavigation } from "src/providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";
import { BusinessunitModel } from "src/app/businessunit/businessunit.component";
import { ApplicationStorage } from "src/providers/ApplicationStorage";

@Component({
  selector: "app-availabilityreport",
  templateUrl: "./availabilityreport.component.html",
  styleUrls: ["./availabilityreport.component.sass"]
})
export class AvailabilityreportComponent implements OnInit {
  selectedClass: string = "Assigned";
  public TodayJourneyPlanViewModel: Array<AvailabilityReportCategoryViewModel>;
  public ChildModel: Array<AvailabilityReportBrandViewModel>;
  public GCModel: Array<AvailabilityReportSKUViewModel>;

  TableResultSet: any[];
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  TotalHeaders: number = 5;
  searchQuery: string = " 1=1 ";
  sortBy: string = "";
  pageIndex: number = 1;
  pageSize: number = 15;
  TotalCount: number = 0;
  MasterData: any = {};
  TotalPageCount: number = 0;
  AdvanceSearch: AdvanceFilter;
  AutodropdownCollection: any = {
    Region: { data: [], placeholder: "Region" },
    SubChannel: { data: [], placeholder: "SubChannel" },
    Supervisor: { data: [], placeholder: "Supervisor" },
    State: { data: [], placeholder: "State" },
    ChainName: { data: [], placeholder: "ChainName" },
    Marchandisor: { data: [], placeholder: "Marchandisor" },
    City: { data: [], placeholder: "City" }
  };
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService,
    private local: ApplicationStorage
  ) {
    let PageName = this.commonService.GetCurrentPageName();
    this.HeaderName = "Availability Report";
    this.ResetAdvanceFilter();
  }
  ActiveRow: boolean[] = [];
  ActiveRowGC: boolean[] = [];
  icon: string = "assets/images/view.png";

  ResetAdvanceFilter() {
    this.AdvanceSearch = {
      Region: "",
      SubChannel: "",
      CustomerCode: "",
      CustomerName: "",
      State: "",
      ChainName: "",
      City: "",
      Address: "",
      Beat: "",
      Supervisor: "",
      Marchandisor: ""
    };
  }

  SubmitSearchCriateria() {
    let searchQuery = "1=1 ";

    if (IsValidType(this.AdvanceSearch.Marchandisor)) {
      searchQuery +=
        " And Marchandisor = '" + this.AdvanceSearch.Marchandisor + "'";
    }

    if (IsValidType(this.AdvanceSearch.Supervisor)) {
      searchQuery +=
        " And Supervisor = '" + this.AdvanceSearch.Supervisor + "'";
    }

    if (IsValidType(this.AdvanceSearch.Region)) {
      searchQuery += " And Region = '" + this.AdvanceSearch.Region + "'";
    }

    if (this.AdvanceSearch.CustomerName) {
      searchQuery +=
        " And CustomerName = '" + this.AdvanceSearch.CustomerName + "'";
    }

    if (this.AdvanceSearch.CustomerCode) {
      searchQuery +=
        " And CustomerCode = '" + this.AdvanceSearch.CustomerCode + "'";
    }

    if (this.AdvanceSearch.State) {
      searchQuery += " And State = '" + this.AdvanceSearch.State + "'";
    }

    if (this.AdvanceSearch.City) {
      searchQuery += " And City = '" + this.AdvanceSearch.City + "'";
    }

    if (this.AdvanceSearch.ChainName) {
      searchQuery += " And ChainName = '" + this.AdvanceSearch.ChainName + "'";
    }

    if (this.AutodropdownCollection !== null) {
      let keys = Object.keys(this.AutodropdownCollection);
      let Value = null;
      let index = 0;
      while (index < keys.length) {
        Value = this.commonService.ReadAutoCompleteObject($("#" + keys[index]));
        if (Value !== null && Value["data"] !== "") {
          searchQuery += ` And ${keys[index]} like '${Value.data}'`;
        }
        index++;
      }
    }

    alert(searchQuery);
  }

  FilterLocaldata() {
    let data = "";
    data = $(event.currentTarget).val();
    if (data.length >= 3) {
      let FilteColumns = [
        "j.Code",
        "j.Name",
        "j.KYCProgress",
        "j.Channel",
        "j.SubChannel",
        "j.ChainName",
        "p.LinkGid",
        "p.HouseNo",
        "p.City",
        "p.Region",
        "p.State",
        "p.Country"
      ];
      this.searchQuery = " 1=1 ";
      let searchStmt = "";
      let index = 0;
      while (index < FilteColumns.length) {
        if (searchStmt === "")
          searchStmt += ` ${FilteColumns[index]} like '${data}%' `;
        else searchStmt += ` or ${FilteColumns[index]} like '${data}%' `;
        index++;
      }

      if (searchStmt !== "") this.searchQuery = ` 1=1 and (${searchStmt})`;
      this.LoadData();
    } else if (data.length === 0) {
      this.searchQuery = ` 1=1 `;
      this.LoadData();
    }
  }

  ngOnInit() {
    this.LoadData();
    let LocalMasterData = this.local.getMaster();
    if (IsValidType(LocalMasterData)) {
      this.MasterData = LocalMasterData;
    }
  }
  LoadData() {
    let MSData = JSON.parse(PostParam);
    MSData.content.searchString = this.searchQuery;
    MSData.content.sortBy = this.sortBy;
    MSData.content.pageIndex = this.pageIndex;
    MSData.content.pageSize = this.pageSize;

    this.http
      .post("Webportal/FetchAvailabilityReport", MSData)
      .then(response => {
        this.TableResultSet = [];
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          if (Data != null && Data != "") {
            let Data = JSON.parse(response.content.data);
            // console.log(Data);
            // console.log(Data[0]["Record"]);
            if (
              IsValidType(Data[0]["Record"]) &&
              IsValidType(Data[0]["Count"])
            ) {
              let Record = Data[0]["Record"];
              this.TotalCount = Data[0]["Count"][0].TotalCount;
              this.TotalPageCount = this.TotalCount / this.pageSize;
              if (this.TotalCount % this.pageSize > 0) {
                this.TotalPageCount = parseInt(
                  (this.TotalPageCount + 1).toString()
                );
              }
              this.IsEmptyRow = false;
              this.TodayJourneyPlanViewModel = Record;
            }
            this.commonService.ShowToast("Data retrieve successfully.");
          } else {
            this.commonService.ShowToast("Unable to get data.");
          }
        }
      });

    // this.TodayJourneyPlanViewModel=[
    //   {CategoryCode:"CA1", TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50",
    //   lstAvailabilityReportBrandViewModel:[
    //     {CategoryCode:"CA1", BrandCode:"BA1",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"
    //     ,lstAvailabilityReportSKUViewModel:[
    //       {CategoryCode:"CA1", BrandCode:"BA1",ItemCode:"I1",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //       {CategoryCode:"CA1", BrandCode:"BA1",ItemCode:"I2",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"}
    //     ]
    //   },
    //     {CategoryCode:"CA1", BrandCode:"BA2",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"
    //     ,lstAvailabilityReportSKUViewModel:[
    //       {CategoryCode:"CA1", BrandCode:"BA2",ItemCode:"I3",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //   {CategoryCode:"CA1", BrandCode:"BA2",ItemCode:"I4",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"}
    //     ]
    //   }
    //   ]
    // },

    //   {CategoryCode:"CA2", TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50",
    //   lstAvailabilityReportBrandViewModel:[
    //     {CategoryCode:"CA2", BrandCode:"BA3",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"
    //   ,lstAvailabilityReportSKUViewModel:[
    //     {CategoryCode:"CA2", BrandCode:"BA3",ItemCode:"I5",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //     {CategoryCode:"CA2", BrandCode:"BA3",ItemCode:"I6",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"}
    //   ]
    //   },
    //     {CategoryCode:"CA2", BrandCode:"BA4",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"
    //     ,lstAvailabilityReportSKUViewModel:[
    //       {CategoryCode:"CA2", BrandCode:"BA4",ItemCode:"I7",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"},
    //       {CategoryCode:"CA2", BrandCode:"BA4",ItemCode:"I8",TotalNoOfStores:"4",AvailabileIn:"2",AvailabilityPercentage:"50"}
    //     ]
    //   }
    //   ]
    // },
    // ];
  }
  NextPage() {
    if (this.pageIndex + 1 <= this.TotalPageCount) {
      this.pageIndex = this.pageIndex + 1;
      this.LoadData();
    }
  }

  PreviousPage() {
    if (this.pageIndex > 1) {
      this.pageIndex = this.pageIndex - 1;
      this.LoadData();
    }
  }

  GetAdvanceFilter() {
    this.EnableFilter = !this.EnableFilter;
  }

  ResetFilter() {
    $("#ShopFilter").val("");
    this.searchQuery = " 1=1 ";
    this.sortBy = "";
    this.pageIndex = 1;
    this.pageSize = 15;
    this.TotalCount = 0;
    this.TotalPageCount = 0;
    this.LoadData();
  }
  toggleIcon(event: Event) {
    var imagevalue = (event.target as Element).getAttribute("src");
    if (imagevalue == "assets/images/view.png") {
      (event.target as Element).setAttribute("src", "assets/images/view1.png");
    } else if (imagevalue == "assets/images/view1.png") {
      (event.target as Element).setAttribute("src", "assets/images/view.png");
    }
  }

  ExportMe() {
    if (!ExportToExcel("avability-table", "avability")) {
      this.commonService.ShowToast(
        "Incorrect value passed to export to excel."
      );
    }
  }
}

export class AvailabilityReportCategoryViewModel {
  CategoryCode: string;
  TotalNoOfStores: string;
  AvailabileIn: string;
  AvailabilityPercentage: string;
  lstAvailabilityReportBrandViewModel: Array<AvailabilityReportBrandViewModel>;
}

export class AvailabilityReportBrandViewModel {
  CategoryCode: string;
  BrandCode: string;
  TotalNoOfStores: string;
  AvailabileIn: string;
  AvailabilityPercentage: string;
  lstAvailabilityReportSKUViewModel: Array<AvailabilityReportSKUViewModel>;
}

export class AvailabilityReportSKUViewModel {
  CategoryCode: string;
  BrandCode: string;
  ItemCode: string;
  TotalNoOfStores: string;
  AvailabileIn: string;
  AvailabilityPercentage: string;
}

interface AdvanceFilter {
  Region: string;
  SubChannel: string;
  CustomerCode: string;
  CustomerName: string;
  State: string;
  ChainName: string;
  City: string;
  Address: string;
  Beat: string;
  Supervisor: string;
  Marchandisor: string;
}
