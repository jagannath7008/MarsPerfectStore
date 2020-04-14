import { IGrid } from "./Generic/Interface/IGrid";

export const Login = "login";
export const Dashboard = "dashboard";
export const Businessunit = "office";
export const Region = "region";
export const State = "state";
export const City = "city";
export const Employee = "employee";
export const RetailerDetail = "dashboard/retailerdetail";
export const CustomerReport = "dashboard/customerreport";
export const JourneyPlan = "dashboard/journeyplan";
export const ZerothIndex = 0;
export const SupervisorCustomer = "supervisorCustomer";
export const ManageSupervisorCustomer =
  "supervisorCustomer/manageSupervisorCustomer";
export const BeatPlanning = "beatPlanning";
export const BeatPlan = "beatCalander";
export const Sku = "sku";
export const Planogrammainaisle = "planogrammainaisle";
export const PlanogramSecondaryVisibility = "planogramsecondaryvisibility";
export const PlanogramTransactionzone = "planogramtransactionzone";
export const SKUPortfolio = "skuportfolio";
export const ManageSKUPortfolio = "skuportfolio/manageskuportfolio";
export const CustomerFootprint = "customerfootprint";
export const WorkEffectiveness = "workeffectiveness";
export const AvailabilityReport = "availabilityreport";
export const PlanogramDetailReport = "planogramdetailreport";
export const KYCReport = "kycreport";

export const PageName: Array<RouteDescription> = [
  { title: Login, display: "Login" },
  { title: Dashboard, display: "Dashboard" },
  { title: Businessunit, display: "Office" },
  { title: Region, display: "Region" },
  { title: State, display: "State" },
  { title: City, display: "City" },
  { title: Employee, display: "Employee" },
  { title: RetailerDetail, display: "Retailer Detail" },
  { title: CustomerReport, display: "Customer Report" },
  { title: JourneyPlan, display: "Journey Plan" },
];

export const AddCustomer: Array<RouteDescription> = [
  { title: Login, display: "Login" },
  { title: Dashboard, display: "Dashboard" },
  { title: Businessunit, display: "Office" },
  { title: Region, display: "Region" },
  { title: State, display: "State" },
  { title: City, display: "City" },
  { title: Employee, display: "Employee" },
  { title: RetailerDetail, display: "Retailer Detail" },
  { title: CustomerReport, display: "Customer Report" },
  { title: JourneyPlan, display: "Journey Plan" },
];

export interface RouteDescription {
  title: string;
  display: string;
}

export const PostParam: any = `{"meta":{"app":"MerchandiserApp","action":"WebLogin","requestId":"0","deviceId":"web"},"content":{"deviceId":"web","deviceType":"web","deviceOS":"Windows","deviceVersion":"web","deviceInfo":"web"}}`;
