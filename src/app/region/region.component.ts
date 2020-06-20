import { Component, OnInit } from "@angular/core";
import { IGrid } from "../../providers/Generic/Interface/IGrid";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormControl } from "@angular/forms";
import {
  CommonService,
  IsValidType,
  ExportToExcel,
} from "../../providers/common-service/common.service";
import * as $ from "jquery";
import { JourneyPlan, Region, PostParam } from "../../providers/constants";
import { iNavigation } from "../../providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";

@Component({
  selector: "app-region",
  templateUrl: "./region.component.html",
  styleUrls: ["./region.component.scss"],
})
export class RegionComponent implements OnInit {
  entity: any = new RegionModel();
  parentCollection: Array<RegionModel>;
  TableResultSet: Array<RegionModel>;
  BindingHeader: Array<IGrid>;
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  TotalHeaders: number = 5;
  TypeEnum: string = "REG";
  searchQuery: string = " 1=1 ";
  sortBy: string = "";
  pageIndex: number = 1;
  pageSize: number = 15;
  TotalCount: number = 0;
  TotalPageCount: number = 0;
  AdvanceFilterObject: FormGroup;
  MasterData: any = {};
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService,
    private local: ApplicationStorage
  ) {
    let PageName = this.commonService.GetCurrentPageName();
    let LocalMasterData = this.local.getMaster();
    if (IsValidType(LocalMasterData)) {
      this.MasterData = LocalMasterData;
    }

    this.HeaderName = "Region";
    this.AdvanceFilterObject = this.fb.group({
      Region: new FormControl(""),
      SubChannel: new FormControl(""),
      CustomerCode: new FormControl(""),
      CustomerName: new FormControl(""),
      State: new FormControl(""),
      ChainName: new FormControl(""),
      City: new FormControl(""),
      Address: new FormControl(""),
      Beat: new FormControl(""),
      Supervisor: new FormControl(""),
      Marchandisor: new FormControl(""),
    });
  }

  FilterLocaldata() {
    let data = "";
    data = $(event.currentTarget).val();
    if (data.length >= 3) {
      let FilteColumns = ["j.Code", "j.Name"];
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

  LoadData() {
    let MSData = JSON.parse(PostParam);
    MSData.content.searchString = this.searchQuery;
    MSData.content.sortBy = this.sortBy;
    MSData.content.pageIndex = this.pageIndex;
    MSData.content.pageSize = this.pageSize;
    MSData.content.locType = this.TypeEnum;

    this.http.post("Webportal/FetchLocations", MSData).then((response) => {
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

  BindParent() {
    let input: any = {
      meta: {
        app: "MerchandiserApp",
        action: "WebLogin",
        requestId: "0",
        deviceId: "web",
      },
      content: {
        deviceId: "web",
        deviceType: "web",
        deviceOS: "Windows",
        deviceVersion: "web",
        deviceInfo: "web",
      },
    };
    input.content.searchString = "";
    input.content.locType = "COU";
    this.http.post("Webportal/FetchLocations", input).then((response) => {
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
      { column: "Name", displayheader: "Region Name", width: 10 },
      { column: "ParentName", displayheader: "Country Name", width: 10 },
      { column: "ParentGid", type: "hidden" },
      { column: "Gid", type: "hidden" },
    ];

    this.BindParent();
    this.LoadData();
    this.LoadTableData();
  }

  Close() {
    this.EnableFilter = false;
  }

  ResetFilter() {
    this.searchQuery = " 1=1 ";
    this.LoadData();
  }

  LoadTableData() {
    this.IsEmptyRow = false;
  }

  Open() {
    this.entity = new RegionModel();
    this.entity.TypeEnum = this.TypeEnum;
    this.entity.ParentGid = "";
    this.EnableFilter = true;
  }

  Edit(editEntity: any) {
    this.Open();
    this.entity = editEntity;
  }

  Save() {
    if (IsValidType(this.entity)) {
      if (
        this.entity.ParentGid !== null &&
        this.entity.ParentGid !== "" &&
        this.entity.ParentName !== null &&
        this.entity.ParentName !== ""
      ) {
        this.Close();
        this.http
          .post("Webportal/SaveLocation", JSON.stringify(this.entity))
          .then((response) => {
            if (this.commonService.IsValidResponse(response)) {
              let Data = response.content.data;
              if (Data != null && Data != "") {
                this.IsEmptyRow = false;
                this.TableResultSet = Data;
                this.commonService.ShowToast(
                  "Region details saved successfully."
                );
              } else {
                this.commonService.ShowToast("Fail to saved.");
              }
            } else {
              this.commonService.ShowToast("Unable to save data.");
            }
          });
      } else {
        this.commonService.ShowToast("Please select Region name and Country.");
      }
    }
  }

  Remove(editEntity: any) {
    if (!confirm("Do you want remove this record?")) {
      return;
    }
    this.entity = editEntity;
    this.http
      .post("Webportal/RemoveLocation", JSON.stringify(this.entity))
      .then((response) => {
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
    if (!ExportToExcel("region-table", "region")) {
      this.commonService.ShowToast(
        "Incorrect value passed to export to excel."
      );
    }
  }
}

export class RegionModel {
  Gid: string;
  Code: string;
  Name: string;
  Region: string;
  TypeEnum: string;
  ParentGid: string;
  ParentName: string;
}
