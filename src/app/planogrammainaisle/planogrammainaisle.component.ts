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
import { JourneyPlan, Planogrammainaisle } from "../../providers/constants";
import { iNavigation } from "../../providers/iNavigation";
import { AjaxService } from "src/providers/ajax.service";

@Component({
  selector: "app-planogrammainaisle",
  templateUrl: "./planogrammainaisle.component.html",
  styleUrls: ["./planogrammainaisle.component.scss"]
})
export class PlanogrammainaisleComponent implements OnInit {
  entity: any = new PlanogrammainaisleModel();
  TableResultSet: Array<PlanogrammainaisleModel>;
  BindingHeader: Array<IGrid>;
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  TotalHeaders: number = 5;
  searchQuery: string = "";
  PlannogramImage: Array<File>;
  PlannogramImagePath: Array<any>;
  PlannogramExistingImagePath: Array<any>;
  TypeEnum: string = "BO";
  SubChannelRecord: Array<any>;
  SubChainRecord: Array<any>;
  SubLocationRecord: Array<any>;
  AdvanceFilterObject: FormGroup;
  OnEdit: boolean = false;
  OnCreate: boolean = false;
  ServerBasePath: string;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private nav: iNavigation,
    private http: AjaxService
  ) {
    let PageName = this.commonService.GetCurrentPageName();
    this.ServerBasePath = this.http.BaseUrl().replace("api/", "");
    this.ServerBasePath = this.ServerBasePath.replace(
      "MarsAuth",
      "MarsMerchandiserMobile"
    );
    this.HeaderName = "Planogram main aisle";
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
    let FilterQuery = {
      SearchString: "1=1",
      SortBy: "Name",
      Index: 1,
      Offset: 10
    };
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

    input.content.searchString = this.searchQuery;
    this.http
      .post("Webportal/FetchPlanogrammainaisles", input)
      .then(response => {
        this.TableResultSet = [];
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          if (Data != null && Data != "") {
            this.IsEmptyRow = false;
            let index = 0;
            while (index < Data.length) {
              this.TableResultSet.push({
                Gid: Data[index].Gid,
                Name: Data[index].Name,
                Description: Data[index].Description,
                SubChannel: Data[index].SubChannel,
                Chain: Data[index].Chain,
                Location: Data[index].Location,
                ImageFilePath:
                  this.ServerBasePath +
                  Data[index].RelativePathText +
                  "//" +
                  Data[index].Label +
                  "." +
                  Data[index].FileExtension
              });
              index++;
            }

            this.commonService.ShowToast("Data retrieve successfully.");
            this.SubChannelRecord = [];
            this.GetDropdownData("retailerSubChannel");
            this.SubChainRecord = [];
            this.GetDropdownData("retailerChainName");
            this.SubLocationRecord = [];
            this.GetDropdownData("locationTypeEnum");
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
      { column: "Name", displayheader: "Name", width: 10 },
      { column: "Description", displayheader: "Description", width: 10 },
      { column: "SubChannel", displayheader: "SubChannel", width: 10 },
      { column: "Chain", displayheader: "Chain", width: 10 },
      { column: "Location", displayheader: "Location", type: "hidden" },
      { column: "Gid", type: "hidden" }
    ];
    this.LoadData();
    this.LoadTableData();
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

  Close() {
    this.EnableFilter = false;
    this.OnCreate = false;
    this.OnEdit = false;
  }

  ResetFilter() {
    this.searchQuery = "";
    this.LoadData();
  }

  LoadTableData() {
    this.IsEmptyRow = false;
  }

  Open() {
    this.entity = new PlanogrammainaisleModel();
    this.entity.SubChannel = "";
    this.entity.Location = "";
    this.entity.Chain = "";
    this.EnableFilter = true;
  }

  Edit(editEntity: any) {
    this.Open();
    this.OnEdit = !this.OnEdit;
    this.PlannogramExistingImagePath = [];
    this.PlannogramExistingImagePath.push(editEntity.ImageFilePath);
    this.entity = editEntity;
  }

  ChooseFile() {
    event.preventDefault();
    event.stopPropagation();
    $("#BrowseFile").click();
  }

  GetFile(fileInput: any) {
    this.OnCreate = true;
    this.PlannogramImage = [];
    this.PlannogramImagePath = [];
    let Files = fileInput.target.files;
    if (Files.length > 0) {
      let index = 0;
      while (index < Files.length) {
        this.PlannogramImage.push(<File>Files[index]);
        let reader = new FileReader();
        reader.readAsDataURL(this.PlannogramImage[index]);
        reader.onload = fileEvent => {
          this.PlannogramImagePath.push(reader.result);
        };
        // let mimeType: any = <File>Files[index].type;
        // if (mimeType.match(/image\/*/) == null) {
        //   this.commonService.ShowToast("Only images are supported.");
        //   return;
        // }
        index++;
      }
    } else {
      this.commonService.ShowToast("No file selected");
    }
  }

  Save() {
    if (IsValidType(this.entity)) {
      let formData = new FormData();
      let index = 0;
      if (IsValidType(this.PlannogramImage)) {
        while (index < this.PlannogramImage.length) {
          formData.append("image_" + index, this.PlannogramImage[index]);
          index++;
        }
      }

      formData.append("planogramNewData", JSON.stringify(this.entity));
      this.Close();
      this.http.upload("Webportal/SavePlanogrammainaisle", formData).then(
        response => {
          if (this.commonService.IsValidResponse(response)) {
            this.commonService.ShowToast("Office details saved successfully.");

            let Data = response.content.data;
            if (Data != null && Data != "") {
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
        },
        error => {
          this.commonService.ShowToast(
            "Server error. Please contact to admin."
          );
        }
      );
    }
  }

  Remove(editEntity: any) {
    if (!confirm("Do you want remove this record?")) {
      return;
    }
    this.entity = editEntity;

    this.Close();
    this.http
      .post("Webportal/RemovePlanogrammainaisle", JSON.stringify(this.entity))
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

  FilterLocaldata() {
    console.log(this.searchQuery);
    this.LoadData();
  }
}

export class PlanogrammainaisleModel {
  Gid: string;
  Name: string;
  Description: string;
  SubChannel: string;
  Chain: string;
  Location: string;
  ImageFilePath: string;
}
