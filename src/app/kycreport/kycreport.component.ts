import { Component, OnInit, Input, ViewChild } from "@angular/core";
import * as _ from "lodash";
import { FormBuilder } from "@angular/forms";
import {
  CommonService,
  IsValidType,
  ExportToExcel,
} from "src/providers/common-service/common.service";
import * as $ from "jquery";
import {
  JourneyPlan,
  Employee,
  PostParam,
  M_Countries,
  M_Region,
  M_State,
  M_City,
  M_Supervisor,
  M_Merchandiser,
  State,
  M_Retailer,
} from "src/providers/constants";
import { iNavigation } from "src/providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import {
  MasterDataModal,
  AdvanceFilterModal,
} from "../availabilityreport/availabilityreport.component";

@Component({
  selector: "app-kycreport",
  templateUrl: "./kycreport.component.html",
  styleUrls: ["./kycreport.component.scss"],
})
export class KycreportComponent implements OnInit {
  KYCRepor: Array<KYCReporModal>;
  IsReportPresent: boolean;
  TableResultSet: any[];
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  searchQuery: string = " 1=1 ";
  sortBy: string = "";
  pageIndex: number = 1;
  pageSize: number = 15;
  TotalCount: number = 0;
  MasterData: MasterDataModal;
  TotalPageCount: number = 0;
  AdvanceSearch: AdvanceFilterModal;
  AutodropdownCollection: any = {
    Region: { data: [], placeholder: "Region" },
    SubChannel: { data: [], placeholder: "SubChannel" },
    Supervisor: { data: [], placeholder: "Supervisor" },
    State: { data: [], placeholder: "State" },
    ChainName: { data: [], placeholder: "ChainName" },
    Marchandisor: { data: [], placeholder: "Marchandisor" },
    City: { data: [], placeholder: "City" },
  };
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService,
    private local: ApplicationStorage
  ) {
    this.MasterData = new MasterDataModal();
    let PageName = this.commonService.GetCurrentPageName();
    this.HeaderName = "KYC Report";
    this.ResetAdvanceFilter();
  }
  ActiveRow: boolean[] = [];
  ActiveRowGC: boolean[] = [];
  icon: string = "assets/images/view.png";

  ResetAdvanceFilter() {
    this.AdvanceSearch = new AdvanceFilterModal();
  }

  SubmitSearchCriateria() {
    let searchQuery = "1=1 ";
    let RegionData = this.local.GetObjectByGid(
      M_Region,
      this.AdvanceSearch.Region
    );
    if (RegionData !== null) {
      this.AdvanceSearch.Region = RegionData.Name;
    }
    let StateData = this.local.GetObjectByGid(
      M_State,
      this.AdvanceSearch.State
    );
    if (StateData !== null) {
      this.AdvanceSearch.State = StateData.Name;
    }
    let CityData = this.local.GetObjectByGid(M_City, this.AdvanceSearch.City);
    if (CityData !== null) {
      this.AdvanceSearch.City = CityData.Name;
    }
    let SOData = this.local.GetObjectByGid(
      M_Supervisor,
      this.AdvanceSearch.Supervisor
    );
    if (SOData !== null) {
      this.AdvanceSearch.Supervisor = SOData.Name;
    }

    let Marchandiser = this.local.GetObjectByGid(
      M_Merchandiser,
      this.AdvanceSearch.Marchandisor
    );
    if (Marchandiser !== null) {
      this.AdvanceSearch.Marchandisor = Marchandiser.Name;
    }
    this.LoadData();
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
        "p.Country",
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
    this.IsReportPresent = true;
    this.LoadData();
    let LocalMasterData = this.local.GetMasterDataValues(M_Region, null);
    if (IsValidType(LocalMasterData)) {
      this.MasterData.M_Region = LocalMasterData;
    }
  }
  LoadData() {
    let MSData = JSON.parse(PostParam);
    MSData.content.searchString = this.searchQuery;
    MSData.content.sortBy = this.sortBy;
    MSData.content.pageIndex = this.pageIndex;
    MSData.content.pageSize = this.pageSize;

    this.EnableFilter = false;
    this.http
      .post("Webportal/FetchKYCReport", {
        Region: this.AdvanceSearch.Region,
        City: this.AdvanceSearch.City,
        SOName: this.AdvanceSearch.Supervisor,
        MerchandiserName: "",
      })
      .then((response) => {
        this.TableResultSet = [];
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          if (Data !== null && Data !== "") {
            this.IsReportPresent = false;
            this.KYCRepor = JSON.parse(Data);
          } else {
            this.commonService.ShowToast("Returned empty result.");
          }
        }
      });
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

  ExportMe() {
    if (!ExportToExcel("avability-table", "avability")) {
      this.commonService.ShowToast(
        "Incorrect value passed to export to excel."
      );
    }
  }

  LoadNextField() {
    let currentType = $(event.currentTarget).attr("name");
    if (IsValidType(currentType)) {
      let NextFieldValue = null;
      switch (currentType) {
        case M_Countries:
          NextFieldValue = this.local.GetMasterDataValues(
            M_Region,
            this.AdvanceSearch.Country
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_Region = NextFieldValue;
          }
          break;

        case M_Region:
          NextFieldValue = this.local.GetMasterDataValues(
            M_State,
            this.AdvanceSearch.Region
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_State = NextFieldValue;
          }
          break;

        case M_State:
          let StateName = $(event.currentTarget).find("option:selected").text();
          NextFieldValue = this.local.GetMasterDataValues(
            M_City,
            this.AdvanceSearch.State
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_City = NextFieldValue;
          }

          NextFieldValue = this.local.GetMasterDataValues(M_Supervisor, "");
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_Supervisor = NextFieldValue;
          }
          break;

        case M_City:
          NextFieldValue = this.local.GetMasterDataValues(
            M_Retailer,
            this.AdvanceSearch.City
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_Retailer = NextFieldValue;
          }
          break;

        case M_Supervisor:
          NextFieldValue = this.local.GetMasterDataValues(
            M_Merchandiser,
            this.AdvanceSearch.Supervisor
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_Merchandiser = NextFieldValue;
          }
          break;

        case M_Merchandiser:
          break;
      }
    } else {
      this.commonService.ShowToast("Invalid selection.");
    }
  }
}

class KYCReporModal {
  City: string = null;
  Merchandiser: string = null;
  Region: string = null;
  TotalKYC: number = 0;
  Supervisor: string = null;
  TotalKYCCompleted: number = 0;
  CompletionPercentage: number = 0;
}
