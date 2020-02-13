import { Component, OnInit } from "@angular/core";
import { IGrid } from "./../../providers/Generic/Interface/IGrid";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormControl } from "@angular/forms";
import {
  CommonService,
  IsValidType
} from "./../../providers/common-service/common.service";
import * as $ from "jquery";
import {
  JourneyPlan,
  RetailerDetail,
  PostParam
} from "./../../providers/constants";
import { iNavigation } from "./../../providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";

@Component({
  selector: "app-customerreports",
  templateUrl: "./customerreports.component.html",
  styleUrls: ["./customerreports.component.scss"]
})
export class CustomerreportsComponent implements OnInit {
  TableResultSet: Array<RetailerModal>;
  BindingHeader: Array<IGrid>;
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  TotalHeaders: number = 5;
  searchQuery: string = " 1=1 ";
  sortBy: string = "";
  pageIndex: number = 1;
  pageSize: number = 15;
  TotalCount: number = 0;
  TotalPageCount: number = 0;
  AutodropdownCollection: any = {
    Region: { data: [], placeholder: "Region" },
    SubChannel: { data: [], placeholder: "SubChannel" },
    Supervisor: { data: [], placeholder: "Supervisor" },
    State: { data: [], placeholder: "State" },
    ChainName: { data: [], placeholder: "ChainName" },
    Marchandisor: { data: [], placeholder: "Marchandisor" },
    City: { data: [], placeholder: "City" }
  };
  AdvanceFilterObject: FormGroup;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService
  ) {
    let PageName = this.commonService.GetCurrentPageName();
    if (PageName === JourneyPlan) {
      this.HeaderName = "Journey Plan";
    } else {
      this.HeaderName = "Customer List";
    }
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
      Marchandisor: new FormControl("")
    });
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

  LoadData() {
    let MSData = JSON.parse(PostParam);
    MSData.content.searchString = this.searchQuery;
    MSData.content.sortBy = this.sortBy;
    MSData.content.pageIndex = this.pageIndex;
    MSData.content.pageSize = this.pageSize;

    this.http.post("Webportal/FetchRetailers", MSData).then(response => {
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

  ngOnInit() {
    this.BindingHeader = [
      { column: "Name", displayheader: "Customer Name", width: 10 },
      { column: "Channel", displayheader: "Channel" },
      { column: "SubChannel", displayheader: "SubChannel" },
      { column: "ChainName", displayheader: "Chain Name" },
      { column: "City", displayheader: "City" },
      { column: "State", displayheader: "State" },
      { column: "Region", displayheader: "Region" },
      { column: "Address", displayheader: "Address" },
      { column: "KYCProgress", displayheader: "KYC Progress" },
      { column: "Gid", type: "hidden" }
    ];
    this.LoadData();
    // this.AutodropdownCollection.Region = {
    //   data: [
    //     { value: "First", data: "1" },
    //     { value: "Second", data: "2" },
    //     { value: "Third", data: "3" },
    //     { value: "Forth", data: "4" },
    //     { value: "Fifth", data: "5" },
    //     { value: "Sixth", data: "6" },
    //     { value: "Seventh", data: "7" }
    //   ],
    //   placeholder: "Region"
    // };
    this.LoadTableData();
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

  LoadTableData() {
    this.IsEmptyRow = false;
  }

  SubmitSearchCriateria() {
    let searchQuery = "1=1 ";
    if (this.AdvanceFilterObject.valid) {
      if (this.AdvanceFilterObject.get("CustomerCode").touched) {
        searchQuery +=
          " And CustomerCode like '" +
          this.AdvanceFilterObject.get("CustomerCode").value +
          "'";
      }

      if (this.AdvanceFilterObject.get("CustomerName").touched) {
        searchQuery +=
          " And Customer Name like '" +
          this.AdvanceFilterObject.get("CustomerName").value +
          "'";
      }

      if (this.AdvanceFilterObject.get("Address").touched) {
        searchQuery +=
          " And Address like '" +
          this.AdvanceFilterObject.get("Address").value +
          "'";
      }

      if (this.AdvanceFilterObject.get("Beat").touched) {
        searchQuery +=
          " And Beat like '" + this.AdvanceFilterObject.get("Beat").value + "'";
      }
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

  EditCurrent(CurrentItem: any) {
    if (IsValidType(CurrentItem))
      this.nav.navigate(RetailerDetail, CurrentItem);
    else this.commonService.ShowToast("Fail to show detail.");
  }

  DeleteRecord() {}
}

export class RetailerModal {
  Gid: String;
  Code: String;
  Name: String;
  KYCProgress: Number;

  SupplyFrom: String;
  SupplyFrequency: String;
  SupplyDay: String;
  Channel: String;
  SubChannel: String;
  ChainName: String;

  //address
  LinkType: String;
  LinkGid: String;
  Type: String;
  City: String;
  State: String;
  Region: String;
  Country: String;
  Phone: String;
  HouseNo: String;
  Street: String;
}
