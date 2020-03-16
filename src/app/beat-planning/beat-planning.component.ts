import { Component, OnInit } from "@angular/core";
import { IGrid } from "src/providers/Generic/Interface/IGrid";
import { PostParam, BeatPlan } from "src/providers/constants";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidType,
  ExportToExcel,
  IsValidResponse
} from "src/providers/common-service/common.service";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { iNavigation } from "src/providers/iNavigation";
import * as $ from "jquery";

@Component({
  selector: "app-beat-planning",
  templateUrl: "./beat-planning.component.html",
  styleUrls: ["./beat-planning.component.scss"]
})
export class BeatPlanningComponent implements OnInit {
  HeaderName: string = "";
  BeatPlanningRows: Array<BeatViewModel> = [];
  BeatPlanningHeader: Array<IGrid> = [];
  BeatSupervisorData: Array<BeatSupervisorModel> = [];
  BeatMerchandiserData: Array<BeatMerchandiserModel> = [];
  EnableFilter: boolean = false;
  IsEmptyRow: boolean = false;
  BeatsAdd: FormGroup = null;
  searchQuery: string = " 1=1 ";
  sortBy: string = "";
  pageIndex: number = 1;
  pageSize: number = 15;
  TotalCount: number = 0;
  TotalPageCount: number = 0;
  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private nav: iNavigation
  ) {
    this.HeaderName = "Beat Planning";
    this.InitGridHeader();
    this.BeatsAdd = this.fb.group({
      Name: [""],
      Code: [""],
      Description: [""],
      SupervisorJobGid: [""],
      JobGid: [""]
    });
  }

  QueryInit() {
    this.searchQuery = " 1=1 ";
    this.sortBy = "";
    this.pageIndex = 1;
    this.pageSize = 15;
    this.TotalCount = 0;
    this.TotalPageCount = 0;
  }

  InitGridHeader() {
    this.BeatPlanningHeader = [
      { column: "Index", type: "hidden" },
      { column: "Gid", type: "hidden" },
      { column: "Code", displayheader: "Code" },
      { column: "Name", displayheader: "Name" },
      { column: "Description", displayheader: "Description" },
      { column: "SupervisorJobGid", type: "hidden" },
      { column: "ContactGid", type: "hidden" },
      { column: "JobGid", type: "hidden" },
      { column: "MerchandiserLoginId", displayheader: "Merchandiser LoginId" },
      { column: "MerchandiserName", displayheader: "Merchandiser Name" },
      { column: "MerchandiserRole", displayheader: "Merchandiser Role" },
      { column: "SupervisorName", displayheader: "Supervisor Name" }
    ];
  }

  ngOnInit() {
    this.LoadGridData();
  }

  SubmitAddBeatPlan() {
    if (this.BeatsAdd !== null) {
      this.QueryInit();
      let MSData = JSON.parse(PostParam);
      MSData.content.beatViewModel = this.BeatsAdd.value;

      this.AddBeatPlan();
      this.http
        .post("Beat/AddEditBeat", MSData)
        .then(result => {
          this.LoadGridData();
          this.commonService.ShowToast("Beats added successfully.");
        })
        .catch(e => {
          this.commonService.ShowToast("Getting server error.");
        });
    }
  }

  LoadGridData() {
    let MSData = JSON.parse(PostParam);
    MSData.content.searchString = this.searchQuery;

    this.http
      .post("Beat/GetBeats", MSData)
      .then(result => {
        if (this.commonService.IsValidResponse(result)) {
          let Data = JSON.parse(result.content.beats);
          this.commonService.ShowToast("Data loaded successfully.");
          this.CheckAndBindData(Data);
        } else {
          this.commonService.ShowToast(
            "Unable to add customer. Please contact to admin."
          );
        }
      })
      .catch(e => {
        this.commonService.ShowToast("Getting server error.");
      });
  }

  CheckAndBindData(ResultData: any) {
    if (IsValidType(ResultData)) {
      this.QueryInit();
      this.BeatPlanningRows = [];
      this.BeatMerchandiserData = [];
      this.BeatSupervisorData = [];
      this.BuildGrid(ResultData);
    }
  }

  AddBeatPlan() {
    this.EnableFilter = !this.EnableFilter;
  }

  GetBeatCustomer($CurrentItem: any) {
    if (IsValidType($CurrentItem)) {
      this.nav.navigate(BeatPlan, $CurrentItem);
    }
  }

  GetFilteredData() {
    let data = "";
    data = $(event.currentTarget).val();
    if (data.length >= 3) {
      let FilterColumns = [
        "b.Code",
        "b.Name",
        "b.Description",
        "j2.Code",
        "c2.Name",
        "j2.MobileAppRole",
        "c1.Name"
      ];
      this.searchQuery = " 1=1 ";
      let searchStmt = "";
      let index = 0;
      while (index < FilterColumns.length) {
        if (searchStmt === "")
          searchStmt += ` ${FilterColumns[index]} like '${data}%' `;
        else searchStmt += ` or ${FilterColumns[index]} like '${data}%' `;
        index++;
      }

      if (searchStmt !== "") this.searchQuery = ` 1=1 and (${searchStmt})`;
      this.FilterResult();
    } else if (data.length === 0) {
      this.searchQuery = ` 1=1 `;
      this.FilterResult();
    }
  }

  NextPage() {
    if (this.pageIndex + 1 <= this.TotalPageCount) {
      this.pageIndex = this.pageIndex + 1;
      this.FilterResult();
    }
  }

  PreviousPage() {
    if (this.pageIndex > 1) {
      this.pageIndex = this.pageIndex - 1;
      this.FilterResult();
    }
  }

  FilterResult() {
    let MSData = JSON.parse(PostParam);
    MSData.content.searchString = this.searchQuery;
    MSData.content.sortBy = this.sortBy;
    MSData.content.pageIndex = this.pageIndex;
    MSData.content.pageSize = this.pageSize;
    this.TotalCount = 0;

    this.http
      .post("Beat/GetBeatsFilterData", MSData)
      .then(result => {
        if (this.commonService.IsValid(result)) {
          if (IsValidType(result)) {
            this.BeatPlanningRows = [];
            let Data = JSON.parse(result.content.beats);
            if (
              typeof Data["Record"] !== "undefined" &&
              typeof Data["Count"] !== "undefined"
            ) {
              let Record = Data["Record"];
              this.TotalCount = Data["Count"][0].Total;
              this.TotalPageCount = this.TotalCount / this.pageSize;
              if (this.TotalCount % this.pageSize > 0) {
                this.TotalPageCount = parseInt(
                  (this.TotalPageCount + 1).toString()
                );
              }
              this.IsEmptyRow = false;
              let index = 0;
              while (index < Record.length) {
                this.BeatPlanningRows.push(Record[index]);
                index++;
              }
            }
          }
        } else {
          this.commonService.ShowToast(
            "Unable to add customer. Please contact to admin."
          );
        }
      })
      .catch(e => {
        this.commonService.ShowToast("Getting server error.");
      });
  }

  ResetFilter() {
    this.searchQuery = " 1=1 ";
    $("#ShopFilter").val("");
    this.FilterResult();
  }

  BuildGrid(ResultData: any) {
    if (
      typeof ResultData["Record"] !== "undefined" &&
      typeof ResultData["Count"] !== "undefined" &&
      typeof ResultData["Supervisor"] !== "undefined" &&
      typeof ResultData["Merchandiser"] !== "undefined"
    ) {
      let Data = ResultData["Record"];
      this.TotalCount = ResultData["Count"][0].TotalCount;
      this.TotalPageCount = this.TotalCount / this.pageSize;
      if (this.TotalCount % this.pageSize > 0) {
        this.TotalPageCount = parseInt(this.TotalPageCount.toString());
      }
      this.BeatMerchandiserData = ResultData["Merchandiser"];
      this.BeatSupervisorData = ResultData["Supervisor"];
      if (IsValidType(Data)) {
        this.IsEmptyRow = false;
        let index = 0;
        while (index < Data.length) {
          this.BeatPlanningRows.push(Data[index]);
          index++;
        }
      }
    }
  }

  ExportMe() {
    if(!ExportToExcel('beatplanning-table', 'beatplanning')){
      this.commonService.ShowToast("Incorrect value passed to export to excel.");
    }
  }

  RemoveBeatCustomer(CurrentCtx: any) {
    if (IsValidType(CurrentCtx)) {
      let MSData = JSON.parse(PostParam);
      MSData.content.rowGid = CurrentCtx.Gid;

      this.http
        .post("Beat/RemoveBeat", MSData)
        .then(result => {
          if (this.commonService.IsValidResponse(result)) {
            let Data = JSON.parse(result.content.beats);
            this.CheckAndBindData(Data);
          } else {
            this.commonService.ShowToast(
              "Unable to add customer. Please contact to admin."
            );
          }
        })
        .catch(e => {
          this.commonService.ShowToast("Getting server error.");
        });
    }
  }
}

interface BeatViewModel {
  Gid: string;
  Code: string;
  Name: string;
  Description: string;
  SupervisorJobGid: string;
  ContactGid: string;
  JobGid: string;
  MerchandiserLoginId: string;
  MerchandiserName: string;
  MerchandiserRole: string;
  SupervisorName: string;
}

interface BeatSupervisorModel {
  JobGid: string;
  JobName: string;
  Name: string;
  ContactGid: string;
}

interface BeatMerchandiserModel {
  JobGid: string;
  JobName: string;
  Name: string;
  ContactGid: string;
  Role: string;
}
