import { Component, OnInit } from "@angular/core";
import { IGrid } from "../../providers/Generic/Interface/IGrid";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormControl } from "@angular/forms";
import {
  CommonService,
  IsValidType,
  ExportToExcel
} from "../../providers/common-service/common.service";
import * as $ from "jquery";
import { JourneyPlan, State, PostParam } from "../../providers/constants";
import { iNavigation } from "../../providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";
import { AdvanceFilter } from "../customerreports/customerreports.component";
import { ApplicationStorage } from "src/providers/ApplicationStorage";

@Component({
  selector: "app-state",
  templateUrl: "./state.component.html",
  styleUrls: ["./state.component.scss"]
})
export class StateComponent implements OnInit {
  entity: any = new StateModel();
  parentCollection: Array<StateModel>;
  TableResultSet: Array<StateModel>;
  BindingHeader: Array<IGrid>;
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  TotalHeaders: number = 5;
  TypeEnum: string = "STA";
  searchQuery: string = " 1=1 ";
  sortBy: string = "";
  pageIndex: number = 1;
  pageSize: number = 15;
  TotalCount: number = 0;
  TotalPageCount: number = 0;
  AdvanceFilterObject: FormGroup;
  AddStateModal: boolean = false;
  MasterData: any = {};
  AdvanceSearch: AdvanceFilter;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService,
    private local: ApplicationStorage
  ) {
    let PageName = this.commonService.GetCurrentPageName();
    this.HeaderName = "State";
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

  FilterLocaldata() {
    let data = "";
    data = $(event.currentTarget).val();
    if (data.length >= 3) {
      let FilteColumns = [];
      if (this.TypeEnum === "COU") {
        FilteColumns = ["j.Code", "j.Name", "j.TypeEnum"];
      } else {
        FilteColumns = ["j.Code", "j.Name", "j.TypeEnum", "p.Name"];
      }

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

  SubmitSearchCriateria() {}

  LoadData() {
    let MSData = JSON.parse(PostParam);
    MSData.content.searchString = this.searchQuery;
    MSData.content.sortBy = this.sortBy;
    MSData.content.pageIndex = this.pageIndex;
    MSData.content.pageSize = this.pageSize;
    MSData.content.locType = this.TypeEnum;

    this.http.post("Webportal/FetchLocations", MSData).then(response => {
      this.TableResultSet = [];
      if (this.commonService.IsValidResponse(response)) {
        let Data = response.content.data;
        if (Data != null && Data != "") {
          let Data = JSON.parse(response.content.data);
          if (IsValidType(Data["Record"]) && IsValidType(Data["Count"])) {
            let Record = Data["Record"];
            this.TotalCount = Data["Count"][0].Total;
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
          this.IsEmptyRow = true;
          this.commonService.ShowToast("Got empty dataset.");
        }
      } else {
        this.commonService.ShowToast("Unable to get data.");
      }
    });
  }

  BindParent() {
    let input: any = {
      meta: {
        app: "MerchandiserApp",
        action: "WebLogin",
        requestId: "0",
        deviceId: "web"
      },
      content: {
        deviceId: "web",
        deviceType: "web",
        deviceOS: "Windows",
        deviceVersion: "web",
        deviceInfo: "web"
      }
    };
    input.content.searchString = "";
    input.content.locType = "REG";
    this.http.post("Webportal/FetchLocations", input).then(response => {
      this.TableResultSet = [];
      if (this.commonService.IsValidResponse(response)) {
        let Data = response.content.data;
        if (Data != null && Data != "") {
          this.parentCollection = Data;
        }
      }
    });
  }

  ngOnInit() {
    this.BindingHeader = [
      { column: "Name", displayheader: "State Name", width: 10 },
      { column: "ParentName", displayheader: "Region Name", width: 10 },
      { column: "ParentGid", type: "hidden" },
      { column: "Gid", type: "hidden" }
    ];

    this.BindParent();
    this.LoadData();
    this.LoadTableData();
    let LocalMasterData = this.local.getMaster();
    if (IsValidType(LocalMasterData)) {
      this.MasterData = LocalMasterData;
    }
  }

  Close() {
    this.EnableFilter = false;
    this.AddStateModal = false;
  }

  ResetFilter() {
    this.searchQuery = "";
    this.LoadData();
  }

  LoadTableData() {
    this.IsEmptyRow = false;
  }

  Open() {
    this.entity = new StateModel();
    this.entity.TypeEnum = this.TypeEnum;
    this.entity.ParentGid = "";
    this.AddStateModal = true;
  }

  OpenFilter() {
    this.EnableFilter = true;
  }

  Edit(editEntity: any) {
    this.Open();
    this.entity = editEntity;
  }
  Save() {
    console.log(this.entity);
    this.http
      .post("Webportal/SaveLocation", JSON.stringify(this.entity))
      .then(response => {
        if (this.commonService.IsValidResponse(response)) {
          this.commonService.ShowToast("State details saved successfully.");
          this.Close();

          let Data = response.content.data;
          if (Data != null && Data != "") {
            this.IsEmptyRow = false;
            this.TableResultSet = Data;
            this.commonService.ShowToast("Data retrieve successfully.");
          }
        } else {
          this.commonService.ShowToast("Unable to save data.");
        }
      });
  }

  Remove(editEntity: any) {
    if (!confirm("Do you want remove this record?")) {
      return;
    }
    this.entity = editEntity;
    this.http
      .post("Webportal/RemoveLocation", JSON.stringify(this.entity))
      .then(response => {
        if (this.commonService.IsValidResponse(response)) {
          this.commonService.ShowToast("Regopm removed successfully.");
          this.Close();

          let Data = response.content.data;
          if (Data != null && Data != "") {
            this.IsEmptyRow = false;
            this.TableResultSet = Data;
            this.commonService.ShowToast("Data retrieve successfully.");
          }
        } else {
          this.commonService.ShowToast("Unable to save data.");
        }
      });
  }

  ExportMe() {
    if(!ExportToExcel('state-table', 'state')){
      this.commonService.ShowToast("Incorrect value passed to export to excel.");
    }
  }
}

export class StateModel {
  Gid: string;
  Code: string;
  Name: string;
  TypeEnum: string;
  ParentGid: string;
  ParentName: string;
}
