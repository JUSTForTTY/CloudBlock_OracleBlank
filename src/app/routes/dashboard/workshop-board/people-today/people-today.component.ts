import { Component, OnInit, Input } from '@angular/core';
import { Chart } from '@antv/g2/dist/g2.min.js';
import { ReplaySubject, Subscription } from 'rxjs';
import { HttpService } from 'ngx-block-core';
@Component({
  selector: 'app-people-today',
  templateUrl: './people-today.component.html',
  styleUrls: ['./people-today.component.less']
})

export class PeopleTodayComponent implements OnInit {
  public heightSub: Subscription;
  @Input() height$: ReplaySubject<number>;
  height = null;
  chart: Chart;
  @Input() workshopCode = "SUZ21-2F";
  @Input() shiftTypeCode = "2Shfit";
  //定时器
  private nzTimer;
  data = [];

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.heightSub = this.height$.subscribe(height => {
      console.log('roundDivHeight-BadTodayComponent', height)
      this.height = height;
      this.render(height);
    });
    this.getData();

    this.nzTimer = setInterval(() => {
      this.getData();
    }, 2 * 60 * 1000)
  }
  total = 0;
  getData() {
    this.http.getHttp("/yieldDashboard/workshopShiftData/" + this.workshopCode + "/" + this.shiftTypeCode).subscribe((data: any) => {
      this.data = [];
      console.log('右上上-people-data', data)
      this.total = 0;
      data.data.forEach(element => {
        this.data.push({
          item: element.workerTypeName,
          count: parseInt(element.countNumber),
          percent: 0
        })
        this.total = this.total + parseInt(element.countNumber)
      });
      this.data.forEach(element => {
        element.percent = Math.round(element.count / this.total * 100) / 100;
      });
      console.log('右上上-people-data2', this.data)
      this.render(this.height);
    });
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
  render(height) {
    if (!this.height) return;
    if (this.data.length == 0) return;
    if (this.chart) this.chart.destroy();
    // const data = [
    //   { item: '领班', count: 40, percent: 0.4 },
    //   { item: 'PE技术员', count: 21, percent: 0.21 },
    //   { item: 'TE技术员', count: 17, percent: 0.17 },
    //   { item: 'QA巡检员', count: 13, percent: 0.13 },
    //   { item: '员工', count: 9, percent: 0.09 },
    // ];
    this.chart = new Chart({
      container: 'people',
      autoFit: true,
      height: height - 10
    });
    this.chart.data(this.data);
    this.chart.scale('percent', {
      formatter: (val) => {
        val = val * 100 + '%';
        return val;
      },
    });
    this.chart.legend('item', {
      position: 'left',
      itemName: {
        style: {
          fill: '#fff',
        },
      },
      offsetX: 10,
    });
    this.chart.coordinate('theta', {
      radius: 0.75,
      innerRadius: 0.55,
    });
    // 辅助文本
    this.chart
      .annotation()
      .text({
        position: ['50%', '50%'],
        content: '在岗',
        style: {
          fontSize: 12,
          fill: '#eee',
          textAlign: 'center',
          fontWeight: '200',
        },
        offsetY: -10,
      })
      .text({
        position: ['50%', '50%'],
        content: this.total + ' 人',
        style: {
          fontSize: 12,
          fill: '#eee',
          textAlign: 'center',
          fontWeight: '200'
        },
        offsetY: 10,
      })
    this.chart
      .interval()
      .adjust('stack')
      .position('percent')
      .color('item')
      .label('count', {
        offset: -10,
        style: {
          textAlign: 'center',
          fontSize: 14,
          shadowBlur: 2,
          shadowColor: 'rgba(0, 0, 0, .45)',
          fill: '#ffffff',
        },
      })
      .tooltip('item*percent', (item, percent) => {
        percent = percent * 100 + '%';
        return {
          name: item,
          value: percent,
        };
      });

    this.chart.interaction('element-active');

    this.chart.render();
  }

}
