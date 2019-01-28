import { Component, OnInit, Input } from '@angular/core';
import { SetService } from 'ngx-block-core';

@Component({
  selector: 'app-sucu04-weiget0040001',
  templateUrl: './sucu04-weiget0040001.component.html',
})
export class DemoComponent  {
  @Input() local = false;
  @Input() static = false;
  @Input() blockid = "-1";
  @Input() layoutid = "-1";

  @Input() sets = {
    blockId: "",
    layoutId: "",
    blockType: '',
    blockChildType: '',
    versionCode: 1,
    attributes: [],
    styles: {
      
    },
    datas: {
     
    }
  };
  setData = []

  constructor(
    public setService: SetService,
  ) { }
  ngOnInit() {
    this.baseInit();
    this.Listening();
  }


  setDataInit() {
    this.setData = [
      {
        tabName: '数据',
        datas: [
          {
            type: 'datas',
            data: [
              // { name: 'nzFormDataSource' },
            ]
          }
        ]
      },
      {
        tabName: '样式',
        datas: [
          {
            type: 'styles',
            data: [
              // {
              //   name: 'switch',
              //   inputs: { nzText: "可清除 : ", nzKeys: ['styles', 'nzAllowClear'], }
              // },

            ]
          },
        ]
      },
    ]
  }
  baseInit() {

    if (!this.local) {//非本地
      if (!this.static) {//非静态
        if (this.setService.blocksort[this.blockid]['sets'] !== "{}") {
          this.sets = this.setService.blocksort[this.blockid]['sets'];
        } else {
          this.setService.blocksort[this.blockid]['sets'] = this.sets;
        }
        this.sets.blockId = this.blockid;
        this.sets.layoutId = this.layoutid;
        this.setDataInit();
        if (typeof this.setService.setDatas[this.blockid] == 'undefined')
          this.setService.setDatas[this.blockid] = this.setData;
        this.pzListening()
        
      }
      else {//静态
        this.sets = JSON.parse(<any>this.sets);
        this.blockid = this.sets.blockId;
        this.layoutid = this.sets.layoutId;
        
      }
    }
  }
  ngOnDestroy() {
    this.setService.deleteEvent(this.blockid);	//注销	
    if (!this.static) this.setService.deleteEvent(this.blockid, 'pz')
  }


  pzListening() {
    setTimeout(() => {
      this.setService.initEvent(this.blockid, 'pz');
      this.setService.pzEvents[this.blockid].subscribe(data => {
        switch (data['type']) {
          case 'changeFormValid':
          //dosomeing
            break;

          default:
            break;
        }
      }
      )
    }, 100);

  }

  Listening() {
    setTimeout(() => {
      this.setService.initEvent(this.blockid);
      this.setService.events[this.blockid].subscribe(
        data => {
          switch (data['type']) {

            case 'editData':

              break;
            default:
              break;
          }
        }
      )
    }, !this.static ? 100 : 10);


  }


}
