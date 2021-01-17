import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'src/providers/ajax.service';
import { ApplicationStorage } from 'src/providers/ApplicationStorage';
import { CommonService, IsValidResponse, IsValidType } from 'src/providers/common-service/common.service';
import { M_Region, PostParam, ZerothIndex } from 'src/providers/constants';

@Component({
  selector: 'app-kamchainmap',
  templateUrl: './kamchainmap.component.html',
  styleUrls: ['./kamchainmap.component.scss']
})
export class KamchainmapComponent implements OnInit {
  KamchainData: Array<any>;
  bindGridModal: Array<any>;
  KamData: Array<any>;
  ChainName: Array<any>;
  Region: any;
  MasterData: any = {};
  enablePP: boolean = false;
  entity: KAMModal;
  isUpdate: boolean = false;

  constructor(private common: CommonService, private http: AjaxService, private local: ApplicationStorage) { }

  ngOnInit() {
    this.ChainName = [];
    this.KamchainData = [];
    this.KamData = [];
    this.loadData();
    let LocalMasterData = this.local.GetMasterDataValues(M_Region, null);
    if (IsValidType(LocalMasterData)) {
      this.MasterData.M_Region = LocalMasterData;
    } else {
      this.MasterData.M_Region = [];
    }
  }

  loadData() {
    this.LoadChain();
    this.LoadKam();
    this.entity = new KAMModal();
    this.entity.KAMLoginId = '';
    this.entity.ChainCode = '';
  }

  LoadChain() {
    let MSData = JSON.parse(PostParam);
    MSData.content.searchString = "retailerChainName";
    MSData.content.sortBy = "";
    MSData.content.pageIndex = 1;
    MSData.content.pageSize = 10;
    this.http.post("Webportal/FetchReasonItems", MSData).then(response => {
      if(IsValidResponse(response)) {
        this.ChainName = response.content.data;
      } else {
        this.common.ShowToast("Fail to get KAM data");
      }
    })
  }

  LoadKam() {
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
          this.LoadGridData();
        }
      } else {
        this.common.ShowToast("Fail to get KAM data");
      }
    });
  }

  LoadGridData() {
    this.http.get("Webportal/FetchKamChain?searchString=1=1").then(response => {
      if(IsValidResponse(response)) {
        this.KamchainData = response.content.data;
        this.BuildGridData();
        this.common.ShowToast("Data loaded successfully");
      } else {
        this.common.ShowToast("Fail to get KAM data");
      }
    });
  }

  BuildGridData() {
    this.bindGridModal = [];
    if(this.KamData.length > 0 && this.KamchainData.length > 0) {
      let index = 0;
      let record = [];
      while(index < this.KamchainData.length) {
        record = this.KamData.filter(x=>x.Gid == this.KamchainData[index].ContactGid);
        if(record.length > 0) {
          let i = 0;
          let chainName = "NA";
          let chainData = [];
          while(i < record.length){
            chainName = "NA";
            chainData = this.ChainName.filter(p=>p.Code === this.KamchainData[index].ChainName);
            if(chainData.length > 0) {
              chainName = chainData[ZerothIndex].Value;
            }
            this.bindGridModal.push({
              Index: this.KamchainData[index].Id,
              KamCode: record[i].Code,
              LoginId: record[i].LoginId,
              Name: record[i].Name,
              Email: record[i].Email,
              ChainCode: this.KamchainData[index].ChainName,
              ContactGid: this.KamchainData[index].ContactGid,
              ChainName: chainName
            });
            i++;
          }
        }
        index++;
      }
    }
  }

  onKamSelection() {
    let kamData: any = this.onKamSelected(this.entity.KAMLoginId);
    this.entity.KAMName = kamData.Name;
    this.entity.KAMEmail = kamData.Email;
  }

  editCurrent(index: any) {
    let currentItem: any = this.bindGridModal.filter(x=>x.Index == index);
    if(currentItem.length > 0) {
      this.isUpdate = true;
      currentItem = currentItem[ZerothIndex];
      this.entity = new KAMModal();
      this.entity.Id = Number(index);
      this.entity.KAMLoginId = currentItem.KamCode;
      this.entity.ChainCode = currentItem.ChainCode;
      this.entity.ContactGid = currentItem.ContactGid;
      let kamData: any = this.onKamSelected(currentItem.KamCode);
      this.entity.KAMName = kamData.Name;
      this.entity.KAMEmail = kamData.Email;
      this.enablePP = true;
    }
  }

  onKamSelected(kamLoginId: string) {
    let data = this.KamData.filter(x=>x.Code == kamLoginId);
    if(data.length > 0)
      data = data[ZerothIndex];
    else
      data = null;
    return data;
  }

  ResetResult(){}

  openKamPopUp() {
    this.isUpdate = false;
    this.entity = new KAMModal();
    this.entity.KAMLoginId = '';
    this.entity.ChainCode = '';
    this.enablePP = true;
  }

  resetKamPopUp() {
    this.entity = new KAMModal();
    this.entity.KAMLoginId = '';
    this.entity.ChainCode = '';
  }

  closeKamPopUp() {
    this.enablePP = false;
  }

  LoadNextField(){}

  onChainChange() {
    let data: any = this.KamchainData.filter(x=>x.ChainName == this.entity.ChainCode);
    if(data.length > 0) {
      this.entity.ContactGid = data[ZerothIndex].ContactGid;
    }
  }

  saveRecord() {
    let requestData = new KAMMappingModal();
    // if(this.isUpdate) {
      
    // }

    if(!IsValidType(this.entity.ContactGid)) {
      this.common.ShowToast("Please select KAM Login Id.");
      return;
    }

    if(!IsValidType(this.entity.ChainCode)) {
      this.common.ShowToast("Please select chain.");
      return;
    }

    requestData.ChainName = this.entity.ChainCode;
    requestData.ContactGid = this.entity.ContactGid;
    let url: string = "";
    if(this.isUpdate) {
      url = "Webportal/UpdateKAMMapping";
      requestData.Id = this.entity.Id;
    } else 
      url = "Webportal/AddKAMMapping";

    this.enablePP = false;
    this.http.post(url, requestData).then(response => {
      if(IsValidResponse(response)) {
        this.KamchainData = response.content.data;
        this.BuildGridData();
        this.common.ShowToast("Data loaded successfully");
      } else {
        this.common.ShowToast("Fail to get KAM data");
      }
    });
  }
}

class KAMModal {
  Id: number;
  KAMLoginId: string;
  KAMName: string;
  KAMEmail: string;
  ChainCode: string;
  ChainName: string;
  ContactGid: string;
}

class KAMMappingModal {
  Id: number;
  ContactGid: string = null;
  ChainName: string = null;
}