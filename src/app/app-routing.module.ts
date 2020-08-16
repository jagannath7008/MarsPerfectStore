import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {
  Login,
  Dashboard,
  Businessunit,
  Region,
  State,
  City,
  Employee,
  RetailerDetail,
  CustomerReport,
  JourneyPlan,
  SupervisorCustomer,
  ManageSupervisorCustomer,
  BeatPlanning,
  BeatPlan,
  Sku,
  PlanogramSecondaryVisibility,
  SKUPortfolio,
  ManageSKUPortfolio,
  CustomerFootprint,
  WorkEffectiveness,
  PlanogramTransactionzone,
  AvailabilityReport,
  PlanogramDetailReport,
  KYCReport,
  PromotionHeader,
  PromotionDetail,
  SpecialVisibilityHeader,
  SpecialVisibilityDetail,
  IncentiveTargetHeader,
  IncentiveTargetDetail,
  PerfectStore,
} from "src/providers/constants";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { BusinessunitComponent } from "./businessunit/businessunit.component";
import { RegionComponent } from "./region/region.component";
import { StateComponent } from "./state/state.component";
import { CityComponent } from "./city/city.component";
import { EmployeeComponent } from "./employee/employee.component";
import { RetailerDetailComponent } from "./retailer-detail/retailer-detail.component";
import { CustomerreportsComponent } from "./customerreports/customerreports.component";
import { SupervisorCustomerComponent } from "./supervisor-customer/supervisor-customer.component";
import { ManageSupervisorCustomerComponent } from "./manage-supervisor-customer/manage-supervisor-customer.component";
import { BeatPlanningComponent } from "./beat-planning/beat-planning.component";
import { ManageBeatPlanComponent } from "./manage-beat-plan/manage-beat-plan.component";
import { PlanogrammainaisleComponent } from "./planogrammainaisle/planogrammainaisle.component";
import { Planogrammainaisle } from "./../providers/constants";
import { SkuComponent } from "./sku/sku.component";
import { PlanogramsecondaryvisibilityComponent } from "./planogramsecondaryvisibility/planogramsecondaryvisibility.component";
import { SkuporfolioComponent } from "./skuporfolio/skuporfolio.component";
import { ManageskuportfolioComponent } from "./manageskuportfolio/manageskuportfolio.component";
import { WorkfffectivenessComponent } from "./workfffectiveness/workfffectiveness.component";
import { CustomerfootprintComponent } from "./customerfootprint/customerfootprint.component";
import { PlanogramtransactionzoneComponent } from "./planogramtransactionzone/planogramtransactionzone.component";
import { AvailabilityreportComponent } from "./availabilityreport/availabilityreport.component";
import { PlanogramDetailReportComponent } from "./PlanogramDetailReport/planogram-detail-report/planogram-detail-report.component";
import { KycreportComponent } from "./kycreport/kycreport.component";
import { PromotionheaderComponent } from "./promotionheader/promotionheader.component";
import { PromotiondetailComponent } from "./promotiondetail/promotiondetail.component";
import { SpecialvisibilityheaderComponent } from "./specialvisibilityheader/specialvisibilityheader.component";
import { SpecialvisibilitydetailComponent } from "./specialvisibilitydetail/specialvisibilitydetail.component";
import { IncentivetargetheaderComponent } from "./incentivetargetheader/incentivetargetheader.component";
import { IncentivetargetdetailComponent } from "./incentivetargetdetail/incentivetargetdetail.component";
import { PerfectstoreComponent } from "./perfectstore/perfectstore.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: Login, component: LoginComponent },
  { path: Dashboard, component: DashboardComponent },
  { path: Businessunit, component: BusinessunitComponent },
  { path: Region, component: RegionComponent },
  { path: State, component: StateComponent },
  { path: City, component: CityComponent },
  { path: Employee, component: EmployeeComponent },
  { path: RetailerDetail, component: RetailerDetailComponent },
  { path: JourneyPlan, component: CustomerreportsComponent },
  { path: CustomerReport, component: CustomerreportsComponent },
  { path: BeatPlanning, component: BeatPlanningComponent },
  { path: BeatPlan, component: ManageBeatPlanComponent },
  {
    path: ManageSupervisorCustomer,
    component: ManageSupervisorCustomerComponent,
  },
  { path: SupervisorCustomer, component: SupervisorCustomerComponent },
  { path: Sku, component: SkuComponent },
  { path: Planogrammainaisle, component: PlanogrammainaisleComponent },
  {
    path: PlanogramSecondaryVisibility,
    component: PlanogramsecondaryvisibilityComponent,
  },
  { path: SKUPortfolio, component: SkuporfolioComponent },
  { path: ManageSKUPortfolio, component: ManageskuportfolioComponent },
  { path: CustomerFootprint, component: CustomerfootprintComponent },
  { path: WorkEffectiveness, component: WorkfffectivenessComponent },
  { path: AvailabilityReport, component: AvailabilityreportComponent },
  { path: KYCReport, component: KycreportComponent },
  { path: PlanogramDetailReport, component: PlanogramDetailReportComponent },
  {
    path: PlanogramTransactionzone,
    component: PlanogramtransactionzoneComponent,
  },
  { path: PromotionHeader, component: PromotionheaderComponent },
  { path: PromotionDetail, component: PromotiondetailComponent },
  {
    path: SpecialVisibilityHeader,
    component: SpecialvisibilityheaderComponent,
  },
  {
    path: SpecialVisibilityDetail,
    component: SpecialvisibilitydetailComponent,
  },
  { path: IncentiveTargetHeader, component: IncentivetargetheaderComponent },
  { path: IncentiveTargetDetail, component: IncentivetargetdetailComponent },
  { path: PerfectStore, component: PerfectstoreComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
