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
  PlanogramTransactionzone
} from "src/providers/constants";
import { CommonService } from "src/providers/common-service/common.service";
import { AjaxService } from "src/providers/ajax.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { PageCache } from "src/providers/PageCache";
import { iNavigation } from "./../providers/iNavigation";
import {
  NavigationStart,
  Router,
  NavigationEnd,
  NavigationError,
  Event
} from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
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
        input.content.username = Credential.Username;
        input.content.password = Credential.Password;
        console.log(input);
        this.http
          .auth("AuthStandard/WebLogin", input)
          .then(
            response => {
              if (this.commonService.IsValidResponse(response)) {
                this.IsLogin = false;
                this.local.set({ UserDetail: response });
                this.nav.navigate(Dashboard, null);
                this.commonService.ShowToast("Login successfull.");
              } else {
                this.commonService.ShowToast(
                  "Invalid response. Please contact to admin."
                );
              }
            },
            error => {
              this.commonService.ShowToast(
                "Invalid username or password. Please try again later."
              );
            }
          )
          .catch(err => {
            this.commonService.ShowToast("Login error. Please contact admin.");
          });
      }
    }
  }
}
