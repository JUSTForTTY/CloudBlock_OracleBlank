import { Component, OnInit, Input } from '@angular/core';
import { Chart } from '@antv/g2/dist/g2.min.js';
import { ReplaySubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-yield-daily',
  templateUrl: './yield-daily.component.html',
  styleUrls: ['./yield-daily.component.less']
})
export class YieldDailyComponent implements OnInit {
  public heightSub: Subscription;
  @Input() height$: ReplaySubject<number>;
  height = 400;
  chart: Chart

  constructor() { }

  ngOnInit() {

    this.heightSub = this.height$.subscribe(height => {
      console.log('roundDivHeight-YieldDailyComponent', height)
      this.render(height);
    });
  }
  render(height) {
    if (this.chart) this.chart.destroy();
    const data = [
      { year: '3月3日', value: 21 },
      { year: '3月4日', value: 31 },
      { year: '3月5日', value: 41 },
      { year: '3月6日', value: 40 },
      { year: '3月7日', value: 60 },
      { year: '3月8日', value: 20 },
      { year: '3月9日', value: 40 },
      { year: '3月10日', value: 77 },
      { year: '3月11日', value: 65 },
      { year: '3月12日', value: 40 },
      { year: '3月13日', value: 60 },
      { year: '3月14日', value: 80 },
      { year: '3月15日', value: 85 },
      { year: '3月16日', value: 88 },
      { year: '3月17日', value: 66 },
      { year: '3月18日', value: 77 },
      { year: '3月19日', value: 21 },
      { year: '3月20日', value: 40 },
      { year: '3月21日', value: 60 },
      { year: '3月22日', value: 20 },
      { year: '3月23日', value: 40 },
      { year: '3月24日', value: 20 },
      { year: '3月25日', value: 20 },
      { year: '3月26日', value: 40 },
      { year: '3月27日', value: 60 },
      { year: '3月28日', value: 80 },
      { year: '3月29日', value: 85 },
      { year: '3月30日', value: 88 },
      { year: '3月31日', value: 66 },
      { year: '4月1日', value: 77 },
    ];
    this.chart = new Chart({
      container: 'yieldDaily',
      autoFit: true,
      height: height - 8
    });

    this.chart.data(data);
    this.chart.scale({
      value: {
        min: 0,
        max: 100,

      },
    });
    this.chart.axis('year',{
      label: {
        style: {
          fill: '#ffffff',
        },
      },
    }).axis('value',{
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

    this.chart.line().position('year*value').label('value', {
      style: {
        fontSize: 13,
        fill: '#fff',
        fontWeight: '1'
        
      }
    }).shape('smooth');
    // this.chart.point().position('year*value').shape('circle');

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
