import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { CommonService } from "src/providers/common-service/common.service";
import { AjaxService } from "src/providers/ajax.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { PageCache } from "src/providers/PageCache";
import { iNavigation } from "./../providers/iNavigation";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RetailerDetailComponent } from "./retailer-detail/retailer-detail.component";
import { HeaderComponent } from "./header/header.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { IautocompleteComponent } from "./iautocomplete/iautocomplete.component";
import { CustomerreportsComponent } from "./customerreports/customerreports.component";
import { PagebreadcrumbComponent } from "./pagebreadcrumb/pagebreadcrumb.component";
import { BusinessunitComponent } from "./businessunit/businessunit.component";
import { RegionComponent } from "./region/region.component";
import { StateComponent } from "./state/state.component";
import { CityComponent } from "./city/city.component";
import { EmployeeComponent } from "./employee/employee.component";
import { SupervisorCustomerComponent } from "./supervisor-customer/supervisor-customer.component";
import { ManageSupervisorCustomerComponent } from "./manage-supervisor-customer/manage-supervisor-customer.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BeatPlanningComponent } from "./beat-planning/beat-planning.component";
import { ManageBeatPlanComponent } from "./manage-beat-plan/manage-beat-plan.component";
import { PlanogrammainaisleComponent } from "./planogrammainaisle/planogrammainaisle.component";
import { SkuComponent } from "./sku/sku.component";
import { PlanogramsecondaryvisibilityComponent } from "./planogramsecondaryvisibility/planogramsecondaryvisibility.component";
import { SkuporfolioComponent } from "./skuporfolio/skuporfolio.component";
import { ManageskuportfolioComponent } from "./manageskuportfolio/manageskuportfolio.component";
import { AgmCoreModule } from "@agm/core";
import { WorkfffectivenessComponent } from "./workfffectiveness/workfffectiveness.component";
import { CustomerfootprintComponent } from "./customerfootprint/customerfootprint.component";
import { PlanogramtransactionzoneComponent } from "./planogramtransactionzone/planogramtransactionzone.component";
import { FooterComponent } from "./footer/footer.component";
import { AvailabilityreportComponent } from "./availabilityreport/availabilityreport.component";
import { PlanogramDetailReportComponent } from "./PlanogramDetailReport/planogram-detail-report/planogram-detail-report.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ChartsModule } from "ng2-charts";
import { KycreportComponent } from './kycreport/kycreport.component';
import { PromotionheaderComponent } from './promotionheader/promotionheader.component';
import { SpecialvisibilityheaderComponent } from './specialvisibilityheader/specialvisibilityheader.component';
import { IncentivetargetheaderComponent } from './incentivetargetheader/incentivetargetheader.component';
import { PromotiondetailComponent } from './promotiondetail/promotiondetail.component';
import { SpecialvisibilitydetailComponent } from './specialvisibilitydetail/specialvisibilitydetail.component';
import { IncentivetargetdetailComponent } from './incentivetargetdetail/incentivetargetdetail.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RetailerDetailComponent,
    HeaderComponent,
    DashboardComponent,
    IautocompleteComponent,
    CustomerreportsComponent,
    BusinessunitComponent,
    RegionComponent,
    StateComponent,
    CityComponent,
    EmployeeComponent,
    PagebreadcrumbComponent,
    SupervisorCustomerComponent,
    ManageSupervisorCustomerComponent,
    BeatPlanningComponent,
    ManageBeatPlanComponent,
    PlanogrammainaisleComponent,
    SkuComponent,
    PlanogramsecondaryvisibilityComponent,
    SkuporfolioComponent,
    ManageskuportfolioComponent,
    CustomerfootprintComponent,
    WorkfffectivenessComponent,
    PlanogramtransactionzoneComponent,
    AvailabilityreportComponent,
    PlanogramDetailReportComponent,
    FooterComponent,
    KycreportComponent,
    PromotionheaderComponent,
    SpecialvisibilityheaderComponent,
    IncentivetargetheaderComponent,
    PromotiondetailComponent,
    SpecialvisibilitydetailComponent,
    IncentivetargetdetailComponent
  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCtI24o4nDCY68CPEilrfQ5UEoDAQ1lAcA"
    }),
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ChartsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatPaginatorModule
  ],
  providers: [
    CommonService,
    AjaxService,
    ApplicationStorage,
    PageCache,
    iNavigation
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
