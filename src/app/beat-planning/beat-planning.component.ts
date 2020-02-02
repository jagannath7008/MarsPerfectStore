import { Component, OnInit } from "@angular/core";
import { IGrid } from "src/providers/Generic/Interface/IGrid";
import { PostParam, BeatPlan } from "src/providers/constants";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidType
} from "src/providers/common-service/common.service";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { iNavigation } from "src/providers/iNavigation";

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
  searchQuery: string = "";
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

  InitGridHeader() {
    this.BeatPlanningHeader = [
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
      let MSData = JSON.parse(PostParam);
      MSData.content.beatViewModel = this.BeatsAdd.value;

      this.http
        .post("Beat/AddEditBeat", MSData)
        .then(result => {
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
        if (this.commonService.IsValid(result)) {
          this.CheckAndBindData(result);
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
    if (this.commonService.IsValid(ResultData)) {
      this.BeatPlanningRows = [];
      this.BeatMerchandiserData = [];
      this.BeatSupervisorData = [];
      this.BuildGrid(ResultData);
      this.commonService.ShowToast("Data loaded successfully.");
    }
  }

  AddBeatPlan() {
    this.EnableFilter = !this.EnableFilter;
  }

  BuildGrid(ResultData: any) {
    if (ResultData.status.code === "SUCCESS") {
      let Data = ResultData.content.beats;
      this.BeatMerchandiserData = ResultData.content.merchandiserlist;
      this.BeatSupervisorData = ResultData.content.supervisorlist;
      if (Data != null && Data != "") {
        this.IsEmptyRow = false;
        let index = 0;
        while (index < Data.length) {
          this.BeatPlanningRows.push(Data[index]);
          index++;
        }
      }
    }
  }

  GetBeatCustomer($CurrentItem: any) {
    if (IsValidType($CurrentItem)) {
      this.nav.navigate(BeatPlan, $CurrentItem);
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
