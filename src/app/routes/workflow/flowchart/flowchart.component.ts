
import { fromEvent as observableFromEvent, Subject } from 'rxjs';
import { Component, OnInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import * as shape from 'd3-shape';
import { AbstractControl, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { colorSets } from 'utils/color-sets';
import { HttpService } from 'ngx-block-core';
import { Router } from '@angular/router';
import { CacheService } from '@delon/cache';
//通用
const roleCurrencyList = [];
@Component({
  selector: 'flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.less']
})


export class FlowchartComponent implements OnInit {


  //新增工序名称
  addNodeName = "";
  workflowId = "";
  targetNode = [1];
  workflowUrl = "/csysworkflow";
  nodeUrl = "/csyspot";
  roleUrl = "/csysrole/listCondition";
  nodeTargertUrl = "/csyspot/condition";
  transferNodeUrl = "/csyspottrs";
  authorityUrl = "/csystrsauth";
  pageUrl = "/csyspage/listCondition";
  transferPgaeUrl = "/csystrspage";
  transferPgaeConditionUrl = "/csystrspage/listCondition";
  nodes;
  //新建工序的id
  checkChartId;
  params = {};
  //目标工序下拉框数据
  targetNodeList = [];
  //目标工序键值对
  targetNodeArray = new Array();

  form: FormGroup;
  insertForm: FormGroup;
  pageForm: FormGroup;
  editForm: FormGroup;
  opForm: FormGroup;
  conditionForm: FormGroup;
  //目标工序数据，flag为标记（包含了insert：新增）

  controlArray: Array<{ id: string, controlInstance: string, value: string, label: string, autoExcuteControl: string, autoExcute, longTime, lastTime, pageIds, desc, flag: string, authority: Array<{ key: string, title: string, direction: string, authorityId: string }>, pageData: { transferPageId: string, oldPageId: string, currentPageId: string } }> = [];
  //已删除的目标工序
  controlDeleteArray: Array<{ id: string, controlInstance: string, value: string, label: string, flag: string, authority: Array<{ key: string, title: string, direction: string, authorityId: string }> }> = [];
  //当前数据
  currentControl: { id: string, controlInstance: string, value: string, label: string, autoExcuteControl: string, autoExcute, longTime, lastTime, pageIds, desc, flag: string, authority: Array<{ key: string, title: string, direction: string, checked: boolean, authorityId: string }>, pageData: { transferPageId: string, oldPageId: string, currentPageId: string } };

  q: any = {
    status: 'all',
  };
  loading = false
  conditionisVisible = false;
  isGraphSpinning = false
  spinningText = "Loading....."
  formEditEnabled = true;
  // inputDisabled = true;
  //默认开启新增工序
  formEditStatus = false;
  screenHeight = "400px";
  isVisible = false;
  isOkLoading = false;
  submitting = false;
  deleting = false;
  isTransferVisible = false;
  saveStyling = false;
  pageValue = "";
  //当前对象集合
  roleList = [];
  pageList = [];

  data: any[] = [];
  view: any[];
  showLegend = false;
  switchValue = false;
  colorSchemes: any;
  colorScheme: any;
  schemeType: string = 'ordinal';
  colorTheme = "";
  lineStyle = "";
  orientation = "";
  layout = "";
  nodeEditName = "";
  workFlowData: object;
  symbol = ['=', '>=', '>', '<=', '<', 'like'];
  checkChartName;
  targetNodeList1 = [];
  csysPointTrsId
  pottrsconData = [];
  tableLodding = false;
  nzTitle = "迁移条件";
  editId;
  tableShow = "table";
  opData = [];
  opName;
  resourceData = [];
  skillData = [];

  //工序描述list
  pointDescList = [];

  //定义途程图数据
  hierarchialGraph = { nodes: [], links: [] };
  curve = shape.curveBundle.beta(1);

  // curve = shape.curveLinear;
  curveType: string = 'Linear';

  zoomToFit$: Subject<boolean> = new Subject();

  center$: Subject<boolean> = new Subject();

  constructor(private fb: FormBuilder, private router: Router, private msg: NzMessageService, private route: ActivatedRoute, private httpService: HttpService, private cacheService: CacheService) {
    //主题下拉框赋值
    Object.assign(this, {
      colorSchemes: colorSets,
    });
  }

  //流向下拉框赋数据
  orientations: any[] = [
    {
      label: '从左到右',
      value: 'LR'
    },
    {
      label: '从右到左',
      value: 'RL'
    },
    {
      label: '从上到下',
      value: 'TB'
    },
    {
      label: '从下到上',
      value: 'BT'
    }
  ];
  workflowlayout = [
    {
      label: '风格1',
      value: 'dagre'
    },
    {
      label: '风格2',
      value: 'dagreCluster'
    },
    {
      label: '风格3',
      value: 'd3ForceDirected'
    },
    {
      label: '风格4',
      value: 'colaForceDirected'
    }
  ];

  //线风格下拉框赋数据
  lineStyleOptions = [
    'Bundle',
    'Cardinal',
    'Catmull Rom',
    'Linear',
    'Monotone X',
    'Monotone Y',
    'Natural',
    'Step',
    'Step After',
    'Step Before'
  ];

  ngOnInit() {
    this.isGraphSpinning = true;
    //this.workflowId = this.route.snapshot.paramMap.get("workFlowId");
    this.route.queryParams.subscribe(queryParams => {
      this.workflowId = queryParams['workflowId'];
    });
    this.getPageData();
    this.getChartData();
    this.getAutoExcute();
    this.formInit();
    this.getOpData();
    this.getResource();
    //this.getSkill();
    this.getPointDescList();
    this.initialConditionFrom();
    this.initOpForm();
    this.form = this.fb.group({
      colorTheme: ['', [Validators.required]],
      lineStyle: ['', [Validators.required]],
      orientation: ['', [Validators.required]]
    });
    this.getFlowTargetNodes();
    //设置主题
    //this.setColorScheme('picnic');

    //设置线性，垂直，自然等等
    //this.setLineStyle('Step Before');

    //查询途程工序数据
    this.getWorkFlowNodes();

    //查询设置目标工序
    //this.getFlowTargetNodes();

    //获取角色信息
    //this.getRoleList();

    //设置图像高度
    this.screenHeight = window.innerHeight - 200 + 'px';

    // 监听页面
    observableFromEvent(window, 'resize')
      .subscribe((event) => {
        // 操作
        this.screenHeight = window.innerHeight - 200 + 'px';
      });


    //判断工作流是否有初始化节点，如果没有进行初始化操作。

    let params = {
      csysWorkflowId: this.workflowId,
      csysPotType: "3"
    }
    this.httpService.postHttp(this.nodeTargertUrl, params).subscribe((data: any) => {

      console.log("初始化节点数据", data.data.length);
      if (data.data.length == 0) {
        this.spinningText = "途程初始化中......";
        this.isGraphSpinning = true;

        this.insertForm.value.addNodeName = "SUCUCsysPotPublic20190412000031"
        this.insertForm.value.addNodeName1 = "开始";
        this.insertForm.value.addNodeName2 = "3";

        this.insertFlowPoint();

      }



    })

  }

  fitGraph() {
    this.zoomToFit$.next(true)
  }
  centerGraph() {
    this.center$.next(true)
  }

  // 表单初始化
  formInit() {
    //清空目标区域
    this.controlArray = [];
    this.controlDeleteArray = [];
    //根据状态初始化对应表单
    if (!this.formEditStatus) {
      this.insertForm = this.fb.group({
        resource: [null],
        opPot: [null],
        potSkill: [null],
        addNodeName: [null, [Validators.required]],
        addNodeName1: [null, [Validators.required]],
        addNodeName2: ["1", [Validators.required]],
      })
    } else {
      this.editForm = this.fb.group({
        id: [null, [Validators.required]],
        nodeEditName: [null, [Validators.required]],
        addNodeName2: [null],
        resource: [null],
        opPot: [null],
        potSkill: [null]
      })
    }
    this.pageForm = this.fb.group({
      pageId: ["", [Validators.required]]
    })
  }

  getFormControl(name: string): AbstractControl {
    //console.log("输出", this.insertForm.controls[name])
    return this.insertForm.controls[name];
  }

  //设置主题
  setColorScheme(name) {
    this.colorTheme = name;
    this.colorScheme = this.colorSchemes.find(s => s.name === name);
  }


  //设置线风格
  setLineStyle(lineStyle) {
    this.lineStyle = lineStyle;
    if (lineStyle === 'Bundle') {
      this.curve = shape.curveBundle.beta(1);
    }
    else if (lineStyle === 'Cardinal') {
      this.curve = shape.curveCardinal;
    }
    else if (lineStyle === 'Catmull Rom') {
      this.curve = shape.curveCatmullRom;
    }
    else if (lineStyle === 'Linear') {
      this.curve = shape.curveLinear;
    }
    else if (lineStyle === 'Monotone X') {
      this.curve = shape.curveMonotoneX;
    }
    else if (lineStyle === 'Monotone Y') {
      this.curve = shape.curveMonotoneY;
    }
    else if (lineStyle === 'Natural') {
      this.curve = shape.curveNatural;
    }
    else if (lineStyle === 'Step') {
      this.curve = shape.curveStep;
    }
    else if (lineStyle === 'Step After') {
      this.curve = shape.curveStepAfter;
    }
    else if (lineStyle === 'Step Before') {
      this.curve = shape.curveStepBefore;
    }
  }

  onLegendLabelClick(entry) {
    //console.log('Legend clicked', entry);
  }

  //获取工序类型
  getFlowpointType(data1): void {
    let typeValue = 2;
    // this.httpService.postHttp("/cysysflowpoint/condition").subscribe((data: any) => {
    console.log("工序类型", data1.id)
    console.log("工序类型", this.flowPointType)
    for (let index = 0; index < this.flowPointType.length; index++) {
      const element = this.flowPointType[index];
      if (element.csysPotId == data1.id) {
        console.log("工序类型", element.csysWorkflowId)
        typeValue = element.csysPotType;
        let formdata = {
          "addNodeName2": typeValue
        }
        this.editForm.patchValue(formdata);
        this.editForm.updateValueAndValidity()
        break;
      }

    }


    //});
  }
  isSpinning = false;
  clickNodeData;
  //工序点击事件
  clickNode(data) {
    console.log("点击数据", data)

    let params = {
      csysPotId: data.id,
    }
    this.httpService.postHttp(this.nodeTargertUrl, params).subscribe((data: any) => {

      console.log("点击节点参数数据", data.data[0])
      if (data.data[0].csysPotType == '3') {
        //初始化节点禁止维护。
        this.formEditEnabled = false;

      } else {
        this.formEditEnabled = true;
      }


    });

    let pageDatai = [];
    this.clickNodeData = data;
    console.log("daat", data);
    this.isSpinning = true;
    //开启修改工序
    this.formEditStatus = true;
    //清空目标区域
    this.controlArray = [];
    this.controlDeleteArray = [];
    //初始化
    this.editForm = this.fb.group({
      //addNodeName: [null, [Validators.required]],
      id: [data.id, [Validators.required]],
      nodeEditName: [data.label, [Validators.required]],
      addNodeName2: [2],
      opPot: [data.op],
      resource: [data.resource],
      potSkill: [data.skillIds],

      // nodeEditName1: [data.label, [Validators.required]]
    });
    //获取工序组

    this.getFlowpointType(data);
    //获取目标工序组
    this.getToGroupFlow(data.id)
    //目标工序数组
    // let targetjson = [];
    //获取目标工序
    this.getFlowTargetNodes();
    //获取自动完成
    //查询是否有目标工序
    let index = 0;
    if (this.hierarchialGraph.links.length > 0) {
      this.hierarchialGraph.links.forEach(element => {
        console.log("element1", this.autoExcute);
        console.log("element", element);
        let autoValue = false;
        //获得超时管控的最长最短时间
        this.httpService.getHttp(this.transferNodeUrl + "/" + element.id).subscribe((timeData: any) => {
          // this.httpService.postHttp("/csystrspage/condition").subscribe((pageData: any) => {
            // pageDatai = [];
            // pageData = pageData.data;
            // for (let j = 0; j < pageData.length; j++) {
            //   const elementpage = pageData[j];
            //   if (elementpage.csysPointTrsId == element.id) {
            //     pageDatai.push(elementpage.csysPageId);
            //   }
            // }
            //判断最短最长时间是否为0，为0赋空值
            if (timeData.data.csysPotTrsLongestTime == 0) {
              timeData.data.csysPotTrsLongestTime = null
            }
            if (timeData.data.csysPotTrsLeastTime == 0) {
              timeData.data.csysPotTrsLeastTime = null
            }
            //若当前工序编号和连接数据的源点相同，则存在目标工序
            if (element != null) {
              if (data.id == element.source) {
                for (let i = 0; i < this.autoExcute.length; i++) {
                  if (element.id == this.autoExcute[i].csysPotTrsId) {
                    if (this.autoExcute[i].csysPotTrsAutoExe == 0) {
                      autoValue = false
                    } else {
                      autoValue = true
                    }
                    console.log("aaa", element.id);
                    break;
                  }
                }
                //查询目标节点类型
                console.log("目标节点编号",element.target)
                this.httpService.getHttp("/csyspot/" + element.target).subscribe((potdata: any) => {
                  console.log("目标节点数据", potdata)
                  console.log("auto", autoValue)
                  const control = {
                    id: element.id,//工序迁移编号
                    controlInstance: element.id,//`passenger${element.id}`,//工序迁移编号
                    value: element.target,
                    label: "",
                    potType: potdata.data.csysPotStyleId,
                    autoExcuteControl: element.id + "auto",
                    autoExcute: autoValue,//自动完成的权限
                    longTime: element.id + "longTime",
                    lastTime: element.id + "lastTime",
                    desc: element.id + "desc",
                    pageIds: element.id + "pageId",
                    flag: "update",
                    authority: [],//编辑初始化时迁移权限为空
                    pageData: { transferPageId: "", oldPageId: "", currentPageId: "" }
                  };
                  console.log("数据control", control);
                  this.controlArray.push(control);
                  console.log("control", this.controlArray)
                  this.editForm.addControl(element.id, new FormControl(element.target, Validators.required));
                  this.editForm.addControl(element.id + "auto", new FormControl(autoValue, Validators.required));
                  this.editForm.addControl(element.id + "longTime", new FormControl(timeData.data.csysPotTrsLongestTime));
                  this.editForm.addControl(element.id + "lastTime", new FormControl(timeData.data.csysPotTrsLeastTime));
                  this.editForm.addControl(element.id + "desc", new FormControl(timeData.data.csysPotTrsDesc));
                  this.editForm.addControl(element.id + "pageId", new FormControl(pageDatai));
                  this.getAutoExcute();//重新获取自动执行的
                });


              }
            }
            index++;
            if (index == this.hierarchialGraph.links.length) {
              this.isSpinning = false;
            }
          })
        // });

      });
    } else {
      this.isSpinning = false;
    }


    //调整工序形状，防止变形
    this.drawWorkFlow();

  }

  //获取当前工序的目标工序
  getToGroupFlow(potid): void {
    this.targetNodeList1 = [];
    this.httpService.getHttp(this.nodeUrl + "/" + potid).subscribe((potdata: any) => {
      let groupToId = []
      //用工序组id去工序组权限表中拿取目标工序组id
      this.httpService.getHttp("/csyspotgropre").subscribe((data: any) => {

        data = data.data.list;
        console.log(data)
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          if (element.csysPotGroupFromId == potdata.data.csysPotGroupId) {
            groupToId.push(element.csysPotGroupToId)
          }
        }
        console.log("groupToId", groupToId)
        if (groupToId.length != 0) {
          for (let index = 0; index < this.targetNodeList.length; index++) {
            const element = this.targetNodeList[index];
            for (let index1 = 0; index1 < groupToId.length; index1++) {
              const element1 = groupToId[index1];
              if (element.group == element1) {
                this.targetNodeList1.push(element);
                break;
              }
            }
          }
        }
        console.log(this.targetNodeList1)

      })
    })
  }

  //点击新建工序
  addPoint() {
    this.formEditStatus = false;
    this.formInit();
  }

  //增加目标工序
  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    //添加框
    const id = "sucu" + Math.floor(Math.random() * 10000 + 1);
    const control = {
      id: `${id}`,
      controlInstance: `passenger${id}`,
      value: ``,
      label: "",
      flag: "insert",
      autoExcuteControl: `passenger${id}auto`,
      autoExcute: false,//自动完成的权限
      longTime: `passenger${id}longTime`,
      lastTime: `passenger${id}lastTime`,
      desc: `passenger${id}desc`,
      pageIds: `passenger${id}pageId`,
      checked: false,
      authority: [],//迁移权限数据初始化为空
      pageData: { transferPageId: "", oldPageId: "", currentPageId: "" }//迁移页面数据初始化为空
    };
    const index = this.controlArray.push(control);
    //console.log(control);
    //console.log(this.controlArray);
    //获取目标工序
    this.getFlowTargetNodes();
    if (!this.formEditStatus) {
      this.insertForm.addControl(this.controlArray[index - 1].controlInstance, new FormControl(null, Validators.required));
      this.insertForm.addControl(this.controlArray[index - 1].autoExcuteControl, new FormControl(false, Validators.required));
      this.insertForm.addControl(this.controlArray[index - 1].longTime, new FormControl(null));
      this.insertForm.addControl(this.controlArray[index - 1].lastTime, new FormControl(null));
      this.insertForm.addControl(this.controlArray[index - 1].desc, new FormControl(null));
      this.insertForm.addControl(this.controlArray[index - 1].pageIds, new FormControl(null));

    }
    else {
      this.editForm.addControl(this.controlArray[index - 1].controlInstance, new FormControl(null, Validators.required));
      this.editForm.addControl(this.controlArray[index - 1].autoExcuteControl, new FormControl(false, Validators.required));
      this.editForm.addControl(this.controlArray[index - 1].longTime, new FormControl(null));
      this.editForm.addControl(this.controlArray[index - 1].lastTime, new FormControl(null));
      this.editForm.addControl(this.controlArray[index - 1].desc, new FormControl(null));
      this.editForm.addControl(this.controlArray[index - 1].pageIds, new FormControl(null));
    }
    console.log("当前点击事件", this.formEditStatus)
  }

  //更新目标工序
  updateTagetPoint(value: { id: string, controlInstance: string, label: string, value: string }, data: any): void {
    //新增
    for (let i = 0; i < this.controlArray.length; i++) {
      if (this.controlArray[i].id == value.id) {
        this.controlArray[i].value == value.id;
        break;
      }
    }
    //console.log("输出：", this.controlArray);
  }
  updateAutotPoint(value, data: any): void {
    console.log("value", value)
    console.log("data", data)
    //新增
    for (let i = 0; i < this.controlArray.length; i++) {
      if (this.controlArray[i].id == value.id) {
        if (data == false) {
          this.controlArray[i].autoExcute = 0
        } else {
          this.controlArray[i].autoExcute = 1
        }
        break;
      }
    }
    console.log("输出：", this.controlArray);
  }
  //移除目标工序
  removeField(i: { id: string, controlInstance: string, value: string, label: "", autoExcuteControl: string, autoExcute, longTime, lastTime, pageIds, desc, flag: "", authority: Array<{ key: string, title: string, direction: string, authorityId: string }>, pageData: { transferPageId: "", oldPageId: "", currentPageId: "" } }, e: MouseEvent): void {
    e.preventDefault();
    //第一步
    if (this.controlArray.length > 0) {
      const index = this.controlArray.indexOf(i);
      let flag = this.controlArray[index].flag;
      //若当前目标工序为新增工序，则移除目标工序对象；
      //if (flag == "insert") this.controlArray.splice(index, 1);
      //若当前操作为修改，则将当前目标工序连接标记设置为已删除，并存入删除数组中
      if (flag == "update") {
        this.controlArray[index].flag = "delete";
        this.controlDeleteArray.push(this.controlArray[index]);
      }
      //移除显示 
      this.controlArray.splice(index, 1);
      if (!this.formEditStatus) this.insertForm.removeControl(i.controlInstance);
      else this.editForm.removeControl(i.controlInstance);
    }
  }


  //新增或修改工序
  _submitForm() {
    this.submitting = true;
    this.isGraphSpinning = true;

    if (this.formEditStatus) {
      //console.log("修改工序");
      this.updateFlowPoint();
    } else {
      //console.log("新增工序");
      //第一步：新增工序
      this.insertFlowPoint();
    }
  }

  getStyleId(csysPotPublicId): void {
    this.httpService.putHttp("/csyspotpublic" + "/" + csysPotPublicId).subscribe((data: any) => {

    })
  }
  flowPointMark = "none";
  //新增工序
  insertFlowPoint() {
    this.flowPointMark = "insert";
    let opId = this.insertForm.value.opPot;
    let rId = this.insertForm.value.resource;
    let skillIds = this.insertForm.value.potSkill;
    //当选择资源的时候必须选择工序
    if (rId && !opId) {
      this.msg.error("选择资源，必须选工序");
      this.submitting = false;
      this.isGraphSpinning = false;
      return;
    }
    //第一步从公共工序获取样式名称
    this.httpService.getHttp("/csyspotpublic/" + this.insertForm.value.addNodeName).subscribe((data1: any) => {
      let params = {
        "csysPotPublicId": this.insertForm.value.addNodeName,
        "csysPotName": this.insertForm.value.addNodeName1,
        "csysPotType": this.insertForm.value.addNodeName2,
        "csysWorkflowId": this.workflowId,
        "csysPotStyleId": data1.data.csysPotStyleId,
        "csysPotGroupId": data1.data.csysPotGroupId,
      }
      this.httpService.postHttp(this.nodeUrl, params).subscribe((data: any) => {
        console.log("工序新增成功", data);
        let nodeId = data.data;

        // if (this.insertForm.value.addNodeName2 == '0') {
        //   //如果是头结点，需要给头结点加入默认迁移
        //   let targetParams = {
        //     "csysWorkflowId": this.workflowId,
        //     "csysPotTrsPointId": nodeId,//迁移目标
        //     "csysPotTrsPointName": this.insertForm.value.addNodeName1
        //   };
        //   this.httpService.postHttp(this.transferNodeUrl, targetParams).subscribe((data: any) => {

        //   });
        // }



        //重新获取目标工序
        //this.getFlowTargetNodes();
        //新增途程工序
        this.insertNodes(nodeId, this.insertForm.value.addNodeName2, data1.data.csysPotStyleId, opId, rId, skillIds);
        //新增工序组 
        if (opId) {
          this.insertOpPot(nodeId, opId);
        }
        if (rId && opId) {
          this.insertPotrs(nodeId, opId, rId);
        }
        //新增资源
        if (skillIds) {
          this.insertPotSkill(nodeId, skillIds)
        }


        //this.insertTsrPage(nodeId);
      });
    })

  }

  insertTsrPage(nodeId, pageId): void {
    console.log("迁移页面data", pageId);
    for (let index = 0; index < pageId.length; index++) {
      const element = pageId[index];
      let bodyData = {
        "csysPointTrsId": nodeId,
        "csysPageId": element
      }
      this.httpService.postHttp("/csystrspage", bodyData).subscribe((data: any) => { })
    }
    // for (let index = 0; index < this.controlArray.length; index++) {
    //   const element = this.controlArray[index];
    //   if (element.pageData.currentPageId) {
    //     for (let index1 = 0; index1 < element.pageData.currentPageId.length; index1++) {
    //       const element1 = element.pageData.currentPageId[index1];
    //       let pageData = {
    //         "csysPointTrsId": nodeId,
    //         "csysPageId": element1
    //       }
    //       console.log("迁移页面body", pageData)
    //       this.httpService.postHttp("/csystrspage", pageData).subscribe((data: any) => { })
    //     }
    //   }
    // }
  }
  //修改工序
  updateFlowPoint() {
    this.flowPointMark = "update"
    //当前工序编号
    let nodeId = this.editForm.value.id;
    let nodeName = this.editForm.value.nodeEditName;
    let nodeType = this.editForm.value.addNodeName2;
    let opPotId = this.editForm.value.opPot;
    let rId = this.editForm.value.resource;
    let skillIds = this.editForm.value.potSkill;
    if (rId && !opPotId) {
      this.msg.error("选择资源，必须选工序");
      this.submitting = false;
      this.isGraphSpinning = false;
      return;
    }
    let params = {
      "csysPotId": nodeId,
      "csysPotName": nodeName,//工序名称
      "csysPotType": nodeType
    };
    //第一步：修改工序信息
    this.httpService.putHttp(this.nodeUrl, params).subscribe((data: any) => {
      /**
       * 对于修改分为以下几种情况（工序、资源或者技能）
       * 第一：原来没有选择，编辑时候重新选择，这时候执行新增，执行前判断是否选择。
       * 第二：原来选择了，现在改变原来所选择的
       * 第三：原来选择了，现在删除了
       */

      //修改途程工序
      if (this.clickNodeData.op) {
        if (this.clickNodeData.op != opPotId) this.updateOpPot(opPotId);
        if (!opPotId) this.deleteOpPot(this.clickNodeData.id);
      } else {
        if (opPotId) this.insertOpPot(this.clickNodeData.id, opPotId);
      }
      //工序资源编辑
      if (this.clickNodeData.resource) {
        if (this.clickNodeData.resource != rId) this.updateResource(this.clickNodeData.id, opPotId, rId);
        if (!rId) this.deleteRs(this.clickNodeData.id)
      } else {
        if (opPotId && rId) this.insertPotrs(this.clickNodeData.id, opPotId, rId);
      }
      //工序技能编辑
      if (this.clickNodeData.skillIds) {
        if (this.clickNodeData.skillIds != skillIds) this.updatePotSkill(this.clickNodeData.id, skillIds);
        if (!skillIds) this.deletePotSkill(this.clickNodeData.id)
      } else {
        if (skillIds) this.insertPotSkill(this.clickNodeData.id, skillIds);

      }
      this.updateNodes(nodeId, nodeName, nodeType, opPotId, rId, skillIds);
      //第二步：保存工序迁移
      this.saveFlowpointTransfer(nodeId);

    });
  }
  updateTsrPage(tsrId, pageId): void {
    console.log("迁移页面update", pageId);
    let deleteArray = []
    //获取迁移页面数据
    this.httpService.postHttp("/csystrspage/condition").subscribe((data: any) => {
      data = data.data;
      for (let index2 = 0; index2 < data.length; index2++) {
        const element2 = data[index2];
        if (element2.csysPointTrsId == tsrId) {
          deleteArray.push(element2.csysTrsPageId);
        }
      }
      //当这个节点存在迁移页面，先删除原来的再新增
      if (deleteArray.length != 0) {
        console.log("存在删除数据", deleteArray)
        for (let index3 = 0; index3 < deleteArray.length; index3++) {
          const element3 = deleteArray[index3];
          this.httpService.deleteHttp("/csystrspage/" + element3).subscribe((data: any) => { })
          if (index3 == deleteArray.length - 1) {
            //this.insertTsrPage(tsrId, pageId);
          }
        }
        //不存在数据的直接新增

      } else {
        console.log("不存在删除数据")
        //this.insertTsrPage(tsrId, pageId);
      }
    })
    // let deleteArray = [];
    // //先获取页面的迁移节点有几个
    // for (let index = 0; index < this.controlArray.length; index++) {
    //   const element = this.controlArray[index];
    //   //判断数据是否修改过，若currentPageId无数据则代表没修改，或者全部删除了
    //   this.httpService.postHttp("/csystrspage/condition").subscribe((data: any) => {
    //     data = data.data;
    //     for (let index2 = 0; index2 < data.length; index2++) {
    //       const element2 = data[index2];
    //       if (element2.csysPointTrsId == element.id) {
    //         deleteArray.push(element2.csysTrsPageId);
    //       }
    //     }
    //     //当存在数据时候
    //     if (deleteArray) {
    //       for (let index3 = 0; index3 < deleteArray.length; index3++) {
    //         const element3 = deleteArray[index3];
    //         this.httpService.deleteHttp("/csystrspage/" + element3).subscribe((data: any) => { })
    //         //删除完成时，进行新增
    //         if (index3 == deleteArray.length - 1) {
    //           if (element.pageData.currentPageId.length > 0) {
    //             for (let index1 = 0; index1 < element.pageData.currentPageId.length; index1++) {
    //               const element1 = element.pageData.currentPageId[index1];
    //               let pageData = {
    //                 "csysPointTrsId": element.id,
    //                 "csysPageId": element1
    //               }
    //               console.log("迁移页面body", pageData)
    //               this.httpService.postHttp("/csystrspage", pageData).subscribe((data: any) => { })
    //             }
    //           }
    //         }
    //       }
    //     } else {
    //       if (element.pageData.currentPageId.length > 0) {
    //         for (let index1 = 0; index1 < element.pageData.currentPageId.length; index1++) {
    //           const element1 = element.pageData.currentPageId[index1];
    //           let pageData = {
    //             "csysPointTrsId": element.id,
    //             "csysPageId": element1
    //           }
    //           console.log("迁移页面body", pageData)
    //           this.httpService.postHttp("/csystrspage", pageData).subscribe((data: any) => { })
    //         }
    //       }
    //     }
    //   })
    // }
  }
  //删除工序
  deleteFlowPoint(nodeId) {
    //获取工序信息
    let params = {

      "csysPotId": nodeId,
      "csysPotIsDelete": "1"
    };
    //第一步：修改工序信息
    this.httpService.putHttp(this.nodeUrl, params).subscribe((data: any) => {
      //console.log("工序删除成功," + data);
      //重新获取工序
      //this.getFlowTargetNodes();
      //删除途程工序
      this.deleteNodes(nodeId);
      //删除工序组权限
      this.deleteOpPot(nodeId)
      //删除oprs和potrs
      this.deleteRs(nodeId)
      //开启第三步：保存途程
      this.saveWorkFlow();
    });
  }

  //保存工序迁移
  saveFlowpointTransfer(nodeId) {
    //console.log("保存工序迁移");
    //console.log("迁移数据：", this.controlArray);
    //赋给新的变量，对this.controlArray直接操作会导致页面发生变化
    let currentControlArray = JSON.parse(JSON.stringify(this.controlArray));
    console.log("this is auto control", currentControlArray)
    //先移除无效目标数据
    /*for (const key in currentControlArray) {
      if (currentControlAr71ray[key].value == "" || currentControlArray[key].value == null) {
        delete this.controlArray[key];
      }
    }*/
    //加入已删除的目标工序
    this.controlDeleteArray.forEach(element => {
      currentControlArray.push(element);
    })

    //若目标工序不为空，则新增工序迁移
    if (currentControlArray.length > 0) {
      //循环新增工序迁移
      for (let i = 0; i < currentControlArray.length; i++) {
        console.log("循环迁移数组", currentControlArray[i])
        //if (currentControlArray[i].value != "" && currentControlArray[i].value != null) {
        //获取标记
        let transferId = currentControlArray[i].id;
        let flag = currentControlArray[i].flag;
        console.log("迁移标记", flag)
        //新增工序迁移
        if (flag == "insert") {
          console.log("新增迁移数据")
          this.insertFlowpointTransfer(nodeId, currentControlArray[i], i, currentControlArray.length - 1);
          //修改工序迁移
        } else if (flag == "update") {
          console.log("更新迁移数据")
          //修改工序迁移
          this.updateFlowpointTransfer(transferId, currentControlArray[i], i, currentControlArray.length - 1);
        } else {
          //删除工序迁移
          this.deleteFlowpointTransfer(transferId, i, currentControlArray.length - 1);
        }
        //}
      }

    }
    //开启第三步：保存途程
    this.saveWorkFlow();


  }

  //保存途程
  saveWorkFlow() {
    console.log("保存途程");
    //第三步：修改途程工序和连接数据
    //先获取途程数据
    this.httpService.getHttp(this.workflowUrl + "/" + this.workflowId).subscribe((data: any) => {
      let workFlowData = data.data;
      console.log("原途程数据", workFlowData);
      //新写入数据
      let params = {
        "csysWorkflowId": workFlowData.csysWorkflowId,
        "csysWorkflowType": workFlowData.csysWorkflowType,
        "csysWorkflowName": workFlowData.csysWorkflowName,
        "csysWorkflowColortheme": workFlowData.csysWorkflowColortheme,
        "csysWorkflowLinestyle": workFlowData.csysWorkflowLinestyle,
        "csysWorkflowOrientation": workFlowData.csysWorkflowOrientation,
        "csysWorkflowParentId": workFlowData.csysWorkflowParentId,
        "csysWorkflowVersion": workFlowData.csysWorkflowVersion,
        "csysWorkflowDueDate": workFlowData.csysWorkflowDueDate,
        "csysWorkflowDesc": workFlowData.csysWorkflowDesc,
        "csysWorkflowCreateTime": workFlowData.csysWorkflowCreateTime,
        "csysWorkflowCreateUser": workFlowData.csysWorkflowCreateUser,
        "csysWorkflowIsDelete": workFlowData.csysWorkflowIsDelete,
        //"cySysWorkflowSort": workFlowData.cySysWorkflowSort,
        "csysWorkflowNodes": JSON.stringify(this.hierarchialGraph.nodes),
        "csysWorkflowLinks": JSON.stringify(this.hierarchialGraph.links),
      }
      console.log("途程修改参数", params)
      //更改途程工序和连接数据
      this.httpService.putHttp(this.workflowUrl, params).subscribe((data: any) => {
        console.log("途程修改成功", data);
        //重绘途程图
        this.drawWorkFlow();
        this.submitting = false;
        this.getFlowTargetNodes();
        //初始化
        this.initAfterSave(workFlowData);
        this.deleting = false;
        // this.msg.success(`保存成功了！`);
        this.isGraphSpinning = false;
      });
    });
  }


  //保存通用配置
  _saveConfigure() {
    //新写入数据
    let params = {
      "csysWorkflowId": this.workflowId,
      "csysWorkflowColortheme": this.colorTheme,
      "csysWorkflowLinestyle": this.lineStyle,
      "csysWorkflowOrientation": this.layout,
    }
    //更改途程工序和连接数据
    this.httpService.putHttp(this.workflowUrl, params).subscribe((data: any) => {
      //console.log("通用配置保存成功", data);
      this.saveStyling = false;
      this.msg.success(`保存成功！`);
    });
  }

  //获取途程工序信息
  // getWorkFlowNodes() {
  //   this.httpService.getHttp(this.workflowUrl + "/" + this.workflowId).subscribe((data: any) => {
  //     let workFolowData = data.data;
  //     console.log("途程工序信息",workFolowData)
  //     //工序
  //     this.hierarchialGraph.nodes = workFolowData.csysWorkflowNodes != null ? JSON.parse(workFolowData.csysWorkflowNodes) : [];
  //     console.log("color",this.hierarchialGraph.nodes);
  //     //连接
  //     for (let index = 0; index < this.hierarchialGraph.nodes.length; index++) {
  //       const element = this.hierarchialGraph.nodes[index];
  //       this.httpService.getHttp(this.nodeUrl + "/" + element.id).subscribe((potData: any) => {
  //         console.log("potId",potData.data.csysPotId)
  //         this.httpService.getHttp("/csyspotstyle" + "/" + potData.csysPotStyleId).subscribe((styData: any) => {
  //          console.log("styId",styData);
  //         })
  //       })

  //     }
  //     this.hierarchialGraph.links = workFolowData.csysWorkflowLinks != null ? JSON.parse(workFolowData.csysWorkflowLinks) : [];
  //     //工序数据
  //     /*console.log(this.hierarchialGraph.nodes)
  //     console.log(this.hierarchialGraph.links)*/
  //     //设置主题
  //     this.setColorScheme(workFolowData.csysWorkflowColortheme);
  //     //设置线性，垂直，自然等等
  //     this.setLineStyle(workFolowData.csysWorkflowLinestyle);
  //     //设置流向
  //     this.orientation = workFolowData.csysWorkflowOrientation;
  //   })
  // }
  getWorkFlowNodes() {

    this.httpService.getHttp(this.workflowUrl + "/" + this.workflowId).subscribe((data: any) => {
      let workFolowData = data.data;
      console.log("途程工序信息", workFolowData)
      //工序
      console.log("工序信息", workFolowData.csysWorkflowNodes);
      this.hierarchialGraph.nodes = workFolowData.csysWorkflowNodes != null && workFolowData.csysWorkflowNodes != "" ? JSON.parse(workFolowData.csysWorkflowNodes) : [];
      console.log("工序信息2", this.hierarchialGraph.nodes);
      //连接
      //循环连接的工序
      // for (let index = 0; index < this.hierarchialGraph.nodes.length; index++) {
      //   this.hierarchialGraph.nodes[index]["style"] = null;
      //   //匹配相应的工序
      //   for (let index1 = 0; index1 < potData.data.list.length; index1++) {
      //     const element = potData.data.list[index1];
      //     if (this.hierarchialGraph.nodes[index].id == element.csysPotId) {
      //       for (let index2 = 0; index2 < styData.data.list.length; index2++) {
      //         const element2 = styData.data.list[index2];
      //         if (element.csysPotStyleId == element2.csysPotStyleId) {

      //           this.hierarchialGraph.nodes[index]["style"] = element2;
      //           console.log("styId", this.hierarchialGraph.nodes);
      //           break;
      //         }
      //       }
      //       break;
      //     }
      //     //匹配工序样式

      //   }
      //   // const element = this.hierarchialGraph.nodes[index];
      //   // this.httpService.getHttp(this.nodeUrl + "/" + element.id).subscribe((potData: any) => {
      //   //   console.log("potId", potData.data.csysPotId)
      //   //   this.httpService.getHttp("/csyspotstyle" + "/" + potData.csysPotStyleId).subscribe((styData: any) => {
      //   //     console.log("styId", styData);
      //   //   })
      //   // })

      // }
      this.hierarchialGraph.links = workFolowData.csysWorkflowLinks != null && workFolowData.csysWorkflowLinks != "" ? JSON.parse(workFolowData.csysWorkflowLinks) : [];

      //this.hierarchialGraph.links=[{"source":"SUCUCsysPot20190225000050","target":"SUCUCsysPot20190225000051","label":"","id":"SUCUCsysPotTrs20190225000047","stroke":"","strokeWidth":"","strokeDash":""}{"source":"SUCUCsysPot20190225000050","target":"SUCUCsysPot20190225000051","label":"","id":"SUCUCsysPotTrs20190225000047","stroke":"","strokeWidth":"","strokeDash":""},{"source":"SUCUCsysPot20190225000051","target":"SUCUCsysPot20190225000052","label":"","id":"SUCUCsysPotTrs20190225000048","stroke":"","strokeWidth":"","strokeDash":""},{"source":"SUCUCsysPot20190225000052","target":"SUCUCsysPot20190225000053","label":"","id":"SUCUCsysPotTrs20190225000049","stroke":"red","strokeWidth":"3","strokeDash":"10"},{"source":"SUCUCsysPot20190225000053","target":"SUCUCsysPot20190225000054","label":"","id":"SUCUCsysPotTrs20190225000050","stroke":"red","strokeWidth":"3","strokeDash":"10"},{"source":"SUCUCsysPot20190225000054","target":"SUCUCsysPot20190225000055","label":"","id":"SUCUCsysPotTrs20190225000051","stroke":"","strokeWidth":"","strokeDash":""},{"source":"SUCUCsysPot20190225000055","target":"SUCUCsysPot20190225000056","label":"","id":"SUCUCsysPotTrs20190225000052","stroke":"","strokeWidth":"","strokeDash":""},{"source":"SUCUCsysPot20190225000056","target":"SUCUCsysPot20190225000057","label":"","id":"SUCUCsysPotTrs20190225000053","stroke":"","strokeWidth":"","strokeDash":""},{"source":"SUCUCsysPot20190225000057","target":"SUCUCsysPot20190225000058","label":"","id":"SUCUCsysPotTrs20190225000054","stroke":"","strokeWidth":"","strokeDash":""},{"source":"SUCUCsysPot20190225000051","target":"SUCUCsysPot20190225000059","label":"","id":"SUCUCsysPotTrs20190225000055","stroke":"","strokeWidth":"","strokeDash":""},{"source":"SUCUCsysPot20190225000055","target":"SUCUCsysPot20190225000059","label":"","id":"SUCUCsysPotTrs20190225000056","stroke":"","strokeWidth":"","strokeDash":""},{"source":"SUCUCsysPot20190225000056","target":"SUCUCsysPot20190225000059","label":"","id":"SUCUCsysPotTrs20190225000057","stroke":"","strokeWidth":"","strokeDash":""},{"source":"SUCUCsysPot20190225000057","target":"SUCUCsysPot20190225000059","label":"","id":"SUCUCsysPotTrs20190225000058","stroke":"","strokeWidth":"","strokeDash":""},{"source":"SUCUCsysPot20190226000067","target":"SUCUCsysPot20190225000050","label":"","id":"SUCUCsysPotTrs20190226000068","stroke":"","strokeWidth":"","strokeDash":""}];
      //工序数据
      /*console.log(this.hierarchialGraph.nodes)*/
      console.log("当前工序信息", JSON.stringify(this.hierarchialGraph.links));

      //设置主题
      this.setColorScheme(workFolowData.csysWorkflowColortheme != null && workFolowData.csysWorkflowColortheme != "" ? workFolowData.csysWorkflowColortheme : 'cool');
      //设置线性，垂直，自然等等
      this.setLineStyle(workFolowData.csysWorkflowLinestyle != null && workFolowData.csysWorkflowLinestyle != "" ? workFolowData.csysWorkflowLinestyle : 'Monotone X');
      //设置流向
      this.layout = workFolowData.csysWorkflowOrientation != null && workFolowData.csysWorkflowOrientation != "" ? workFolowData.csysWorkflowOrientation : 'dagreCluster';

      this.isGraphSpinning = false;

    })
  }
  //获取目标工序
  getFlowTargetNodes() {
    let params = {
      "csysWorkflowId": this.workflowId
    }

    this.httpService.postHttp(this.nodeTargertUrl, params).subscribe((data: any) => {
      let targetNodedata = data.data;
      //目标工序赋值
      const children = [];
      // autoExcuteControl: `passenger${id}auto`,
      // autoExcute:
      for (let i = 0; i < targetNodedata.length; i++) {
        children.push({ label: targetNodedata[i].csysPotName, value: targetNodedata[i].csysPotId, group: targetNodedata[i].csysPotGroupId, public: targetNodedata[i].csysPotPublicId });
        this.targetNodeArray[targetNodedata[i].csysPotId] = targetNodedata[i].csysPotName;
      }
      this.targetNodeList = children;
    })
  }
  autoExcute = []
  flowPointType = []
  //获取工序自动完成和工序信息  
  getAutoExcute(): void {
    this.httpService.postHttp("/csyspottrs/condition").subscribe((data: any) => {
      this.autoExcute = data.data;

    })
    this.httpService.postHttp("/csyspot/condition").subscribe((data: any) => {
      this.flowPointType = data.data;
      console.log("data.data", this.flowPointType)
    });
  }

  //查询工序迁移（参数：源工序编号）
  getFlowpointTransfer(transferId) {
    this.httpService.getHttp(this.transferNodeUrl + "/" + transferId).subscribe((data: any) => {
      return data.data;
    });
  }

  //添加途程工序连接（参数：源工序编号，目标工序编号，工序迁移编号）
  insertLinks(nodeId, targetId, transferId, auto) {
    console.log("auto值", auto)
    if (auto == 1) {
      this.hierarchialGraph.links.push({
        source: nodeId,
        target: targetId,
        label: "",
        id: transferId,
        stroke: "red",
        strokeWidth: "1",
        strokeDash: "10"
      });
    } else {
      this.hierarchialGraph.links.push({
        source: nodeId,
        target: targetId,
        label: "",
        id: transferId,
        stroke: "",
        strokeWidth: "",
        strokeDash: ""
      });
    }

  }

  //修改途程工序连接（参数：工序迁移编号，目标工序编号）
  updateLinks(transferId, targetId, auto) {
    console.log("测试auto", auto);

    for (const key in this.hierarchialGraph.links) {
      const element = this.hierarchialGraph.links[key];
      if (element != null) {
        if (transferId == element.id) {
          if (auto == 1) {
            this.hierarchialGraph.links[key].target = targetId;
            this.hierarchialGraph.links[key]["stroke"] = "red";
            this.hierarchialGraph.links[key]["strokeWidth"] = "3";
            this.hierarchialGraph.links[key]["strokeDash"] = "10";
          } else {
            this.hierarchialGraph.links[key].target = targetId;
            this.hierarchialGraph.links[key]["stroke"] = "";
            this.hierarchialGraph.links[key]["strokeWidth"] = "";
            this.hierarchialGraph.links[key]["strokeDash"] = "";
          }
          break;
        }
      }
    }
    this.drawWorkFlow();

  }



  //删除途程工序连接（参数：工序迁移编号，目标工序编号）
  deleteLinks(transferId) {
    for (const key in this.hierarchialGraph.links) {
      if (this.hierarchialGraph.links[key] != null) {
        if (transferId == this.hierarchialGraph.links[key].id) {
          this.hierarchialGraph.links.splice(Number(key), 1);
          break;
        }
      }
    }
    //console.log("工序连接", this.hierarchialGraph.links);
  }
  deleteTrsPage(transferId): void {
    let pageDatai = [];
    this.httpService.postHttp("/csystrspage/condition").subscribe((pageData: any) => {
      pageDatai = [];
      pageData = pageData.data;
      for (let j = 0; j < pageData.length; j++) {
        const elementpage = pageData[j];
        if (elementpage.csysPointTrsId == transferId) {
          pageDatai.push(elementpage.csysPageId);
        }
      }
      for (let index = 0; index < pageDatai.length; index++) {
        const element = pageDatai[index];
        this.httpService.deleteHttp("/csystrspage/" + element).subscribe((pageData: any) => { })
      }
    })
  }
  //新增途程工序
  insertNodes(nodeId, type, styId, opId, rId, skillIds) {

    this.httpService.getHttp("/csyspotstyle/" + styId).subscribe((data: any) => {
      //途程工序数据添加新增工序
      if (type == 0) {
        this.hierarchialGraph.nodes.push({
          id: nodeId,
          label: this.insertForm.value.addNodeName1,
          position: 'x' + nodeId,
          color: data.data.csysPotStyleColor,
          shape: data.data.csysPotStyleDesc,
          op: opId,
          opName: this.opName,
          resource: rId,
          skillIds: skillIds
        });
      } else {
        this.hierarchialGraph.nodes.push({
          id: nodeId,
          label: this.insertForm.value.addNodeName1,
          position: 'x' + nodeId,
          color: data.data.csysPotStyleColor,
          shape: data.data.csysPotStyleDesc,
          op: opId,
          opName: this.opName,
          resource: rId,
          skillIds: skillIds
        });

        console.log("node测试123", this.hierarchialGraph.nodes)
      }

      //第二步：保存工序迁移
      this.saveFlowpointTransfer(nodeId);

      this.getAutoExcute();

    });

  }
  //插入工序组权限
  insertOpPot(potid, opId) {
    let opPotData = {
      "opId": opId,
      "csysPotId": potid,
      "csysWorkflowId": this.workflowId
    }
    console.log("opPotData", opPotData);

    this.httpService.postHttp("/oppot", opPotData).subscribe((data: any) => {

    });
  }
  //插入资源
  insertPotrs(potid, opId, rId): void {
    for (let index = 0; index < rId.length; index++) {
      const element = rId[index];
      let potrsData = {
        "tResourcesId": element,
        "csysPotId": potid,
        "csysWorkflowId": this.workflowId,
      }
      this.httpService.postHttp("/potrs", potrsData).subscribe((data: any) => { });

      let oprsData = {
        "tResourceId": element,
        "opId": opId,
        "csysPotId": potid,
        "csysWorkflowId": this.workflowId,
      }
      this.httpService.postHttp("/oprs", oprsData).subscribe((data: any) => { });
    }
  }
  //插入工序技能
  insertPotSkill(potid, skillIds): void {
    for (let index = 0; index < skillIds.length; index++) {
      const element = skillIds[index];
      let skillData = {
        "skillId": element,
        "csysPotId": potid,
        "csysWorkflowId": this.workflowId
      }
      this.httpService.postHttp("/potskill", skillData).subscribe((data: any) => { });
    }
  }


  //修改途程工序
  updateNodes(nodeId, nodeName, type, opid, rId, skillIds) {
    //途程工序数据添加新增工序
    for (const key in this.hierarchialGraph.nodes) {
      if (type == 0) {
        if (this.hierarchialGraph.nodes[key].id == nodeId) {
          this.hierarchialGraph.nodes[key].label = nodeName;
          // if (this.hierarchialGraph.nodes[key].op) {
          //   this.hierarchialGraph.nodes[key].op = opid;
          //   this.hierarchialGraph.nodes[key].opName = this.opName
          // }else{
          this.hierarchialGraph.nodes[key]["op"] = opid;
          this.hierarchialGraph.nodes[key]["opName"] = this.opName
          //}
          // if (this.hierarchialGraph.nodes[key].resource) {
          //   this.hierarchialGraph.nodes[key].resource = rId;
          // }else{
          this.hierarchialGraph.nodes[key]["resource"] = rId;
          this.hierarchialGraph.nodes[key]["skillIds"] = skillIds;
          //}
          break;

        }

      } else {
        if (this.hierarchialGraph.nodes[key].id == nodeId) {
          this.hierarchialGraph.nodes[key].label = nodeName;
          this.hierarchialGraph.nodes[key]["op"] = opid;
          this.hierarchialGraph.nodes[key]["opName"] = this.opName
          this.hierarchialGraph.nodes[key]["resource"] = rId;
          this.hierarchialGraph.nodes[key]["skillIds"] = skillIds;
          break;
        }
      }

    }
    this.getAutoExcute();
  }
  //修改工序组
  updateOpPot(newId): void {
    //现获取再修改
    this.httpService.postHttp("/oppot/condition").subscribe((data: any) => {
      data = data.data
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.csysPotId == this.clickNodeData.id) {
          let updateData = {
            "opPotId": element.opPotId,
            "opId": newId
          }
          this.httpService.putHttp("/oppot", updateData).subscribe((data: any) => {
          })
          break;
        }
      }
    })
  }

  updateResource(potId, opId, rId): void {
    /*
     更新potrs
     author:zeq
     remark:这里同修改工序资源，因为可能存在多个资源的情况，所以先执行删除在执行新增
     */
    let dataSource = [];
    let opDataSource = [];
    this.httpService.postHttp("/potrs/condition").subscribe((data: any) => {
      data = data.data
      this.httpService.postHttp("/oprs/condition").subscribe((opdata: any) => {
        opdata = opdata.data
        //获取当前工序存在的oprs和potrs的id
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          if (element.csysPotId == this.clickNodeData.id) {
            dataSource.push(element.potRsId);
          }
        }
        for (let index = 0; index < opdata.length; index++) {
          const element = opdata[index];
          if (element.csysPotId == this.clickNodeData.id) {
            opDataSource.push(element.opRsId);
          }
        }
        for (let index = 0; index < dataSource.length; index++) {
          const element = dataSource[index];
          this.httpService.deleteHttp("/potrs/" + element).subscribe((data: any) => {
            //当全部删除的potrs执行完之后删除oprs最后再新增
            if (index == dataSource.length - 1) {
              //删除oprs
              console.log("rs删除成功")
              for (let i = 0; i < opDataSource.length; i++) {
                const el = opDataSource[i];
                this.httpService.deleteHttp("/oprs/" + el).subscribe((data: any) => {
                  if (i == opDataSource.length - 1) {
                    //执行完毕，重新添加数据
                    console.log("oprs删除成功")
                    this.insertPotrs(potId, opId, rId)
                  }
                })
              }
            }
          })
        }
      })
    })
  }
  updatePotSkill(potId, skillId): void {
    //先删除再新增
    let delSkillId = [];
    this.httpService.postHttp("/potskill/condition").subscribe((data: any) => {
      data = data.data;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.csysPotId == potId) {
          delSkillId.push(element.potSkillId)
        }
      }
      for (let index = 0; index < delSkillId.length; index++) {
        const element = delSkillId[index];
        this.httpService.deleteHttp("/potskill/" + element).subscribe((data: any) => {
          this.insertPotSkill(potId, skillId);
        })
      }

    })
  }
  //删除途程工序
  deleteNodes(nodeId) {
    for (const key in this.hierarchialGraph.nodes) {
      if (this.hierarchialGraph.nodes[key].id == nodeId) {
        this.hierarchialGraph.nodes.splice(Number(key), 1);
        break;
      }
    }
  }
  deleteOpPot(nodeId): void {
    this.httpService.getHttp("/oppot").subscribe((data: any) => {
      data = data.data.list
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.csysPotId == this.clickNodeData.id) {
          this.httpService.deleteHttp("/oppot/" + element.opPotId).subscribe((data: any) => {
          })
          break;
        }
      }
    })
  }
  deleteRs(nodeId): void {
    /*
    删除oprs和potrs中对应工序的数据
    author：zeq-190404
    */
    //刪除oprs
    this.httpService.postHttp("/oprs/condition").subscribe((oprsData: any) => {
      let opdata = []
      oprsData = oprsData.data;
      for (let index = 0; index < oprsData.length; index++) {
        const element = oprsData[index];
        if (element.csysPotId == nodeId) {
          opdata.push(element.opRsId);
        }
      }
      for (let index = 0; index < opdata.length; index++) {
        const element = opdata[index];
        this.httpService.deleteHttp("/oprs/" + element).subscribe((data: any) => { })
      }
    })
    //刪除potrs
    this.httpService.postHttp("/potrs/condition").subscribe((potrsData: any) => {
      let potdata = []
      potrsData = potrsData.data;
      for (let index = 0; index < potrsData.length; index++) {
        const element = potrsData[index];
        if (element.csysPotId == nodeId) {
          potdata.push(element.potRsId);
        }
      }
      for (let index = 0; index < potdata.length; index++) {
        const element = potdata[index];
        this.httpService.deleteHttp("/potrs/" + element).subscribe((data: any) => { })
      }
    })
  }

  deletePotSkill(potId): void {
    this.httpService.postHttp("/potskill/condition").subscribe((data: any) => {
      data = data.data;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.csysPotId == potId) {
          this.httpService.deleteHttp("/potskill/" + element.potSkillId).subscribe((data: any) => { })
        }
      }
    })
  }
  //新增工序迁移（参数：源工序编号，目标工序）
  insertFlowpointTransfer(nodeId, control, i, length) {
    console.log("超级插入", this.insertForm.value[control.pageIds]);

    console.log("测试流1", this.formEditStatus);
    let autocontrol = control.autoExcuteControl;
    let longestime;
    let leastime;
    let auto;
    let pages = [];
    //判断最短时间不能小于最长时间

    if (!this.formEditStatus) {
      longestime = this.insertForm.value[control.longTime];
      leastime = this.insertForm.value[control.lastTime];
      auto = this.insertForm.value[autocontrol];
      pages = this.insertForm.value[control.pageIds]
    } else {
      longestime = this.editForm.value[control.longTime];
      leastime = this.editForm.value[control.lastTime];
      auto = this.editForm.value[autocontrol];
      pages = this.editForm.value[control.pageIds]
    }

    console.log("新增检测", auto)
    // if (longestime > leastime) {
    //先判断不为空，在判断大小
    if (typeof longestime == "number" && typeof leastime == "number") {
      if (longestime > leastime) {
        //目标工序编号
        let targetId = control.value;

        if (!auto) {
          control.autoExcute = 0
        } else {
          control.autoExcute = 1
        }

        console.log("新增检测", control.autoExcute)
        console.log("this is 3", this.insertForm)
        let targetParams, potType
        if (!this.formEditStatus) {
          targetParams = {
            "csysWorkflowId": this.workflowId,
            //"cySysWorkflowName": "生产2 ",
            "csysPotCurrentId": nodeId,//新增工序编号
            "csysPotTrsAutoExe": control.autoExcute,
            "csysPotCurrentName": this.insertForm.value.nodeEditName,
            "csysPotTrsPointId": control.value,//迁移目标
            "csysPotTrsPointName": this.targetNodeArray[control.value],
            "csysPotTrsLongestTime": this.insertForm.value[control.longTime],//最长时间
            "csysPotTrsLeastTime": this.insertForm.value[control.lastTime],//最短时间
            "csysPotTrsDesc": this.insertForm.value[control.desc]
          };
          potType = this.insertForm.value.addNodeName2;

        } else {
          targetParams = {
            "csysWorkflowId": this.workflowId,
            //"cySysWorkflowName": "生产2 ",
            "csysPotCurrentId": nodeId,//新增工序编号
            "csysPotTrsAutoExe": control.autoExcute,
            "csysPotCurrentName": this.editForm.value.nodeEditName,
            "csysPotTrsPointId": control.value,//迁移目标
            "csysPotTrsPointName": this.targetNodeArray[control.value],
            "csysPotTrsLongestTime": this.editForm.value[control.longTime],//最长时间
            "csysPotTrsLeastTime": this.editForm.value[control.lastTime],//最短时间
            "csysPotTrsDesc": this.editForm.value[control.desc]
          };
          potType = this.editForm.value.addNodeName2
        }
        console.log("targetParams", targetParams)
        console.log("新增工序类型检测-当前工序", potType);
        console.log("新增工序类型检测-迁移工序", control)

        //如果当前是初始化节点，将指向的节点设置为头结点
        if (potType == '3') {

          console.log("初始化节点操作-cty");

          //更改节点类型
          let uppotparams = {
            csysPotId: control.value,
            csysPotType: "0"
          }
          this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {

            targetParams.csysPotCurrentId = "";
            targetParams.csysPotCurrentName = "";

            this.httpService.postHttp(this.transferNodeUrl, targetParams).subscribe((data: any) => {
              console.log("工序迁移新建成功", data);
              let transferId = data.data;
              //添加迁移页面
              //this.insertTsrPage(transferId, pages);
              //途程添加工序连接
              this.insertLinks(nodeId, targetId, transferId, control.autoExcute);
              //新增工序迁移权限数据，和下面的保存途程先后保存顺序没有影响
              this.insertAuthority(transferId, control.authority);

              //新增迁移权限页面
              //this.insertTransferPage(transferId, this.controlArray[i].pageData.currentPageId)
              //重新获取工序迁移表
              this.getAutoExcute();
              //工序迁移全部操作完后保存途程
              if (i == length) {
                console.log("更新途程信息");
                this.saveWorkFlow();
              }
            });

          });

        } else {


          this.httpService.postHttp(this.transferNodeUrl, targetParams).subscribe((data: any) => {

            console.log("工序迁移新建成功2", data);
            let transferId = data.data;
            //添加迁移页面
            //this.insertTsrPage(transferId, pages);
            //途程添加工序连接
            this.insertLinks(nodeId, targetId, transferId, control.autoExcute);
            //新增工序迁移权限数据，和下面的保存途程先后保存顺序没有影响
            this.insertAuthority(transferId, control.authority);

            //新增迁移权限页面
            //this.insertTransferPage(transferId, this.controlArray[i].pageData.currentPageId)
            //重新获取工序迁移表
            this.getAutoExcute();
            //工序迁移全部操作完后保存途程
            if (i == length) {
              console.log("更新途程信息");
              this.saveWorkFlow();
            }
          });

          /*-------start------  若当前节点有后续节点，设置为普通节点。---------start---------*/
          //查询当前节点是头结点，则不变更类型

          //查询此迁移的当前节点

          this.httpService.getHttp("/csyspot/" + nodeId).subscribe((data: any) => {

            if (data.data.csysPotType != '0') {
              //更改节点类型
              let uppotparams = {
                csysPotId: nodeId,
                csysPotType: "1"
              }
              this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {
              });

            }

          });


          /*-------end------  若当前节点有后续节点，设置为普通节点。---------end---------*/


          /*-------start------  判断目标节点是否有后续节点，若没有，自动设置为尾节点。---------start---------*/
          let checkNextPot = {
            "csysWorkflowId": this.workflowId,
            "csysPotCurrentId": control.value
          }
          this.httpService.postHttp("/csyspottrs/condition", checkNextPot).subscribe((data: any) => {
            console.log("检测当前节点是否有后续节点", data.data)
            if (data.data.length == 0) {
              //无后续节点，将此节点设置为尾节点

              //更改节点类型
              let uppotparams = {
                csysPotId: control.value,
                csysPotType: "2"
              }
              this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {
              });
            }

          });
          /*------end-------  判断目标节点是否有后续节点，若没有，自动设置为尾节点。---------end---------*/

        }

      } else {
        this.submitting = false;
        this.getFlowTargetNodes();
        this.isGraphSpinning = false;
        this.msg.create("error", "最短时间大于最长时间，请重新输入")
      }
    } else {
      let targetId = control.value;

      if (!auto) {
        control.autoExcute = 0
      } else {
        control.autoExcute = 1
      }
      console.log("新增检测", this.insertForm.value)

      console.log("新增检测", control.autoExcute)
      console.log("this is 2", this.insertForm)
      let targetParams, potType
      if (!this.formEditStatus) {
        targetParams = {
          "csysWorkflowId": this.workflowId,
          //"cySysWorkflowName": "生产2 ",
          "csysPotCurrentId": nodeId,//新增工序编号
          "csysPotTrsAutoExe": control.autoExcute,
          "csysPotCurrentName": this.insertForm.value.nodeEditName,
          "csysPotTrsPointId": control.value,//迁移目标
          "csysPotTrsPointName": this.targetNodeArray[control.value],
          "csysPotTrsLongestTime": this.insertForm.value[control.longTime],//最长时间
          "csysPotTrsLeastTime": this.insertForm.value[control.lastTime],//最短时间
          "csysPotTrsDesc": this.insertForm.value[control.desc]
        };
        potType = this.insertForm.value.addNodeName2;

      } else {
        targetParams = {
          "csysWorkflowId": this.workflowId,
          //"cySysWorkflowName": "生产2 ",
          "csysPotCurrentId": nodeId,//新增工序编号
          "csysPotTrsAutoExe": control.autoExcute,
          "csysPotCurrentName": this.editForm.value.nodeEditName,
          "csysPotTrsPointId": control.value,//迁移目标
          "csysPotTrsPointName": this.targetNodeArray[control.value],
          "csysPotTrsLongestTime": this.editForm.value[control.longTime],//最长时间
          "csysPotTrsLeastTime": this.editForm.value[control.lastTime],//最短时间
          "csysPotTrsDesc": this.editForm.value[control.desc]
        };
        potType = this.editForm.value.addNodeName2;
      }
      console.log("targetParams", targetParams)
      console.log("新增工序类型检测-当前工序", potType);
      console.log("新增工序类型检测-迁移工序", control)

      //如果当前是初始化节点，将指向的节点设置为头结点
      if (potType == '3') {

        console.log("初始化节点操作-tty");

        //更改节点类型
        let uppotparams = {
          csysPotId: control.value,
          csysPotType: "0"
        }
        this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {

          targetParams.csysPotCurrentId = "";
          targetParams.csysPotCurrentName = "";

          this.httpService.postHttp(this.transferNodeUrl, targetParams).subscribe((data: any) => {

            console.log("工序迁移新建成功3", data);
            let transferId = data.data;
            //添加迁移页面
            //this.insertTsrPage(transferId, pages);
            //途程添加工序连接
            this.insertLinks(nodeId, targetId, transferId, control.autoExcute);
            //新增工序迁移权限数据，和下面的保存途程先后保存顺序没有影响
            this.insertAuthority(transferId, control.authority);

            //新增迁移权限页面
            //this.insertTransferPage(transferId, this.controlArray[i].pageData.currentPageId)
            //重新获取工序迁移表
            this.getAutoExcute();
            //工序迁移全部操作完后保存途程
            if (i == length) {
              console.log("更新途程信息");
              this.saveWorkFlow();
            }
          });

        });

      } else {


        this.httpService.postHttp(this.transferNodeUrl, targetParams).subscribe((data: any) => {

          console.log("工序迁移新建成功4", data);
          let transferId = data.data;
          //添加迁移页面
          //this.insertTsrPage(transferId, pages);
          //途程添加工序连接
          this.insertLinks(nodeId, targetId, transferId, control.autoExcute);
          //新增工序迁移权限数据，和下面的保存途程先后保存顺序没有影响
          this.insertAuthority(transferId, control.authority);

          //新增迁移权限页面
          //this.insertTransferPage(transferId, this.controlArray[i].pageData.currentPageId)
          //重新获取工序迁移表
          this.getAutoExcute();
          //工序迁移全部操作完后保存途程
          if (i == length) {
            console.log("更新途程信息");
            this.saveWorkFlow();
          }
        });

        /*-------start------  若当前节点有后续节点，设置为普通节点。---------start---------*/
        //查询当前节点是头结点，则不变更类型

        //查询此迁移的当前节点

        this.httpService.getHttp("/csyspot/" + nodeId).subscribe((data: any) => {

          if (data.data.csysPotType != '0') {
            //更改节点类型
            let uppotparams = {
              csysPotId: nodeId,
              csysPotType: "1"
            }
            this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {
            });

          }

        });



        /*-------end------  若当前节点有后续节点，设置为普通节点。---------end---------*/


        /*-------start------  判断目标节点是否有后续节点，若没有，自动设置为尾节点。---------start---------*/
        let checkNextPot = {
          "csysWorkflowId": this.workflowId,
          "csysPotCurrentId": control.value
        }
        this.httpService.postHttp("/csyspottrs/condition", checkNextPot).subscribe((data: any) => {
          console.log("检测当前节点是否有后续节点", data.data)
          if (data.data.length == 0) {
            //无后续节点，将此节点设置为尾节点

            //更改节点类型
            let uppotparams = {
              csysPotId: control.value,
              csysPotType: "2"
            }
            this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {
            });
          }

        });
        /*------end-------  判断目标节点是否有后续节点，若没有，自动设置为尾节点。---------end---------*/

      }

    }







  }


  //删除编辑工序
  deleteCurrentNode() {
    this.deleting = true;
    //当前工序
    let nodeId = this.editForm.value.id;
    //判断当前工序是否存在源工序和目标工序
    try {
      this.hierarchialGraph.links.forEach(element => {
        if (element.source == nodeId || element.target == nodeId) {
          //抛出异常，跳出循环
          throw new Error("error");
        }
      })
      //若无连接则删除工序
      this.deleteFlowPoint(nodeId);
    } catch (e) {
      this.deleting = false;
      this.msg.warning("对不起，当前工序存在源工序或目标工序，请删除后重试！");
    }
  }

  //修改工序迁移（参数：原工序迁移数据，新数据）
  updateFlowpointTransfer(transferId, control, i, length) {
    console.log("迁移页面data", this.editForm.value[control.pageIds]);
    let longestime = this.editForm.value[control.longTime];
    let leastime = this.editForm.value[control.lastTime];
    let pageId = this.editForm.value[control.pageIds];
    // if (longestime > leastime) {
    //先判断不为空，在判断大小
    if (typeof longestime == "number" && typeof leastime == "number") {
      console.log("超级更新", this.editForm.value)
      if (longestime > leastime) {
        let autocontrol = control.autoExcuteControl;
        console.log("this is 1", this.editForm.value[autocontrol])
        if (this.editForm.value[autocontrol] == false) {
          control.autoExcute = 0
        } else {
          control.autoExcute = 1
        }

        console.log("this is num", control.autoExcute)
        let targetParams = {
          "csysPotTrsId": transferId,
          "csysPotTrsAutoExe": control.autoExcute,
          "csysPotTrsPointId": control.value,//迁移目标
          "csysPotTrsPointName": this.targetNodeArray[control.value],//迁移目标名称
          "csysPotTrsLongestTime": this.editForm.value[control.longTime],
          "csysPotTrsLeastTime": this.editForm.value[control.lastTime],
          "csysPotTrsDesc": this.editForm.value[control.desc]
        };
        console.log("targetParamsupdate", targetParams)
        console.log("工序类型检测-当前工序", this.editForm.value.addNodeName2);
        console.log("工序类型检测-迁移工序", control)


        //如果当前是初始化节点，将指向的节点设置为头结点
        if (this.editForm.value.addNodeName2 == '3') {

          console.log("初始化节点操作");

          //更改节点类型
          let uppotparams = {
            csysPotId: control.value,
            csysPotType: "0"
          }
          this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {

            targetParams['csysPotCurrentId'] = "";
            targetParams['csysPotCurrentName'] = "";

            console.log("更新工序", targetParams)
            this.httpService.putHttp(this.transferNodeUrl, targetParams).subscribe((data: any) => {
              this.getAutoExcute()
              //console.log("工序迁移修改成功", data);
              //更新途程连接
              this.updateLinks(transferId, control.value, control.autoExcute);
              //保存工序迁移权限
              this.saveAuthority(transferId, control.authority);
              //更新页面
              this.updateTsrPage(transferId, pageId)
              //保存工序迁移权限页面
              //this.saveTransferPage(transferId, control.pageData);
              this.getAutoExcute();
              //工序迁移全部操作完后保存途程
              if (i == length) {
                this.saveWorkFlow();
              }
            });

          });

        } else {


          console.log("更新工序1", targetParams)
          this.httpService.putHttp(this.transferNodeUrl, targetParams).subscribe((data: any) => {
            this.getAutoExcute()
            //console.log("工序迁移修改成功", data);
            //更新途程连接
            this.updateLinks(transferId, control.value, control.autoExcute);
            //保存工序迁移权限
            this.saveAuthority(transferId, control.authority);
            //保存工序迁移权限页面
            //this.saveTransferPage(transferId, control.pageData);
            //更新页面
            this.updateTsrPage(transferId, pageId)
            this.getAutoExcute();
            //工序迁移全部操作完后保存途程
            if (i == length) {
              this.saveWorkFlow();
            }
          });


          /*-------start------  若当前节点有后续节点，设置为普通节点。---------start---------*/
          //查询当前节点是头结点，则不变更类型

          //查询此迁移的当前节点
          this.httpService.getHttp("/csyspottrs/" + transferId).subscribe((data: any) => {

            console.log("检测历史节点是否有后续节点", data)
            this.httpService.getHttp("/csyspot/" + data.data.csysPotCurrentId).subscribe((data: any) => {

              if (data.data.csysPotType != '0') {
                //更改节点类型
                let uppotparams = {
                  csysPotId: data.data.csysPotId,
                  csysPotType: "1"
                }
                this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {
                });

              }

            });

          });

          /*-------end------  若当前节点有后续节点，设置为普通节点。---------end---------*/


          /*-------start------  判断目标节点是否有后续节点，若没有，自动设置为尾节点。---------start---------*/
          let checkNextPot = {
            "csysWorkflowId": this.workflowId,
            "csysPotCurrentId": control.value
          }
          this.httpService.postHttp("/csyspottrs/condition", checkNextPot).subscribe((data: any) => {
            console.log("检测当前节点是否有后续节点", data.data)
            if (data.data.length == 0) {
              //无后续节点，将此节点设置为尾节点

              //更改节点类型
              let uppotparams = {
                csysPotId: control.value,
                csysPotType: "2"
              }
              this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {
              });
            }

          });
          /*------end-------  判断目标节点是否有后续节点，若没有，自动设置为尾节点。---------end---------*/

        }


      } else {
        this.submitting = false;
        this.isGraphSpinning = false;
        this.msg.create("error", "最短时间大于最长时间，请重新输入")
      }
    } else {
      let autocontrol = control.autoExcuteControl;
      if (this.editForm.value[autocontrol] == false) {
        control.autoExcute = 0
      } else {
        control.autoExcute = 1
      }
      if (!this.editForm.value[control.lastTime]) {
        this.editForm.value[control.lastTime] = 0
      }
      if (!this.editForm.value[control.longTime]) {
        this.editForm.value[control.longTime] = 0
      }
      console.log("thistime", control.autoExcute)
      let targetParams = {
        "csysPotTrsId": transferId,
        "csysPotTrsAutoExe": control.autoExcute,
        "csysPotTrsPointId": control.value,//迁移目标
        "csysPotTrsPointName": this.targetNodeArray[control.value],//迁移目标名称
        "csysPotTrsLongestTime": this.editForm.value[control.longTime],
        "csysPotTrsLeastTime": this.editForm.value[control.lastTime],
        "csysPotTrsDesc": this.editForm.value[control.desc]
      };
      console.log("targetParams", targetParams)
      console.log("工序类型检测-当前工序", this.editForm.value.addNodeName2);
      console.log("工序类型检测-迁移工序", control)
      //如果当前是初始化节点，将指向的节点设置为头结点
      if (this.editForm.value.addNodeName2 == '3') {

        console.log("初始化节点操作-更新操作");

        //更改节点类型
        let uppotparams = {
          csysPotId: control.value,
          csysPotType: "0"
        }
        this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {

          targetParams['csysPotCurrentId'] = "";
          targetParams['csysPotCurrentName'] = "";


          console.log("更新工序2", targetParams)
          this.httpService.putHttp(this.transferNodeUrl, targetParams).subscribe((data: any) => {
            this.getAutoExcute()
            console.log("工序迁移修改成功", data);
            //更新途程连接
            this.updateLinks(transferId, control.value, control.autoExcute);
            //保存工序迁移权限
            this.saveAuthority(transferId, control.authority);
            //保存工序迁移权限页面
            //更新页面
            this.updateTsrPage(transferId, pageId)
            //this.saveTransferPage(transferId, control.pageData);
            this.getAutoExcute();
            //工序迁移全部操作完后保存途程
            if (i == length) {
              this.saveWorkFlow();
            }
          });

        });

      } else {


        console.log("更新工序3", targetParams)
        this.httpService.putHttp(this.transferNodeUrl, targetParams).subscribe((data: any) => {
          this.getAutoExcute()
          //console.log("工序迁移修改成功", data);
          //更新途程连接
          this.updateLinks(transferId, control.value, control.autoExcute);
          //保存工序迁移权限
          this.saveAuthority(transferId, control.authority);
          //保存工序迁移权限页面
          //this.saveTransferPage(transferId, control.pageData);
          //更新页面
          this.updateTsrPage(transferId, pageId)
          this.getAutoExcute();
          //工序迁移全部操作完后保存途程
          if (i == length) {
            this.saveWorkFlow();
          }
        });
        /*-------start------  若当前节点有后续节点，设置为普通节点。---------start---------*/
        //查询当前节点是头结点，则不变更类型

        //查询此迁移的当前节点
        this.httpService.getHttp("/csyspottrs/" + transferId).subscribe((data: any) => {

          console.log("检测历史节点是否有后续节点", data)
          this.httpService.getHttp("/csyspot/" + data.data.csysPotCurrentId).subscribe((data: any) => {

            if (data.data.csysPotType != '0') {
              //更改节点类型
              let uppotparams = {
                csysPotId: data.data.csysPotId,
                csysPotType: "1"
              }
              this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {
              });

            }

          });

        });

        /*-------end------  若当前节点有后续节点，设置为普通节点。---------end---------*/

        /*-------start------  判断目标节点是否有后续节点，若没有，自动设置为尾节点。---------start---------*/
        let checkNextPot = {
          "csysWorkflowId": this.workflowId,
          "csysPotCurrentId": control.value
        }
        this.httpService.postHttp("/csyspottrs/condition", checkNextPot).subscribe((data: any) => {
          console.log("检测当前节点是否有后续节点", data.data)
          if (data.data.length == 0) {
            //无后续节点，将此节点设置为尾节点

            //更改节点类型
            let uppotparams = {
              csysPotId: control.value,
              csysPotType: "2"
            }
            this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {
            });
          }

        });
        /*------end-------  判断目标节点是否有后续节点，若没有，自动设置为尾节点。---------end---------*/

      }
    }
  }

  //删除工序迁移（参数：工序迁移编号），删除方法为逻辑删除
  deleteFlowpointTransfer(transferId, i, length) {
    //console.log("开始工序删除");
    let potId = "";
    //查询此迁移的当前节点
    this.httpService.getHttp("/csyspottrs/" + transferId).subscribe((data: any) => {
      potId = data.data.csysPotCurrentId;
      let targetParams = {
        "csysPotTrsId": transferId,
        "csysPotTrsIsDelete": "1"
      };
      this.httpService.putHttp(this.transferNodeUrl, targetParams).subscribe((data: any) => {
        //console.log("工序迁移删除成功", data);
        //第二步：删除目标工序 
        this.deleteLinks(transferId);
        //删除迁移权限下的页面
        this.deleteTrsPage(transferId);
        //删除工序迁移权限数据，和下面的保存途程先后保存顺序没有影响
        this.deleteAuthorityByTransferId(transferId);
        //删除迁移权限页面
        //this.deleteTransferPageByTransferId(transferId);

        /*-------start------  若当前节点有后续节点，设置为普通节点。---------start---------*/

        let checkNextPot = {
          "csysWorkflowId": this.workflowId,
          "csysPotCurrentId": potId
        }
        this.httpService.postHttp("/csyspottrs/condition", checkNextPot).subscribe((data: any) => {
          console.log("检测历史节点是否有后续节点", data)
          if (data.data.length > 0) {
            //更改节点类型
            let uppotparams = {
              csysPotId: potId,
              csysPotType: "1"
            }
            this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {
              console.log("更新节点数据", data);
              //工序迁移全部操作完后保存途程
              if (i == length) {
                this.saveWorkFlow();
              }
            });
          } else {
            //更改节点类型
            let uppotparams = {
              csysPotId: potId,
              csysPotType: "2"
            }
            this.httpService.putHttp(this.nodeUrl, uppotparams).subscribe((data: any) => {
              console.log("更新节点数据", data);
              //工序迁移全部操作完后保存途程
              if (i == length) {
                this.saveWorkFlow();
              }
            });
          }


        });
        /*-------end------  若当前节点有后续节点，设置为普通节点。---------end---------*/

      });






    });





  }


  //保存工序迁移权限
  saveAuthority(transferId, currentControl) {
    console.log("输出权限数据：", currentControl)
    currentControl.forEach(element => {
      //若工序迁移权限编号为空，且位置为左，则为新增权限
      if (element.authorityId == "" && element.direction == "right") {
        console.log("输出新增：")
        let currentControl = [];
        currentControl.push(element)
        this.insertAuthority(transferId, currentControl);
        ///若工序迁移权限编号为空，且位置为右，则为删除权限
      } else if (element.authorityId != "" && element.direction == "left") {
        console.log("输出删除：")
        this.deleteAuthority(element.authorityId);
      }
      //说明：不存在修改权限
    });
  }


  //新增工序迁移权限
  insertAuthority(transferId, currentControl) {
    console.log("新增权限数据：", currentControl);
    for (let i = 0; i < currentControl.length; i++) {
      if (currentControl[i].direction == "right") {
        let params = {
          "csysWorkflowId": this.workflowId,
          //"cySysWorkflowName": "台式机生产",
          "csysPotTrsId": transferId,
          //"cySysFlowpointTransferHandleAuthorityType": "1",
          "csysRoleId": currentControl[i].key,
          //"cySysBaseUserId": null,
          //"cySysFlowpointTransferHandleAuthorityDesc": "处理角色"
        };
        this.httpService.postHttp(this.authorityUrl, params).subscribe((data: any) => {
          console.log("工序迁移权限新增成功：", data.data);
        });
      }
    }
  }


  //通过工序迁移编号删除该工序迁移下的所有权限
  deleteAuthorityByTransferId(transferId) {
    //根据工序迁移编号，查出所有工序迁移迁移权限记录
    let params = {
      "csysPointTrsId": transferId,
    };
    this.httpService.postHttpAllUrl(this.authorityUrl + "/listCondition", params).subscribe((data: any) => {
      //console.log("需删除工序迁移权限：", data.data.list);
      //循环获取权限数据
      data.data.list.forEach(element => {
        console.log("nnnzeq");
        if (element.csysPotTrsId == transferId && element.csysWorkflowId == this.workflowId) {
          this.deleteAuthority(element.csysTrsAuthId)
        }
      });
    });
  }
  //删除工序迁移权限
  deleteAuthority(authorityId) {
    let params = {
      "csysTrsAuthId": authorityId,
      "csysTrsAuthIsDelete": "1"
    }
    this.httpService.putHttpAllUrl(this.authorityUrl, params).subscribe((data: any) => {
      //console.log("成功删除工序迁移权限：", data);
    })
  }

  //保存工序迁移页面
  saveTransferPage(transferId, pageData) {
    //若原迁移页面编号为空
    if (pageData.transferPageId == "") {
      //若当前迁移页面数据不为空则为新增
      if (pageData.currentPageId != null && pageData.currentPageId != "") this.insertTransferPage(transferId, pageData.currentPageId);
      //若原迁移页面编号不为空且当前迁移页面数据不为空
    } else if (pageData.currentPageId != null && pageData.currentPageId != "") {
      //若原迁移数据和当前迁移数据不相等则执行更新操作
      if (pageData.currentPageId != pageData.oldPageId) this.updateTransferPage(pageData.transferPageId, pageData.currentPageId);
      //若原迁移页面编号不为空且当前迁移页面数据为空
    } else if (pageData.currentPageId == null || pageData.currentPageId == "") {
      //执行删除操作
      this.deleteTransferPage(pageData.transferPageId);
    }
  }

  //新增迁移权限页面
  insertTransferPage(transferId, pageId) {
    if (pageId != null && pageId != "") {
      let params = {
        "csysPointTrsId": transferId,
        "csysPageId": pageId,
        "csysTrsPageDesc": ""
      }
      this.httpService.postHttp(this.transferPgaeUrl, params).subscribe((data: any) => {
        //console.log("迁移权限页面新建成功：", data);
      })
    }
  }

  //更新迁移权限页面
  updateTransferPage(transferPageId, pageId) {
    this.httpService.getHttp(this.transferPgaeUrl + "/" + transferPageId).subscribe((data: any) => {
      data = data.data;
      let params = {
        "csysTrsPageId": data.cySysFlowpointTransferPageId,
        "csysPointTrsId": data.cySysFlowpointTransferId,
        "csysPageId": pageId,
        "csysTrsPageDesc": data.cySysFlowpointTransferPageDesc,
        "csysTrsPageCreateTime": data.cySysFlowpointTransferPageCreateTime,
        "csysTrsPageCreateUser": data.cySysFlowpointTransferPageCreateUser
      }
      this.httpService.putHttp(this.transferPgaeUrl, params).subscribe((data: any) => {
        //console.log("权限页面更新成功：", data);
      });
    })
  }

  //根据迁移编号删除迁移权限页面
  deleteTransferPageByTransferId(transferId) {
    //根据迁移编号查询迁移权限页面
    let params = {
      "csysPointTrsId": transferId,
    }
    this.httpService.postHttp(this.transferPgaeConditionUrl, params).subscribe((data: any) => {
      data.data.list.forEach(element => {
        this.deleteTransferPage(element.csysPointTrsId);
      });
    })
  }

  //删除迁移权限页面
  deleteTransferPage(transferPageId) {
    let params = {
      "csysTrsPageId": transferPageId,
      "csysTrsPageIsDelete": "1"
    }
    this.httpService.putHttp(this.transferPgaeUrl, params).subscribe((data: any) => {
      //console.log("权限页面删除成功：", data);
    });
  }

  //重绘途程图
  drawWorkFlow() {

    // let link = this.hierarchialGraph.links;
    // let node = this.hierarchialGraph.nodes;
    // this.hierarchialGraph = { nodes: [], links: [] };
    // this.hierarchialGraph.nodes = node;
    // this.hierarchialGraph.links = link;
    this.hierarchialGraph.links = [...this.hierarchialGraph.links];
    this.hierarchialGraph.nodes = [...this.hierarchialGraph.nodes];
  }


  initAfterSave(data) {
    //清空目标区域
    this.controlArray = [];
    this.controlDeleteArray = [];
    //表单数据初始化
    this.insertForm = this.fb.group({
      addNodeName: [null, [Validators.required]],
      addNodeName1: [null, [Validators.required]],
      addNodeName2: ["1", [Validators.required]],
      opPot: [null],
      resource: [null],
      potSkill: [null],

    })

    this.editForm = this.fb.group({
      id: [null, [Validators.required]],
      nodeEditName: [null, [Validators.required]],
      addNodeName2: [null],
      opPot: [null],
      resource: [null],
      potSkill: [null],
    })

    this.pageForm = this.fb.group({
      pageId: ["", [Validators.required]]
    })
    this.formEditStatus = false;
  }

  transferreload(direction: string): void {
    //this.getRoleList();
    this.msg.success(`your clicked ${direction}!`);
  }


  // 穿梭框：选中项发生改变时的回调函数，即选中框事件
  transferselect(ret: {}): void {
    //console.log('nzSelectChange', ret);
  }

  // 穿梭框：选项在两栏之间转移时的回调函数，点击to right 或者 to left事件
  transferchange(ret: { from: string, to: string, list: [{ key: string, title: string, direction: string, checked: boolean }] }): void {
    /*
        let ids = ""
        ret.list.forEach(element => {
          ids = ids + "," + element.key + ",";
        });
        this.roleList.filter(value => ids.indexOf("," + value.key + ",") >= 0).forEach(element => {
          console.log("element", element)
          element.direction = ret.to == "right" ? "right" : "left";
        });
     */
    if (ret.to == "right") {
      ret.list.forEach(element => {
        console.log(element)
        let i = this.roleList.indexOf(element);
        this.roleList[i].direction = "right";
      });
    } else {
      ret.list.forEach(element => {
        let i = this.roleList.indexOf(element);
        this.roleList[i].direction = "left";
      });
    }
    //console.log('nzChange：', this.roleList);
  }


  //设置权限
  setAuthority(i: { id: string, controlInstance: string, value: string, label: "", autoExcuteControl: string, autoExcute, longTime, lastTime, pageIds, desc, flag: "", authority: Array<{ key: string, title: string, direction: string, checked: boolean, authorityId: string }>, pageData: { transferPageId: string, oldPageId: string, currentPageId: string } }, e: MouseEvent): void {
    let authority = i.authority;
    //查看当前迁移权限是否有数据
    if (authority.length == 0) {
      //若无迁移数据则先获取角色信息
      const roleArray = [];
      this.httpService.postHttp(this.roleUrl, {}).subscribe((data: any) => {
        data = data.data.list;
        //console.log(data);
        data.forEach(element => {
          roleArray.push({
            key: element.csysRoleId,//角色编号
            title: element.csysRoleName,//角色名称
            //description: `description of content${i + 1}`,
            direction: 'left',//默认右边
            authorityId: ''//迁移权限编号
          });
        });

        //判断当前状态是否为新增
        if (this.formEditStatus == false) {
          //若为新增则将查询的数据转换后赋值（不能直接赋值，否者会改变后者的数据）
          this.roleList = JSON.parse(JSON.stringify(roleArray));
          i.authority = roleArray;
          this.currentControl = i;
          console.log("弹出弹窗");
          this.isVisible = true;
        } else {//若为修改，则需查询当前迁移权限的原有数据
          //根据当前迁移编号，查询迁移权限数据
          let params = {
            "csysPotTrsId": i.id,
          };
          this.httpService.postHttp(this.authorityUrl + "/listCondition", params).subscribe((data: any) => {
            console.log("当前工序迁移权限数据：", data.data.list);
            data.data.list.forEach(element => {
              try {
                roleArray.forEach(role => {
                  //若权限表中的角色编号和角色表中的编号相等，则将角色中的位置标记为right即已设置
                  if (element.csysRoleId == role.key) {
                    role.direction = "right";
                    role.authorityId = element.csysTrsAuthId//工序迁移权限编号
                    //抛出异常跳出循环
                    throw new Error("error");
                  }
                })
              } catch (e) {
              }
            });
            this.roleList = JSON.parse(JSON.stringify(roleArray));
            i.authority = roleArray;
            this.currentControl = i;
            console.log("弹出弹窗");
            this.isVisible = true;
          });
        }
      })
    } else {
      //若存在数据则转换数据并赋值（不能直接赋值，否者会改变后者的数据）
      //console.log("输出数据：", authority)
      this.roleList = JSON.parse(JSON.stringify(authority));
      this.currentControl = i;
      console.log("弹出弹窗");
      this.isVisible = true;
    }
  }

  //确认设置权限
  authorityConfirm(ret: {}): void {
    this.isOkLoading = true;
    let i = this.controlArray.indexOf(this.currentControl);
    this.controlArray[i].authority = this.roleList;
    //console.log(this.controlArray)
    this.isVisible = false;
    this.isOkLoading = false;
  };

  //取消设置权限或迁移页面
  handleCancel(): void {
    this.isVisible = false;
    this.isTransferVisible = false;
  }

  getPageData(): void {
    this.httpService.postHttp("/csyssimplepage/condition").subscribe((data: any) => {
      this.pageList = data.data;
    })
  }
  //设置迁移权限页面
  setTransferPage(i: { id: string, controlInstance: string, value: string, label: "", autoExcuteControl: string, autoExcute, longTime, lastTime, pageIds, desc, flag: "", authority: Array<{ key: string, title: string, direction: string, checked: boolean, authorityId: string }>, pageData: { transferPageId: string, oldPageId: string, currentPageId: any } }, e: MouseEvent): void {
    console.log("设置迁移页面", i);
    let trsPage = [];
    this.httpService.postHttp("/csyssimplepage/condition").subscribe((data: any) => {
      console.log("page接口测试", data);
      data = data.data;
      console.log("this.formEditStatus", this.formEditStatus)
      if (data.length > 0) {
        let pageData = [];
        data.forEach(element => {
          pageData.push({ "label": element.csysPageName, "value": element.csysPageId });
        });
        //设置页面数据
        this.pageList = JSON.parse(JSON.stringify(pageData));
        //console.log("迁移数据：", this.pageList);
        let currentPageIdValue = i.pageData.currentPageId;
        //新增状态
        if (!this.formEditStatus) {
          this.setPageIdValue(null);//赋值
        } else {
          //编辑状态
          //根据迁移编号，获取已设置的权限页面
          this.httpService.postHttp("/csystrspage/condition").subscribe((data: any) => {
            data = data.data;
            //console.log("当前权限页面数据：", data);
            //若存在权限页面
            if (data.length > 0) {
              // i.pageData.transferPageId = data[0].csysTrsPageId;
              // i.pageData.currentPageId = data[0].csysPageId;
              // i.pageData.oldPageId = data[0].csysPageId;
              // currentPageIdValue = data[0].csysPageId;
              for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if (element.csysPointTrsId == i.id) {
                  trsPage.push(element.csysPageId);
                }
              }
              console.log("trsPage", trsPage)
              i.pageData.currentPageId = trsPage;

              this.setPageIdValue(trsPage);
            } else {
              currentPageIdValue = null;
            }
            //赋值

          });
        }
        //直接赋值
        this.isTransferVisible = true;
        this.currentControl = i;
      }
    })
  }

  //权限页面赋值
  setPageIdValue(currentPageIdValue) {
    this.pageForm = this.fb.group({
      pageId: [currentPageIdValue, []]
    })
  }

  //确认设置权限
  pageConfirm(): void {
    this.isOkLoading = true;
    let i = this.controlArray.indexOf(this.currentControl);
    this.controlArray[i].pageData.currentPageId = this.pageForm.value.pageId;
    console.log("pageId", this.controlArray)
    this.isTransferVisible = false;
    this.isOkLoading = false;
  };
  //工序选择数据源获取
  getChartData(): void {
    this.httpService.postHttp("/csyspotpublic/condition").subscribe((data: any) => {
      this.nodes = data.data;
      console.log("data", this.nodes)
    })
  }

  chartChange(event): void {
    let id;
    this.targetNodeList1 = []
    console.log("event", event)
    console.log("event", this.targetNodeList)
    for (let index = 0; index < this.targetNodeList.length; index++) {
      const element = this.targetNodeList[index];
      if (element.public == event) {
        id = element.group
        break;
      }
    }
    console.log("id", id)
    let groupToId = []
    //用工序组id去工序组权限表中拿取目标工序组id
    this.httpService.getHttp("/csyspotgropre").subscribe((data: any) => {
      data = data.data.list;
      console.log(data)
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.csysPotGroupFromId == id) {
          groupToId.push(element.csysPotGroupToId)
        }
      }
      console.log("groupToId", groupToId)
      if (groupToId.length != 0) {
        for (let index = 0; index < this.targetNodeList.length; index++) {
          const element = this.targetNodeList[index];
          for (let index1 = 0; index1 < groupToId.length; index1++) {
            const element1 = groupToId[index1];
            if (element.group == element1) {
              this.targetNodeList1.push(element);
              break;
            }
          }
        }
      }
      console.log(this.targetNodeList1)
    })
    this.checkChartId = event;
    for (let index = 0; index < this.nodes.length; index++) {
      const element = this.nodes[index];
      if (element.csysPotPublicId == event) {
        this.checkChartName = element.csysPotPublicName;
        break;
      }
    }
    let formdata = {
      "addNodeName1": this.checkChartName,
      "addNodeName2": "1"
    }
    this.insertForm.patchValue(formdata);
    this.insertForm.updateValueAndValidity()
  }

  //迁移条件
  addCondition(control, event): void {
    this.csysPointTrsId = control.controlInstance;
    this.getTableData();
    this.initialConditionFrom()
    this.conditionisVisible = true;
    console.log(control)
    console.log(event)
  }
  getTableData(): void {
    this.pottrsconData = []
    this.httpService.postHttp("/csyspottrscon/condition").subscribe((data: any) => {
      console.log("zeq123", this.csysPointTrsId)
      console.log("zeq123", data.data)
      for (let index = 0; index < data.data.length; index++) {
        const element = data.data[index];
        if (element.csysPotTrsId == this.csysPointTrsId) {
          this.pottrsconData.push(element);
        }
      }
      //重新强制转换赋值
      this.pottrsconData = [...this.pottrsconData]
      console.log("zzz", this.pottrsconData)
    })
  }
  //权限弹框取消
  conditionCancel(): void {
    this.conditionisVisible = false;
    this.isSpinning = false;
    this.tableShow = 'table'
  }
  //权限弹框确认
  conditionOk(): void {
    //当不是新增或者编辑的时候，点击确认关闭窗口
    if (this.tableShow == "table") {
      this.conditionisVisible = false;
      //新增时候
    } else if (this.nzTitle == "新增迁移条件") {
      this.tableLodding = true;
      let conditionData = {
        "csysWorkflowId": this.workflowId,
        "csysPotTrsId": this.csysPointTrsId,
        "csysPotTrsConRawData": this.conditionForm.value.dataSource,
        "csysPotTrsConMethod": this.conditionForm.value.contrast,
        "csysPotTrsConContrastData": this.conditionForm.value.contrastData,
        "csysPotTrsConInfo": this.conditionForm.value.tips,
      }
      console.log("conditionData", JSON.stringify(conditionData) )
      this.httpService.postHttp("cssypottrscon", conditionData).subscribe((data: any) => {
        this.msg.create("success", "创建成功");
        this.getTableData()
        this.tableShow = "table";
        this.tableLodding = false;
      },
        (err) => {
          this.msg.create("error", "发生错误，请稍后重试！");
          this.tableLodding = false;
        })
      console.log(conditionData)
      //编辑时候
    } else if (this.nzTitle == "编辑迁移条件") {
      let conditionData = {
        "csysPotTrsConId": this.editId,
        "csysPotTrsConRawData": this.conditionForm.value.dataSource,
        "csysPotTrsConMethod": this.conditionForm.value.contrast,
        "csysPotTrsConContrastData": this.conditionForm.value.contrastData,
        "csysPotTrsConInfo": this.conditionForm.value.tips
      }
      this.httpService.putHttp("/csyspottrscon", conditionData).subscribe((data: any) => {
        this.msg.create("success", "编辑成功");
        //返回表格界面
        this.tableShow = "table";
        this.nzTitle = "迁移条件列表";
        //关闭加载
        this.tableLodding = false;
        //刷新数据
        this.getTableData();
      },
        (err) => {
          this.msg.create("error", "发生错误，请稍后重试！");
          this.tableLodding = false;
        })
    }


  }
  initialConditionFrom() {
    this.conditionForm = this.fb.group({
      dataSource: [null, [Validators.required]],
      contrast: [null, [Validators.required]],
      contrastData: [null, [Validators.required]],
      tips: [null, [Validators.required]],
    });
  }

  insertWorkFlowInit(): void {
    //初始化表单控件
    this.initialConditionFrom();
    this.nzTitle = "新增迁移条件";
    this.tableShow = "addTable";
  }
  back(): void {
    this.tableShow = "table";
    this.nzTitle = "迁移条件列表";
  }

  editCondition(id, dataSource, contrast, contrastData, tips): void {
    this.nzTitle = "编辑迁移条件";
    this.editId = id;
    this.conditionForm = this.fb.group({
      dataSource: [dataSource, [Validators.required]],
      contrast: [contrast, [Validators.required]],
      contrastData: [contrastData, [Validators.required]],
      tips: [tips, [Validators.required]]
    });
    this.tableShow = "addTable";
    this.tableLodding = true;
  }
  deleteCondition(id): void {
    this.httpService.deleteHttp("/csyspottrscon/" + id).subscribe((data: any) => {
      this.msg.create("success", "删除成功");
      this.getTableData();
    })
  }

  //获取工序组
  getOpData() {
    this.opData = [];
    this.httpService.postHttp("/op/condition").subscribe((data: any) => {
      console.log("opData", data);
      console.log("this.workflowId", this.workflowId)
      for (let index = 0; index < data.data.length; index++) {
        const element = data.data[index];
        if (element.csysWorkflowId == this.workflowId) {
          this.opData.push(element);
          this.opData = [...this.opData]
        }
      }
    })
  }
  //获取当前点击工序组名称

  opChange(event) {
    for (let index = 0; index < this.opData.length; index++) {
      const element = this.opData[index];
      if (element.opId == event) {
        this.opName = element.opCode;
        break;
      }
    }
  }


  getResource(): void {
    //获取资源名称
    this.httpService.postHttp("/tresource/condition").subscribe((data: any) => {
      this.resourceData = data.data;
    })
  }

  getSkill(): void {
    //获取技能数据源
    this.httpService.postHttp("/skill/condition").subscribe((data: any) => {
      this.skillData = data.data;
    })
  }

  //获取工序描述代码
  getPointDescList() {

    this.httpService.postHttp("/csyscodemaster/condition").subscribe((data: any) => {
      this.pointDescList = data.data;
    })

  }
  //获取工序组列表
  getOpList(): void {

  }
  initOpForm(): void {
    this.httpService.getHttp("/csysworkflow/" + this.workflowId).subscribe((data: any) => {
      this.opForm = this.fb.group({
        opcode: [null, [Validators.required]],
        opdesc: [null],
        opcontrol: [null, [Validators.required]],
        workflowid: [this.workflowId, [Validators.required]],
        workflowname: [data.data.csysWorkflowName, [Validators.required]],
      });
    })

  }
  opVisible;
  opDiv = "list";
  isOpLoding = false;
  opListTitle = "工序组列表";
  editOpId = "";
  opList(): void {
    this.opVisible = true;
  }
  //
  opCancel(): void {
    this.opVisible = false;
    this.isOpLoding = false;
    this.opDiv = "list";
    //关闭初始化
    this.initOpForm();
  }
  opOk(): void {
    if (this.opListTitle == "工序组列表") {
      this.opVisible = false;
      this.initOpForm();
    } else {
      if (this.opListTitle == "新增工序组") {
        this.insertOpData();
      } else if (this.opListTitle == "编辑工序组") {
        this.editOpData();
      }
    }
  }
  insertOp(): void {
    this.initOpForm();
    this.opDiv = "insertOpData";
    this.opListTitle = "新增工序组";

  }
  //新增工序组信息
  insertOpData(): void {

    for (const i in this.opForm.controls) {
      this.opForm.controls[i].markAsDirty();
      this.opForm.controls[i].updateValueAndValidity();
    }
    if (this.opForm.controls.opcode.invalid) return;
    this.isOpLoding = true;
    let opdata = {
      "opCode": this.opForm.value.opcode,
      "opDesc": this.opForm.value.opdesc,
      "csysWorkflowId": this.opForm.value.workflowid,
      "csysWorkflowName": this.opForm.value.workflowname
    }
    console.log("opData", opdata);
    this.httpService.postHttp("/op", opdata).subscribe((data: any) => {
      if (data.code == 200) {
        this.msg.success("新增成功");
        this.isOpLoding = false;
        this.initOpForm();
        this.getOpData();
      } else {
        this.msg.error("请稍后再试");
        this.isOpLoding = false;
      }
    })
  }
  //编辑工序组窗口
  editOp(event): void {
    this.editOpId = event.opId;
    this.opDiv = "insertOpData";
    this.opListTitle = "编辑工序组";
    console.log("event", event);
    this.httpService.getHttp("/csysworkflow/" + this.workflowId).subscribe((data: any) => {
      this.opForm = this.fb.group({
        opcode: [event.opCode, [Validators.required]],
        opdesc: [event.opDesc],
        //opcontrol: [event.opControl, [Validators.required]],
        workflowid: [this.workflowId, [Validators.required]],
        workflowname: [data.data.csysWorkflowName, [Validators.required]],
      });
    })
  }
  editOpData(): void {
    this.isOpLoding = true;
    let opdata = {
      "opId": this.editOpId,
      "opCode": this.opForm.value.opcode,
      "opDesc": this.opForm.value.opdesc,
      //"opControl": this.opForm.value.opcontrol,
      "csysWorkflowId": this.opForm.value.workflowid,
      "csysWorkflowName": this.opForm.value.workflowname
    }
    this.httpService.putHttp("/op", opdata).subscribe((data: any) => {
      if (data.code == 200) {
        this.msg.success("编辑成功");
        this.isOpLoding = false;
        this.opDiv = "list";
        this.initOpForm();
        this.getOpData();
      } else {
        this.msg.error("请稍后再试");
        this.isOpLoding = false;
      }
    })
  }
  opBack(): void {
    this.opDiv = "list";
    this.opListTitle = "工序组列表";
  }
  opDelete(id): void {
    this.httpService.deleteHttp("/op/" + id).subscribe((data: any) => {
      this.msg.success("删除成功");
      this.getOpData();
    })
  }
}
