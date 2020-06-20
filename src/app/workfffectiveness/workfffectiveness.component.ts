import { Component, OnInit } from "@angular/core";
import {
  IsValidType,
  CommonService,
  ExportToExcel,
} from "src/providers/common-service/common.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { AjaxService } from "src/providers/ajax.service";
import { NgbCalendar, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import {
  ZerothIndex,
  M_Countries,
  M_Region,
  M_State,
  M_City,
  M_Retailer,
  M_Merchandiser,
  M_Supervisor,
} from "./../../providers/constants";
import { MasterDataModal } from "../availabilityreport/availabilityreport.component";

@Component({
  selector: "app-workfffectiveness",
  templateUrl: "./workfffectiveness.component.html",
  styleUrls: ["./workfffectiveness.component.scss"],
})
export class WorkfffectivenessComponent implements OnInit {
  AttendenceReportData: Array<AttendenceReportByDate> = [];
  WorkEffectiveness: Array<WorkEffectivenessModal>;
  MasterData: MasterDataModal;
  CalculatedDetail: any = [];
  selectedDate: any;
  datePickerConfig: any = {};
  model: NgbDateStruct;
  modalDate: string = "";
  date: { year: number; month: number };
  Region: string;
  State: string;
  City: string;
  SO: string;

  constructor(
    private local: ApplicationStorage,
    private commonService: CommonService,
    private http: AjaxService,
    private calendar: NgbCalendar
  ) {}

  ngOnInit() {
    this.MasterData = new MasterDataModal();
    this.selectToday();
    this.Region = "";
    this.State = "";
    this.City = "";
    this.SO = "";
    let LocalMasterData = this.local.GetMasterDataValues(M_Region, null);
    if (IsValidType(LocalMasterData)) {
      this.MasterData.M_Region = LocalMasterData;
    }
    this.InitData();
    this.LoadFilteredResult();
  }

  selectToday() {
    this.model = this.calendar.getToday();
    this.modalDate = `${this.model.day}/${this.model.month}/${this.model.year}`;
  }

  manageDate() {
    this.modalDate = `${this.model.day}/${this.model.month}/${this.model.year}`;
  }

  ResetResult() {
    this.model = this.calendar.getToday();
    this.Region = "";
    this.State = "";
    this.City = "";
    this.SO = "";
    this.LoadFilteredResult();
  }

  LoadFilteredResult() {
    let SOCode = this.SO;
    let filterDate =
      this.model.year.toString() +
      this.BuildDayAndMonth(this.model.month) +
      this.BuildDayAndMonth(this.model.day);

    let firstDay = new Date(this.model.year, this.model.month - 1, 1);
    let FD = `${firstDay.getFullYear()}${this.BuildDayAndMonth(
      firstDay.getMonth() + 1
    )}${this.BuildDayAndMonth(firstDay.getDate())}`;
    let lastDay = new Date(this.model.year, this.model.month, 0);
    let LD = this.GetLastOrCurrentDate();
    let Url = `Webportal/FetchAttendanceReportService?SD=${filterDate}&ST=${FD}&ET=${LD}&Region=${this.Region}&State=${this.State}&City=${this.City}&SO=${SOCode}`;
    this.LoadData(Url);
  }

  GetLastOrCurrentDate() {
    let LD = "";
    let CurrentMonth = new Date().getMonth();
    if (this.model.month - 1 < CurrentMonth) {
      let lastDay = new Date(this.model.year, this.model.month, 0);
      LD = `${lastDay.getFullYear()}${this.BuildDayAndMonth(
        lastDay.getMonth() + 1
      )}${this.BuildDayAndMonth(lastDay.getDate())}`;
    } else {
      LD =
        this.model.year.toString() +
        this.BuildDayAndMonth(this.model.month) +
        this.BuildDayAndMonth(this.model.day);
    }
    return LD;
  }

  BuildDayAndMonth(Value: number) {
    let NewForm = "";
    if (Value < 10) {
      NewForm = "0" + Value;
    } else {
      NewForm = Value.toString();
    }
    return NewForm;
  }

  LoadData(Url) {
    this.manageDate();
    this.CalculatedDetail = [];
    this.AttendenceReportData = [];
    this.http
      .get(Url)
      .then((response) => {
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          if (Data != null && Data != "") {
            let Data = JSON.parse(response.content.data);
            if (IsValidType(Data["Header"]) && IsValidType(Data["Detail"])) {
              let HeaderDetail = Data["Header"];
              let GridDetail = Data["Detail"];
              let TodayHeaderDetail = HeaderDetail.filter(
                (x) => x.Dy === "Today"
              );
              let MTDHeaderDetail = HeaderDetail.filter((x) => x.Dy === "MTD");
              if (
                IsValidType(TodayHeaderDetail) &&
                IsValidType(MTDHeaderDetail)
              ) {
                this.CalcultePercentage(
                  TodayHeaderDetail[ZerothIndex],
                  MTDHeaderDetail[ZerothIndex]
                );
              }
              //this.CalculatePercentile(TodayHeaderDetail, MTDHeaderDetail);
              this.ManageGridData(GridDetail);
            }
            this.commonService.ShowToast("Data retrieve successfully.");
          } else {
            this.commonService.ShowToast("Got empty dataset.");
          }
        } else {
          this.commonService.ShowToast("Unable to get data.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  CalcultePercentage(TodayHeader: any, MTDHeader: any) {
    this.CalculatedDetail = [
      {
        WorkType: "Percentage",
        TodayAttendancePercent: this.CalculateValue(
          TodayHeader.ActualAttendance,
          TodayHeader.TotalAttendance
        ),
        TodayCallCompliancePercent: this.CalculateValue(
          TodayHeader.ActualCallComplaince,
          TodayHeader.TotalCallComplaince
        ),
        MTDAttendancePercent: this.CalculateValue(
          MTDHeader.ActualAttendance,
          MTDHeader.TotalAttendance
        ),
        MTDCallCompliancePercent: this.CalculateValue(
          MTDHeader.ActualCallComplaince,
          MTDHeader.TotalCallComplaince
        ),
      },
      {
        WorkType: "SO",
        TodayAttendanceSO:
          TodayHeader.ActualAttendance.toString() +
          "/" +
          TodayHeader.TotalAttendance.toString(),
        TodayCallComplianceSO:
          TodayHeader.ActualCallComplaince.toString() +
          "/" +
          TodayHeader.TotalCallComplaince.toString(),
        MTDAttendanceSO:
          MTDHeader.ActualAttendance.toString() +
          "/" +
          MTDHeader.TotalAttendance.toString(),
        MTDCallComplianceSO:
          MTDHeader.ActualCallComplaince.toString() +
          "/" +
          MTDHeader.TotalCallComplaince.toString(),
      },
    ];
  }

  IsValidNumber(GivenValue: any): boolean {
    let flag = true;
    if (GivenValue == null) {
      flag = false;
    } else {
      let Type = typeof GivenValue;
      if (Type === "string") {
        try {
          parseInt(GivenValue);
        } catch (e) {
          flag = false;
        }
      } else if (Type === "number") {
        flag = true;
      } else {
        flag = false;
      }
    }
    return flag;
  }

  ManageGridData(GridDetail: any) {
    this.AttendenceReportData = [];
    if (IsValidType(GridDetail)) {
      let index = 0;
      while (index < GridDetail.length) {
        this.AttendenceReportData.push({
          MerName: GridDetail[index].MerName,
          MRole: GridDetail[index].MRole,
          AttendanceTime: this.secondsToHms(GridDetail[index].AttendanceTime),
          PlannedCalls: GridDetail[index].PlannedCalls,
          ActualCalls: GridDetail[index].ActualCalls,
          TotalPlannedWorkdays: GridDetail[index].TotalPlannedWorkdays,
          TotalActualWorkdays: GridDetail[index].TotalActualWorkdays,
          AttendencePercent: this.CalculateValue(
            GridDetail[index].TotalActualWorkdays,
            GridDetail[index].TotalPlannedWorkdays
          ),
          TotalPlannedCalls: GridDetail[index].TotalPlannedCalls,
          TotalActualCalls: GridDetail[index].TotalActualCalls,
          CallCompliancePercent: this.CalculateValue(
            GridDetail[index].TotalActualCalls,
            GridDetail[index].TotalPlannedCalls
          ),
        });
        index++;
      }
    }
  }

  secondsToHms(d: any) {
    if (d >= 0) {
      d = Number(d);
      var h = Math.floor(d / 3600);
      var m = Math.floor((d % 3600) / 60);
      var s = Math.floor((d % 3600) % 60);

      var hDisplay = h > 0 ? h : "0";
      var mDisplay = m > 0 ? m : "0";
      var sDisplay = s > 0 ? s : "0";
      return `${hDisplay}:${mDisplay}`;
    } else {
      return "-";
    }
  }

  CalculateValue(Total: any, Actual: any) {
    if (Total === 0 || Actual === 0 || Total === null || Actual === null)
      return 0;
    else {
      let value = parseFloat(((Total / Actual) * 100).toFixed(2));
      return Math.round(value);
    }
  }

  InitData() {}

  ExportMe() {
    if (!ExportToExcel("work-table", "work")) {
      this.commonService.ShowToast(
        "Incorrect value passed to export to excel."
      );
    }
  }

  SubmitSearchCriateria() {
    let searchQuery = "1=1 ";
    let RegionData = this.local.GetObjectByGid(M_Region, this.Region);
    if (RegionData !== null) {
      this.Region = RegionData.Name;
    }
    let StateData = this.local.GetObjectByGid(M_State, this.State);
    if (StateData !== null) {
      this.State = StateData.Name;
    }
    let CityData = this.local.GetObjectByGid(M_City, this.City);
    if (CityData !== null) {
      this.City = CityData.Name;
    }
    let SOData = this.local.GetObjectByGid(M_Supervisor, this.SO);
    if (SOData !== null) {
      this.SO = SOData.Code;
    }
    this.LoadFilteredResult();
  }

  LoadNextField() {
    let currentType = $(event.currentTarget).attr("name");
    if (IsValidType(currentType)) {
      let NextFieldValue = null;
      switch (currentType) {
        case M_Countries:
          NextFieldValue = this.local.GetMasterDataValues(M_Region, "Country");
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_Region = NextFieldValue;
          }
          break;

        case M_Region:
          NextFieldValue = this.local.GetMasterDataValues(M_State, this.Region);
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_State = NextFieldValue;
          }

          this.MasterData.M_Supervisor = this.local.GetMasterDataValues(
            M_Supervisor,
            ""
          );
          break;

        case M_State:
          let StateName = $(event.currentTarget).find("option:selected").text();
          NextFieldValue = this.local.GetMasterDataValues(M_City, this.State);
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_City = NextFieldValue;
          }

          NextFieldValue = this.local.GetMasterDataValues(
            M_Supervisor,
            null,
            StateName
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_Supervisor = NextFieldValue;
          }
          break;

        case M_City:
          NextFieldValue = this.local.GetMasterDataValues(
            M_Retailer,
            this.City
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_Retailer = NextFieldValue;
          }
          break;

        case M_Supervisor:
          NextFieldValue = this.local.GetMasterDataValues(
            M_Merchandiser,
            this.SO
          );
          if (IsValidType(NextFieldValue)) {
            this.MasterData.M_Merchandiser = NextFieldValue;
          }
          break;

        case M_Merchandiser:
          break;
      }
    } else {
      this.commonService.ShowToast("Invalid selection.");
    }
  }
}

interface AttendenceReportByDate {
  MerName: string;
  MRole: string;
  AttendanceTime: string;
  PlannedCalls: string;
  ActualCalls: string;
  TotalPlannedWorkdays: number;
  TotalActualWorkdays: number;
  AttendencePercent: number;
  TotalPlannedCalls: number;
  TotalActualCalls: number;
  CallCompliancePercent: number;
}

interface WorkEffectivenessModal {
  WorkType: string;
  Data: WorkTypeModal;
}

interface WorkTypeModal {
  AttendneceByDate: number;
  CallComplianceByDate: number;
  AttendneceByMTD: number;
  CallComplianceByMTD: number;
}
