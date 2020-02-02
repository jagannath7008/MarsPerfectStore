import { Component, OnInit } from "@angular/core";
import { IGrid } from "src/providers/Generic/Interface/IGrid";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidType,
  IsValidResponse
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import { PostParam } from "src/providers/constants";
import { FormGroup, FormControl } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import * as $ from "jquery";

@Component({
  selector: "app-manage-beat-plan",
  templateUrl: "./manage-beat-plan.component.html",
  styleUrls: ["./manage-beat-plan.component.scss"]
})
export class ManageBeatPlanComponent implements OnInit {
  HeaderName: string = "";
  BeatPlanHeader: Array<IGrid> = [];
  EnableFilter: boolean = false;
  IsEmptyRow: boolean = false;
  searchQuery: string = "";
  CustomerListData: Array<any>;
  IsReady: boolean = false;
  CustomerGrid: Array<BeatPlanModal> = [];
  CurrentPageData: any;
  constructor(
    private nav: iNavigation,
    private http: AjaxService,
    private commonService: CommonService,
    private fb: FormBuilder
  ) {
    this.InitGridHeader();
    this.LoadInitPageData();
    this.HeaderName = "Beat Planning";
  }

  LoadInitPageData() {
    this.CurrentPageData = this.nav.getValue();
    if (
      IsValidType(this.CurrentPageData) &&
      IsValidType(this.CurrentPageData.Gid)
    ) {
      let MSData = JSON.parse(PostParam);
      MSData.content.beatViewModelGid = this.CurrentPageData.Gid;
      MSData.content.beatJobGid = this.CurrentPageData.JobGid;

      this.http
        .post("Beat/GetBeatCustomers", MSData)
        .then(result => {
          if (IsValidResponse(result)) {
            let CustomerDetail = result.content["beatCustomers"];
            let CustomerDetailList = result.content["customerList"];
            this.BindGrid(CustomerDetail);
            this.BindDropDown(CustomerDetailList);
            this.IsReady = true;
            this.commonService.ShowToast("Page loaded successfully.");
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

  BindGrid(Result: any) {
    this.CustomerGrid = [];
    if (IsValidType(Result)) {
      let index = 0;
      while (index < Result.length) {
        this.CustomerGrid.push({
          BeatGid: Result[index].BeatGid,
          Gid: Result[index].Gid,
          CustomerGid: Result[index].CustomerGid,
          CustomerName: Result[index].CustomerName,
          SubChannel: Result[index].SubChannel,
          City: Result[index].City,
          StartTimeStr: Result[index].StartTimeStr,
          EndTimeStr: Result[index].EndTimeStr,
          MonTF: Result[index].MonTF,
          TueTF: Result[index].TueTF,
          WedTF: Result[index].WebTF,
          ThuTF: Result[index].ThuTF,
          FriTF: Result[index].FriTF,
          SatTF: Result[index].SatTF,
          SunTF: Result[index].SunTF
        });
        index++;
      }
    }
  }

  BindDropDown(CustomerListInfo: any) {
    if (IsValidType(CustomerListInfo)) {
      this.CustomerListData = CustomerListInfo;
    }
  }

  InitGridHeader() {
    this.BeatPlanHeader = [
      { column: "CustomerName", displayheader: "Customer", width: 10 },
      { column: "BeatGid", type: "hidden" },
      { column: "Gid", type: "hidden" },
      { column: "CustomerGid", type: "hidden" },
      { column: "SubChannel", displayheader: "SubChannel" },
      { column: "City", displayheader: "City" },
      { column: "StartTimeStr", displayheader: "Start Time", type: "textbox" },
      { column: "EndTimeStr", displayheader: "EndTime", type: "textbox" },
      { column: "MonTF", displayheader: "Mon", type: "checkbox" },
      { column: "TueTF", displayheader: "Tue", type: "checkbox" },
      { column: "WedTF", displayheader: "Wed", type: "checkbox" },
      { column: "ThuTF", displayheader: "Thu", type: "checkbox" },
      { column: "FriTF", displayheader: "Fri", type: "checkbox" },
      { column: "SatTF", displayheader: "Sat", type: "checkbox" },
      { column: "SunTF", displayheader: "Sun", type: "checkbox" }
    ];
  }

  GetGridData() {
    return null;
  }

  RemoveCustomer(RowDetail: any) {}

  AddCustomer() {
    let CustomerGid = $("#customers").val();
    let BeatCustomerViewModel: Array<any> = [];
    if (IsValidType(CustomerGid)) {
      BeatCustomerViewModel.push({
        BeatGid: this.CurrentPageData.Gid,
        CustomerGid: CustomerGid
      });
      this.AddAndSaveCustomer(BeatCustomerViewModel);
    }
  }

  SaveCustomers() {
    let BeatCustomerViewModel: Array<any> = [];
    let GridData = this.GetGridData();
    let index = 0;
    while (index < GridData.length) {
      BeatCustomerViewModel.push({
        BeatGid: this.CurrentPageData.Gid,
        CustomerGid: ""
      });
      index++;
    }

    if (BeatCustomerViewModel.length > 0) {
      this.AddAndSaveCustomer(BeatCustomerViewModel);
    } else {
      this.commonService.ShowToast(
        "Unable to read grid. Please contact to admin."
      );
    }
  }

  AddAndSaveCustomer(CustomerModal: any) {
    if (IsValidType(CustomerModal)) {
      let MSData = JSON.parse(PostParam);
      MSData.content.beatCustomers = CustomerModal;

      this.http
        .post("Beat/AddEditBeatCustomers", MSData)
        .then(result => {
          if (IsValidResponse(result)) {
            this.commonService.ShowToast("Page loaded successfully.");
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

  RemoveBeatCustomer(CurrentCtx: any) {
    if (IsValidType(CurrentCtx)) {
      let MSData = JSON.parse(PostParam);
      MSData.content.rowGid = CurrentCtx.Gid;

      this.http
        .post("Beat/RemoveBeatCustomers", MSData)
        .then(result => {
          if (IsValidResponse(result)) {
            this.commonService.ShowToast("Page loaded successfully.");
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

  ngOnInit() {}
}

interface BeatPlanModal {
  BeatGid: string;
  Gid: string;
  CustomerGid: string;
  CustomerName: string;
  SubChannel: string;
  City: string;
  StartTimeStr: string;
  EndTimeStr: string;
  MonTF: boolean;
  TueTF: boolean;
  WedTF: boolean;
  ThuTF: boolean;
  FriTF: boolean;
  SatTF: boolean;
  SunTF: boolean;
}
