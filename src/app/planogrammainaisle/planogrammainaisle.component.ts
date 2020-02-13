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
import {
  JourneyPlan,
  Planogrammainaisle,
  PostParam
} from "../../providers/constants";
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
  ServerResult: Array<PlanogrammainaisleModel>;
  BindingHeader: Array<IGrid>;
  IsEmptyRow: boolean = true;
  HeaderName: string = "Page Name";
  EnableFilter: boolean = false;
  TotalHeaders: number = 5;
  PlannogramImage: File;
  PlannogramImagePath: Array<any> = [];
  PlannogramExistingImagePath: Array<any>;
  TypeEnum: string = "BO";
  SubChannelRecord: Array<any>;
  SubChainRecord: Array<any>;
  SubLocationRecord: Array<any>;
  AdvanceFilterObject: FormGroup;
  ServerBasePath: string;
  searchQuery: string = " 1=1 ";
  sortBy: string = "";
  pageIndex: number = 1;
  pageSize: number = 15;
  TotalCount: number = 0;
  TotalPageCount: number = 0;
  ImagePopup: boolean = false;
  CurrentGid: string = "";
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
      let FilteColumns = ["j.Name", "j.Description", "j.SubChannel", "j.Chain"];
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

  LoadData() {
    let MSData = JSON.parse(PostParam);
    MSData.content.searchString = this.searchQuery;
    MSData.content.sortBy = this.sortBy;
    MSData.content.pageIndex = this.pageIndex;
    MSData.content.pageSize = this.pageSize;

    this.http
      .post("Webportal/FetchPlanogrammainaisles", MSData)
      .then(response => {
        this.TableResultSet = [];
        if (this.commonService.IsValidResponse(response)) {
          let Data = JSON.parse(response.content.data);
          if (IsValidType(Data["Record"]) && IsValidType(Data["Count"])) {
            this.IsEmptyRow = false;
            let Record = Data["Record"];
            this.TotalCount = Data["Count"][0].Total;
            this.TotalPageCount = this.TotalCount / this.pageSize;
            if (this.TotalCount % this.pageSize > 0) {
              this.TotalPageCount = parseInt(
                (this.TotalPageCount + 1).toString()
              );
            }
            this.ServerResult = Record;
            let index = 0;
            while (index < Record.length) {
              if (
                this.TableResultSet.filter(x => x.Gid === Record[index].Gid)
                  .length === 0
              ) {
                this.TableResultSet.push(Record[index]);
              }
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
    this.ImagePopup = false;
    this.PlannogramImagePath = [];
  }

  ResetFilter() {
    this.searchQuery = " 1=1 ";
    $("#ShopFilter").val("");
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

  RemoveImage(aFileGid: string) {
    if (IsValidType(aFileGid)) {
      let MSData = JSON.parse(PostParam);
      MSData.content.aFileGid = aFileGid;

      this.http.upload("Webportal/RemovePlanogrammainaislesAfile", MSData).then(
        response => {
          if (this.commonService.IsValidResponse(response)) {
            if (response.content.data === "Removed successfully.") {
              this.ServerResult = this.ServerResult.filter(
                x => x.AFileGid !== aFileGid
              );
              this.BuildImagePaths();
              this.commonService.ShowToast("Image remove successfully.");
            } else {
              this.commonService.ShowToast("Unable to remove image.");
            }
          } else {
            this.commonService.ShowToast("Unable to remove image.");
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

  BuildImagePaths() {
    let AfileResult = this.ServerResult.filter(x => x.Gid === this.CurrentGid);
    if (AfileResult.length > 0) {
      this.PlannogramExistingImagePath = [];
      AfileResult.forEach(item => {
        this.PlannogramExistingImagePath.push({
          url: `${this.ServerBasePath}\\${item.RelativePathText}\\${item.Label}.${item.FileExtension}`,
          gid: item.AFileGid
        });
      });
    }
  }

  UploadImage(editEntity: any) {
    this.entity = new PlanogrammainaisleModel();
    this.entity.SubChannel = "";
    this.entity.Location = "";
    this.entity.Chain = "";
    this.CurrentGid = editEntity.Gid;
    this.BuildImagePaths();
    this.ImagePopup = true;
    this.entity = editEntity;
  }

  Edit(editEntity: any) {
    this.Open();
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
    let Files = fileInput.target.files;
    this.PlannogramImage = null;
    if (Files.length > 0) {
      let index = 0;
      while (index < Files.length) {
        this.PlannogramImage = <File>Files[index];
        let reader = new FileReader();
        reader.readAsDataURL(this.PlannogramImage);
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

      if (this.ImagePopup) {
        this.UploadAndSaveImage();
      }
    } else {
      this.commonService.ShowToast("No file selected");
    }
  }

  UploadAndSaveImage() {
    if (IsValidType(this.entity)) {
      let formData = new FormData();
      if (this.PlannogramImage !== null) {
        formData.append("image", this.PlannogramImage);
        formData.append("planogramNewData", JSON.stringify(this.entity));
        this.http
          .upload("Webportal/UpdatePlanogrammainaisleImages", formData)
          .then(
            response => {
              if (this.commonService.IsValidResponse(response)) {
                let Data = JSON.parse(response.content.data);
                if (IsValidType(Data["Afile"])) {
                  Data = Data["Afile"];
                  let OtherFiles = this.ServerResult.filter(
                    x => x.Gid !== this.entity.Gid
                  );
                  this.ServerResult = OtherFiles.concat(Data);
                  this.BuildImagePaths();
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
  }

  Save() {
    if (IsValidType(this.entity)) {
      let formData = new FormData();
      formData.append("planogramNewData", JSON.stringify(this.entity));
      this.Close();
      this.http.upload("Webportal/SavePlanogrammainaisle", formData).then(
        response => {
          if (this.commonService.IsValidResponse(response)) {
            this.commonService.ShowToast("Office details saved successfully.");
            let Data = JSON.parse(response.content.data);
            if (IsValidType(Data["Record"]) && IsValidType(Data["Count"])) {
              this.TableResultSet = [];
              this.IsEmptyRow = false;
              let Record = Data["Record"];
              this.pageIndex = 1;
              this.TotalCount = Data["Count"][0].Total;
              this.TotalPageCount = this.TotalCount / this.pageSize;
              if (this.TotalCount % this.pageSize > 0) {
                this.TotalPageCount = parseInt(
                  (this.TotalPageCount + 1).toString()
                );
              }
              this.ServerResult = Record;
              let index = 0;
              while (index < Record.length) {
                if (
                  this.TableResultSet.filter(x => x.Gid === Record[index].Gid)
                    .length === 0
                ) {
                  this.TableResultSet.push(Record[index]);
                }
                index++;
              }
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
}

export class PlanogrammainaisleModel {
  Gid: string;
  Name: string;
  Description: string;
  SubChannel: string;
  Chain: string;
  Location: string;
  ImageFilePath: string;
  RelativePathText: string;
  FileExtension: string;
  Label: string;
  AFileGid: string;
}
