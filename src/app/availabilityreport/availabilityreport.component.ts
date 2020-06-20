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
  pageIndex: number = 1;
  IsshowOosData: boolean = false;
  GridData: any;
  TotalCount: number = 0;
  MasterData: MasterDataModal;
  TotalPageCount: number = 0;
  AdvanceSearch: AdvanceFilterModal;
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
          let CurrentBrandItem = null;
          let CurrentSKUItem = null;
          if (Data != null && Data != "") {
            let ServerData = JSON.parse(response.content.data);
            if (IsValidType(ServerData)) {
              let AvailableGridData = ServerData.Table;
              let AvailableItemData = null;
              if (IsValidType(AvailableGridData)) {
                let SegmentItems = this.FilterGroupBy(
                  AvailableGridData,
                  "segmentName"
                );

                AvailableItemData = this.GenerateBindData(SegmentItems);
                if (AvailableItemData.length > 0) {
                  this.GridData = AvailableItemData;
                }

                if (IsValidType(SegmentItems)) {
                  let SubCatagoryItems = null;
                  let Keys = Object.keys(SegmentItems);
                  let index = 0;
                  while (index < Keys.length) {
                    let SubCatagoryItems = null;
                    SubCatagoryItems = SegmentItems[Keys[index]];
                    let BrandItems = this.FilterGroupBy(
                      SubCatagoryItems,
                      "BrandName"
                    );

                    CurrentBrandItem = null;
                    AvailableItemData = this.GenerateBindData(BrandItems);
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
                        let ParentSKUItems = this.FilterGroupBy(
                          SubCatagoryItems,
                          "ParentSKU"
                        );
                        AvailableItemData = this.GenerateBindData(
                          ParentSKUItems
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

  GenerateBindData(Data: any) {
    let BindingData = [];
    if (IsValidType(Data)) {
      let Keys = Object.keys(Data);
      let index = 0;
      let Total = 0;
      let ItemDataName = null;
      let OosItems = [];
      while (index < Keys.length) {
        ItemDataName = Data[Keys[index]];
        OosItems = ItemDataName.filter((x) => x.IsAvailable === 0);
        Total = ItemDataName.length;
        BindingData.push({
          Catagory: Keys[index],
          TotalNoOfStore: Total,
          AvailableStore: Total - OosItems.length,
          OOS: OosItems,
          OOSLength: OosItems.length,
          AvailablePercentage: (
            ((Total - OosItems.length) / Total) *
            100
          ).toFixed(2),
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
      if ($e.length > 0) {
        $($e[0]).toggleClass("d-none");
      }
    }
  }

  FilterGroupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  ViewOOSDetail() {
    let catagory = $(event.currentTarget).attr("Catagory");
    if (IsValidType(catagory)) {
      this.OOSDetail = this.GridData.filter((x) => x.Catagory === catagory);
      if (this.OOSDetail.length > 0) {
        this.OOSDetail = this.OOSDetail[0].availabilityReports;
      }
      this.IsshowOosData = true;
    }
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
}
