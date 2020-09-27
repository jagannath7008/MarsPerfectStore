import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kamchainmap',
  templateUrl: './kamchainmap.component.html',
  styleUrls: ['./kamchainmap.component.scss']
})
export class KamchainmapComponent implements OnInit {
  KamchainData: Array<any>;

  constructor() { }

  ngOnInit() {
    this.KamchainData = [];
  }

}
