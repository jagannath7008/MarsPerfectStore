import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'src/providers/ajax.service';
import { CommonService, IsValidResponse, IsValidType } from 'src/providers/common-service/common.service';
import { PostParam, ZerothIndex } from 'src/providers/constants';
import * as $ from 'jquery';

@Component({
  selector: 'app-approvalbudgetplan',
  templateUrl: './approvalbudgetplan.component.html',
  styleUrls: ['./approvalbudgetplan.component.scss']
})
export class ApprovalbudgetplanComponent implements OnInit {
  isDataAvailable: boolean = false;
  KamData: Array<any>;
  gridData: Array<any>;
  KamchainData: Array<any>;
  entity: KAMModal;
  ChainDetail: Array<any>;
  CurrentYear: string = "";
  KamInstance: Array<KamTarget>;
  TotalKamTarget: KamTarget;
  TotalKamTargetPercentage: KamTarget;
  ApprovalType: string;
  GridTitle: string;

  constructor(private http: AjaxService, private common: CommonService) { }

  ngOnInit() {
    this.GridTitle = 'Pending for approval';
    this.ApprovalType = '';
    this.TotalKamTargetPercentage = new KamTarget();
    this.TotalKamTarget = new KamTarget();
    this.KamInstance = new Array<KamTarget>();
    this.gridData = [];
    this.KamchainData = [];
    let fullYear: number = (new Date()).getFullYear();
    this.CurrentYear = (fullYear % 2000).toString();
    this.KamData = [];
    this.LoadKam();
  }

  LoadGridData() {
    this.gridData = [];
    this.http.get(`Webportal/FetchApprovalTarget?searchString=${this.entity.KAMCode}`).then(response => {
      if(IsValidResponse(response)) {
        this.gridData = response.content.data;
        this.isDataAvailable = true;
        this.common.ShowToast('Data loaded successfully');
      } else {
        this.common.ShowToast('Fail to load grid data');
      }
    })
  }

  // LoadChain() {
  //   let MSData = JSON.parse(PostParam);
  //   MSData.content.searchString = "retailerChainName";
  //   MSData.content.sortBy = "";
  //   MSData.content.pageIndex = 1;
  //   MSData.content.pageSize = 10;
  //   this.http.post("Webportal/FetchReasonItems", MSData).then(response => {
  //     if(IsValidResponse(response)) {
  //       this.ChainDetail = response.content.data;
  //     } else {
  //       this.common.ShowToast("Fail to get KAM data");
  //     }
  //   })
  // }

  getPercentValue(totalValue: any, percent: any): any {
    return Number(totalValue*percent / 100).toFixed(2);
  }

  changeGrid(type: string){
    $('#action-btns').find('li').removeClass('bg-success');
    $('#action-btns').find('a').removeClass('text-white');
    $(event.currentTarget).addClass('bg-success');
    $(event.currentTarget).find('a').addClass('text-white');
    if(type == 'approve') {
      this.ApprovalType = 'Approved';
      this.GridTitle = 'Approved records';
    } else if(type == 'reject') {
      this.ApprovalType = 'Rejected';
      this.GridTitle = 'Rejected records';
    } else {
      this.GridTitle = 'Pending for approval';
      if(typeof this.entity.KAMGid !== "undefined" && this.entity.KAMGid !== null && this.entity.KAMGid !== "") {
        this.LoadKAMChainData();
      }
    }
  }

  LoadKAMChainData() {
    this.http.get(`Webportal/FetchKamChainByGid?searchString=${this.entity.KAMGid}`).then(response => {
      if(IsValidResponse(response)) {
        this.KamchainData = response.content.data;
        let ChainCodes = this.KamchainData.map(x=>x.ChainName).join(",");
        this.FetchGridData(ChainCodes);
        this.isDataAvailable = true;
      } else {
        this.common.ShowToast("Fail to get KAM data");
      }
    });
  }

  maskToTwoDigit(value: any) {
    let convertedValue = 0;
    if(!isNaN(Number(value))) {
      convertedValue = Number(Number(value).toFixed(2));
    }
    return convertedValue;
  }

  calculatedKams() {
    let index = 0;
    let i = 0;
    let total = 0;
    let currentValue = 0;
    this.TotalKamTarget = new KamTarget();
    while(index < this.gridData.length) {
      i = 0;
      total = 0;
      while(i < this.gridData[index]['targets'].length) {
        currentValue = this.gridData[index]['targets'][ZerothIndex]["Jan"];
        if(!isNaN(Number(currentValue))) {
          this.gridData[index]['targets'][ZerothIndex]["Jan"] = this.maskToTwoDigit(currentValue);
          currentValue = Number(currentValue);
          this.TotalKamTarget.Jan = this.maskToTwoDigit(this.TotalKamTarget.Jan + currentValue);
          total += currentValue;
          //total = this.maskToTwoDigit(total + currentValue);
        }
        currentValue = 0;
        currentValue = this.gridData[index]['targets'][ZerothIndex]["Feb"];
        if(!isNaN(Number(currentValue))) {
          this.gridData[index]['targets'][ZerothIndex]["Feb"] = this.maskToTwoDigit(currentValue);
          currentValue = this.maskToTwoDigit(Number(currentValue));
          this.TotalKamTarget.Feb = this.maskToTwoDigit(this.TotalKamTarget.Feb + currentValue);
          total += currentValue;
          //total = this.maskToTwoDigit(total + currentValue);
        }
        currentValue = 0;
        currentValue = this.gridData[index]['targets'][ZerothIndex]["Mar"];
        if(!isNaN(Number(currentValue))) {
          this.gridData[index]['targets'][ZerothIndex]["Mar"] = this.maskToTwoDigit(currentValue);
          currentValue = this.maskToTwoDigit(Number(currentValue));
          this.TotalKamTarget.Mar = this.maskToTwoDigit(this.TotalKamTarget.Mar + currentValue);
          total += currentValue;
          //total = this.maskToTwoDigit(total + currentValue);
        }
        currentValue = 0;
        currentValue = this.gridData[index]['targets'][ZerothIndex]["Apr"];
        if(!isNaN(Number(currentValue))) {
          this.gridData[index]['targets'][ZerothIndex]["Apr"] = this.maskToTwoDigit(currentValue);
          currentValue = this.maskToTwoDigit(Number(currentValue));
          this.TotalKamTarget.Apr = this.maskToTwoDigit(this.TotalKamTarget.Apr + currentValue);
          total += currentValue;
          //total = this.maskToTwoDigit(total + currentValue);
        }
        currentValue = 0;
        currentValue = this.gridData[index]['targets'][ZerothIndex]["Aug"];
        if(!isNaN(Number(currentValue))) {
          this.gridData[index]['targets'][ZerothIndex]["Aug"] = this.maskToTwoDigit(currentValue);
          currentValue = this.maskToTwoDigit(Number(currentValue));
          this.TotalKamTarget.Aug = this.maskToTwoDigit(this.TotalKamTarget.Aug + currentValue);
          total += currentValue;
          //total = this.maskToTwoDigit(total + currentValue);
        }
        currentValue = 0;
        currentValue = this.gridData[index]['targets'][ZerothIndex]["Jul"];
        if(!isNaN(Number(currentValue))) {
          this.gridData[index]['targets'][ZerothIndex]["Jul"] = this.maskToTwoDigit(currentValue);
          currentValue = this.maskToTwoDigit(Number(currentValue));
          this.TotalKamTarget.Jul = this.maskToTwoDigit(this.TotalKamTarget.Jul + currentValue);
          total += currentValue;
          //total = this.maskToTwoDigit(total + currentValue);
        }
        currentValue = 0;
        currentValue = this.gridData[index]['targets'][ZerothIndex]["Jun"];
        if(!isNaN(Number(currentValue))) {
          this.gridData[index]['targets'][ZerothIndex]["Jun"] = this.maskToTwoDigit(currentValue);
          currentValue = this.maskToTwoDigit(Number(currentValue));
          this.TotalKamTarget.Jun = this.maskToTwoDigit(this.TotalKamTarget.Jun + currentValue);
          total += currentValue;
          //total = this.maskToTwoDigit(total + currentValue);
        }
        currentValue = 0;
        currentValue = this.gridData[index]['targets'][ZerothIndex]["May"];
        if(!isNaN(Number(currentValue))) {
          this.gridData[index]['targets'][ZerothIndex]["May"] = this.maskToTwoDigit(currentValue);
          currentValue = this.maskToTwoDigit(Number(currentValue));
          this.TotalKamTarget.May = this.maskToTwoDigit(this.TotalKamTarget.May + currentValue);
          total += currentValue;
          //total = this.maskToTwoDigit(total + currentValue);
        }
        currentValue = 0;
        currentValue = this.gridData[index]['targets'][ZerothIndex]["Nov"];
        if(!isNaN(Number(currentValue))) {
          this.gridData[index]['targets'][ZerothIndex]["Nov"] = this.maskToTwoDigit(currentValue);
          currentValue = this.maskToTwoDigit(Number(currentValue));
          this.TotalKamTarget.Nov = this.maskToTwoDigit(this.TotalKamTarget.Nov + currentValue);
          total += currentValue;
          //total = this.maskToTwoDigit(total + currentValue);
        }
        currentValue = 0;
        currentValue = this.gridData[index]['targets'][ZerothIndex]["Oct"];
        if(!isNaN(Number(currentValue))) {
          this.gridData[index]['targets'][ZerothIndex]["Oct"] = this.maskToTwoDigit(currentValue);
          currentValue = this.maskToTwoDigit(Number(currentValue));
          this.TotalKamTarget.Oct = this.maskToTwoDigit(this.TotalKamTarget.Oct + currentValue);
          total += currentValue;
          //total = this.maskToTwoDigit(total + currentValue);
        }
        currentValue = 0;
        currentValue = this.gridData[index]['targets'][ZerothIndex]["Sep"];
        if(!isNaN(Number(currentValue))) {
          this.gridData[index]['targets'][ZerothIndex]["Sep"] = this.maskToTwoDigit(currentValue);
          currentValue = this.maskToTwoDigit(Number(currentValue));
          this.TotalKamTarget.Sep = this.maskToTwoDigit(this.TotalKamTarget.Sep + currentValue);
          total += currentValue;
          //total = this.maskToTwoDigit(total + currentValue);
        }
        currentValue = 0;
        currentValue = this.gridData[index]['targets'][ZerothIndex]["Dec"];
        if(!isNaN(Number(currentValue))) {
          this.gridData[index]['targets'][ZerothIndex]["Dec"] = this.maskToTwoDigit(currentValue);
          currentValue = this.maskToTwoDigit(Number(currentValue));
          this.TotalKamTarget.Dec = this.maskToTwoDigit(this.TotalKamTarget.Dec + currentValue);
          total += currentValue;
          //total = this.maskToTwoDigit(total + currentValue);
        }
        this.gridData[index]['targets'][ZerothIndex]["FYPlan"] = this.maskToTwoDigit(total);
        i++;
      }

      this.TotalKamTarget.FYPlan = this.maskToTwoDigit(this.TotalKamTarget.Jan + 
                                   this.TotalKamTarget.Feb + 
                                   this.TotalKamTarget.Mar + 
                                   this.TotalKamTarget.Apr + 
                                   this.TotalKamTarget.May + 
                                   this.TotalKamTarget.Jun + 
                                   this.TotalKamTarget.Jul + 
                                   this.TotalKamTarget.Aug + 
                                   this.TotalKamTarget.Sep + 
                                   this.TotalKamTarget.Oct + 
                                   this.TotalKamTarget.Nov + 
                                   this.TotalKamTarget.Dec);

      this.TotalKamTargetPercentage = new KamTarget();
      this.TotalKamTargetPercentage.Jan = this.getPercentValue(this.TotalKamTarget.Jan, this.gridData[index]['approvalPercent']);
      this.TotalKamTargetPercentage.Feb = this.getPercentValue(this.TotalKamTarget.Feb, this.gridData[index]['approvalPercent']);
      this.TotalKamTargetPercentage.Mar = this.getPercentValue(this.TotalKamTarget.Mar, this.gridData[index]['approvalPercent']);
      this.TotalKamTargetPercentage.Apr = this.getPercentValue(this.TotalKamTarget.Apr, this.gridData[index]['approvalPercent']);
      this.TotalKamTargetPercentage.May = this.getPercentValue(this.TotalKamTarget.May, this.gridData[index]['approvalPercent']);
      this.TotalKamTargetPercentage.Jun = this.getPercentValue(this.TotalKamTarget.Jun, this.gridData[index]['approvalPercent']);
      this.TotalKamTargetPercentage.Jul = this.getPercentValue(this.TotalKamTarget.Jul, this.gridData[index]['approvalPercent']);
      this.TotalKamTargetPercentage.Aug = this.getPercentValue(this.TotalKamTarget.Aug, this.gridData[index]['approvalPercent']);
      this.TotalKamTargetPercentage.Sep = this.getPercentValue(this.TotalKamTarget.Sep, this.gridData[index]['approvalPercent']);
      this.TotalKamTargetPercentage.Oct = this.getPercentValue(this.TotalKamTarget.Oct, this.gridData[index]['approvalPercent']);
      this.TotalKamTargetPercentage.Nov = this.getPercentValue(this.TotalKamTarget.Nov, this.gridData[index]['approvalPercent']);
      this.TotalKamTargetPercentage.Dec = this.getPercentValue(this.TotalKamTarget.Dec, this.gridData[index]['approvalPercent']);

      this.TotalKamTargetPercentage.FYPlan = this.maskToTwoDigit(this.TotalKamTargetPercentage.Jan + 
                                      this.TotalKamTargetPercentage.Feb + 
                                      this.TotalKamTargetPercentage.Mar + 
                                      this.TotalKamTargetPercentage.Apr + 
                                      this.TotalKamTargetPercentage.May + 
                                      this.TotalKamTargetPercentage.Jun + 
                                      this.TotalKamTargetPercentage.Jul + 
                                      this.TotalKamTargetPercentage.Aug + 
                                      this.TotalKamTargetPercentage.Sep + 
                                      this.TotalKamTargetPercentage.Oct + 
                                      this.TotalKamTargetPercentage.Nov + 
                                      this.TotalKamTargetPercentage.Dec);
      index++;
    }
  }

  getTotalTsValue(item: any, approvalPercent: any): any {
    let totalValue = 0;
    if(typeof item !== "undefined" && item !== null && typeof approvalPercent !== "undefined" && approvalPercent !== null) {
      totalValue += Number(this.getPercentValue(item.Jan, approvalPercent));
      totalValue += Number(this.getPercentValue(item.Feb, approvalPercent));
      totalValue += Number(this.getPercentValue(item.Mar, approvalPercent));
      totalValue += Number(this.getPercentValue(item.Apr, approvalPercent));
      totalValue += Number(this.getPercentValue(item.May, approvalPercent));
      totalValue += Number(this.getPercentValue(item.Jun, approvalPercent));
      totalValue += Number(this.getPercentValue(item.Jul, approvalPercent));
      totalValue += Number(this.getPercentValue(item.Aug, approvalPercent));
      totalValue += Number(this.getPercentValue(item.Sep, approvalPercent));
      totalValue += Number(this.getPercentValue(item.Oct, approvalPercent));
      totalValue += Number(this.getPercentValue(item.Nov, approvalPercent));
      totalValue += Number(this.getPercentValue(item.Dec, approvalPercent));
    }
    return this.maskToTwoDigit(totalValue);
  }

  FetchGridData(ChainCodes: string) {
    this.gridData = [];
    this.http.get(`Webportal/FetchTargetByChainCode?searchString=${ChainCodes}&approvalType=${this.ApprovalType}`).then(response => {
      if(IsValidResponse(response)) {
        this.gridData = response.content.data;
        this.calculatedKams();
        this.common.ShowToast('Data loaded successfully');
      } else {
        this.common.ShowToast("Fail to get KAM data");
      }
    })
  }

  LoadKam() {
    this.entity = new KAMModal();
    let MSData = JSON.parse(PostParam);
    MSData.content.searchString = "1=1 And Designation = 'KAM'";
    MSData.content.sortBy = "";
    MSData.content.pageIndex = 1;
    MSData.content.pageSize = 10;
    this.http.post("Webportal/FetchContacts", MSData).then(response => {
      if(IsValidResponse(response)) {
        let data = response.content.data;
        if(IsValidType(data)) {
          this.KamData = JSON.parse(data).Record;
        }
      } else {
        this.common.ShowToast("Fail to get KAM data");
      }
    });
  }

  onKamSelection() {
    let kamData: any = this.KamData.filter(x=>x.Gid == this.entity.KAMGid);
    if(kamData.length > 0){
      kamData = kamData[ZerothIndex];
      this.entity.KAMName = kamData.Name;
      this.LoadKAMChainData();
    }
  }

  findCurrentObject(gid: string) {
    let i = 0;
    let instance: any = null;
    while(i < this.gridData.length) {
      instance = this.gridData[i].targets.filter(i=>i.Gid == gid);
      if(instance.length > 0)
        return instance[ZerothIndex];
      i++;
    }
    return instance;
  }

  getParsedValue(passedValue: any) {
    let value: number = 0;
    try{
      if(!isNaN(Number(passedValue)))
        value = Number(passedValue);
    } catch(e) {
      value = 0;
    }
    return value;
  }

  getCurrentRowData(gid: string) {
    let instance: KamTarget = this.findCurrentObject(gid);  
    if(instance !== null) {
      this.KamInstance.push(instance);
    }
  }

  findData(tag: any, gid: string) {
    let instance: any = this.KamInstance.filter(x=>x.Gid == gid);  
    let columns = tag.closest('tr').querySelectorAll('td');
    if(columns !== null && instance.length > 0) {
      instance = instance[ZerothIndex];
      let currentTag = null;
      let i = 0;
      while(i < columns.length) {
        currentTag = null;
        currentTag = columns[i].querySelector('input[name="jan"]');
        if(currentTag != null) {
          instance.Jan = this.getParsedValue(currentTag.value);
          i++;
          continue;
        }
        currentTag = columns[i].querySelector('input[name="feb"]');
        if(currentTag != null) {
          instance.Feb = this.getParsedValue(currentTag.value);
          i++;
          continue;
        }
        currentTag = columns[i].querySelector('input[name="mar"]');
        if(currentTag != null) {
          instance.Mar = this.getParsedValue(currentTag.value);
          i++;
          continue;
        }
        currentTag = columns[i].querySelector('input[name="apr"]');
        if(currentTag != null) {
          instance.Apr = this.getParsedValue(currentTag.value);
          i++;
          continue;
        }
        currentTag = columns[i].querySelector('input[name="may"]');
        if(currentTag != null) {
          instance.May = this.getParsedValue(currentTag.value);
          i++;
          continue;
        }
        currentTag = columns[i].querySelector('input[name="jun"]');
        if(currentTag != null) {
          instance.Jun = this.getParsedValue(currentTag.value);
          i++;
          continue;
        }
        currentTag = columns[i].querySelector('input[name="jul"]');
        if(currentTag != null) {
          instance.Jul = this.getParsedValue(currentTag.value);
          i++;
          continue;
        }
        currentTag = columns[i].querySelector('input[name="aug"]');
        if(currentTag != null) {
          instance.Aug = this.getParsedValue(currentTag.value);
          i++;
          continue;
        }
        currentTag = columns[i].querySelector('input[name="sep"]');
        if(currentTag != null) {
          instance.Sep = this.getParsedValue(currentTag.value);
          i++;
          continue;
        }
        currentTag = columns[i].querySelector('input[name="oct"]');
        if(currentTag != null) {
          instance.Oct = this.getParsedValue(currentTag.value);
          i++;
          continue;
        }
        currentTag = columns[i].querySelector('input[name="nov"]');
        if(currentTag != null) {
          instance.Nov = this.getParsedValue(currentTag.value);
          i++;
          continue;
        }
        currentTag = columns[i].querySelector('input[name="dec"]');
        if(currentTag != null) {
          instance.Dec = this.getParsedValue(currentTag.value);
          i++;
          continue;
        }
        i++;
      }
    }
  }

  approveItems(val: number) {
    let table = document.getElementById('approval-table');
    let items = table.querySelectorAll('input[class="ac-data"]:checked');
    if(items.length > 0) {
      let index = 0;
      while(index < items.length) {
        this.findData(items[index], items[index].getAttribute('name'));
        index++;
      }

      this.KamInstance.map(item => {
        if(val == 1) 
          item.Status = 'Approved';
        else if(val == 0) 
          item.Status = 'Rejected';
        else 
          item.Status = '';
      });
      this.http.post("Webportal/UpdateTargetApproval", this.KamInstance).then(response => {
        this.LoadKAMChainData();
      });
    } else {
      this.common.ShowToast("Please select atleast one checkbox");
    }
  }

  readExcelData(elem: any){}
}

class KAMModal {
  KAMCode: string = "";
  KAMValue: string = "";
  KAMName: string = "";
  KAMGid: string = "";
}

class KamTarget {  
  CHContactGid: string;
  CT: number;
  ChainCode: string;
  ChainName: string;
  Channel: string;
  ContactGid: string;
  DirectIn: "In"
  Gid: string;
  FYPlan: number = 0;
  Id: number;
  Jan: number = 0;
  Feb: number = 0;
  Mar: number = 0;
  Apr: number = 0;
  Aug: number = 0;
  Jul: number = 0;
  Jun: number = 0;
  May: number = 0;
  Nov: number = 0;
  Oct: number = 0;
  Sep: number = 0;
  Dec: number = 0;
  Remakrs: string;
  MT: number;
  SCT: number;
  SMT: number;
  SS: number;
  Status: string;
  TargetYear: number;
}