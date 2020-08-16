import { Component, OnInit, Input, ViewChild } from "@angular/core";
import * as _ from "lodash";
import { FormBuilder } from "@angular/forms";
import {
  CommonService,
  IsValidType,
  ExportToExcel,
} from "src/providers/common-service/common.service";
import * as $ from "jquery";
import {
  PostParam,
  M_Countries,
  M_Region,
  M_State,
  M_City,
  M_Supervisor,
  M_Merchandiser,
  M_Retailer,
  ZerothIndex,
  M_ChainName,
  M_CustomerName,
} from "src/providers/constants";
import { iNavigation } from "src/providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";
import { BusinessunitModel } from "src/app/businessunit/businessunit.component";
import { ApplicationStorage } from "src/providers/ApplicationStorage";

@Component({
  selector: "app-availabilityreport",
  templateUrl: "./availabilityreport.component.html",
  styleUrls: ["./availabilityreport.component.scss"],
})
export class AvailabilityreportComponent implements OnInit {
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(",")
        .map((str) => +str);
    }
  }

  selectedClass: string = "Assigned";
  public TodayJourneyPlanViewModel: Array<AvailabilityReportCategoryViewModel>;
  public ChildModel: Array<AvailabilityReportBrandViewModel>;
  public GCModel: Array<AvailabilityReportSKUViewModel>;

  TableResultSet: any[];
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  TotalHeaders: number = 5;
  searchQuery: string = " 1=1 ";
  sortBy: string = "";
  OOSDetail: any;
  StoreVisitedTable: any;
  TotalStore: any;
  pageIndex: number = 1;
  IsshowOosData: boolean = false;
  GridData: any;
  TotalCount: number = 0;
  MasterData: MasterDataModal;
  TotalPageCount: number = 0;
  AdvanceSearch: AdvanceFilterModal;
  CurrentSegmentName: string = null;
  CurrentBrandName: string = null;
  CurrentParentSKU: string = null;
  AutodropdownCollection: any = {
    Region: { data: [], placeholder: "Region" },
    SubChannel: { data: [], placeholder: "SubChannel" },
    Supervisor: { data: [], placeholder: "Supervisor" },
    State: { data: [], placeholder: "State" },
    ChainName: { data: [], placeholder: "ChainName" },
    Marchandisor: { data: [], placeholder: "Marchandisor" },
    City: { data: [], placeholder: "City" },
  };
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService,
    private local: ApplicationStorage
  ) {
    this.MasterData = new MasterDataModal();
    let PageName = this.commonService.GetCurrentPageName();
    this.HeaderName = "Availability Report";
    this.ResetAdvanceFilter();
  }
  ActiveRow: boolean[] = [];
  ActiveRowGC: boolean[] = [];
  icon: string = "assets/images/view.png";

  ResetAdvanceFilter() {
    this.AdvanceSearch = new AdvanceFilterModal();
  }

  SubmitSearchCriateria() {
    let searchQuery = "1=1 ";
    this.local.GetAdvanceFilterValue(this.AdvanceSearch);

    if (IsValidType(this.AdvanceSearch.Marchandisor)) {
      searchQuery +=
        " And Marchandisor = '" + this.AdvanceSearch.Marchandisor + "'";
    }

    if (IsValidType(this.AdvanceSearch.Supervisor)) {
      searchQuery +=
        " And Supervisor = '" + this.AdvanceSearch.Supervisor + "'";
    }

    if (IsValidType(this.AdvanceSearch.Region)) {
      searchQuery += " And Region = '" + this.AdvanceSearch.Region + "'";
    }

    if (this.AdvanceSearch.CustomerName) {
      searchQuery +=
        " And CustomerName = '" + this.AdvanceSearch.CustomerName + "'";
    }

    if (this.AdvanceSearch.CustomerCode) {
      searchQuery +=
        " And CustomerCode = '" + this.AdvanceSearch.CustomerCode + "'";
    }

    if (this.AdvanceSearch.State) {
      searchQuery += " And State = '" + this.AdvanceSearch.State + "'";
    }

    if (this.AdvanceSearch.City) {
      searchQuery += " And City = '" + this.AdvanceSearch.City + "'";
    }

    if (this.AdvanceSearch.ChainName) {
      searchQuery += " And ChainName = '" + this.AdvanceSearch.ChainName + "'";
    }

    this.LoadData();
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
        "p.Country",
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

  ngOnInit() {
    this.LoadData();
    let LocalMasterData = this.local.GetMasterDataValues(M_Region, null);
    if (IsValidType(LocalMasterData)) {
      this.MasterData.M_Region = LocalMasterData;
    }

    let ChainData = this.GetUniqueItem(
      "ChainName",
      this.local.GetMasterDataValues(M_ChainName, null)
    );
    if (IsValidType(ChainData)) {
      this.MasterData.M_ChainName = ChainData;
    }
  }

  LoadData() {
    let MSData = JSON.parse(PostParam);
    this.EnableFilter = false;
    this.http
      .post(
        "Webportal/FetchAvailabilityReport",
        JSON.stringify(this.AdvanceSearch)
      )
      .then((response) => {
        this.TableResultSet = [];
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          this.GridData = [];
          let CurrentBrandItem = null;
          let CurrentSKUItem = null;
          if (Data != null && Data != "") {
            let ServerData = JSON.parse(response.content.data);
            if (
              IsValidType(ServerData["Table"]) &&
              IsValidType(ServerData["Table1"]) &&
              IsValidType(ServerData["Table2"])
            ) {
              this.TotalStore = ServerData["Table1"][ZerothIndex]["Total"];
              let RetailByMsl = ServerData["Table2"];
              this.StoreVisitedTable = ServerData["Table3"];
              let MslBySegment = this.FilterGroupBy(RetailByMsl, "SegmentName");
              let AvailableGridData = ServerData.Table;
              let AvailableItemData = null;
              if (IsValidType(AvailableGridData)) {
                let SegmentItems = this.FilterGroupBy(
                  AvailableGridData,
                  "segmentName"
                );

                AvailableItemData = this.GenerateBindData(
                  "RetailerGid",
                  SegmentItems,
                  MslBySegment,
                  "Segment"
                );

                if (AvailableItemData.length > 0) {
                  this.GridData = AvailableItemData;
                }

                if (IsValidType(SegmentItems)) {
                  let SubCatagoryItems = null;
                  let MslBySegment = null;
                  let Keys = Object.keys(SegmentItems);
                  let index = 0;
                  while (index < Keys.length) {
                    let SubCatagoryItems = null;
                    SubCatagoryItems = SegmentItems[Keys[index]];
                    MslBySegment = this.FilterGroupBy(RetailByMsl, "BrandName");
                    let BrandItems = this.FilterGroupBy(
                      SubCatagoryItems,
                      "BrandName"
                    );

                    this.CurrentSegmentName = Keys[index];
                    CurrentBrandItem = null;
                    AvailableItemData = this.GenerateBindData(
                      "RetailerGid",
                      BrandItems,
                      MslBySegment,
                      "Brand"
                    );

                    if (AvailableItemData.length > 0) {
                      CurrentBrandItem = this.GridData.filter(
                        (x) => x.Catagory === Keys[index]
                      );
                      if (CurrentBrandItem.length > 0) {
                        CurrentBrandItem[ZerothIndex][
                          "BrandItem"
                        ] = AvailableItemData;
                      }
                    }

                    if (IsValidType(BrandItems)) {
                      let SubCatagoryItems = null;
                      let innerKeys = Object.keys(BrandItems);
                      let innerIndex = 0;
                      while (innerIndex < innerKeys.length) {
                        SubCatagoryItems = null;
                        SubCatagoryItems = BrandItems[innerKeys[innerIndex]];
                        MslBySegment = this.FilterGroupBy(
                          RetailByMsl,
                          "ParentSKU"
                        );

                        let ParentSKUItems = this.FilterGroupBy(
                          SubCatagoryItems,
                          "ParentSKU"
                        );

                        this.CurrentBrandName = innerKeys[innerIndex];
                        AvailableItemData = this.GenerateBindData(
                          "RetailerGid",
                          ParentSKUItems,
                          MslBySegment,
                          "ParentSKU"
                        );

                        CurrentSKUItem = null;
                        if (AvailableItemData.length > 0) {
                          CurrentSKUItem = CurrentBrandItem[ZerothIndex][
                            "BrandItem"
                          ].filter((x) => x.Catagory === innerKeys[innerIndex]);
                          if (CurrentSKUItem.length > 0) {
                            CurrentSKUItem[ZerothIndex][
                              "SKUItem"
                            ] = AvailableItemData;
                          }
                        }
                        innerIndex++;
                      }
                    }
                    index++;
                  }
                }
              }
            }
            this.IsEmptyRow = false;
            this.commonService.ShowToast("Data retrieve successfully.");
          } else {
            this.GridData = [];
          }
        } else {
          this.commonService.ShowToast("Unable to get data.");
        }
      });
  }

  FilterGroupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  GetUniqueItem(Key: any, Items: any): Array<any> {
    let index = 0;
    let i = 0;
    let UniqueItems = [];
    if (IsValidType(Items)) {
      while (index < Items.length) {
        i = UniqueItems.findIndex((x) => x[Key] === Items[index][Key]);
        if (i === -1) {
          UniqueItems.push(Items[index]);
        }
        index++;
      }
    }
    return UniqueItems;
  }

  GetOutOfStockItems(MSLUniqueData: any, InStockData: any): Array<any> {
    let FinalData: [];
    if (
      IsValidType(MSLUniqueData) &&
      IsValidType(InStockData) &&
      MSLUniqueData.length >= InStockData.length
    ) {
      let index = 0;
      while (index < InStockData.length) {
        MSLUniqueData = MSLUniqueData.filter(
          (x) => x.RetailerGID !== InStockData[index].RetailerGid
        );
        index++;
      }
      FinalData = MSLUniqueData;
    }
    return FinalData;
  }

  GetUniqueStoreVisited(
    SegmentName: string,
    BrandName: string,
    ParentSKUName: string
  ): number {
    let UniqueVisitedStore = 0;
    if (this.StoreVisitedTable !== null && this.StoreVisitedTable.length > 0) {
      let UniqueStore = [];
      let index = 0;
      let Items = [];
      Items = this.StoreVisitedTable;
      if (SegmentName !== null) {
        Items = this.StoreVisitedTable.filter(
          (x) => x.segmentName === SegmentName
        );
      }

      if (BrandName !== null) {
        Items = this.StoreVisitedTable.filter((x) => x.BrandName === BrandName);
      }

      if (ParentSKUName !== null) {
        Items = this.StoreVisitedTable.filter(
          (x) => x.ParentSKU === ParentSKUName
        );
      }
      while (index < Items.length) {
        if (
          UniqueStore.filter((x) => x.RetailerGid === Items[index].RetailerGid)
            .length === 0
        )
          UniqueStore.push(Items[index]);
        index++;
      }
      UniqueVisitedStore = UniqueStore.length;
    }
    return UniqueVisitedStore;
  }

  GenerateBindData(Key: string, Data: any, MSLData: any, Type: string) {
    let BindingData = [];
    if (IsValidType(Data) && MSLData !== null) {
      let Keys = Object.keys(Data);
      let index = 0;
      let Total = 0;
      let ItemDataName = null;
      let UniqueMSLData = null;
      let OosItems = [];
      let OOSCount = 0;

      while (index < Keys.length) {
        ItemDataName = this.GetUniqueItem(Key, Data[Keys[index]]);
        UniqueMSLData = this.GetUniqueItem("RetailerGID", MSLData[Keys[index]]);
        // OosItems = this.GetOutOfStockItems(UniqueMSLData, ItemDataName);
        OosItems = ItemDataName.filter((x) => x.IsAvailable === 0);
        ItemDataName = ItemDataName.filter((x) => x.IsAvailable === 1);
        Total = UniqueMSLData.length;
        OOSCount = UniqueMSLData.length - ItemDataName.length;

        if (Type === "Segment") {
          this.CurrentSegmentName = Keys[index];
          this.CurrentBrandName = null;
          this.CurrentParentSKU = null;
        }

        if (Type === "Brand") {
          this.CurrentBrandName = Keys[index];
          this.CurrentParentSKU = null;
        }

        if (Type === "ParentSKU") {
          this.CurrentParentSKU = Keys[index];
        }

        BindingData.push({
          Catagory: Keys[index],
          TotalNoOfStore: this.TotalStore,
          TotalMSLData: UniqueMSLData,
          VisitedRetailer: this.GetUniqueStoreVisited(
            this.CurrentSegmentName,
            this.CurrentBrandName,
            this.CurrentParentSKU
          ),
          AvailableStore: ItemDataName.length,
          OOS: OosItems,
          OOSLength: OOSCount > 0 ? OOSCount : 0,
          AvailablePercentage:
            Total > 0 ? ((ItemDataName.length / Total) * 100).toFixed(2) : 0,
        });
        index++;
      }
    }
    return BindingData;
  }

  NextPage() {
    if (this.pageIndex + 1 <= this.TotalPageCount) {
      this.pageIndex = this.pageIndex + 1;
      this.LoadData();
    }
  }

  ExpandCollapseChild() {
    let $e = $(event.currentTarget)
      .closest("div")
      .find('div[name="content-table"]');

    if ($e !== null) {
      $e = $($e[ZerothIndex]);
      if ($(event.currentTarget).attr("name") === "plus-sign") {
        $(event.currentTarget).attr("name", "minus-sign");
      } else {
        $(event.currentTarget).attr("name", "plus-sign");
      }

      $($e[0]).toggleClass("d-none");
      $(event.currentTarget).find('i[name="plus"]').toggleClass("d-none");
      $(event.currentTarget).find('i[name="minus"]').toggleClass("d-none");
    }
  }

  ViewOOSDetail(parent: string, subparent: string, index: number) {
    let ItemData = null;
    if (parent !== "") {
      let Data = this.GridData.filter((x) => x.Catagory === parent);
      if (Data.length > 0) {
        ItemData = Data[ZerothIndex];
      }
    }

    if (subparent !== "") {
      let Data = ItemData.BrandItem.filter((x) => x.Catagory === subparent);
      if (Data.length > 0) {
        ItemData = Data[ZerothIndex];
      }
    }

    if (index != -1) {
      ItemData = ItemData.SKUItem[index];
    }

    this.OOSDetail = ItemData.OOS;
    this.IsshowOosData = true;
  }

  PreviousPage() {
    if (this.pageIndex > 1) {
      this.pageIndex = this.pageIndex - 1;
      this.LoadData();
    }
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
  toggleIcon(event: Event) {
    var imagevalue = (event.target as Element).getAttribute("src");
    if (imagevalue == "assets/images/view.png") {
      (event.target as Element).setAttribute("src", "assets/images/view1.png");
    } else if (imagevalue == "assets/images/view1.png") {
      (event.target as Element).setAttribute("src", "assets/images/view.png");
    }
  }

  ExportMe() {
    if (!ExportToExcel("avability-table", "avability")) {
      this.commonService.ShowToast(
        "Incorrect value passed to export to excel."
      );
    }
  }

  ClosepopUp() {
    this.IsshowOosData = false;
    this.OOSDetail = [];
  }

  LoadNextField() {
    let currentType = $(event.currentTarget).attr("name");
    if (IsValidType(currentType)) {
      let NextFieldValue = null;
      switch (currentType) {
        case M_Countries:
          NextFieldValue = this.local.GetMasterDataValues(
            M_Region,
            this.AdvanceSearch.Country
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_Region = NextFieldValue;
          }
          break;

        case M_Region:
          NextFieldValue = this.local.GetMasterDataValues(
            M_State,
            this.AdvanceSearch.Region
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_State = NextFieldValue;
          }

          this.MasterData.M_Supervisor = this.local.GetMasterDataValues(
            M_Supervisor,
            ""
          );
          break;

        case M_State:
          NextFieldValue = this.local.GetMasterDataValues(
            M_City,
            this.AdvanceSearch.State
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_City = NextFieldValue;
          }
          break;

        case M_City:
          NextFieldValue = this.local.GetMasterDataValues(
            M_Retailer,
            this.AdvanceSearch.City
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_Retailer = NextFieldValue;
          }

          NextFieldValue = this.local.GetChainOrCustomer(
            false,
            this.AdvanceSearch.City,
            ""
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_CustomerName = NextFieldValue;
          }
          break;

        case M_Supervisor:
          NextFieldValue = this.local.GetMasterDataValues(
            M_Merchandiser,
            this.AdvanceSearch.Supervisor
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_Merchandiser = NextFieldValue;
          }
          break;

        case M_ChainName:
          NextFieldValue = this.local.GetChainOrCustomer(
            false,
            this.AdvanceSearch.City,
            this.AdvanceSearch.ChainName
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_CustomerName = NextFieldValue;
          }
          break;

        case M_Merchandiser:
          break;
      }
    } else {
      this.commonService.ShowToast("Invalid selection.");
    }
  }
}

export class AvailabilityReportCategoryViewModel {
  CategoryCode: string;
  TotalNoOfStores: string;
  AvailabileIn: string;
  AvailabilityPercentage: string;
  lstAvailabilityReportBrandViewModel: Array<AvailabilityReportBrandViewModel>;
}

export class AvailabilityReportBrandViewModel {
  CategoryCode: string;
  BrandCode: string;
  TotalNoOfStores: string;
  AvailabileIn: string;
  AvailabilityPercentage: string;
  lstAvailabilityReportSKUViewModel: Array<AvailabilityReportSKUViewModel>;
}

export class AvailabilityReportSKUViewModel {
  CategoryCode: string;
  BrandCode: string;
  ItemCode: string;
  TotalNoOfStores: string;
  AvailabileIn: string;
  AvailabilityPercentage: string;
}

export class AdvanceFilterModal {
  Country: string = "";
  Region: string = "";
  SubChannel: string = "";
  CustomerCode: string = "";
  CustomerName: string = "";
  State: string = "";
  ChainName: string = "";
  City: string = "";
  Address: string = "";
  Beat: string = "";
  Supervisor: string = "";
  Marchandisor: string = "";
  PageIndex: number = 0;
  PageSize: number = 0;
  SortBy: string = "";
  SearchString: string = "";
}

export class MasterDataModal {
  M_Countries: Array<any> = [];
  M_State: Array<any> = [];
  M_Region: Array<any> = [];
  M_City: Array<any> = [];
  M_Merchandiser: Array<any> = [];
  M_Retailer: Array<any> = [];
  M_Supervisor: Array<any> = [];
  M_ChainName: Array<any> = [];
  M_CustomerName: Array<any> = [];
}
