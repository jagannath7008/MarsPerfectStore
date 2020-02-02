import { Component, OnInit } from "@angular/core";
import { BusinessunitModel } from "../businessunit/businessunit.component";
import { IGrid } from "src/providers/Generic/Interface/IGrid";
import { FormGroup, FormBuilder } from "@angular/forms";
import { iNavigation } from "src/providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";
import { CommonService } from "src/providers/common-service/common.service";
import { ManageSupervisorCustomer } from "src/providers/constants";

@Component({
  selector: "app-supervisor-customer",
  templateUrl: "./supervisor-customer.component.html",
  styleUrls: ["./supervisor-customer.component.scss"]
})
export class SupervisorCustomerComponent implements OnInit {
  entity: any = new EmployeeModel();
  buCollection: Array<BusinessunitModel>;
  reporteeCollection: Array<EmployeeModel>;
  TableResultSet: Array<EmployeeModel>;
  BindingHeader: Array<IGrid>;
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  TotalHeaders: number = 5;
  searchQuery: string = "";
  TypeEnum: string = "CIT";
  AdvanceFilterObject: FormGroup;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService
  ) {
    this.HeaderName = "Supervisor Customer";
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
    this.http
      .post("Beat/FetchMerchandisingSupervisors", input)
      .then(response => {
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
      })
      .catch(err => {
        this.commonService.ShowToast(
          "Getting server error. Please contact to admin."
        );
      });
  }

  // BindBusinessunit() {
  //   let input: any = {
  //     meta: {
  //       app: "MerchandiserApp",
  //       action: "WebLogin",
  //       requestId: "0",
  //       deviceId: "web"
  //     },
  //     content: {
  //       deviceId: "web",
  //       deviceType: "web",
  //       deviceOS: "Windows",
  //       deviceVersion: "web",
  //       deviceInfo: "web"
  //     }
  //   };
  //   input.content.searchString = "";
  //   this.http.post("Webportal/FetchBusinessUnits", input).then(response => {
  //     this.TableResultSet = [];
  //     if (this.commonService.IsValidResponse(response)) {
  //       let Data = response.content.data;
  //       if (Data != null && Data != "") {
  //         this.buCollection = Data;
  //       }
  //     }
  //   });
  // }

  BindReportsto() {
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
    this.http.post("Webportal/FetchEmployees", input).then(response => {
      this.TableResultSet = [];
      if (this.commonService.IsValidResponse(response)) {
        let Data = response.content.data;
        if (Data != null && Data != "") {
          this.reporteeCollection = Data;
        }
      }
    });
  }

  ngOnInit() {
    this.BindingHeader = [
      { column: "Supervisor", displayheader: "Supervisor", width: 10 },
      { column: "MerchandiserEmpNo", displayheader: "Merchandiser Emp No#" },
      { column: "Marchandiser", displayheader: "Marchandiser" },
      { column: "RetailreCode", displayheader: "Retailre Code" },
      { column: "RetailerName", displayheader: "Retailer Name" }
    ];

    //this.BindBusinessunit();
    this.LoadData();
    this.LoadTableData();
  }

  Close() {
    this.EnableFilter = false;
  }

  ResetFilter() {
    this.searchQuery = "";
    this.LoadData();
  }

  LoadTableData() {
    this.IsEmptyRow = false;
  }

  Open() {
    this.entity = new EmployeeModel();
    this.entity.TypeEnum = this.TypeEnum;
    this.entity.LinkType = "businessunit";
    this.entity.LinkGid = "";
    this.entity.GenderEnum = "";
    this.entity.WebPortalRole = "";
    this.entity.MobileAppRole = "";

    this.EnableFilter = true;
  }

  Edit(editEntity: any) {
    // this.Open();
    // this.entity = editEntity;
    this.nav.navigate(ManageSupervisorCustomer, editEntity);
  }

  Save() {
    console.log(this.entity);
    this.http
      .post("Webportal/SaveContact", JSON.stringify(this.entity))
      .then(response => {
        if (this.commonService.IsValidResponse(response)) {
          this.commonService.ShowToast("Employee details saved successfully.");
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
      .post("Webportal/RemoveContact", JSON.stringify(this.entity))
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

  FilterLocaldata() {
    console.log(this.searchQuery);
    this.LoadData();
  }
}

export class EmployeeModel {
  LinkType: String;
  LinkGid: String;
  Name: String;
  GenderEnum: String;
  Mobile: String;
  CountryGid: String;
  LoginId: String;
  Status: Number;
  EmpNo: String;
  JoinDate: String;
  ExitDate: String;
  BirthDate: String;
  EncryptedPassword: String;
  PrimaryPhone: String;
  SecondaryPhone: String;
  WhatsAppPhone: String;
  Email: String;
  Designation: String;
  Department: String;
  Gid: String;

  JobGid: String;
  Code: String;
  WebPortalRole: String;
  MobileAppRole: String;
  ReportingToJobId: String;
  Marchandiser: string;
  Supervisor: string;
  RetailerName: string;
  RetailreCode: string;
  SupervisorEmpNo: string;
  MerchandiserEmpNo: string;
}
