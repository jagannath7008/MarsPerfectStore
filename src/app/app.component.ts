import { Component } from "@angular/core";
import {
  Dashboard,
  RetailerDetail,
  CustomerReport,
  JourneyPlan,
  Businessunit,
  Region,
  State,
  City,
  Employee,
  SupervisorCustomer,
  ManageSupervisorCustomer,
  BeatPlanning,
  BeatPlan,
  Sku,
  Planogrammainaisle,
  PlanogramSecondaryVisibility,
  SKUPortfolio,
  ManageSKUPortfolio,
  WorkEffectiveness,
  CustomerFootprint,
  PlanogramTransactionzone,
  PlanogramDetailReport,
  AvailabilityReport,
  KYCReport,
  PromotionHeader,
  PromotionDetail,
  SpecialVisibilityDetail,
  SpecialVisibilityHeader,
  IncentiveTargetDetail,
  IncentiveTargetHeader,
} from "src/providers/constants";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import { AjaxService } from "src/providers/ajax.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { PageCache } from "src/providers/PageCache";
import { iNavigation } from "./../providers/iNavigation";
import {
  NavigationStart,
  Router,
  NavigationEnd,
  NavigationError,
  Event,
} from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Retail Connect";
  initialUrl: string = "";
  catagory: any = {};
  IsLogin: boolean;
  constructor(
    private router: Router,
    private nav: iNavigation,
    private commonService: CommonService,
    private http: AjaxService,
    private local: ApplicationStorage,
    private cache: PageCache
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.commonService.EnableOperationBase();
        this.commonService.ShowLoader();
        this.commonService.SetCurrentPageName(event.url.replace("/", ""));
        this.commonService.UpdateBreadCrumb(event.url);
        if (event.url === "/" || event.url === "/#/") {
          this.IsLogin = true;
          this.commonService.EnableAuthBase();
        } else {
          if (
            this.local.$master !== null &&
            Object.keys(this.local.$master).length > 0
          ) {
            switch (event.url) {
              case "/" + Dashboard:
                break;
              case "/" + RetailerDetail:
                break;
              case "/" + CustomerReport:
                break;
              case "/" + JourneyPlan:
                break;
              case "/" + Businessunit:
                break;
              case "/" + Region:
                break;
              case "/" + State:
                break;
              case "/" + City:
                break;
              case "/" + Employee:
                break;
              case "/" + SupervisorCustomer:
                break;
              case "/" + ManageSupervisorCustomer:
                break;
              case "/" + BeatPlanning:
                break;
              case "/" + BeatPlan:
                break;
              case "/" + Sku:
                break;
              case "/" + Planogrammainaisle:
                break;
              case "/" + PlanogramSecondaryVisibility:
                break;
              case "/" + SKUPortfolio:
                break;
              case "/" + ManageSKUPortfolio:
                break;
              case "/" + CustomerFootprint:
                break;
              case "/" + WorkEffectiveness:
                break;
              case "/" + PlanogramTransactionzone:
                break;
              case "/" + AvailabilityReport:
                break;
              case "/" + PlanogramDetailReport:
                break;
              case "/" + KYCReport:
                break;
              case "/" + PromotionHeader:
                break;
              case "/" + PromotionDetail:
                break;
              case "/" + SpecialVisibilityHeader:
                break;
              case "/" + SpecialVisibilityDetail:
                break;
              case "/" + IncentiveTargetHeader:
                break;
              case "/" + IncentiveTargetDetail:
                break;
              default:
                this.commonService.EnableAuthBase();
                this.IsLogin = true;
            }
          } else {
            if (!this.local.reinitMaster()) {
              if (event.url !== "/") this.router.navigate(["/"]);
              this.commonService.ShowToast(
                "Fail to login. Master data is mission."
              );
            }
          }
        }
      }
      if (event instanceof NavigationEnd) {
        this.commonService.HideLoader();
      }
      if (event instanceof NavigationError) {
        this.commonService.HideLoader();
      }
    });
  }

  ParseMasterData(MasterData: any) {
    let FinalData = {
      Countries: [],
      State: [],
      Region: [],
      City: [],
      Merchandiser: [],
      Retailer: [],
      Supervisor: [],
    };
    if (IsValidType(MasterData["LocationTable"])) {
      let Data = MasterData["LocationTable"];
      let index = 0;
      while (index < Data.length) {
        if (Data[index]["TypeEnum"] === "COU") {
          if (
            FinalData.Countries.filter((x) => x.Gid === Data[index].Gid)
              .length === 0
          ) {
            FinalData.Countries.push(Data[index]);
          }
        } else if (Data[index]["TypeEnum"] === "STA") {
          if (
            FinalData.State.filter((x) => x.Gid === Data[index].Gid).length ===
            0
          ) {
            FinalData.State.push(Data[index]);
          }
        } else if (Data[index]["TypeEnum"] === "REG") {
          if (
            FinalData.Region.filter((x) => x.Gid === Data[index].Gid).length ===
            0
          ) {
            FinalData.Region.push(Data[index]);
          }
        } else if (Data[index]["TypeEnum"] === "CIT") {
          if (
            FinalData.City.filter((x) => x.Gid === Data[index].Gid).length === 0
          ) {
            FinalData.City.push(Data[index]);
          }
        } else if (Data[index]["TypeEnum"] === "Merchandiser") {
          if (
            FinalData.Merchandiser.filter((x) => x.Gid === Data[index].Gid)
              .length === 0
          ) {
            FinalData.Merchandiser.push(Data[index]);
          }
        } else if (Data[index]["TypeEnum"] === "Retailer") {
          if (
            FinalData.Retailer.filter((x) => x.Gid === Data[index].Gid)
              .length === 0
          ) {
            FinalData.Retailer.push(Data[index]);
          }
        } else if (Data[index]["TypeEnum"] === "Supervisor") {
          if (
            FinalData.Supervisor.filter((x) => x.Gid === Data[index].Gid)
              .length === 0
          ) {
            FinalData.Supervisor.push(Data[index]);
          }
        }
        index++;
      }
    }
    return FinalData;
  }

  AuthenticateCredential(Credential: any) {
    if (this.commonService.IsValid(Credential)) {
      if (
        this.commonService.IsValid(Credential.Username) &&
        this.commonService.IsValid(Credential.Password)
      ) {
        let input: any = {
          meta: {
            app: "MerchandiserApp",
            action: "WebLogin",
            requestId: "0",
            deviceId: "web",
          },
          content: {
            deviceId: "web",
            deviceType: "web",
            deviceOS: "Windows",
            deviceVersion: "web",
            deviceInfo: "web",
          },
        };
        input.content.username = Credential.Username;
        input.content.password = Credential.Password;
        console.log(input);
        this.http
          .auth("AuthStandard/WebLogin", input)
          .then(
            (response) => {
              if (this.commonService.IsValidResponse(response)) {
                let StringifiedMasterData = response.content.data;
                if (IsValidType(StringifiedMasterData)) {
                  this.IsLogin = false;
                  let MasterData = JSON.parse(response.content.data);
                  response.content.data = this.ParseMasterData(MasterData);
                  this.local.set(response.content.data, true);
                  this.nav.navigate(Dashboard, null);
                  this.commonService.ShowToast("Login successfull.");
                } else {
                  this.commonService.ShowToast("Fail to load master data.");
                }
              } else {
                this.commonService.ShowToast(
                  "Invalid response. Please contact to admin."
                );
              }
            },
            (error) => {
              this.commonService.ShowToast(
                "Invalid username or password. Please try again later."
              );
            }
          )
          .catch((err) => {
            this.commonService.ShowToast("Login error. Please contact admin.");
          });
      }
    }
  }
}
