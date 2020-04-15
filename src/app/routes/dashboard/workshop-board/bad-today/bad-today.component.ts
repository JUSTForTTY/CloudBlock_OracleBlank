import { Component, OnInit, Input } from '@angular/core';
import { Chart } from '@antv/g2/dist/g2.min.js';
import { ReplaySubject, Subscription } from 'rxjs';
import { HttpService } from 'ngx-block-core';

@Component({
  selector: 'app-bad-today',
  templateUrl: './bad-today.component.html',
  styleUrls: ['./bad-today.component.less']
})

export class BadTodayComponent implements OnInit {
  public heightSub: Subscription;
  @Input() height$: ReplaySubject<number>;
  height = null;
  chart: Chart;
  @Input() workshopCode = "SUZ21-2F";
  @Input() shiftTypeCode = "2Shfit";
  //定时器
  private nzTimer;
  data = [
    { item: '关键缺陷', count: 5, percent: 0.1 },
    { item: '主要缺陷', count: 15, percent: 0.3 },
    { item: '次要缺陷', count: 30, percent: 0.6 },
  ];
  constructor(private http: HttpService) { }

  ngOnInit() {
    this.data = [];
    this.heightSub = this.height$.subscribe(height => {
      console.log('roundDivHeight-BadTodayComponent', height)
      this.height = height;
      this.render(height);
    });
    this.getData();

    this.nzTimer = setInterval(() => {
      this.getData();
    }, 60 * 1000)

  }
  getData() {
    this.http.getHttp("/yieldDashboard/workshopDefectData/" + this.workshopCode + "/" + this.shiftTypeCode).subscribe((data: any) => {
      console.log('右上上-bad-data', data)
      this.data = [
        { item: '关键缺陷', count: 0, percent: 0.1 },
        { item: '主要缺陷', count: 0, percent: 0.3 },
        { item: '次要缺陷', count: 0, percent: 0.6 },
        { item: '其它缺陷', count: 0, percent: 0.6 },
      ];
      let sortData = {
        '关键缺陷': 0,
        '主要缺陷': 1,
        '次要缺陷': 2,
        '其它缺陷': 3,
      }
      let total = 0;
      data.data.forEach(element => {
        if (sortData[element['defectLevel']]) {
          this.data[sortData[element['defectLevel']]].count = parseInt(element.countNumber);
        } else if (element['defectLevel'] === '') {
          this.data[sortData['其它缺陷']].count = parseInt(element.countNumber);
        } else {
          this.data.push({
            item: element.defectLevel,
            count: parseInt(element.countNumber),
            percent: 0
          });
        }
        total = total + parseInt(element.countNumber);
      });
      //去除无用数据
      for (let index = 0; index < this.data.length; index++) {
        const element = this.data[index];
        if (element.count === 0) {
          this.data.splice(index, 1);
          index--
        } else {
          element.percent = Math.round(element.count / total * 100) / 100;
        }
      }
      console.log('右上上-bad-data2',total, this.data)

      this.render(this.height);
    });
  }

  render(height) {
    if (!this.height) return;
    if (this.data.length == 0) return;
    if (this.chart) this.chart.destroy();
    this.chart = new Chart({
      container: 'container',
      autoFit: true,
      height: height - 10
    });


    this.chart.coordinate('theta', {
      radius: 0.75,
    });

    this.chart.data(this.data);

    this.chart.scale('count', {
      formatter: (val) => {
        // val = val * 100 + '%';
        return val;
      },
    });
    // 声明需要进行自定义图例字段： 'item'
    this.chart.legend('item', {
      position: 'left',
      itemName: {
        style: {
          fill: '#fff',
        },
      },
      offsetX: 10,
      custom: true,                                       // 关键字段，告诉 G2，要使用自定义的图例
      items: this.data.map((obj, index) => {
        return {
          name: obj.item,                                 // 对应 itemName
          value: obj.percent,                             // 对应 itemValue
          marker: {
            symbol: 'square',                             // marker 的形状
            style: {
              r: 5,                                       // marker 图形半径
              fill: this.chart.getTheme().colors10[index],     // marker 颜色，使用默认颜色，同图形对应
            },
          },                                              // marker 配置
        };
      }),
      itemValue: {
        style: {
          fill: '#eee',
        },                                             // 配置 itemValue 样式
        formatter: val => `${Math.round(val * 100)}%`                // 格式化 itemValue 内容
      },
    });

    this.chart.tooltip({
      showTitle: false,
      showMarkers: false,
    });

    this.chart
      .interval()
      .adjust('stack')
      .position('count')
      .color('item')
      .label('count', {
        offset: -20,
        style: {
          textAlign: 'center',
          fontSize: 16,
          shadowBlur: 2,
          shadowColor: 'rgba(0, 0, 0, .45)',
          fill: '#ffffff',
        },
      })
      .tooltip('item*count', (item, count) => {
        count = count * 100 + '%';
        return {
          name: item,
          value: count,
        };
      });

    this.chart.interaction('element-active');
    this.chart.render();
  }
  ngOnDestroy() {

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.heightSub) {
      this.heightSub.unsubscribe();
    }
    if (this.nzTimer) {
      clearInterval(this.nzTimer);
    }

  }

}
