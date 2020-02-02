import { Component, OnInit } from "@angular/core";
import { iNavigation } from "src/providers/iNavigation";
import {
  CommonService,
  IsValidType
} from "src/providers/common-service/common.service";
import { SKUPortfolioModal } from "src/providers/modals";
import { IGrid } from "src/providers/Generic/Interface/IGrid";
import { AjaxService } from "src/providers/ajax.service";
import * as $ from "jquery";

@Component({
  selector: "app-manageskuportfolio",
  templateUrl: "./manageskuportfolio.component.html",
  styleUrls: ["./manageskuportfolio.component.scss"]
})
export class ManageskuportfolioComponent implements OnInit {
  entity: any = new SKUPortfolioModal();
  PageData: SKUPortfolioModal;
  ManageSkuPortfolioGrid: Array<IManageSKUPortfolio> = [];
  IsEmptyRow: boolean = true;
  ManageSkuPortfolioHeader: Array<IGrid> = [];
  SkuData: Array<any> = [];
  EnableFilter: boolean = false;
  searchQuery: string = "";
  CustomerList: Array<any> = [];
  constructor(
    private nav: iNavigation,
    private common: CommonService,
    private http: AjaxService
  ) {
    this.InitGridHeader();
  }

  ngOnInit() {
    let StringifyPageData: any = this.nav.getValue();
    if (IsValidType(StringifyPageData)) {
      this.PageData = StringifyPageData;
      this.LoadData();
    } else {
      this.common.ShowToast("Unable to load SKU Portfolio data.");
    }
  }

  Close() {
    this.EnableFilter = false;
  }

  Open() {
    this.entity = new SKUPortfolioModal();
    this.EnableFilter = true;
  }

  Save() {
    if (IsValidType(this.entity)) {
      this.AddUpdateSkuPortfolioSku(this.entity);
    }
  }

  AddSkuPortfolioSku() {
    let ReasonGid = $("#reason").val();
    if (IsValidType(ReasonGid)) {
      let ManageSKUPortfolioNew = {
        Gid: null,
        SkuPortfolioCode: "",
        ParentSKU: ReasonGid,
        DefaultUoM: "",
        MainAisleModelQty: 0,
        TZModelQty: 0,
        SecondaryVisibilityModelQty: 0,
        StockModelQty: 0,
        IsMainAisleMustHave: 0,
        IsTZMustHave: 0,
        IsSecondaryVisibilityMustHave: 0
      };
      this.AddUpdateSkuPortfolioSku(ManageSKUPortfolioNew);
    }
  }

  AddUpdateSkuPortfolioSku(ManageSKUPortfolioNew: any) {
    if (IsValidType(ManageSKUPortfolioNew)) {
      let input: any = {
        meta: {
          app: "MerchandiserApp",
          action: "AddUpdateSkuportfolioskus",
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

      if (ManageSKUPortfolioNew.IsMainAisleMustHave)
        ManageSKUPortfolioNew.IsMainAisleMustHave = 1;
      else ManageSKUPortfolioNew.IsMainAisleMustHave = 0;

      if (ManageSKUPortfolioNew.IsTZMustHave)
        ManageSKUPortfolioNew.IsTZMustHave = 1;
      else ManageSKUPortfolioNew.IsTZMustHave = 0;

      if (ManageSKUPortfolioNew.IsSecondaryVisibilityMustHave)
        ManageSKUPortfolioNew.IsSecondaryVisibilityMustHave = 1;
      else ManageSKUPortfolioNew.IsSecondaryVisibilityMustHave = 0;

      this.Close();
      input.content.searchString = this.searchQuery;
      this.http
        .post(
          "Webportal/AddSkuportfoliosku",
          JSON.stringify(ManageSKUPortfolioNew)
        )
        .then(response => {
          this.ManageSkuPortfolioGrid = [];
          if (this.common.IsValidResponse(response)) {
            let Data = response.content.data;
            if (Data != null && Data != "") {
              this.IsEmptyRow = false;
              this.ManageSkuPortfolioGrid = Data;
              this.CustomerList = [];
              this.GetDropdownData("skuparentsku");
              this.common.ShowToast("Data retrieve successfully.");
            } else {
              this.IsEmptyRow = true;
              this.common.ShowToast("Got empty dataset.");
            }
          } else {
            this.common.ShowToast("Unable to get data.");
          }
        });
    }
  }

  EditCurrent(editEntity: any) {
    this.entity = editEntity;
    this.EnableFilter = true;
  }

  LoadData() {
    let FilterQuery = {
      SearchString: "1=1",
      SortBy: "Name",
      Index: 1,
      Offset: 10
    };
    let input: any = {
      meta: {
        app: "MerchandiserApp",
        action: "FetchSkuportfolioskus",
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
    this.http.post("Webportal/FetchSkuportfolioskus", input).then(response => {
      this.ManageSkuPortfolioGrid = [];
      if (this.common.IsValidResponse(response)) {
        let Data = response.content.data;
        if (Data != null && Data != "") {
          this.IsEmptyRow = false;
          this.ManageSkuPortfolioGrid = Data;
          this.CustomerList = [];
          this.GetDropdownData("skuparentsku");
          this.common.ShowToast("Data retrieve successfully.");
        } else {
          this.IsEmptyRow = true;
          this.common.ShowToast("Got empty dataset.");
        }
      } else {
        this.common.ShowToast("Unable to get data.");
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
          if (this.common.IsValidResponse(response)) {
            let Data = response.content.data;
            if (IsValidType(Data)) {
              this.CustomerList = Data;
            } else {
              this.common.ShowToast("Fail to load customer data.");
            }
          } else {
            this.common.ShowToast("Unable to get data.");
          }
        })
        .catch(err => {
          this.common.ShowToast("Unable to get sub channel data.");
        });
    }
  }

  RemoveManageSKUPortfolio(CurrentItem: any) {
    if (IsValidType(CurrentItem)) {
      if (!confirm("Do you want remove this record?")) {
        return;
      }
      this.Close();
      this.http
        .post("Webportal/RemoveSkuportfoliosku", JSON.stringify(CurrentItem))
        .then(response => {
          if (this.common.IsValidResponse(response)) {
            let Data = response.content.data;
            if (Data != null && Data != "" && Data.length > 0) {
              this.IsEmptyRow = false;
              this.ManageSkuPortfolioGrid = Data;
              this.common.ShowToast("Data deleted successfully.");
            } else {
              this.ManageSkuPortfolioGrid = [];
              this.IsEmptyRow = true;
            }
          } else {
            this.common.ShowToast("Unable to save data.");
          }
        });
    }
  }

  InitGridHeader() {
    this.ManageSkuPortfolioHeader = [
      {
        column: "SkuPortfolioCode",
        displayheader: "Code",
        type: "hidden",
        width: 10
      },
      { column: "ParentSKU", displayheader: "Parent SKU" },
      { column: "DefaultUoM", displayheader: "Default UoM", type: "header" },
      {
        column: "MainAisleModelQty",
        displayheader: "MainAisle Qty",
        type: "header"
      },
      {
        column: "IsMainAisleMustHave",
        displayheader: "Is MainAisle Must Have?",
        type: "header"
      },
      {
        column: "SecondaryVisibilityModelQty",
        displayheader: "Secondary Visibility Qty",
        type: "header"
      },
      {
        column: "IsSecondaryVisibilityMustHave",
        displayheader: "Is Secondary Visibility  Must Have?",
        type: "header"
      },
      {
        column: "TZModelQty",
        displayheader: "TZ ModelQty",
        type: "header"
      },
      {
        column: "IsTZMustHave",
        displayheader: "Is TZ Must Have?",
        type: "header"
      },
      { column: "StockModelQty", displayheader: "Stock Qty", type: "header" },
      { column: "Gid", type: "hidden" }
    ];
  }
}

interface IManageSKUPortfolio {
  Gid: string;
  SkuPortfolioCode: string;
  ParentSKU: string;
  DefaultUoM: string;
  MainAisleModelQty: number;
  TZModelQty: number;
  SecondaryVisibilityModelQty: number;
  StockModelQty: number;
  IsMainAisleMustHave: number;
  IsTZMustHave: number;
  IsSecondaryVisibilityMustHave: number;
}
