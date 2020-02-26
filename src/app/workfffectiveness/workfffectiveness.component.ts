import { Component, OnInit } from "@angular/core";
import {
  IsValidType,
  CommonService,
  ExportToExcel
} from "src/providers/common-service/common.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { AjaxService } from "src/providers/ajax.service";

@Component({
  selector: "app-workfffectiveness",
  templateUrl: "./workfffectiveness.component.html",
  styleUrls: ["./workfffectiveness.component.scss"]
})
export class WorkfffectivenessComponent implements OnInit {
  AttendenceReportData: Array<AttendenceReportByDate> = [];
  WorkEffectiveness: Array<WorkEffectivenessModal>;
  MasterData: any;
  CalculatedDetail: any = [];
  AutodropdownCollection: any = {
    Region: { data: [], placeholder: "Region" },
    SubChannel: { data: [], placeholder: "SubChannel" },
    Supervisor: { data: [], placeholder: "Supervisor" },
    State: { data: [], placeholder: "State" },
    ChainName: { data: [], placeholder: "ChainName" },
    Marchandisor: { data: [], placeholder: "Marchandisor" },
    City: { data: [], placeholder: "City" }
  };
  constructor(
    private local: ApplicationStorage,
    private commonService: CommonService,
    private http: AjaxService
  ) {}

  ngOnInit() {
    let LocalMasterData = this.local.getMaster();
    if (IsValidType(LocalMasterData)) {
      this.MasterData = LocalMasterData;
    }
    this.InitData();
    this.LoadData();
  }

  LoadData() {
    let Url = `Webportal/FetchAttendanceReportService?SD=20200201&ST=20200201&ET=20200224`;

    this.http
      .get(Url)
      .then(response => {
        if (this.commonService.IsValidResponse(response)) {
          let Data = response.content.data;
          if (Data != null && Data != "") {
            let Data = JSON.parse(response.content.data);
            if (IsValidType(Data["Header"]) && IsValidType(Data["Detail"])) {
              let HeaderDetail = Data["Header"];
              let GridDetail = Data["Detail"];
              let TodayHeaderDetail = HeaderDetail.filter(
                x => x.Dy === "Today"
              );
              let MTDHeaderDetail = HeaderDetail.filter(x => x.Dy === "MTD");
              this.CalculatePercentile(TodayHeaderDetail, MTDHeaderDetail);
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
      .catch(err => {
        console.log(err);
      });
  }

  ManageGridData(GridDetail: any) {
    this.AttendenceReportData = [];
    if (IsValidType(GridDetail)) {
      let index = 0;
      while (index < GridDetail.length) {
        this.AttendenceReportData.push({
          MerName: GridDetail[index].MerName,
          MRole: GridDetail[index].MRole,
          AttendanceTime: GridDetail[index].AttendanceTime,
          PlannedCalls: GridDetail[index].PlannedCalls,
          ActualCalls: GridDetail[index].ActualCalls,
          TotalPlannedWorkdays: GridDetail[index].TotalPlannedWorkdays,
          TotalActualWorkdays: GridDetail[index].TotalActualWorkdays,
          AttendencePercent: this.CalculateValue(
            GridDetail[index].TotalPlannedWorkdays,
            GridDetail[index].TotalActualWorkdays
          ),
          TotalPlannedCalls: GridDetail[index].TotalPlannedCalls,
          TotalActualCalls: GridDetail[index].TotalActualCalls,
          CallCompliancePercent: this.CalculateValue(
            GridDetail[index].TotalPlannedCalls,
            GridDetail[index].TotalActualCalls
          )
        });
        index++;
      }
    }
  }

  CalculatePercentile(Data: any, MTDData: any) {
    this.CalculatedDetail = [];
    if (IsValidType(Data)) {
      let index = 0;
      let TotalAttendance = 0;
      let ActualAttendance = 0;
      let TotalCallComplaince = 0;
      let ActualCallComplaince = 0;

      let MTDTotalAttendance = 0;
      let MTDActualAttendance = 0;
      let MTDTotalCallComplaince = 0;
      let MTDActualCallComplaince = 0;

      let RegionData = Data.filter(x => x.LocType === "Region");
      if (RegionData.length > 0) {
        index = 0;
        while (index < RegionData.length) {
          if (RegionData[index].TotalAttendance !== null)
            TotalAttendance += RegionData[index].TotalAttendance;

          if (RegionData[index].ActualAttendance !== null)
            ActualAttendance += RegionData[index].ActualAttendance;

          if (RegionData[index].TotalCallComplaince !== null)
            TotalCallComplaince += RegionData[index].TotalCallComplaince;

          if (RegionData[index].ActualCallComplaince !== null)
            ActualCallComplaince += RegionData[index].ActualCallComplaince;

          index++;
        }
      }

      RegionData = MTDData.filter(x => x.LocType === "Region");
      if (RegionData.length > 0) {
        index = 0;
        while (index < RegionData.length) {
          if (RegionData[index].TotalAttendance !== null)
            MTDTotalAttendance += RegionData[index].TotalAttendance;

          if (RegionData[index].ActualAttendance !== null)
            MTDActualAttendance += RegionData[index].ActualAttendance;

          if (RegionData[index].TotalCallComplaince !== null)
            MTDTotalCallComplaince += RegionData[index].TotalCallComplaince;

          if (RegionData[index].ActualCallComplaince !== null)
            MTDActualCallComplaince += RegionData[index].ActualCallComplaince;

          index++;
        }
      }

      this.CalculatedDetail.push({
        WorkType: "Region",
        Data: {
          AttendneceByDate: this.CalculateValue(
            TotalAttendance,
            ActualAttendance
          ),
          CallComplianceByDate: this.CalculateValue(
            TotalCallComplaince,
            ActualCallComplaince
          ),
          AttendneceByMTD: this.CalculateValue(
            MTDTotalCallComplaince,
            MTDActualCallComplaince
          ),
          CallComplianceByMTD: this.CalculateValue(
            MTDTotalCallComplaince,
            MTDActualCallComplaince
          )
        }
      });

      TotalAttendance = 0;
      ActualAttendance = 0;
      TotalCallComplaince = 0;
      ActualCallComplaince = 0;
      MTDTotalAttendance = 0;
      MTDActualAttendance = 0;
      MTDTotalCallComplaince = 0;
      MTDActualCallComplaince = 0;

      let StateData = Data.filter(x => x.LocType === "State");
      if (StateData.length > 0) {
        index = 0;
        while (index < StateData.length) {
          if (StateData[index].TotalAttendance !== null)
            TotalAttendance += StateData[index].TotalAttendance;

          if (StateData[index].ActualAttendance !== null)
            ActualAttendance += StateData[index].ActualAttendance;

          if (StateData[index].TotalCallComplaince !== null)
            TotalCallComplaince += StateData[index].TotalCallComplaince;

          if (StateData[index].ActualCallComplaince !== null)
            ActualCallComplaince += StateData[index].ActualCallComplaince;

          index++;
        }
      }

      RegionData = MTDData.filter(x => x.LocType === "State");
      if (RegionData.length > 0) {
        index = 0;
        while (index < RegionData.length) {
          if (RegionData[index].TotalAttendance !== null)
            MTDTotalAttendance += RegionData[index].TotalAttendance;

          if (RegionData[index].ActualAttendance !== null)
            MTDActualAttendance += RegionData[index].ActualAttendance;

          if (RegionData[index].TotalCallComplaince !== null)
            MTDTotalCallComplaince += RegionData[index].TotalCallComplaince;

          if (RegionData[index].ActualCallComplaince !== null)
            MTDActualCallComplaince += RegionData[index].ActualCallComplaince;

          index++;
        }
      }

      this.CalculatedDetail.push({
        WorkType: "State",
        Data: {
          AttendneceByDate: this.CalculateValue(
            TotalAttendance,
            ActualAttendance
          ),
          CallComplianceByDate: this.CalculateValue(
            TotalCallComplaince,
            ActualCallComplaince
          ),
          AttendneceByMTD: this.CalculateValue(
            MTDTotalCallComplaince,
            MTDActualCallComplaince
          ),
          CallComplianceByMTD: this.CalculateValue(
            MTDTotalCallComplaince,
            MTDActualCallComplaince
          )
        }
      });

      TotalAttendance = 0;
      ActualAttendance = 0;
      TotalCallComplaince = 0;
      ActualCallComplaince = 0;
      MTDTotalAttendance = 0;
      MTDActualAttendance = 0;
      MTDTotalCallComplaince = 0;
      MTDActualCallComplaince = 0;

      let CityData = Data.filter(x => x.LocType === "City");
      if (CityData.length > 0) {
        index = 0;
        while (index < CityData.length) {
          if (CityData[index].TotalAttendance !== null)
            TotalAttendance += CityData[index].TotalAttendance;

          if (CityData[index].ActualAttendance !== null)
            ActualAttendance += CityData[index].ActualAttendance;

          if (CityData[index].TotalCallComplaince !== null)
            TotalCallComplaince += CityData[index].TotalCallComplaince;

          if (CityData[index].ActualCallComplaince !== null)
            ActualCallComplaince += CityData[index].ActualCallComplaince;

          index++;
        }
      }

      RegionData = MTDData.filter(x => x.LocType === "City");
      if (RegionData.length > 0) {
        index = 0;
        while (index < RegionData.length) {
          if (RegionData[index].TotalAttendance !== null)
            MTDTotalAttendance += RegionData[index].TotalAttendance;

          if (RegionData[index].ActualAttendance !== null)
            MTDActualAttendance += RegionData[index].ActualAttendance;

          if (RegionData[index].TotalCallComplaince !== null)
            MTDTotalCallComplaince += RegionData[index].TotalCallComplaince;

          if (RegionData[index].ActualCallComplaince !== null)
            MTDActualCallComplaince += RegionData[index].ActualCallComplaince;

          index++;
        }
      }

      this.CalculatedDetail.push({
        WorkType: "City",
        Data: {
          AttendneceByDate: this.CalculateValue(
            TotalAttendance,
            ActualAttendance
          ),
          CallComplianceByDate: this.CalculateValue(
            TotalCallComplaince,
            ActualCallComplaince
          ),
          AttendneceByMTD: this.CalculateValue(
            MTDTotalCallComplaince,
            MTDActualCallComplaince
          ),
          CallComplianceByMTD: this.CalculateValue(
            MTDTotalCallComplaince,
            MTDActualCallComplaince
          )
        }
      });

      TotalAttendance = 0;
      ActualAttendance = 0;
      TotalCallComplaince = 0;
      ActualCallComplaince = 0;
      MTDTotalAttendance = 0;
      MTDActualAttendance = 0;
      MTDTotalCallComplaince = 0;
      MTDActualCallComplaince = 0;

      let SOData = Data.filter(x => x.LocType === "SO");
      if (SOData.length > 0) {
        index = 0;
        while (index < SOData.length) {
          if (SOData[index].TotalAttendance !== null)
            TotalAttendance += SOData[index].TotalAttendance;

          if (SOData[index].ActualAttendance !== null)
            ActualAttendance += SOData[index].ActualAttendance;

          if (SOData[index].TotalCallComplaince !== null)
            TotalCallComplaince += SOData[index].TotalCallComplaince;

          if (SOData[index].ActualCallComplaince !== null)
            ActualCallComplaince += SOData[index].ActualCallComplaince;

          index++;
        }
      }

      RegionData = MTDData.filter(x => x.LocType === "SO");
      if (RegionData.length > 0) {
        index = 0;
        while (index < RegionData.length) {
          if (RegionData[index].TotalAttendance !== null)
            MTDTotalAttendance += RegionData[index].TotalAttendance;

          if (RegionData[index].ActualAttendance !== null)
            MTDActualAttendance += RegionData[index].ActualAttendance;

          if (RegionData[index].TotalCallComplaince !== null)
            MTDTotalCallComplaince += RegionData[index].TotalCallComplaince;

          if (RegionData[index].ActualCallComplaince !== null)
            MTDActualCallComplaince += RegionData[index].ActualCallComplaince;

          index++;
        }
      }

      this.CalculatedDetail.push({
        WorkType: "SO",
        Data: {
          AttendneceByDate: this.CalculateValue(
            TotalAttendance,
            ActualAttendance
          ),
          CallComplianceByDate: this.CalculateValue(
            TotalCallComplaince,
            ActualCallComplaince
          ),
          AttendneceByMTD: this.CalculateValue(
            MTDTotalCallComplaince,
            MTDActualCallComplaince
          ),
          CallComplianceByMTD: this.CalculateValue(
            MTDTotalCallComplaince,
            MTDActualCallComplaince
          )
        }
      });
    }
  }

  CalculateValue(Total: any, Actual: any) {
    if (Total === 0 || Actual === 0) return 0;
    else {
      return parseFloat(((Total / Actual) * 100).toFixed(2));
    }
  }

  InitData() {}

  ExportMe() {
    if(!ExportToExcel('work-table', 'work')){
      this.commonService.ShowToast("Incorrect value passed to export to excel.");
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
