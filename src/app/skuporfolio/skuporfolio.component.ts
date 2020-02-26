import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import {
  CommonService,
  IsValidType,
  ExportToExcel
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";
import { IGrid } from "src/providers/Generic/Interface/IGrid";
import { ManageSKUPortfolio, PostParam } from "src/providers/constants";
import { SKUPortfolioModal } from "src/providers/modals";
import * as $ from "jquery";

@Component({
  selector: "app-skuporfolio",
  templateUrl: "./skuporfolio.component.html",
  styleUrls: ["./skuporfolio.component.scss"]
})
export class SkuporfolioComponent implements OnInit {
  entity: any = new SKUPortfolioModal();
  TableResultSet: Array<SKUPortfolioModal>;
  BindingHeader: Array<IGrid>;
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  TotalHeaders: number = 5;
  PlannogramImage: any;
  PlannogramImagePath: any;
  TypeEnum: string = "BO";
  AdvanceFilterObject: FormGroup;
  SubChannelRecord: Array<any> = [];
  SubChainRecord: Array<any> = [];
  SubLocationRecord: Array<any> = [];
  searchQuery: string = " 1=1 ";
  sortBy: string = "";
  pageIndex: number = 1;
  pageSize: number = 15;
  TotalCount: number = 0;
  TotalPageCount: number = 0;
  IsFirstLoad = true;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService
  ) {
    let PageName = this.commonService.GetCurrentPageName();
    this.HeaderName = "SKU Portfolio";
    this.AdvanceFilterObject = this.fb.group({
      Region: new FormControl(""),
      SubChannel: new FormControl(""),
      CustomerCode: new FormControl(""),
      CustomerName: new FormControl(""),
      State: new FormControl(""),
      Code: new FormControl(""),
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
      this.searchQuery = ` 1=1 and (j.Code like '${data}%' or j.Name like '${data}%'
      or j.Description like '${data}%' or j.SubChannel like '${data}%' or j.Chain like '${data}%')`;
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

    this.http.post("Webportal/FetchSkuportfolios", MSData).then(result => {
      this.TableResultSet = [];
      if (this.commonService.IsValidResponse(result)) {
        if (IsValidType(result)) {
          this.IsEmptyRow = false;
          let Data = JSON.parse(result.content.data);
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
            this.TableResultSet = Record;
          }

          if (this.IsFirstLoad) {
            this.IsFirstLoad = false;
            this.SubChannelRecord = [];
            this.GetDropdownData("retailerSubChannel");
            this.SubChainRecord = [];
            this.GetDropdownData("retailerChainName");
            this.SubLocationRecord = [];
            this.GetDropdownData("locationTypeEnum");
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

  GetDropdownData(SearchString: string) {
    if (SearchString !== "") {
      let input: any = {
        meta: {
          app: "MerchandiserApp",
          action: "FetchPlanogrammainaisles",
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

      input.content.searchString = SearchString;
      this.http
        .post("Webportal/FetchReasonItems", input)
        .then(response => {
          if (this.commonService.IsValidResponse(response)) {
            let Data = response.content.data;
            if (Data != null && Data != "" && Data.length > 0) {
              if (SearchString === "retailerSubChannel")
                this.SubChannelRecord = Data;
              else if (SearchString === "retailerChainName")
                this.SubChainRecord = Data;
              else if (SearchString === "locationTypeEnum")
                this.SubLocationRecord = Data;
            } else {
              this.commonService.ShowToast("Got empty sub-channel.");
            }
          } else {
            this.commonService.ShowToast("Unable to get data.");
          }
        })
        .catch(err => {
          this.commonService.ShowToast("Unable to get sub channel data.");
        });
    }
  }

  ngOnInit() {
    this.BindingHeader = [
      { column: "Name", displayheader: "Name", width: 10 },
      { column: "Description", displayheader: "Description", width: 10 },
      { column: "SubChannel", displayheader: "SubChannel", width: 10 },
      { column: "Chain", displayheader: "Chain", width: 10 },
      { column: "Location", displayheader: "Location", type: "hidden" },
      { column: "Code", displayheader: "Code" },
      { column: "Gid", type: "hidden" }
    ];
    this.LoadData();

    this.LoadTableData();
  }

  Close() {
    this.EnableFilter = false;
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

  Open() {
    this.entity = new SKUPortfolioModal();
    this.entity.SubChannel = "";
    this.entity.Location = "";
    this.entity.Chain = "";
    this.EnableFilter = true;
  }

  Edit(editEntity: SKUPortfolioModal) {
    if (IsValidType(editEntity)) {
      this.nav.navigate(ManageSKUPortfolio, editEntity);
    }
  }

  GetFile(fileInput: any) {
    let Files = fileInput.target.files;
    if (Files.length > 0) {
      this.PlannogramImage = <File>Files[0];
      let mimeType = this.PlannogramImage.type;
      if (mimeType.match(/image\/*/) == null) {
        console.log("Only images are supported.");
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(this.PlannogramImage);
      reader.onload = fileEvent => {
        this.PlannogramImagePath = reader.result;
      };
    } else {
      this.commonService.ShowToast("No file selected");
    }
  }

  Save() {
    let formData = new FormData();
    formData.append("image", this.PlannogramImage);
    formData.append("skuportfolioData", JSON.stringify(this.entity));

    this.Close();
    this.http.upload("Webportal/SaveSkuportfolio", formData).then(
      response => {
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          if (Data != null && Data != "") {
            this.IsEmptyRow = false;
            this.TableResultSet = Data;
            this.SubChannelRecord = [];
            this.GetDropdownData("retailerSubChannel");
            this.SubChainRecord = [];
            this.GetDropdownData("retailerChainName");
            this.SubLocationRecord = [];
            this.GetDropdownData("locationTypeEnum");
            this.commonService.ShowToast("Data retrieve successfully.");
          } else {
            this.IsEmptyRow = true;
            this.commonService.ShowToast("Got empty dataset.");
          }
        } else {
          this.commonService.ShowToast("Unable to save data.");
        }
      },
      error => {
        this.commonService.ShowToast("Server error. Please contact to admin.");
      }
    );
  }

  Remove(editEntity: any) {
    if (!confirm("Do you want remove this record?")) {
      return;
    }
    this.Close();
    this.entity = editEntity;
    this.http
      .post("Webportal/RemoveSkuportfolio", JSON.stringify(this.entity))
      .then(response => {
        if (this.commonService.IsValidResponse(response)) {
          this.commonService.ShowToast("Office removed successfully.");

          let Data = response.content.data;
          if (IsValidType(Data)) {
            this.IsEmptyRow = false;
            this.TableResultSet = Data;
            this.commonService.ShowToast("Data retrieve successfully.");
          } else {
            this.TableResultSet = [];
            this.IsEmptyRow = true;
          }
        } else {
          this.commonService.ShowToast("Unable to save data.");
        }
      });
  }

  ExportMe() {
    if(!ExportToExcel('skuportfolio-table', 'skuportfolio')){
      this.commonService.ShowToast("Incorrect value passed to export to excel.");
    }
  }
}
