import { Component, OnInit, Input } from '@angular/core';
import { Chart } from '@antv/g2/dist/g2.min.js';
import { ReplaySubject, Subscription } from 'rxjs';
import { HttpService } from 'ngx-block-core';

@Component({
  selector: 'app-yield-daily',
  templateUrl: './yield-daily.component.html',
  styleUrls: ['./yield-daily.component.less']
})
export class YieldDailyComponent implements OnInit {
  public heightSub: Subscription;
  @Input() height$: ReplaySubject<number>;
  height = 400;
  chart: Chart;
  @Input() workshopCode = "SUZ21-2F";
  @Input() shiftTypeCode = "2Shfit";
  //定时器
  private nzTimer;
  data = [];
  constructor(private http: HttpService) { }

  ngOnInit() {

    this.heightSub = this.height$.subscribe(height => {
      console.log('roundDivHeight-YieldDailyComponent', height)
      this.height = height;
      this.render(height);
    });
    setTimeout(() => {
      this.getData();
    }, 100);


    this.nzTimer = setInterval(() => {
      this.getData();
    }, 1 * 60 * 60 * 1000)
  }
  getData() {
    console.log('日良率1', this.data)
    this.http.getHttp("/yieldDashboard/workshopYeildDataByDay/" + this.workshopCode + "/" + this.shiftTypeCode + "/15").subscribe((data: any) => {
      console.log('日良率', data)
      this.data=[];
      data.data.forEach(element => {
        let date=element.timeslotDate+'';
        if(date.startsWith('0')) date=date.substring(1,6);
        this.data.splice(0, 0, { date: date, value: element.timeslotYeild })
      });

      this.render(this.height);
    });
  }
  render(height) {
    if (!this.height) return;
    if (this.data.length == 0) return;
    if (this.chart) this.chart.destroy();
    // const data = [
    //   { date: '3月3日', value: 21 },
    //   { date: '3月4日', value: 31 },
    //   { date: '3月5日', value: 41 },
    //   { date: '3月6日', value: 40 },
    //   { date: '3月7日', value: 60 },
    //   { date: '3月8日', value: 20 },
    //   { date: '3月9日', value: 40 },
    //   { date: '3月10日', value: 77 },
    //   { date: '3月11日', value: 65 },
    //   { date: '3月12日', value: 40 },
    //   { date: '3月13日', value: 60 },
    //   { date: '3月14日', value: 80 },
    //   { date: '3月15日', value: 85 },
    //   { date: '3月16日', value: 88 },
    //   { date: '3月17日', value: 66 },
    //   { date: '3月18日', value: 77 },
    //   { date: '3月19日', value: 21 },
    //   { date: '3月20日', value: 40 },
    //   { date: '3月21日', value: 60 },
    //   { date: '3月22日', value: 20 },
    //   { date: '3月23日', value: 40 },
    //   { date: '3月24日', value: 20 },
    //   { date: '3月25日', value: 20 },
    //   { date: '3月26日', value: 40 },
    //   { date: '3月27日', value: 60 },
    //   { date: '3月28日', value: 80 },
    //   { date: '3月29日', value: 85 },
    //   { date: '3月30日', value: 88 },
    //   { date: '3月31日', value: 66 },
    //   { date: '4月1日', value: 77 },
    // ];
    this.chart = new Chart({
      container: 'yieldDaily',
      autoFit: true,
      height: height - 8
    });

    this.chart.data(this.data);
    this.chart.scale({
      value: {
        min: 0,
        max: 120,
      },
    });
    this.chart.axis('date', {
      label: {
        style: {
          fill: '#ffffff',
        },
      },
    }).axis('value', {
      label: {
        style: {
          fill: '#ffffff',
        },
      },
    });

    this.chart.tooltip({
      showCrosshairs: true, // 展示 Tooltip 辅助线
      shared: true,
    });

    this.chart.line().position('date*value').label('value', {
      style: {
        fontSize: 14,
        fill: '#fff',
        fontWeight: '400'

      }
    });
    // this.chart.point().position('date*value').shape('circle');
    console.log('this.data',this.height,this.data)
    this.chart.render();
  }
  ngOnDestroy() {

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.heightSub) {
      this.heightSub.unsubscribe();
    }

  }


}
