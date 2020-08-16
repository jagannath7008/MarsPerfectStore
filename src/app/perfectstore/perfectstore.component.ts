import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import { AjaxService } from "src/providers/ajax.service";
import {
  MasterDataModal,
  AdvanceFilterModal,
} from "../availabilityreport/availabilityreport.component";
import { PostParam, M_Region, M_ChainName } from "src/providers/constants";

@Component({
  selector: "app-perfectstore",
  templateUrl: "./perfectstore.component.html",
  styleUrls: ["./perfectstore.component.sass"],
})
export class PerfectstoreComponent implements OnInit {
  IsEmptyRow: boolean = false;
  HeaderName: string = "";
  MasterData: MasterDataModal;
  searchQuery: string = " 1=1 ";
  AdvanceSearch: AdvanceFilterModal;
  constructor(
    private commonService: CommonService,
    private http: AjaxService,
    private local: ApplicationStorage
  ) {
    this.MasterData = new MasterDataModal();
    let PageName = this.commonService.GetCurrentPageName();
    this.HeaderName = "Perfect Score";
    this.ResetAdvanceFilter();
  }
  ActiveRow: boolean[] = [];
  ActiveRowGC: boolean[] = [];
  icon: string = "assets/images/view.png";

  ResetAdvanceFilter() {
    this.AdvanceSearch = new AdvanceFilterModal();
  }
  ngOnInit() {
    //this.LoadData();
    this.IsEmptyRow = true;
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

  LoadData() {
    let MSData = JSON.parse(PostParam);
    this.http
      .post(
        "Webportal/FetchAvailabilityReport",
        JSON.stringify(this.AdvanceSearch)
      )
      .then((response) => {
        if (this.commonService.IsValidResponse(response)) {
          this.IsEmptyRow = false;
          this.commonService.ShowToast("Data retrieve successfully.");
        } else {
          this.commonService.ShowToast("Unable to get data.");
        }
      });
  }
}
