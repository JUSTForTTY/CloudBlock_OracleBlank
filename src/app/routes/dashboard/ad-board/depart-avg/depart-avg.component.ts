import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

import { HttpService, PageService } from 'ngx-block-core';
import { Observable } from 'rxjs';
import { RpsBoardService, WorkShop, FactoryCode } from '../../rps-board/rps-board.service';
import { ActivatedRoute } from '@angular/router';

const sourceData = [
  { name: 'WEEK1', 'PE': 5.5, 'EE': 4.5, 'TE': 3.9, 'AE': 3.1, 'JE': 2.0 },
  { name: 'WEEK2', 'PE': 3.3, 'EE': 2.3, 'TE': 3.4, 'AE': 4.9, 'IT': 5.2, 'JE': 3.5 },
  { name: 'WEEK3', 'PE': 4.2, 'EE': 3.2, 'AE': 6.6, 'IT': 4.7, 'JE': 3.3 },
  { name: 'WEEK4', 'PE': 5.2, 'EE': 2.8, 'TE': 2.2, 'AE': 1.3, 'IT': 5.4, 'JE': 2.0 }
];
const Fields = ['PE', 'EE', 'TE', 'AE', 'IT', 'JE']
const sourceData2 = [
  { name: 'WEEK1', 'PE': 18, 'EE': 28, 'TE': 12, 'AE': 34, 'IT': 21, 'JE': 20 },
  { name: 'WEEK2', 'PE': 12, 'EE': 23, 'TE': 32, 'AE': 21, 'IT': 23, },
  { name: 'WEEK3', 'PE': 18, 'TE': 12, 'AE': 26, 'IT': 12, 'JE': 33 },
  { name: 'WEEK4', 'PE': 14, 'EE': 28, 'TE': 22, 'AE': 21, 'IT': 32, 'JE': 20 }
];
const Fields2 = ['PE', 'EE', 'TE', 'AE', 'IT', 'JE']

const sourceData3 = [
  { name: 'WEEK1', 'SMT': 18, 'WAVE': 28, 'COATING': 39, 'ATP': 64, },
  { name: 'WEEK2', 'SMT': 12, 'WAVE': 23, 'COATING': 34, 'ATP': 45, },
  { name: 'WEEK3', 'SMT': 18, 'WAVE': 32, 'COATING': 45, 'ATP': 74, },
  { name: 'WEEK4', 'SMT': 14, 'WAVE': 28, 'COATING': 22, 'ATP': 33, }
];
const Fields3 = ['SMT', 'WAVE', 'COATING', 'ATP']


const Label = ['总数', function (val) {

  return {
    position: 'middle',
    offset: 0,
    textStyle: {
      fill: '#fff',
      fontSize: 12,
      shadowBlur: 2,
      shadowColor: 'rgba(0, 0, 0, .45)'
    },
    formatter: function formatter(text) {
      return text;
    }
  };
}]

enum EpageType {
  部门响应时间, 部门维修时间, 工段总时间, 部门响应, 工段响应, 工厂响应
}
interface AvgItem {
  Dept_Desc: string,//"EC/OPR_EC_ENG"
  FMainComDate: number,//"26.4"
  FRespDate: number,//"12.6"
  FStopDate: number,//"495.2"
  WeekCount: number,//"17"
}

@Component({
  selector: 'app-depart-avg',
  templateUrl: './depart-avg.component.html',
  styleUrls: ['./depart-avg.component.less']
})
export class DepartAvgComponent implements OnInit {
  @Input() title = "部门-平均响应时间统计";
  @Input() type: EpageType = EpageType.部门响应时间;
  @Input() lineNum = 0;
  @Input() avg = true;
  @Input() FKind: 'DEPT' | '' | 'Test' = 'DEPT'
  theme = require('assets/js/chartstheme.js');
  forceFit: boolean = true;
  height: number = 400;
  adjust = [{
    type: 'dodge',
    marginRatio: 1 / 32,
  }];
  label = Label
  data;
  Fields: Set<string> = new Set();
  constructor(private http: HttpService, private rpsBoardService: RpsBoardService, private route: ActivatedRoute) { }

  setWeek(weekIndex, weekNum, AbnormalInfo: AvgItem[],avg=true) {
    const weeks = new Set<number>();
    for (const iterator of AbnormalInfo) {
      if(avg){
        weeks.add(parseInt(iterator.WeekCount + ''))
      }else{
        for (const key in iterator) {
          if (Object.prototype.hasOwnProperty.call(iterator, key)) {
            const element = iterator[key];
            if(key.length<=2&& typeof element==='number'){
              weeks.add(parseInt(key + ''))
            }
          }
        }
      }
      if (weeks.size >= 4) break;
    }
    const arr=Array.from(weeks).sort((a,b)=> a-b);

    for (let index = 0; index < arr.length; index++) {
      weekIndex[arr[index]]=index;
      weekNum['WEEK'+(index+1)]=arr[index];
    }
    console.log('setWeek',arr,weekIndex,weekNum)


  }
  getSource(): Observable<any> {
    return new Observable<any>(o => {
      const weekIndex = {
        // '16': '0',
        // '17': '1',
        // '18': '2',
        // '19': '3',
      }
      const weekNum = {
        'WEEK1': '16',
        'WEEK2': '17',
        'WEEK3': '18',
        'WEEK4': '19',
      }

      const sourceData = [
        { name: 'WEEK1' },
        { name: 'WEEK2' },
        { name: 'WEEK3' },
        { name: 'WEEK4' }
      ]
      const url = 'http://172.16.8.28:8088/api/getAbInfoBySecOrDept';
      let factoryCode = FactoryCode[this.workShopCode];

      this.http.postHttpAllUrl(url, { FactoryCode: factoryCode, FKind: this.FKind, FWay: this.avg ? '1' : "0" }).subscribe(
        (res: { data: { AbnormalInfo: AvgItem[], errorcode: number } }) => {
          const data = res.data
          console.log('data,getSource', data)
          if (data.errorcode + '' !== '0') {
            o.error(data);
            o.complete();
          }
          else {
            if (this.type >= 3) {
              this.setWeek(weekIndex,weekNum,data.AbnormalInfo,false)
              // num
              for (const item of data.AbnormalInfo) {
                const desc = getDesc(item.Dept_Desc)
                for (const iterator of sourceData) {
                  const week = weekNum[iterator.name];
                  if (item[week]) {
                    iterator[desc] = parseFloat(item[week] + '')
                    this.Fields.add(desc);
                  }
                }
              }
            } else {
              this.setWeek(weekIndex,weekNum,data.AbnormalInfo,true)

              // avg
              for (const iterator of data.AbnormalInfo) {
                const index = weekIndex[iterator.WeekCount];
                const desc = getDesc(iterator.Dept_Desc)
                const timeAvg = (this.type === EpageType.部门响应时间 ? iterator.FRespDate : (this.type === EpageType.部门维修时间 ? iterator.FMainComDate : iterator.FStopDate))
                sourceData[index][desc] = parseFloat(timeAvg + '')
                this.Fields.add(desc);
              }
            }

            o.next(sourceData)
            o.complete();
          }

        }
      )
    })

  }
  ngOnInit() {
    console.log('init')
    if (this.type === EpageType.工段总时间 || this.type === EpageType.工段响应) this.FKind = 'Test';
    else if (this.type === EpageType.工厂响应) this.FKind = '';
    this.getRouteParam()
    this.getSource().subscribe(
      sourceData => {
        let source
        let fields
        source = sourceData
        console.log('set,getSource', this.Fields, source)
        fields = Array.from(this.Fields);
        const dv = new DataSet.View().source(source);
        dv.transform({
          type: 'fold',
          fields: fields,
          key: '部门',
          value: '总数',
        });
        const data = dv.rows;
        this.data = data;
        this.text = {
          position: 'start',
          style: {
            fill: '#fff',
            fontSize: 15,
            fontWeight: 'normal'
          },
          content: '合格线' + this.lineNum,
          offsetY: -3,
          offsetX: -20
        };
      }
    )

  }

  color = ['name', function (name) {
    console.log('name', name)
    switch (name) {
      case 'WEEK1':
        return '#3aa1ff'
      case 'WEEK2':
        return '#4ecb73'
      case 'WEEK3':
        return '#fcce72'
      case 'WEEK4':
        return '#8543e0'

      default:
        break;
    }
    return null;
  }]

  // start2:any={ '部门': 'PE', '总数': 5 };
  start2: any = (xScale, yScale) => {
    const max = yScale.总数.max;
    if (max > this.lineNum) {
      const start = ((max - this.lineNum) / max) * 100
      return ['0%', start + '%']
    } else
      return []; // 位置信息
  };


  // end:any=['30%', '50%'];
  end: any = (xScale, yScale) => {
    const max = yScale.总数.max;
    if (max > this.lineNum) {
      const start = ((max - this.lineNum) / max) * 100
      return ['100%', start + '%']
    } else
      return []; // 位置信息
  };
  text = {
    position: 'end',
    style: {
      fill: '#fff',
      fontSize: 15,
      fontWeight: 'normal'
    },
    content: '',
    offsetY: -5,
    offsetX: -15
  };
  lineStyle = {
    stroke: 'red',
    lineWidth: 2,
    lineDash: [3, 3]
  };
  workShopCode = ''
  getRouteParam() {
    const workShop = this.rpsBoardService.getRouteParam(this.route);
    this.workShopCode = workShop.workShopCode;
  }

}

function getDesc(name: string) {
  const arr = name.split('/');
  if (!arr.length) return name;
  return arr[arr.length - 1].replace('OPR_', '').replace('_ENG', '').replace('_PRD', '')
}