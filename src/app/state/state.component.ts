import { Component, OnInit } from "@angular/core";
import { IGrid } from "../../providers/Generic/Interface/IGrid";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { CommonService } from "../../providers/common-service/common.service";
import * as $ from "jquery";
import { JourneyPlan, State } from "../../providers/constants";
import { iNavigation } from "../../providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";

@Component({
  selector: "app-state",
  templateUrl: "./state.component.html",
  styleUrls: ["./state.component.scss"]
})
export class StateComponent implements OnInit {
  entity: any = new StateModel();
  parentCollection: Array<StateModel>;
  TableResultSet: Array<StateModel>;
  BindingHeader: Array<IGrid>;
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  TotalHeaders: number = 5;
  searchQuery: string = "";
  TypeEnum: string = "STA";
  AdvanceFilterObject: FormGroup;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService
  ) {
    let PageName = this.commonService.GetCurrentPageName();
      this.HeaderName = "State";
    
  }

  LoadData() {
    
    let input : any = {
      "meta" : {
                "app" : "MerchandiserApp",
                "action" : "WebLogin",
                "requestId" : "0",
                "deviceId" : "web"
      },
      "content" : {
                  "deviceId" : "web",
                  "deviceType" : "web",
                  "deviceOS":"Windows",
                  "deviceVersion" : "web",
                  "deviceInfo" : "web"
      }
    };
input.content.searchString = this.searchQuery;
input.content.locType = this.TypeEnum;
    this.http.post("Webportal/FetchLocations", input).then(response => {
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

  BindParent()
  {
    let input : any = {
      "meta" : {
                "app" : "MerchandiserApp",
                "action" : "WebLogin",
                "requestId" : "0",
                "deviceId" : "web"
      },
      "content" : {
                  "deviceId" : "web",
                  "deviceType" : "web",
                  "deviceOS":"Windows",
                  "deviceVersion" : "web",
                  "deviceInfo" : "web"
      }
    };
input.content.searchString = "";
input.content.locType = "REG";
    this.http.post("Webportal/FetchLocations", input).then(response => {
      this.TableResultSet = [];
      if (this.commonService.IsValidResponse(response)) {
        let Data = response.content.data;
        if (Data != null && Data != "") {
          this.parentCollection = Data;
        } 
      } 
    });
  }

  ngOnInit() {
    this.BindingHeader = [
      { column: "Name", displayheader: "State Name", width: 10 },
      { column: "ParentName", displayheader: "Region Name", width: 10 },
      { column: "ParentGid", type: "hidden" },
      { column: "Gid", type: "hidden" }
    ];

    this.BindParent();
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

  Open()
  {
    this.entity = new StateModel();
    this.entity.TypeEnum = this.TypeEnum;
    this.entity.ParentGid = "";
    this.EnableFilter = true;
  }
  Edit(editEntity: any)
  {
    this.Open();
    this.entity = editEntity;
  }
  Save()
  {
    console.log(this.entity);
    this.http.post("Webportal/SaveLocation", JSON.stringify(this.entity)).then(response => {
      if (this.commonService.IsValidResponse(response)) {
        this.commonService.ShowToast("State details saved successfully.");
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

  Remove(editEntity: any)
  {
    if(!confirm("Do you want remove this record?"))
    {
      return;
    }
    this.entity = editEntity;
    this.http.post("Webportal/RemoveLocation", JSON.stringify(this.entity)).then(response => {
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

export class StateModel {
  Gid: string;
  Code: string;
  Name: string;
  TypeEnum: string;
  ParentGid: string;
  ParentName: string;
}
