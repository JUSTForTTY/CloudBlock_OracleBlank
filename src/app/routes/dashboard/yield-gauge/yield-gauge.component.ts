import { Component, Input, OnInit } from '@angular/core';
import { registerShape } from 'viser-ng';

registerShape('point', 'pointer', {
  draw(cfg, container) {
    let point = cfg.points[0]; // 获取第一个标记点
    point = this.parsePoint(point);
    const center = this.parsePoint({ // 获取极坐标系下画布中心点
      x: 0,
      y: 0
    });
    // 绘制指针
    container.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: point.x,
        y2: point.y + 15,
        stroke: cfg.color,
        lineWidth: 5,
        lineCap: 'round'
      }
    });
    return container.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 9.75,
        stroke: cfg.color,
        lineWidth: 4.5,
        fill: '#fff'
      }
    });
  }
});

const scale = [{
  dataKey: 'value',
  min: 0,
  max: 9,
  tickInterval: 1,
  nice: false
}];

const color = ['#0086FA', '#FFBF00', '#F5222D'];
@Component({
  selector: 'app-yield-gauge',
  templateUrl: './yield-gauge.component.html',
  styleUrls: ['./yield-gauge.component.less']
})
export class YieldGaugeComponent implements OnInit {
  forceFit: boolean = true;
  height = 300;
  @Input() data:any[] = [
    {value:9}
  ];
  scale = scale;

  axisLabel = {
    offset: -16,
    textStyle: {
      fontSize: 18,
      textAlign: 'center',
      textBaseline: 'middle'
    }
  };
  axisSubTickLine = {
    length: -8,
    stroke: '#fff',
    strokeOpacity: 1,
  };
  axisTickLine = {
    length: -17,
    stroke: '#fff',
    strokeOpacity: 1,
  };

  arcGuideBgStart = [0, 0.945];
  arcGuideBgEnd = [9, 0.945];
  arcGuideBgStyle = {
    stroke: '#CBCBCB',
    lineWidth: 18,
  };

  arcGuide2Start = [0, 0.945];
  arcGuide2End = [];
  arcGuide2Style = {
    stroke: '#1890FF',
    lineWidth: 18,
  };

  htmlGuidePosition = ['50%', '95%'];
  htmlGuideHtml = ""

  timer: any;
  trend: 'up' | 'down' = 'up';

  theme = require('assets/js/chartstheme.js');
  constructor() {
  }

 
  ngOnInit() {

    this.arcGuide2End=[this.data[0].value, 0.945];

    this.htmlGuideHtml = `
    <div style="width: 300px;text-align: center;">
      <p style="font-size: 20px;color: #ffffff;margin: 0;">合格率</p>
      <p style="font-size: 36px;color: #ffffff;margin: 0;">${Math.ceil(this.data[0].value * 10)}%</p>
    </div>
  `;
    console.log("初始化数据",this.data)
  }

}
