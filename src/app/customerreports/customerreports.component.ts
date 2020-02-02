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
import { JourneyPlan, RetailerDetail } from "./../../providers/constants";
import { iNavigation } from "./../../providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";

@Component({
  selector: "app-customerreports",
  templateUrl: "./customerreports.component.html",
  styleUrls: ["./customerreports.component.scss"]
})
export class CustomerreportsComponent implements OnInit {
  searchQuery: string = "";
  TableResultSet: Array<RetailerModal>;
  BindingHeader: Array<IGrid>;
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  TotalHeaders: number = 5;
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

  LoadData() {
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
    input.content.searchString = this.searchQuery;
    this.http.post("Webportal/FetchRetailers", input).then(response => {
      this.TableResultSet = [];
      if (this.commonService.IsValidResponse(response)) {
        let Data = response.content.data;
        if (Data != null && Data != "") {
          this.IsEmptyRow = false;
          this.TableResultSet = Data;
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

  ResetFilter() {}

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

  FilterLocaldata(keyvalue: any) {}

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
