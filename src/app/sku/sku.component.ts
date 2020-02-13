import { Component, OnInit } from "@angular/core";
import { IGrid } from "../../providers/Generic/Interface/IGrid";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormControl } from "@angular/forms";
import {
  CommonService,
  IsValidType
} from "../../providers/common-service/common.service";
import * as $ from "jquery";
import { JourneyPlan, Sku, PostParam } from "../../providers/constants";
import { iNavigation } from "../../providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";

@Component({
  selector: "app-sku",
  templateUrl: "./sku.component.html",
  styleUrls: ["./sku.component.scss"]
})
export class SkuComponent implements OnInit {
  entity: any = new SkuModel();
  TableResultSet: Array<SkuModel>;
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
  TypeEnum: string = "BO";
  AdvanceFilterObject: FormGroup;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService
  ) {
    let PageName = this.commonService.GetCurrentPageName();
    this.HeaderName = "Sku";
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

    this.http.post("Webportal/FetchSkus", MSData).then(response => {
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
    });
  }

  ngOnInit() {
    this.BindingHeader = [
      { column: "Code", displayheader: "Code" },
      { column: "Name", displayheader: "Name", width: 10 },
      { column: "MRP", displayheader: "MRP" },
      { column: "UoM", displayheader: "UOM" },
      { column: "ParentSKU", displayheader: "Parent SKU", width: 10 },
      { column: "SubBrandName", displayheader: "Sub Brand", width: 10 },
      { column: "BrandName", displayheader: "Brand", width: 10 },
      { column: "SegmentName", displayheader: "Segment", width: 10 },
      { column: "CompanyName", displayheader: "Company", width: 10 },
      { column: "Gid", type: "hidden" }
    ];
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
    this.entity = new SkuModel();
    this.entity.CompanyCode = "MWC";
    this.entity.CompanyName = "MARS WRIGLEY CONFECTIONERY";
    this.EnableFilter = true;
  }
  Edit(editEntity: any) {
    this.Open();
    this.entity = editEntity;
  }
  Save() {
    console.log(this.entity);
    this.http
      .post("Webportal/SaveSku", JSON.stringify(this.entity))
      .then(response => {
        if (this.commonService.IsValidResponse(response)) {
          this.commonService.ShowToast("Office details saved successfully.");
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
      .post("Webportal/RemoveSku", JSON.stringify(this.entity))
      .then(response => {
        if (this.commonService.IsValidResponse(response)) {
          this.commonService.ShowToast("Office removed successfully.");
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
}

export class SkuModel {
  Gid: string;
  Code: string;
  Name: string;
  ShortName: string;
  MRP: number;
  UoM: string;
  EANNumber: string;
  ParentSKU: string;
  SubBrandName: string;
  BrandName: string;
  SegmentName: string;
  CompanyCode: string;
  CompanyName: string;
}
