import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import {
  CommonService,
  IsValidType
} from "./../../providers/common-service/common.service";
import * as $ from "jquery";
import { AjaxService } from "src/providers/ajax.service";
import { iNavigation } from "src/providers/iNavigation";
import { ZerothIndex } from "./../../providers/constants";

@Component({
  selector: "app-retailer-detail",
  templateUrl: "./retailer-detail.component.html",
  styleUrls: ["./retailer-detail.component.scss"]
})
export class RetailerDetailComponent implements OnInit {
  Row: Array<FormGroup> = [];
  RetailerContactsGrid: Array<ContactViewModel>;
  NewContactDetail: FormGroup;
  RetailerDetail: RetailerViewModel;
  RetailerDetailAddress: Array<RetailerAddressDetail>;
  RetailerMerchandisingPlan: Array<RetailerMershandisingPlanModal>;
  RetailerMainasles: Array<RetailerMainasleModal>;
  CurrentSection: any = {};
  TzGid: string;
  ActiveSection: string = "";
  CompetitionGrid: Array<string>;
  RetailerSecoundryVisibility: Array<RetailerSecoundryVisibilityModal>;
  SecoundryVisibility: Array<ISecoundryVisibility>;
  MerchandiserPlan: Array<IMerchandiserPlan>;
  CurrentPageData: any = null;
  PlanogrammainaisleModal: Array<PlanogrammainaisleViewModal>;
  RetailerCompetition: Array<RetailerCompetitionModal>;
  SkuPortfolio: Array<SkuportfolioViewModel>;
  PlanogramdVisibilityModal: Array<PlanogramSecondryVisibilityModal>;
  Competition: Array<any>;
  DdsecondaryvisibilityImage: string = "";
  IsPageReady: boolean = false;
  visibilityEntity: RetailerSecoundryVisibilityModal;
  ServerUrl: string = "";
  visibilitymodal: boolean = false;
  NewCompetition: string = "";
  SelectedPlanogramImageUrl: string = "";
  OptionsPlanogramImpagePath: string = "";
  OptionsTransactionZonePlanogramImpagePath: string = "";
  TransactionZonePlanogram: Array<TransactionZonePlanogramModal>;
  CurrentPlanogramGid: string = "";
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private http: AjaxService,
    private nav: iNavigation
  ) {
    this.ActiveSection = "Detail";
    this.CurrentSection = [
      { Name: "Detail", IsEnabled: true },
      { Name: "Address", IsEnabled: false },
      { Name: "Contacts", IsEnabled: false },
      { Name: "Mainaisle", IsEnabled: false },
      { Name: "Secondary Visibility", IsEnabled: false },
      { Name: "Transaction Zone", IsEnabled: false },
      { Name: "Competition", IsEnabled: false },
      { Name: "SKUPorfolio", IsEnabled: false },
      { Name: "Merchandiser Plan", IsEnabled: false }
    ];
  }

  ngOnInit() {
    this.ServerUrl = this.http.GetImageBaseUrl();
    let PageData = this.nav.getValue();
    if (PageData !== null) {
      this.CurrentPageData = PageData;
      // this.InitGridForm();
      this.InitCompletition();
      this.LoadData();
    } else {
      this.commonService.ShowToast("Server error. Please contact to admin.");
    }
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

    input.content.Gid = this.CurrentPageData.Gid;
    this.http.post("Webportal/FetchCustomerDetail", input).then(response => {
      if (this.commonService.IsValidResponse(response)) {
        let Data = response.content.data;
        if (Data != null && Data != "") {
          if (IsValidType(Data["retailerViewModel"])) {
            this.RetailerDetail = Data["retailerViewModel"][ZerothIndex];
          }

          if (IsValidType(Data["contactViewModels"])) {
            this.RetailerContactsGrid = Data["contactViewModels"];
          }

          if (IsValidType(Data["retailerAddressDetail"])) {
            this.RetailerDetailAddress =
              Data["retailerAddressDetail"][ZerothIndex];
          }

          if (IsValidType(Data["secoundryVisibility"])) {
            this.RetailerSecoundryVisibility = Data["secoundryVisibility"];
          }

          if (IsValidType(Data["retailerMainasles"])) {
            this.RetailerMainasles = Data["retailerMainasles"];
            if (this.RetailerMainasles.length > 0) {
              let CurrentPlanogramItem: any = this.RetailerMainasles[0];
              this.OptionsPlanogramImpagePath =
                this.ServerUrl +
                CurrentPlanogramItem.RelativePathText +
                "\\" +
                CurrentPlanogramItem.Label +
                "." +
                CurrentPlanogramItem.FileExtension;
            }
          }

          if (IsValidType(Data["retailerMerchandisingPlan"])) {
            this.RetailerMerchandisingPlan = Data["retailerMerchandisingPlan"];
          }

          this.PlanogrammainaisleModal = [];
          if (IsValidType(Data["planogrammainaisleViewModels"])) {
            this.PlanogrammainaisleModal = Data["planogrammainaisleViewModels"];
          }

          this.RetailerCompetition = [];
          if (IsValidType(Data["retailerCompetition"])) {
            this.RetailerCompetition = Data["retailerCompetition"];
          }

          this.Competition = [];
          if (IsValidType(Data["competition"])) {
            this.Competition = Data["competition"];
          }

          this.SkuPortfolio = [];
          if (IsValidType(Data["skuportfolio"])) {
            this.SkuPortfolio = Data["skuportfolio"];
          }

          this.PlanogramdVisibilityModal = [];
          if (IsValidType(Data["planogramsecondaryvisibilityViewModel"])) {
            this.PlanogramdVisibilityModal =
              Data["planogramsecondaryvisibilityViewModel"];
          }

          this.TransactionZonePlanogram = [];
          if (IsValidType(Data["transactionzoneplanogram"])) {
            this.TransactionZonePlanogram = Data["transactionzoneplanogram"];
          }

          this.IsPageReady = true;
          this.commonService.ShowToast("Data loaded successfully.");
        } else {
          this.commonService.ShowToast("Got empty dataset.");
        }
      } else {
        this.commonService.ShowToast("Unable to get data.");
      }
    });
  }

  VisibilitySave() {
    if (IsValidType(this.visibilityEntity)) {
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

      if (IsValidType(this.visibilityEntity.PlanogramGid)) {
        this.visibilityEntity.PlanogramGid = $(
          "#planogramsecondaryvisibility"
        ).val();
      }

      this.visibilitymodal = false;
      this.http
        .post(
          "Webportal/UpdatePlanogramsecondaryvisibilitys",
          JSON.stringify(this.visibilityEntity)
        )
        .then(response => {
          if (this.commonService.IsValidResponse(response)) {
            let Data = response.content.data;
            if (IsValidType(Data)) {
              this.RetailerSecoundryVisibility = Data;
              this.commonService.ShowToast("Data loaded successfully.");
            } else {
              this.commonService.ShowToast("Got empty dataset.");
            }
          } else {
            this.commonService.ShowToast("Unable to get data.");
          }
        });
    }
  }

  AddtoRetailerMainAisle() {
    let planogrammodal = $(event.currentTarget)
      .closest('div[name="planogrammainaisle"]')
      .find("select");
    let CurrentRetailerMainAisle = $("#plnogramdd").val();
    if (planogrammodal !== null && IsValidType(CurrentRetailerMainAisle)) {
      let planogrammainaisleGid = planogrammodal.val();
      if (IsValidType(planogrammainaisleGid)) {
        let input: any = {
          meta: {
            app: "MerchandiserApp",
            action: "UpdatePlanogrammainaisle",
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

        input.content.planogramGid = planogrammainaisleGid;
        input.content.retailermainaisleGid = this.RetailerMainasles[0].Gid;
        this.http
          .post("Webportal/UpdatePlanogrammainaisle", input)
          .then(response => {
            if (this.commonService.IsValidResponse(response)) {
              let Data = response.content.data;
              if (IsValidType(Data)) {
                this.RetailerMainasles = Data;
                this.commonService.ShowToast("Data loaded successfully.");
              } else {
                this.commonService.ShowToast("Got empty dataset.");
              }
            } else {
              this.commonService.ShowToast("Unable to get data.");
            }
          });
      }
    }
  }

  InitCompletition() {
    this.CompetitionGrid = ["AAAA", "BBBB", "CCCC", "DDDD", "EEEE"];
  }

  // GetBindingData() {
  //   this.RetailerDetail = {
  //     Code: "23752032",
  //     Status: "Approved",
  //     Name: "Phanny",
  //     RetailerClass: "A",
  //     Type: "RTCode3",
  //     GSTNo: "34",
  //     PAN: "",
  //     AdharNo: ""
  //   };

  //   this.RetailerDetailAddress = {
  //     AddressLine1: "Addr 1",
  //     AddressLine2: "Addr 2",
  //     AddressLine3: "Addr 3",
  //     Landmark: "Hitech city",
  //     City: "Hyderabad",
  //     PinCode: "500004",
  //     State: "Telangana",
  //     Region: "Hyderabad",
  //     Country: "India",
  //     Phone: "9998987876",
  //     Email: "adsa@gm.com",
  //     Fax: "8994759347",
  //     Longitude: "47.98723542",
  //     Latitude: "78.893748923"
  //   };
  // }

  InitGridForm() {
    this.NewContactDetail = this.fb.group({
      Name: new FormControl(""),
      Gender: new FormControl(""),
      Mobile: new FormControl(""),
      SecondryPhase: new FormControl(""),
      WhatsPhase: new FormControl(""),
      Email: new FormControl(""),
      Designation: new FormControl(""),
      Dob: new FormControl(""),
      Anniversorydate: new FormControl("")
    });
  }

  // GetGridData(): Array<ContactViewModel> {
  //   return [
  //     {
  //       Name: "Phanny",
  //       Designation: "Manager",
  //       Mobile: "9989876765",
  //       WhatsAppMobile: "9898787676",
  //       BirthDate: "10/10/2019",
  //       AnniversaryDate: "11/11/2000"
  //     },
  //     {
  //       Name: "Phanny",
  //       Designation: "Manager",
  //       Mobile: "9989876765",
  //       WhatsAppMobile: "9898787676",
  //       BirthDate: "10/10/2019",
  //       AnniversaryDate: "11/11/2000"
  //     }
  //   ];
  // }

  AddRow(RowData: ContactViewModel): FormGroup {
    return this.fb.group({
      Name: new FormControl(RowData.Name),
      Designation: new FormControl(RowData.Designation),
      Mobile: new FormControl(RowData.Mobile),
      WhatsAppMobile: new FormControl(RowData.WhatsAppPhone),
      BirthDate: new FormControl(RowData.BirthDate),
      AnniversaryDate: new FormControl("")
    });
  }

  FillInitialRows(Data: Array<ContactViewModel>) {
    let index = 0;
    if (this.commonService.IsValid(Data)) {
      while (index < Data.length) {
        this.Row.push(this.AddRow(Data[index]));
        index++;
      }
    }
  }

  AddNewRow() {
    let NewData: Array<ContactViewModel> = [];
    this.FillInitialRows(NewData);
  }

  LoadMainaisleData() {}

  LoadSecoundryVisibilityData() {
    this.SecoundryVisibility = [
      {
        Type: "Type 1",
        Size: "Normal",
        UniqueId: "adndgsa89-asdfn-sakfj-asodif-asdfhaslk",
        Image: "No image"
      },
      {
        Type: "Type 2",
        Size: "Average",
        UniqueId: "adndgsa89-asdfn-sakfj-asodif-asdfhaslk",
        Image: "No image"
      },
      {
        Type: "Type 3",
        Size: "Big",
        UniqueId: "adndgsa89-asdfn-sakfj-asodif-asdfhaslk",
        Image: "No image"
      },
      {
        Type: "Type 4",
        Size: "Huge",
        UniqueId: "adndgsa89-asdfn-sakfj-asodif-asdfhaslk",
        Image: "No image"
      }
    ];
  }

  LoadMerchandiserPlanData() {
    this.MerchandiserPlan = [
      {
        Supervisor: "Supervisor 1",
        Merchandiser: "Merchandiser data",
        Beat: "AB",
        Mon: "1",
        Tue: "2",
        Wed: "3",
        Thu: "4",
        Fri: "5",
        Sat: "6",
        Sun: "7"
      },
      {
        Supervisor: "Supervisor 1",
        Merchandiser: "Merchandiser data",
        Beat: "AB",
        Mon: "1",
        Tue: "2",
        Wed: "3",
        Thu: "4",
        Fri: "5",
        Sat: "6",
        Sun: "7"
      },
      {
        Supervisor: "Supervisor 1",
        Merchandiser: "Merchandiser data",
        Beat: "AB",
        Mon: "1",
        Tue: "2",
        Wed: "3",
        Thu: "4",
        Fri: "5",
        Sat: "6",
        Sun: "7"
      }
    ];
  }

  ManageDectionDetail(LinkName: string) {
    let index = 0;
    $(event.currentTarget)
      .closest("ul")
      .find('li[name="linkitem"]')
      .removeClass("active-link");

    $(event.currentTarget)
      .closest("li")
      .addClass("active-link");
    while (index < this.CurrentSection.length) {
      if (this.CurrentSection[index].Name === LinkName) {
        this.CurrentSection[index].IsEnabled = true;
        this.ActiveSection = LinkName.replace(/ /g, "");
        switch (LinkName) {
          case "Detail":
            break;
          case "Address":
            break;
          case "Contacts":
            break;
          case "Mainaisle":
            this.LoadMainaisleData();
            break;
          case "Secoundry Vsibility":
            this.LoadSecoundryVisibilityData();
            break;
          case "Transactional Zone":
            break;
          case "Competition":
            break;
          case "SKUPorfolio":
            break;
          case "MSL SKU":
            break;
          case "Marchands Plan":
            this.LoadMerchandiserPlanData();
            break;
        }
        setTimeout(() => {
          $("#id_" + LinkName.replace(/ /g, "")).addClass("enable-slowly");
        }, 50);
      } else this.CurrentSection[index].IsEnabled = false;
      index++;
    }
  }

  AddNewCompetition() {
    let CompetitionGid = $("#retailer-competition").val();
    if (IsValidType(CompetitionGid)) {
      let CurrentCompetition = this.Competition.filter(
        x => x.Gid == CompetitionGid
      );
      if (CurrentCompetition.length > 0) {
        CurrentCompetition = CurrentCompetition[ZerothIndex];
        CurrentCompetition["RetailerGid"] = this.CurrentPageData.Gid;
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

        this.http
          .post(
            "Webportal/AddUpdateCompetition",
            JSON.stringify(CurrentCompetition)
          )
          .then(response => {
            if (this.commonService.IsValidResponse(response)) {
              let Data = response.content.data;
              if (Data != null && Data != "") {
                this.RetailerCompetition = Data;
                this.commonService.ShowToast("Data loaded successfully.");
              } else {
                this.commonService.ShowToast("Got empty dataset.");
              }
            } else {
              this.commonService.ShowToast("Unable to get data.");
            }
          });
      }
    }
  }

  EditSecondryVisibility(entity: any) {
    this.visibilitymodal = !this.visibilitymodal;
    this.visibilityEntity = entity;
    this.DdsecondaryvisibilityImage =
      this.ServerUrl +
      entity.RelativePathText +
      "\\" +
      entity.Label +
      "." +
      entity.FileExtension;
  }

  CloseVisibilityModal() {
    this.visibilitymodal = !this.visibilitymodal;
  }

  AddNewContact() {
    if (this.NewContactDetail.valid) {
      let ErrorField = [];
      let NewData: ContactViewModel = {
        LinkType: "",
        LinkGid: "",
        Name: "",
        GenderEnum: "",
        Mobile: "",
        CountryGid: "",
        LoginId: "",
        Status: 0,
        EmpNo: "",
        JoinDate: "",
        ExitDate: "",
        BirthDate: "",
        EncryptedPassword: "",
        PrimaryPhone: "",
        SecondaryPhone: "",
        WhatsAppPhone: "",
        Email: "",
        Designation: "",
        Department: "",
        Gid: "",
        JobGid: "",
        Code: "",
        WebPortalRole: "",
        MobileAppRole: "",
        ReportingToJobId: ""
      };

      if (this.NewContactDetail.get("Anniversorydate").value !== "") {
      } else {
        //ErrorField.push("Anniversorydate");
      }

      if (this.NewContactDetail.get("Designation").value !== "") {
        NewData["Designation"] = this.NewContactDetail.get("Designation").value;
      } else {
        ErrorField.push("Designation");
      }

      if (this.NewContactDetail.get("Dob").value !== "") {
      } else {
        //ErrorField.push("Dob");
      }

      if (this.NewContactDetail.get("Email").value !== "") {
        NewData["Email"] = this.NewContactDetail.get("Email").value;
      } else {
        ErrorField.push("Email");
      }

      if (this.NewContactDetail.get("Gender").value !== "") {
      } else {
        //ErrorField.push("Gender");
      }

      if (this.NewContactDetail.get("Mobile").value !== "") {
        NewData["Phone"] = this.NewContactDetail.get("Mobile").value;
      } else {
        ErrorField.push("Mobile");
      }

      if (this.NewContactDetail.get("Name").value !== "") {
        NewData["Name"] = this.NewContactDetail.get("Name").value;
      } else {
        ErrorField.push("Name");
      }

      if (this.NewContactDetail.get("SecondryPhase").value !== "") {
      } else {
        //ErrorField.push("SecondryPhase");
      }

      if (this.NewContactDetail.get("WhatsPhase").value !== "") {
      } else {
        //ErrorField.push("WhatsPhase");
      }

      if (ErrorField.length === 0) {
        this.FillInitialRows([NewData]);
        $("#newcontact").modal("hide");
      } else {
        let index = 0;
        while (index < ErrorField.length) {
          $("#" + ErrorField[index]).addClass("error-filed");
          index++;
        }
      }
    }
  }

  GetCurrentPlanogram(value: any) {
    let CurrentPlanogramGid = $(event.currentTarget).val();
    if (IsValidType(CurrentPlanogramGid)) {
      let PlanogramRecord = this.PlanogrammainaisleModal.filter(
        x => x.Gid === CurrentPlanogramGid
      );
      if (PlanogramRecord.length > 0) {
        let CurrentPlanogramItem: any = PlanogramRecord[0];
        this.OptionsPlanogramImpagePath =
          this.ServerUrl +
          CurrentPlanogramItem.RelativePathText +
          "\\" +
          CurrentPlanogramItem.Label +
          "." +
          CurrentPlanogramItem.FileExtension;
      }
    }
  }

  ShowImage() {
    let ImageGid = $(event.currentTarget).val();
    let CurrentObject = this.PlanogramdVisibilityModal.filter(
      x => x.Gid === ImageGid
    );
    if (CurrentObject.length) {
      let Current: any = CurrentObject[0];
      this.DdsecondaryvisibilityImage =
        this.ServerUrl +
        Current.RelativePathText +
        "\\" +
        Current.Label +
        "." +
        Current.FileExtension;
    }
  }

  UpdateTransactionZonePlanogram() {
    if (IsValidType(this.TzGid)) {
      let input: any = {
        meta: {
          app: "MerchandiserApp",
          action: "UpdatePlanogrammainaisle",
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

      input.content.planogramGid = this.TzGid;
      input.content.retailerGid = this.RetailerDetail.Gid;
      this.http
        .post("Webportal/UpdatePlanogrammainaisle", input)
        .then(response => {
          if (this.commonService.IsValidResponse(response)) {
            let Data = response.content.data;
            if (IsValidType(Data)) {
              this.RetailerMainasles = Data;
              this.commonService.ShowToast("Data loaded successfully.");
            } else {
              this.commonService.ShowToast("Got empty dataset.");
            }
          } else {
            this.commonService.ShowToast("Unable to get data.");
          }
        });
    }
  }

  GetTZImage() {
    this.OptionsTransactionZonePlanogramImpagePath = "";
    this.TzGid = $(event.currentTarget).val();
    if (IsValidType(this.TzGid)) {
      let CurrentObject = this.TransactionZonePlanogram.filter(
        x => x.Gid === this.TzGid
      );
      if (CurrentObject.length) {
        let Current: TransactionZonePlanogramModal = CurrentObject[ZerothIndex];
        this.OptionsTransactionZonePlanogramImpagePath =
          this.ServerUrl +
          Current.RelativePathText +
          "//" +
          Current.Label +
          "." +
          Current.FileExtension;
      }
    }
  }
}

// interface IRetailerInfo {
//   Code: string;
//   Status: string;
//   Name: string;
//   RetailerClass: string;
//   Type: string;
//   GSTNo: string;
//   PAN: string;
//   AdharNo: string;
// }

// interface IRowDetail {
//   Name: string;
//   Designation: string;
//   Mobile: string;
//   WhatsAppMobile: string;
//   BirthDate: string;
//   AnniversaryDate: string;
// }

// interface IRetailerAddressDetail {
//   AddressLine1: string;
//   AddressLine2: string;
//   AddressLine3: string;
//   Landmark: string;
//   City: string;
//   PinCode: string;
//   State: string;
//   Region: string;
//   Country: string;
//   Phone: string;
//   Email: string;
//   Fax: string;
//   Longitude: string;
//   Latitude: string;
// }

// interface IRetailerContact {
//   Name: string;
//   Designation: string;
//   Gender: boolean;
//   Mobile: string;
//   SecondaryPhone: string;
//   WhatsAppPhone: string;
//   Email: string;
//   BirthDate: string;
//   AnniversaryDate: string;
// }

interface ISecoundryVisibility {
  Type: string;
  Size: string;
  UniqueId: string;
  Image: string;
}

interface IMerchandiserPlan {
  Supervisor: string;
  Merchandiser: string;
  Beat: string;
  Mon: string;
  Tue: string;
  Wed: string;
  Thu: string;
  Fri: string;
  Sat: string;
  Sun: string;
}

interface RetailerViewModel {
  Gid: string;
  Code: string;
  Name: string;
  SupplyFrom: string;
  SupplyFrequency: string;
  SupplyDay: string;
  Channel: string;
  SubChannel: string;
  ChainName: string;
  LinkType: string;
  LinkGid: string;
  Type: string;
  City: string;
  State: string;
  Region: string;
  Country: string;
  Phone: string;
  HouseNo: string;
  Street: string;
  TZCheckOutCount: number;
  TZFoodCheckOutCount: number;
}

interface ContactViewModel {
  LinkType: string;
  LinkGid: string;
  Name: string;
  GenderEnum: string;
  Mobile: string;
  CountryGid: string;
  LoginId: string;
  Status: number;
  EmpNo: string;
  JoinDate: string;
  ExitDate: string;
  BirthDate: string;
  EncryptedPassword: string;
  PrimaryPhone: string;
  SecondaryPhone: string;
  WhatsAppPhone: string;
  Email: string;
  Designation: string;
  Department: string;
  Gid: string;
  JobGid: string;
  Code: string;
  WebPortalRole: string;
  MobileAppRole: string;
  ReportingToJobId: string;
}

interface RetailerAddressDetail {
  LinkType: string;
  LinkGid: string;
  Type: string;
  HouseNo: string;
  Street: string;
  Landmark: string;
  Locality: string;
  City: string;
  PostalCode: string;
  District: string;
  State: string;
  Region: string;
  Country: string;
  Phone: string;
  Email: string;
  Fax: string;
  Latitude: string;
  Longitude: string;
  Altitude: string;
  SS: number;
  CT: number;
  MT: number;
  SCT: number;
  SMT: number;
  Gid: string;
}

interface RetailerSecoundryVisibilityModal {
  Id: string;
  Gid: string;
  RetailerGid: string;
  TypeEnum: string;
  SubTypeEnum: string;
  Size: string;
  UniqueId: string;
  Remarks: string;
  Location: string;
  IsPermanent: string;
  FromDate: string;
  ToDate: string;
  Status: string;
  RelativePathText: string;
  Label: string;
  FileExtension: string;
  PlanogramName: string;
  PlanogramGid: string;
}

interface RetailerMershandisingPlanModal {
  Id: string;
  Gid: string;
  Name: string;
  Supervisor: string;
  Merchandiser: string;
  SS: string;
  CT: string;
  MT: string;
  SCT: string;
  SMT: string;
  RetailerGid: string;
  BeatGid: string;
  Sun: string;
  Mon: string;
  Tue: string;
  Wed: string;
  Thu: string;
  Fri: string;
  Sat: string;
  StartTime: string;
  EndTime: string;
  FromDate: string;
  ToDate: string;
  IsActive: string;
  LastVisitDate: string;
  NextVisitDate: string;
}

interface PlanogrammainaisleViewModal {
  Gid: string;
  Name: string;
  Description: string;
  SubChannel: string;
  Chain: string;
  Location: string;
  RetailerGid: string;
}

interface RetailerMainasleModal {
  Gid: string;
  SS: string;
  CT: string;
  MT: string;
  SCT: string;
  SMT: string;
  RetailerGid: string;
  TypeEnum: string;
  Size: string;
  UniqueId: string;
  Remarks: string;
  Location: string;
  RelativePathText: string;
  Label: string;
  FileExtension: string;
  PlanogramGid: string;
  AFileGid: string;
}

interface RetailerCompetitionModal {
  Gid: string;
  SS: string;
  CT: string;
  MT: string;
  SCT: string;
  SMT: string;
  RetailerGid: string;
  CompetitionGid: string;
  Name: string;
}

interface SkuportfolioViewModel {
  Gid: string;
  Code: string;
  Name: string;
  Description: string;
  SubChannel: string;
  Chain: string;
  Location: string;
  RetailerGid: string;
}

interface PlanogramSecondryVisibilityModal {
  Gid: string;
  Name: string;
}

interface TransactionZonePlanogramModal {
  Gid: string;
  Name: string;
  Description: string;
  SubChannel: string;
  Chain: string;
  Label: string;
  Location: string;
  RetailerGid: string;
  RelativePathText: string;
  FileExtension: string;
  AFileGid: string;
}
