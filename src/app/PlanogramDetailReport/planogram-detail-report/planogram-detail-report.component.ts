import { Component, OnInit } from "@angular/core";
import { IGrid } from "src/providers/Generic/Interface/IGrid";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import {
  M_Countries,
  M_Region,
  M_State,
  M_City,
  M_Retailer,
  M_Supervisor,
  M_Merchandiser,
} from "src/providers/constants";
import { iNavigation } from "src/providers/iNavigation";
import { FormBuilder } from "@angular/forms";
import * as $ from "jquery";

import { AjaxService } from "src/providers/ajax.service";
import { PostParam } from "src/providers/constants";
import {
  MasterDataModal,
  AdvanceFilterModal,
} from "src/app/availabilityreport/availabilityreport.component";
import { ApplicationStorage } from "src/providers/ApplicationStorage";

@Component({
  selector: "app-planogram-detail-report",
  templateUrl: "./planogram-detail-report.component.html",
  styleUrls: ["./planogram-detail-report.component.scss"],
})
export class PlanogramDetailReportComponent implements OnInit {
  BindingHeader: Array<IGrid>;
  IsEmptyRow: boolean = true;
  searchQuery: string = " 1=1 ";
  sortBy: string = "";
  pageIndex: number = 1;
  StateName: string = "";
  pageSize: number = 15;
  TotalCount: number = 0;
  TotalPageCount: number = 0;
  HeaderName: string = "Page Name";
  TableResultSet: any[];
  BindSuggestedImages: Array<PlanogramSuggestedImages>;
  BindTypeImages: Array<PlanogramTypeImages>;
  EnableFilter: boolean = false;
  EnableImagePopup: boolean = false;
  MasterData: MasterDataModal;
  AdvanceSearch: AdvanceFilterModal;
  ServerBaseUrl: string;
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
    this.ServerBaseUrl = this.http.GetImageBaseUrl();
    this.HeaderName = "Planogram Detail";
    this.ResetAdvanceFilter();
  }

  ResetAdvanceFilter() {
    this.AdvanceSearch = new AdvanceFilterModal();
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

    alert(searchQuery);
  }
  ngOnInit() {
    let LocalMasterData = this.local.GetMasterDataValues(M_Region, null);
    if (IsValidType(LocalMasterData)) {
      this.MasterData.M_Region = LocalMasterData;
    }
    this.BindingHeader = [
      { column: "storeName", displayheader: "Store Name", width: 10 },
      { column: "MainAisleSuggested", displayheader: "MA Suggested" },
      { column: "MainAisleExecuted", displayheader: "MA Executed" },
      { column: "SecondaryVisibilitySuggested", displayheader: "SV Suggested" },
      { column: "SecondaryVisibilityExecuted", displayheader: "SV Executed" },
      { column: "TransactionZoneSuggested", displayheader: "TZ Suggested" },
      { column: "TransactionZoneExecuted", displayheader: "TZ Executed" },
      { column: "Gid", type: "hidden" },
    ];

    this.LoadData();
    this.LoadTableData();
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

  LoadTableData() {
    this.IsEmptyRow = false;
  }

  GetAdvanceFilter() {
    this.EnableFilter = !this.EnableFilter;
  }
  Open(Gid: string, Type: string) {
    // this.BindTypeImages=[];
    // for(var i=0;i<this.BindSuggestedImages.length;i++)
    // {
    //        if(this.BindSuggestedImages[i].Gid==Gid && this.BindSuggestedImages[i].Type==Type)
    //        {
    //           this.BindTypeImages.push({Type:this.BindSuggestedImages[i].Type,ImageTypes:this.BindSuggestedImages[i].ImageTypes,
    //           SuggestedImages:this.BindSuggestedImages[i].SuggestedImages,SubType:this.BindSuggestedImages[i].SubType})

    //        }

    // }
    for (var i = 0; i < this.TableResultSet.length; i++) {
      let Imagelist: any[];
      Imagelist = this.TableResultSet[i].lstPlanogramSuggestedImages;

      for (var j = 0; j < Imagelist.length; i++) {
        if (Imagelist[i].Gid == Gid && Imagelist[i].Type == Type) {
          this.BindTypeImages.push({
            Type: Imagelist[i].Type,
            ImageTypes: Imagelist[i].ImageTypes,
            SuggestedImages: Imagelist[i].SuggestedImages,
            SubType: Imagelist[i].SubType,
          });
        }
      }
    }

    this.EnableFilter = true;
  }
  Close() {
    this.EnableFilter = false;
  }
  ResetFilter() {
    $("#ShopFilter").val("");
    this.searchQuery = "";
    this.searchQuery = " 1=1 ";
    this.sortBy = "";
    this.pageIndex = 1;
    this.pageSize = 15;
    this.TotalCount = 0;
    this.TotalPageCount = 0;
    this.LoadData();
  }

  LoadData() {
    let PlanoGramData = JSON.parse(PostParam);
    PlanoGramData.content.searchString = this.searchQuery;
    PlanoGramData.content.sortBy = this.sortBy;
    PlanoGramData.content.pageIndex = this.pageIndex;
    PlanoGramData.content.pageSize = this.pageSize;

    this.http
      .post("Webportal/FetchPlanogramDetailReport", PlanoGramData)
      .then((response) => {
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
              this.TableResultSet = Record;
            }
            this.commonService.ShowToast("Data retrieve successfully.");
          } else {
            this.commonService.ShowToast("Unable to get data.");
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

  LoadNextField() {
    let currentType = $(event.currentTarget).attr("name");
    if (IsValidType(currentType)) {
      let NextFieldValue = null;
      switch (currentType) {
        case M_Countries:
          NextFieldValue = this.local.GetMasterDataValues(M_Region, "Country");
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
          this.StateName = $(event.currentTarget)
            .find("option:selected")
            .text();
          NextFieldValue = this.local.GetMasterDataValues(
            M_City,
            this.AdvanceSearch.State
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_City = NextFieldValue;
          }

          NextFieldValue = this.local.GetMasterDataValues(
            M_Supervisor,
            null,
            this.StateName
          );
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

export class PlannogramDetailModel {
  Gid: string;
  storeName: string;
  StoreCode: string;
  BusinessUnitCode: string;
  UserCode: string;
  UserName: string;
  BusinessUnitName: string;
  DateExecuted: string;
  //Region,State,City,BeatCode,BeatName,ChainName,Subchannel
  SuggestedImagesList: Array<PlanogramSuggestedImages>;
  // ExecutedImagesList: Array<PlanogramExecutedImages>;
}

export class PlanogramSuggestedImages {
  Gid: string;
  Type: string;
  ImageTypes: string;
  SuggestedImages: string;
  SubType: string;
}

export class PlanogramTypeImages {
  Type: string;
  ImageTypes: string;
  SuggestedImages: string;
  SubType: string;
}
