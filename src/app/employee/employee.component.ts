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
import { JourneyPlan, Employee, PostParam } from "../../providers/constants";
import { iNavigation } from "../../providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";
import { BusinessunitModel } from "../businessunit/businessunit.component";
import { AdvanceFilter } from "../customerreports/customerreports.component";
import { ApplicationStorage } from "src/providers/ApplicationStorage";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.scss"]
})
export class EmployeeComponent implements OnInit {
  entity: any = new EmployeeModel();
  buCollection: Array<BusinessunitModel>;
  reporteeCollection: Array<EmployeeModel>;
  TableResultSet: Array<EmployeeModel>;
  BindingHeader: Array<IGrid>;
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  AddEmployeeModal: boolean = false;
  TotalHeaders: number = 5;
  searchQuery: string = " 1=1 ";
  sortBy: string = "";
  pageIndex: number = 1;
  pageSize: number = 15;
  TotalCount: number = 0;
  TotalPageCount: number = 0;
  TypeEnum: string = "CIT";
  AdvanceFilterObject: FormGroup;
  AdvanceSearch: EmployeeAdvanceSearch;
  MasterData: any = {};
  AutodropdownCollection: any = {
    Region: { data: [], placeholder: "Region" },
    SubChannel: { data: [], placeholder: "SubChannel" },
    Supervisor: { data: [], placeholder: "Supervisor" },
    State: { data: [], placeholder: "State" },
    ChainName: { data: [], placeholder: "ChainName" },
    Marchandisor: { data: [], placeholder: "Marchandisor" },
    City: { data: [], placeholder: "City" }
  };
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private local: ApplicationStorage,
    private http: AjaxService
  ) {
    let PageName = this.commonService.GetCurrentPageName();
    this.HeaderName = "Employee";
    this.ResetAdvanceFilter();
  }

  NextPage() {
    if (this.pageIndex + 1 <= this.TotalPageCount) {
      this.pageIndex = this.pageIndex + 1;
      this.LoadData();
    }
  }

  SubmitSearchCriateria() {
    let searchQuery = "1=1 ";

    if (IsValidType(this.AdvanceSearch.Marchandisor)) {
      searchQuery +=
        " And j.Name = '" +
        this.AdvanceSearch.Marchandisor +
        "' and j.LinkType = 'businessunit'";
    }

    // if (IsValidType(this.AdvanceSearch.Supervisor)) {
    //   searchQuery +=
    //     " And Supervisor = '" + this.AdvanceSearch.Supervisor + "'";
    // }

    if (IsValidType(this.AdvanceSearch.Name)) {
      searchQuery += " And j.Name like '" + this.AdvanceSearch.Name + "%'";
    }

    if (this.AdvanceSearch.Mobile) {
      searchQuery += " And j.Mobile like '" + this.AdvanceSearch.Mobile + "%'";
    }

    if (this.AdvanceSearch.LoginId) {
      searchQuery += " And LoginId like '" + this.AdvanceSearch.LoginId + "%'";
    }

    if (this.AdvanceSearch.EmpNo) {
      searchQuery += " And j.EmpNo like '" + this.AdvanceSearch.EmpNo + "%'";
    }

    if (this.AdvanceSearch.PrimaryPhone) {
      searchQuery +=
        " And p.PrimaryPhone like '" + this.AdvanceSearch.PrimaryPhone + "%'";
    }

    if (this.AdvanceSearch.Designation) {
      searchQuery +=
        " And j.Designation like '" + this.AdvanceSearch.Designation + "%'";
    }

    if (this.AdvanceSearch.Department) {
      searchQuery +=
        " And j.Department like '" + this.AdvanceSearch.Department + "%'";
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

    this.searchQuery = searchQuery;
    this.LoadData();
  }

  ResetAdvanceFilter() {
    this.AdvanceSearch = {
      LinkType: "",
      Name: "",
      Mobile: "",
      LoginId: "",
      EmpNo: "",
      JoinDate: "",
      ExitDate: "",
      BirthDate: "",
      PrimaryPhone: "",
      SecondaryPhone: "",
      WhatsAppPhone: "",
      Email: "",
      Designation: "",
      Department: "",
      Code: "",
      Marchandisor: ""
    };
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
      this.searchQuery = " 1=1 ";
      let searchStmt = "";
      this.BindingHeader.map((value, index) => {
        if (value.type !== "hidden") {
          if (searchStmt === "")
            searchStmt += ` j.${value.column} like '${data}%' `;
          else searchStmt += ` or j.${value.column} like '${data}%' `;
        }
      });

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

    this.Close();
    this.http.post("Webportal/FetchContacts", MSData).then(response => {
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
          this.commonService.ShowToast("Unable to get data.");
        }
      }
    });
  }

  BindBusinessunit() {
    let MSData = JSON.parse(PostParam);
    MSData.content.searchString = this.searchQuery;
    MSData.content.sortBy = this.sortBy;
    MSData.content.pageIndex = this.pageIndex;
    MSData.content.pageSize = this.pageSize;
    this.http.post("Webportal/FetchBusinessUnits", MSData).then(response => {
      this.TableResultSet = [];
      if (this.commonService.IsValidResponse(response)) {
        let Data = response.content.data;
        if (Data != null && Data != "") {
          this.buCollection = Data;
        }
      }
    });
  }

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

  GetAdvanceFilter() {
    this.EnableFilter = true;
  }

  ngOnInit() {
    this.BindingHeader = [
      { column: "Name", displayheader: "Employee Name", width: 10 },
      { column: "GenderEnum", displayheader: "Gender" },
      { column: "Mobile", displayheader: "Mobile" },
      { column: "LoginId", displayheader: "LoginId" },
      { column: "EmpNo", displayheader: "EmpNo" },
      { column: "PrimaryPhone", displayheader: "Primary Phone" },
      { column: "Email", displayheader: "Email" },
      { column: "Designation", displayheader: "Designation" },
      { column: "Department", displayheader: "Department" },
      { column: "Gid", type: "hidden" }
    ];

    this.BindBusinessunit();
    //this.BindReportsto();
    this.LoadData();
    this.LoadTableData();
    let LocalMasterData = this.local.getMaster();
    if (IsValidType(LocalMasterData)) {
      this.MasterData = LocalMasterData;
    }
  }

  Close() {
    this.EnableFilter = false;
    this.AddEmployeeModal = false;
  }

  ResetFilter() {
    this.searchQuery = " 1=1 ";
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

    this.AddEmployeeModal = true;
  }
  Edit(editEntity: any) {
    this.Open();
    this.entity = editEntity;
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

  ExportMe() {
    if(!ExportToExcel('emp-table', 'employee')){
      this.commonService.ShowToast("Incorrect value passed to export to excel.");
    }
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

  //job
  JobGid: String;
  Code: String;
  WebPortalRole: String;
  MobileAppRole: String;
  ReportingToJobId: String;
}

interface EmployeeAdvanceSearch {
  LinkType: string;
  Name: string;
  Mobile: string;
  LoginId: string;
  EmpNo: string;
  JoinDate: string;
  ExitDate: string;
  BirthDate: string;
  PrimaryPhone: string;
  SecondaryPhone: string;
  WhatsAppPhone: string;
  Email: string;
  Designation: string;
  Department: string;
  Code: string;
  Marchandisor: string;
}
