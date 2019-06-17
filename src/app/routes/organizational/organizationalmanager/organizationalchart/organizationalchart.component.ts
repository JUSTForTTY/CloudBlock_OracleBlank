
import { fromEvent as observableFromEvent } from 'rxjs';
import { Component, OnInit, ViewEncapsulation, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzFormatEmitEvent, NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import * as shape from 'd3-shape';
import * as graph from '@swimlane/ngx-graph';
import { AbstractControl, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { colorSets } from 'utils/color-sets';
import { HttpService } from 'ngx-block-core';
import { Identifiers } from '@angular/compiler';
import { STColumn, STChange } from '@delon/abc';
import { Md5 } from "ts-md5/dist/md5";
import { isThisISOWeek } from 'date-fns';

@Component({
  selector: 'organizationalchart',
  templateUrl: './organizationalchart.component.html',
  styleUrls: ['./organizationalchart.component.less']
})
export class OrganizationalchartComponent implements OnInit, OnDestroy {
  form: FormGroup;
  insertForm: FormGroup;
  editForm: FormGroup;
  addUserForm: FormGroup;
  controlArray: Array<{ id: string, controlInstance: string, value: string, flag }> = [];

  controlDeleteArray: Array<{ id: string, controlInstance: string, value: string, flag }> = [];
  q: any = {
    status: 'all',
  };
  loading = false;
  currentPoint: string;
  formEditStatus = false;
  screenHeight = "400px";
  isVisible = false;
  isOkLoading = false;
  saveStyling = false;
  windowShow = "userList";
  //用户角色
  userRole;
  timer;
  nzLoading = true;
  //用户组织架构
  userOrganization;
  userOrganizationId;
  //当前编辑用户id
  editUserId;
  //当前点击树状图id
  clickOrganizationId;
  nodes1;
  //st的数据表格
  usersListData = [];
  //默认选中部门树状图
  defaultSelectedKeys = [""];
  //组织架构数组调用
  organizationData;
  //部门data
  //添加部门标签
  tags = [];
  temporary = [];
  //用户显示数据
  userList = [];
  //用户真实数据
  userCurrentList = [];
  //用户临时数据
  userChangeList = [];
  colorTheme = "";
  nzTitle = "权限分配";
  data: any[] = [];
  view: any[];
  showLegend = false;
  listOfOption = [];//临时数据
  colorSchemes: any;
  colorScheme: any;
  schemeType: string = 'ordinal';
  submitting = false;
  addUserBtn = true;
  deleting = false;
  searchContent = "";
  nzBtnLoding = false;
  num = 0;
  a = "123";
  //当前组织架构的id
  organizeId = "";
  organizeUrl = "/csysorgstruce";
  nodeUrl = "/csysorgpot";
  nodeConditionUrl = "/csysorgpot/listCondition";
  userUrl = "/cysysbaseuser";
  authorityUrl = "/csysorgpotauth";

  fileList = [
    {
      uid: -1,
      name: 'xxx.png',
      response: [],
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }
  ];
  //当前数据位置
  index = 0;
  lineStyle = "";
  targetNodeList = [];
  //目标节点键值对
  targetNodeArray = new Array();

  saveTargetEevent: EventEmitter<any> = new EventEmitter();
  OrganizeEevent: EventEmitter<any> = new EventEmitter();

  //定义组织架构图数据
  hierarchialGraph = { nodes: [], links: [] };

  curve = shape.curveBundle.beta(1);

  orientation: string = 'TB'; // LR, RL, TB, BT

  layout="";
  users: any[] = [];



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
  workflowlayout=[
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
  columns: STColumn[] = [
    { title: '', index: 'key', type: 'checkbox' },
    { title: '姓名', index: 'csysUserRealname', },
    { title: '性别', index: 'csysUserGender' },
    { title: '部门', index: 'cySysOrganizationalStructurePointName' },
    { title: '部门', index: 'cySysOrganizationalStructurePointName' },
    { title: '手机', index: 'cySysBaseUserCity' },
    { title: '个人邮箱', index: 'cySysBaseUserCity' },

    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          click: (item: any) => console.log(item.cySysBaseUserMobile)//this.afferent(item.TABLE_NAME, item.TABLE_COMMENT, item.ENGINE),
        }
      ]
    }
  ];
  curveType: string = 'Linear';
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


  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: NzMessageService,
    private httpService: HttpService,

    private modalService: NzModalService, ) {
    Object.assign(this, {
      colorSchemes: colorSets,
    });
    this.reload();
  }
  public ngOnInit(): void {
    this.getMenuList();
    this.organizeId = this.route.snapshot.paramMap.get("organizeId");
    this.initializeFromControl();
    this.form = this.fb.group({
      colorTheme: ['', [Validators.required]],
      lineStyle: ["", [Validators.required]],
      orientation: ['', [Validators.required]]
    });

    this.editForm = this.fb.group({
      id: [null, [Validators.required]],
      nodeEditName: [null, [Validators.required]]
    })

    this.insertForm = this.fb.group({
      addNodeName: [null, [Validators.required]]
    })


    //保存目标节点（参数：节点编号）
    this.saveTargetEevent.subscribe((value: string) => {
      this.saveTarget(value);
    })

    //保存（参数：节点编号）
    this.OrganizeEevent.subscribe(() => {
      this.saveOragnize();
    })



    //增加默认目标节点
    //this.addField();

    //设置主题
    this.setColorScheme('picnic');

    //设置线性，垂直，自然等等
    this.setLineStyle('Step After');

    //查询组织架构节点数据
    console.log("获取组织架构")
    this.getOrganizeNodes();


    //设置图像高度
    this.screenHeight = window.innerHeight - 200 + 'px';

    //this.getTransferData();
    // 监听页面
    observableFromEvent(window, 'resize')
      .subscribe((event) => {
        // 操作
        this.screenHeight = window.innerHeight - 200 + 'px';
      });

  }


  reload() {
    this.users = Array(10).fill({}).map((item: any, idx: number) => {
      console.log("item", item);
      console.log("idx", idx);
    });
  }



  get id() {
    return this.form.controls.id;
  }
  get title() {
    return this.form.controls.title;
  }
  get tablename() {
    return this.form.controls.tablename;
  }

  /* getTransferData(): void {
    const ret = [];
    for (let i = 0; i < 20; i++) {
      ret.push({
        key: i.toString(),
        title: `用户${i + 1}`,
        description: `description of content${i + 1}`,
        direction: Math.random() * 2 > 1 ? 'right' : ''
      });
    }
    this.transferlist = ret;
  } */

  transferreload(direction: string): void {
    //this.getTransferData();
    this.msg.success(`your clicked ${direction}!`);
  }

  // 穿梭框：选中项发生改变时的回调函数，即选中框事件
  transferselect(ret: {}): void {
    /*  console.log('nzSelectChange', ret);
     console.log(this.userList[0])
     console.log(this.userCurrentList[0]) */
  }

  // 穿梭框：选项在两栏之间转移时的回调函数，点击to left 或者 to right事件
  transferchange(ret: { from: string, to: string, list: [{ key: string, title: string, direction: string, checked: string }] }): void {
    if (ret.to == "left") {
      ret.list.forEach(element => {
        let i = this.userList.indexOf(element);
        console.log(i)
        this.userChangeList[i].direction = "left";
      });
    } else {
      ret.list.forEach(element => {
        delete element.checked;
        let i = this.userList.indexOf(element);
        this.userChangeList[i].direction = "right";
      });
    }
  }


  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = "sucu" + Math.floor(Math.random() * 10000 + 1);
    const control = {
      id: `${id}`,
      controlInstance: `passenger${id}`,
      value: ``,
      flag: 'insert',
      authority: [],//设置用户数据初始化为空
    };
    const index = this.controlArray.push(control);
    //console.log(this.controlArray[this.controlArray.length - 1]);
    //重新获取节点
    this.getFlowTargetNodes("", "");
    if (!this.formEditStatus) this.insertForm.addControl(this.controlArray[index - 1].controlInstance, new FormControl(null, Validators.required));
    else this.editForm.addControl(this.controlArray[index - 1].controlInstance, new FormControl(null, Validators.required));
  }

  removeField(i: { id: string, controlInstance: string, value: string, laebl: "", flag: string, authority: Array<{ key: string, title: string, direction: string, authorityId: string }> }, e: MouseEvent): void {
    e.preventDefault();
    if (this.controlArray.length > 0) {
      const index = this.controlArray.indexOf(i);
      //console.log(this.controlArray);
      let flag = this.controlArray[index].flag;
      if (flag == "update") {
        this.controlArray[index].flag = "delete";
        this.controlDeleteArray.push(this.controlArray[index]);
      }
      this.controlArray.splice(index, 1);
      if (!this.formEditStatus) this.insertForm.removeControl(i.controlInstance);
      else this.editForm.removeControl(i.controlInstance);
    }
  }

  getFormControl(name: string): AbstractControl {
    return this.form.controls[name];
  }

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
    console.log('Legend clicked', entry);
  }

  //节点点击事件
  clickNode(data) {
    //uses Data;
    this.clickOrganizationId = []
    this.clickOrganizationId.push(data.id);
    console.log("data.data", this.clickOrganizationId);
    this.formEditStatus = true;
    this.currentPoint = data.id;
    this.userCurrentList = [];
    //组织架构的某个具体部门的取值
    this.organizationData = data;

    //清空目标区域
    this.controlArray = [];
 
    //获取值
    this.editForm = this.fb.group({
      id: [data.id, [Validators.required]],
      nodeEditName: [data.label, [Validators.required]]
    })
    this.addUserBtn = false;
    //目标节点数组
    let targetjson = [];
    //查询是否有目标节点

    console.log("links昌都",this.hierarchialGraph.links.length)
    for (let i=0; i < this.hierarchialGraph.links.length;i++) {
      let element = this.hierarchialGraph.links[i];

      console.log("当前值",element);      
      if (element != null) {
        if (data.id == element.source) {
          let control = {
            id: element.source,//父节点编号即源节点
            controlInstance: element.target,//`passenger${element.id}`,
            value: element.target,//当前节点即子节点
            label: "",
            flag: "update",
            authority: []//编辑初始化时设置用户为空
          };
          console.log("存放数据节点", control)
          this.controlArray=[... this.controlArray];
          
          console.log("存放数据节点-未处理", control)

          console.log("存放数据节点-处理后", JSON.stringify(control))

          console.log("存放数据节点-处理后", JSON.parse(JSON.stringify(control)))
           
           
          this.controlArray.push(JSON.parse(JSON.stringify(control)));
        

          console.log("存放数据节点", this.controlArray)
 

          this.editForm.addControl(element.target, new FormControl(element.target, Validators.required));
          try {
            //获取目标节点标签
            this.hierarchialGraph.nodes.forEach(nodeArray => {
              if (nodeArray.id == element.target) {
                //重新获取节点
                this.getFlowTargetNodes(nodeArray.id, nodeArray.label);
                //抛出异常，跳出循环
                throw new Error("error");
              }
            });
          } catch (e) {
          }
        }
      }
    }


    // this.hierarchialGraph.links.forEach(element => {
    //   //若当前节点编号和连接数据的源点相同，则存在目标节点
    //   console.log("当前点击节点", data.id);
    //   console.log("循环节点数据", element);
    //   if (element != null) {
    //     if (data.id == element.source) {
    //       let control = {
    //         id: element.source,//父节点编号即源节点
    //         controlInstance: element.id,//`passenger${element.id}`,
    //         value: element.target,//当前节点即子节点
    //         label: "",
    //         flag: "update",
    //         authority: []//编辑初始化时设置用户为空
    //       };
    //       console.log("存放数据节点", JSON.stringify(control))
    //       this.controlArray.push(control);

    //       this.editForm.addControl(element.id, new FormControl(element.target, Validators.required));
    //       try {
    //         //获取目标节点标签
    //         this.hierarchialGraph.nodes.forEach(nodeArray => {
    //           if (nodeArray.id == element.target) {
    //             //重新获取节点
    //             this.getFlowTargetNodes(nodeArray.id, nodeArray.label);
    //             //抛出异常，跳出循环
    //             throw new Error("error");
    //           }
    //         });
    //       } catch (e) {
    //       }
    //     }
    //   }
    // });
   
    console.log("最终节点数据", this.controlArray);

  }

  addPoint() {
    this.formEditStatus = false;
    //清空目标区域
    this.controlArray = [];
    this.insertForm = this.fb.group({
      addNodeName: [null, [Validators.required]]
    })
    this.userCurrentList = [];
  }

  //更新目标节点
  updateTagetPoint(value: { id: string, controlInstance: string, value: string }, e: MouseEvent): void {
    //console.log(this.controlArray)
  }

  //设置用户
  setUser(): void {

    this.getUsersList();//获取用户列表
    this.getTreeData();//树结构data

    this.isVisible = true;
    //判断当前节点是否存在用户
    if (this.userCurrentList.length > 0) {
      this.userList = JSON.parse(JSON.stringify(this.userCurrentList));
      this.isVisible = true;
    } else {
      //若无迁移数据则先获取用户信息
      const userArray = [];
      this.httpService.postHttp(this.userUrl + "/listCondition", {}).subscribe((data: any) => {
        data = data.data.list;
        console.log("this is a", data);
        data.forEach(element => {
          userArray.push({
            key: element.csysUserId,//用户编号
            title: element.csysUserUsername,//用户名称
            //description: `description of content${i + 1}`,
            direction: 'right',//默认右边
            authorityId: ''//节点编号
          });
        });
        console.log("this is b", userArray);
        //判断当前状态是否为新增
        if (this.formEditStatus == false) {
          this.userList = JSON.parse(JSON.stringify(userArray));
          this.userCurrentList = JSON.parse(JSON.stringify(userArray));
          this.userChangeList = JSON.parse(JSON.stringify(userArray));
          this.isVisible = true;
        } else {
          //若为修改，则需查询当前迁移权限的原有数据
          //根据当前迁移编号，查询迁移权限数据
          let params = {
            "csysOrgPotId": this.editForm.value.id,
          };
          this.httpService.postHttp(this.authorityUrl + "/listCondition", params).subscribe((data: any) => {
            console.log("当前用户权限权限数据：", data.data.list);
            data.data.list.forEach(element => {
              try {
                userArray.forEach(user => {
                  //若权限表中的用户编号和用户表中的编号相等，则将用户中的位置标记为left即已设置
                  if (element.csysUserId == user.key) {
                    user.direction = "left";
                    user.authorityId = element.csysOrgPotAuthId//用户权限权限编号
                    //抛出异常跳出循环
                    throw new Error("error");
                  }
                })
              } catch (e) {
              }
            });
            this.userList = JSON.parse(JSON.stringify(userArray));
            this.userCurrentList = JSON.parse(JSON.stringify(userArray));
            this.userChangeList = JSON.parse(JSON.stringify(userArray));

          });
        }
      })
    }
  }

  //删除编辑节点
  deleteCurrentNode() {
    this.deleting = true;
    //当前节点
    let nodeId = this.editForm.value.id;
    //判断当前节点是否存在源节点和目标节点
    try {
      this.hierarchialGraph.links.forEach(element => {
        if (element.source == nodeId || element.target == nodeId) {
          //抛出异常，跳出循环
          throw new Error("error");
        }
      })
      //若无连接则删除节点
      this.deleteFlowPoint(nodeId);
      this.deleteAuthorityByTransferId(nodeId)
    } catch (e) {
      this.deleting = false;
      this.msg.warning("对不起，当前节点存在源节点或目标节点，请删除后重试！");
    }
  }


  //删除节点
  deleteFlowPoint(nodeId) {
    //获取节点信息
    let params = {
      "csysOrgPotId": nodeId,
      "csysOrgPotIsDelete": "1"
    };
    //第一步：修改节点信息
    this.httpService.putHttp(this.nodeUrl, params).subscribe((data: any) => {
      //console.log("节点删除成功," + data);
      //重新获取节点
      //this.getFlowTargetNodes();
      //删除工作流节点
      this.deleteNodes(nodeId);
      //开启第三步：保存工作流
      this.saveOragnize();
    });
  }

  //通过节点迁移编号删除该节点迁移下的所有权限
  deleteAuthorityByTransferId(transferId) {
    //根据节点迁移编号，查出所有节点迁移迁移权限记录
    let params = {
      "csysorgpotauth": transferId,
    };
    this.httpService.postHttp(this.authorityUrl + "/listCondition", params).subscribe((data: any) => {
      //console.log("需删除节点迁移权限：", data.data.list);
      //循环获取权限数据
      data.data.list.forEach(element => {
        this.deleteAuthority(element.csysOrgPotAuthId)
      });
    });
  }

  //删除工作流节点
  deleteNodes(nodeId) {
    for (const key in this.hierarchialGraph.nodes) {
      if (this.hierarchialGraph.nodes[key].id == nodeId) {
        this.hierarchialGraph.nodes.splice(Number(key), 1);
        break;
      }
    }
  }

  handleOk(): void {
    this.isOkLoading = true;
    window.setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
      this.msg.create('success', `保存成功！`);
    }, 3000);
  }

  handleCancel(): void {
    //console.log('Button cancel clicked!');
    // this.initializeFromControl();
    //this.msg.create('success', `取消成功！`);                                                                                                                                                                                                                                                                                                                                                                                                                                          vc                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           vbc                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  c                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    this.isVisible = false;

  }

  //获取组织架构节点信息
  getOrganizeNodes() {
    this.httpService.getHttp(this.organizeUrl + "/" + this.organizeId).subscribe((data: any) => {
      // this.getTreeData();
      data = data.data;
      // this.treeData = data["cySysOrganizationalStructureLinks"];
      // console.log("data123123123123",JSON.parse(this.treeData)[0]["source"]);
      //节点
      this.hierarchialGraph.nodes = data.csysOrgStruceNodes != null ? JSON.parse(data.csysOrgStruceNodes) : [];
      //连接
      this.hierarchialGraph.links = data.csysOrgStruceLinks != null ? JSON.parse(data.csysOrgStruceLinks) : [];
      //节点数据
      /* console.log(this.hierarchialGraph.nodes)
      console.log(this.hierarchialGraph.links) */
      //设置主题
      this.setColorScheme(data.csysOrgStruceColortheme);
      //设置线性，垂直，自然等等
      this.setLineStyle(data.csysOrgStruceStyle);
      //设置流向
      this.layout = data.csysOrgStruceOriente;
    })
  }

  //获取目标节点
  getFlowTargetNodes(id, label) {
    let params = {
      "csysOrgStruceId": this.organizeId

    }
    //目标节点赋值
    const children = [];
    //编辑时加入当前的目标节点
    if (id != "") children.push({ label: label, value: id });
    this.httpService.postHttp(this.nodeConditionUrl, params).subscribe((data: any) => {
      //console.log("目标节点", data.data);
      let targetNodedata = data.data.list;
      for (let i = 0; i < targetNodedata.length; i++) {
        children.push({ label: targetNodedata[i].csysOrgPotName, value: targetNodedata[i].csysOrgPotId });
        //this.targetNodeArray[targetNodedata[i].cySysFlowpointId] = targetNodedata[i].cySysFlowpointName;
      }
      this.targetNodeList = children;
      console.log("输出", this.targetNodeList)
    })
  }

  _submitForm() {
    this.submitting = true;
    if (this.formEditStatus) {
      console.log("修改节点");
      this.updateFlowPoint();
      this.saveUser(this.editForm.value.id);
    } else {
      console.log("新增节点");
      //第一步：新增节点
      this.insertPoint();
    }
  }

  //保存通用配置
  _saveConfigure() {
    this.saveStyling = true;
    //新写入数据
    let params = {
      "csysOrgStruceId": this.organizeId,
      "csysOrgStruceColortheme": this.colorTheme,
      "csysOrgStruceStyle": this.lineStyle,
      "csysOrgStruceOriente": this.layout
    }
    //更改工作流节点和连接数据
    this.httpService.putHttp(this.organizeUrl, params).subscribe((data: any) => {
      //console.log("通用配置保存成功", data);
      this.saveStyling = false;
      this.msg.success(`保存成功！`);
    });
  }


  //新增节点
  insertPoint() {
    let nodeName = this.insertForm.value.addNodeName;
    let params = {
      "csysOrgPotName": nodeName,
      "csysOrgStruceId": this.organizeId,
      "csysOrgPotParentId": "-1"
    }
    this.httpService.postHttp(this.nodeUrl, params).subscribe((data: any) => {
      console.log("节点新增成功", data);
      let nodeId = data.data;
      console.log("zeq", data)
      //保存父节点用户和下面保存组织架构的先后顺序没有影响
      this.saveUser(nodeId);
      //新增组织架构节点
      this.insertNodes(nodeId, nodeName);
      //第三步：保存目标节点
      this.saveTargetEevent.emit(nodeId);
    });
  }

  //新增组织架构节点
  insertNodes(nodeId, pointName) {
    //组织架构节点数据添加新增节点
    this.hierarchialGraph.nodes.push({
      id: nodeId,
      label: pointName,
      position: 'x' + nodeId
    });
  }


  //修改节点
  updateFlowPoint() {
    //当前节点编号
    let nodeId = this.editForm.value.id;
    let nodeName = this.editForm.value.nodeEditName;
    let params = {
      "csysOrgPotId": nodeId,
      "csysOrgPotName": nodeName//节点名称
    };
    //第一步：修改节点信息
    this.httpService.putHttp(this.nodeUrl, params).subscribe((data: any) => {
      //console.log("节点修改成功," + data);
      //修改组织架构节点
      this.updateNodes(nodeId, nodeName);
      this.submitting = false;
      //第二步：保存父节点
      this.saveParentFlowpoint(nodeId);
    });
  }


  //保存父节点
  saveParentFlowpoint(nodeId) {
    //console.log("保存父节点");
    //console.log("迁移数据：", this.controlArray);
    //赋给新的变量，对this.controlArray直接操作会导致页面发生变化
    let currentControlArray = JSON.parse(JSON.stringify(this.controlArray));
    //先移除无效目标数据
    /*for (const key in currentControlArray) {
      if (currentControlArray[key].value == "" || currentControlArray[key].value == null) {
        delete this.controlArray[key];
      }
    }*/
    //加入已删除的目标节点
    this.controlDeleteArray.forEach(element => {
      currentControlArray.push(element);
    })

    if (currentControlArray.length > 0) {
      //循环新增父节点
      for (let i = 0; i < currentControlArray.length; i++) {
        //获取标记
        let flag = currentControlArray[i].flag;
        //根据标记设置父节点值，若为更新则设置为当前节点，否则父节点为-1
        let parentId = flag == "update" || flag == "insert" ? nodeId : "-1";
        //修改子节点的父节点
        this.updateParentFlowpoint(currentControlArray[i].value, parentId, flag, i, currentControlArray.length - 1);
      }
    } else {
      //保存组织架构
      this.saveOragnize();
    }
  }

  //修改父节点（参数：子节点编号，父节点编号）
  updateParentFlowpoint(id, parentId, flag, i, length) {
    let targetParams = {
      "csysOrgPotId": id,
      "csysOrgPotParentId": parentId,//迁移目标
    };
    this.httpService.putHttp(this.nodeUrl, targetParams).subscribe((data: any) => {
      //console.log("父节点修改成功", data);
      //更新组织架构连接
      this.updateLinks(parentId, id, flag);
      //保存父节点权限
      /*  this.saveAuthority(transferId, control.authority);
       //保存父节点权限页面
       this.saveTransferPage(transferId, control.pageData); */
      //父节点全部操作完后保存组织架构
      if (i == length) {
        this.saveOragnize();
      }
    });
  }

  //修改组织架构节点
  updateNodes(nodeId, nodeName) {
    //组织架构节点数据添加新增节点
    for (const key in this.hierarchialGraph.nodes) {
      if (this.hierarchialGraph.nodes[key].id == nodeId) {
        this.hierarchialGraph.nodes[key].label = nodeName;
        break;
      }
    }
  }

  //修改组织架构节点连接（参数：父节点编号，节点编号）
  updateLinks(parentId, id, flag) {
    if (flag == "insert") this.insertLinks(parentId, id);
    else {
      for (const key in this.hierarchialGraph.links) {
        const element = this.hierarchialGraph.links[key];
        if (element != null) {
          if (id == element.target) {
            //移除操作
            if (parentId == "-1") this.hierarchialGraph.links.splice(Number(key), 1);
            // 新增操作
            else this.hierarchialGraph.links[key].source = parentId;
            break;
          }
        }
      }
    }
  }


  //保存组织架构
  saveOragnize() {
    console.log("保存组织架构");
    //第三步：修改组织架构节点和连接数据
    //新写入数据
    let params = {
      "csysOrgStruceId": this.organizeId,
      "csysOrgStruceNodes": JSON.stringify(this.hierarchialGraph.nodes),
      "csysOrgStruceLinks": JSON.stringify(this.hierarchialGraph.links),
    }
    //更改组织架构节点和连接数据
    this.httpService.putHttp(this.organizeUrl, params).subscribe((data: any) => {
      //console.log("组织架构修改成功", data);
      //重绘组织架构图
      this.drawOrganize();
      this.submitting = false;
      //初始化
      this.formInit();
      this.msg.success(`保存成功！`);
    });
  }

  //保存目标节点
  saveTarget(nodeId) {
    let currentControlArray = JSON.parse(JSON.stringify(this.controlArray));
    if (currentControlArray.length > 0) {
      for (let i = 0; i < currentControlArray.length; i++) {
        this.updateTarget(nodeId, currentControlArray[i].value, i, currentControlArray.length - 1);
      }
    } else {
      this.OrganizeEevent.emit();
    }
  }

  //更新设置父节点
  updateTarget(nodeId, targetId, i, lenth) {
    let targetParams = {
      "csysOrgPotId": targetId,//节点编号
      "csysOrgPotParentId": nodeId//父节点编号
    };
    this.httpService.putHttp(this.nodeUrl, targetParams).subscribe((data: any) => {
      console.log("父节点设置成功", data);
      //组织架构添加节点连接
      this.insertLinks(nodeId, targetId);
      //父节点全部操作完后保存组织架构
      if (i == length) {
        this.OrganizeEevent.emit();
      }
    });
  }


  saveUser(nodeId) {
    //console.log("输出权限数据：", currentControl)
    this.userCurrentList.forEach(element => {
      //若用户权限权限编号为空，且位置为左，则为新增权限
      if (element.authorityId == "" && element.direction == "left") {
        let currentControl = [];
        currentControl.push(element)
        this.insertAuthority(nodeId, currentControl);
        ///若用户权限权限编号为空，且位置为右，则为删除权限
      } else if (element.authorityId != "" && element.direction == "right") {
        this.deleteAuthority(element.authorityId);
      }
      //说明：不存在修改权限
    });
  }

  //新增节点权限
  insertAuthority(nodeId, currentControl) {
    // console.log("新增权限数据：", currentControl);
    for (let i = 0; i < currentControl.length; i++) {
      let params = {
        "csysOrgPotId": nodeId,
        "csysUserId": currentControl[i].key,
      };
      this.httpService.postHttp(this.authorityUrl, params).subscribe((data: any) => {
        console.log("节点权限新增成功：", data.data);
      });
    }
  }


  //删除节点权限
  deleteAuthority(authorityId) {
    let params = {
      "csysOrgPotAuthId": authorityId,
      "csysOrgPotAuthIsDelete": "1"
    }
    this.httpService.putHttp(this.authorityUrl, params).subscribe((data: any) => {
      //console.log("成功删除用户权限权限：", data);
    })
  }

  //添加组织架构节点连接（参数：当前节点编号即父节点编号，目标节点编号即子节点编号）
  insertLinks(nodeId, targetId) {
    this.hierarchialGraph.links.push({
      source: nodeId,
      target: targetId,
      label: ""
    });
  }

  formInit() {
 
    //清空目标区域
    this.controlArray = [];
    this.controlDeleteArray = [];
    //根据状态初始化对应表单
    if (!this.formEditStatus) {
      this.insertForm = this.fb.group({
        addNodeName: [null, [Validators.required]]
      })
    } else {
      this.editForm = this.fb.group({
        id: [null, [Validators.required]],
        nodeEditName: [null, [Validators.required]]
      })
    }
    this.formEditStatus = false;
  }

  //重绘组织架构图
  drawOrganize() {
    this.hierarchialGraph.links = [...this.hierarchialGraph.links];
    this.hierarchialGraph.nodes = [...this.hierarchialGraph.nodes];
  }

  change(e: STChange) {
    console.log(e);
  }
  //新增用户
  addUser(): void {
    this.addUserForm = this.fb.group({
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confitmPassword: [null, [Validators.required, this.confirmationValidator]],
      age: [null],
      gender: ["男"],
      position: [null, [Validators.required]],
      department: [this.clickOrganizationId, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.email]],
      address: [null],
      employeeId: [null]
    });
    this.windowShow = "adduser";
    this.nzTitle = "添加成员";
    //这里是点击某个组织架构的图标得到的-id this.organizationData.id;
  }
  //返回按钮
  returnUserList(): void {
    this.windowShow = "userList";
    this.nzTitle = "权限分配";
    this.getUsersList();
  }
  settingDepartment(): void {
    this.windowShow = "settingDepartment";
    this.nzTitle = "设置所在部门";
    this.getTreeData();


  }
  nzEvent(event: NzFormatEmitEvent): void {
    let departmentData = {};
    let num = 0;
    departmentData = {
      "title": event.node.origin.title,
      "key": event.node.origin.key
    };
    for (let i = 0; i < this.tags.length; i++) {
      if (departmentData["title"] == this.tags[i].title) num++;
    }
    if (num == 0) {
      this.tags.push(departmentData);
      this.defaultSelectedKeys.push(departmentData["key"]);
    }
    if (num != 0) {
      for (let i = 0; i < this.tags.length; i++) {
        if (departmentData["key"] == this.tags[i].key) {
          this.tags.splice(i, 1);
          break;
        }
      }

    }
    console.log("zeqevent", event);
  }
  nzOnCloseTag(event, tag): void {
    console.log("event", event);
    for (let i = 0; i < this.defaultSelectedKeys.length; i++) {
      console.log(i, "aa", this.defaultSelectedKeys[i]);
      if (tag.key == this.defaultSelectedKeys[i]) {
        console.log(i, "a", tag.key);
        console.log("b", this.defaultSelectedKeys[i]);
        this.defaultSelectedKeys.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < this.tags.length; i++) {
      if (tag.key == this.tags[i].key) {
        this.tags.splice(i, 1);

        break;
      }
    }
    this.defaultSelectedKeys = [...this.defaultSelectedKeys];
  }
  getTreeData(): void {
    this.usersListData = []
    this.nodes1 = [];
    let body = {
      "csysOrgStruceId": this.organizeId
    };
    console.log("body体", body);
    this.httpService.postHttp("/csysorgpot/tree", body).subscribe((data: any) => {
      this.nodes1 = data.data;
    });
  }

  //获得用户
  getUsersList(): void {
    this.num = 0;
    this.nzLoading = true;
    let userId = [];
    let usersListData1 = [];

    //优化操作，查出当前节点下的数据

    let orgpotauthParams = {
      "csysOrgPotId": this.clickOrganizationId[0]
    }
    console.log("bodys", orgpotauthParams)
    this.httpService.postHttp("/csysorgpotauth/condition", orgpotauthParams).subscribe((data: any) => {
      let organizationUser = data.data;
      this.httpService.postHttp("/csysuser/condition").subscribe((data1: any) => {
        let usersListData = data1.data;
        //获得该组织架架构下的所有人
        for (let i = 0; i < organizationUser.length; i++) {

          userId.push(organizationUser[i].csysUserId);

        }
        console.log("this is d", usersListData);
        //匹配相关用户
        for (let i = 0; i < userId.length; i++) {
          for (let index = 0; index < usersListData.length; index++) {
            const element = usersListData[index];
            if (userId[i] == element.csysUserId) {
              usersListData1.push(element)
              break;
            }
          }
        }
        console.log("this is d", usersListData1);
        for (let i = 0; i < usersListData1.length; i++) {
          this.num = this.num + 2;
          this.getUserOrganization(usersListData1[i].csysUserId, i);
          this.getUserRole(usersListData1[i].csysUserId, i);
        }
        this.usersListData = usersListData1;
        console.log("abc", this.usersListData)
        this.timer = setInterval(() => {
          if (this.num == 0) {
            this.nzLoading = false;
            this.ngOnDestroy();
          }
        }, 500);

      });

    });


  }
  ngOnDestroy() {
    clearInterval(this.timer);
  }
  //获得用户组
  getMenuList(): void {
    this.httpService.postHttp("/csysrole/condition").subscribe((data: any) => {
      this.listOfOption = data.data;
    });
  }
  //查询用户
  serachUserList(): void {
    let userList;
    let searchUserList = [];
    if (this.searchContent != "") {
      this.httpService.getHttp("/csysuser").subscribe((data: any) => {
        userList = data.data.list;
        for (let key in userList) {
          if (userList[key].csysUserRealname.indexOf(this.searchContent) != -1) {
            console.log("userList", this.searchContent);
            searchUserList.push(userList[key])
          }
        }
        this.usersListData = searchUserList;
      });

    } else {
      this.getUsersList();
    }
  }
  //重置
  resetingUserList(): void {
    this.getUsersList();
    this.searchContent = "";
  }

  //获取用户所属用户组
  getUserRole(userId, index): void {
    let userRoleList = [];
    let role = [];
    let userIdRole;
    let roleId = [];
    this.httpService.getHttp("/csysuserrole").subscribe((data: any) => {
      this.httpService.getHttp("/csysrole").subscribe((data1: any) => {
        role = data1.data.list;
        this.userRole = data.data.list;
        for (let key = 0; key < this.userRole.length; key++) {
          if (this.userRole[key].csysUserId == userId) {
            for (const i in role) {
              if (role[i].csysRoleId == this.userRole[key].csysRoleId) {
                userRoleList.push(role[i].csysRoleName);
                roleId.push(role[i].csysRoleId);
              }
            }
          }
        }
        userIdRole = userRoleList[0];
        for (let i = 0; i < userRoleList.length - 1; i++) {
          userIdRole += "，" + userRoleList[i + 1];
        }
        this.usersListData[index]['userRole'] = userIdRole;
        this.usersListData[index]['userRoleId'] = roleId;
        this.num--;
      });

    });
  }
  //获取用户所属组织架构
  getUserOrganization(userId, index): void {
    let userOrganization = [];
    let Organization = [];
    let OrganizationId = [];
    let userIdOrganization;
    this.httpService.getHttp("/csysorgpotauth").subscribe((data: any) => {
      this.httpService.getHttp("/csysorgpot").subscribe((data1: any) => {
        console.log("point", data)
        console.log("point1", data1)
        this.userOrganization = data.data.list;
        userOrganization = data1.data.list;
        for (let key = 0; key < this.userOrganization.length; key++) {
          if (this.userOrganization[key].csysUserId == userId) {
            for (const i in userOrganization) {
              if (userOrganization[i].csysOrgPotId == this.userOrganization[key].csysOrgPotId) {
                Organization.push(userOrganization[i].csysOrgPotName);
                OrganizationId.push(userOrganization[i].csysOrgPotId);
              }
            }
          }
        }
        userIdOrganization = Organization[0];
        for (let i = 1; i < Organization.length; i++) {
          userIdOrganization += "，" + Organization[i];
        }

        this.usersListData[index]['csysOrgPotName'] = userIdOrganization;
        this.usersListData[index]['csysOrgPotId'] = OrganizationId;
        this.num--;
      });

    });
  }
  insertTimer;
  insertUser(): void {
    let insertNum = 0;
    let position = this.addUserForm.controls.position.value;//用户组
    let department = this.addUserForm.controls.department.value;//组织（部门）
    let userData = {
      "csysUserUsername": this.addUserForm.controls.username.value,//用户名
      "csysUserPassword": this.addUserForm.controls.password.value,//密码
      "csysUserPhone": this.addUserForm.controls.phone.value,//手机号
      "csysUserRealname": this.addUserForm.controls.name.value,//真实姓名
      "csysUserNumber": this.addUserForm.controls.employeeId.value,//员工号
      "csysUserGender": this.addUserForm.controls.gender.value,//性别
      "csysUserAge": this.addUserForm.controls.age.value,//年龄
      "csysUserEmail": this.addUserForm.controls.email.value,//邮箱
      "csysUserAddress": this.addUserForm.controls.address.value//地址
    }
    console.log("this is e", userData)
    //添加用户
    this.httpService.postHttp("/csysuser", userData).subscribe((data: any) => {
      insertNum++;
      let userId = data.data;
      //添加用户组
      for (let i = 0; i < position.length; i++) {
        let userRole = {
          "csysRoleId": position[i],
          "csysUserId": userId
        }
        console.log("userRole", userRole);
        this.httpService.postHttp("/csysuserrole", userRole).subscribe((data: any) => {
          if (i == position.length - 1) {
            insertNum++;
          }
        });
      }

      //添加组织架构
      console.log("position", this.addUserForm.controls.position);
      console.log("department", this.addUserForm.controls.department);


      for (let i = 0; i < department.length; i++) {

        //查询节点信息
        this.httpService.getHttp("/csysorgpot/" + department[i]).subscribe((data: any) => {

          let organization = {
            "csysUserId": userId,
            "csysOrgPotId": department[i],
            "csysOrgPotName": data.data.csysOrgPotName
          }
          console.log("bodys", organization);
          this.httpService.postHttp("/csysorgpotauth", organization).subscribe((data: any) => {
            if (i == department.length - 1) {
              insertNum++;
            }
          });
        });

      }
    });
    this.insertTimer = setInterval(() => {
      if (insertNum == 3) {
        this.nzBtnLoding = false;
        this.msg.create("success", "创建成功");
        this.nzTitle = "权限分配";
        this.windowShow = "userList";
        this.getUsersList();
        clearInterval(this.insertTimer);
      }
    }, 500);
  }

  //校验两次密码是否相同
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.addUserForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }
  password; //记录密码
  //编辑成员
  editUser(userId): void {
    this.editUserId = userId;
    let userData;
    for (let i = 0; i < this.usersListData.length; i++) {
      if (this.usersListData[i].csysUserId == userId) {
        userData = this.usersListData[i];
        console.log("userData", userData);
        break;
      }
    }
    this.nzTitle = "编辑成员";
    this.windowShow = "adduser";
    this.password = userData.csysUserPassword;
    console.log("1", userData.userRoleId);
    console.log("1", userData.csysorgpotauth);
    this.addUserForm = this.fb.group({
      name: [userData.csysUserRealname, [Validators.required]],
      username: [userData.csysUserUsername, [Validators.required]],
      password: [userData.csysUserPassword, [Validators.required]],
      confitmPassword: [userData.csysUserPassword, [Validators.required, this.confirmationValidator]],
      age: [userData.csysUserAge],
      gender: [userData.csysUserGender],
      position: [userData.userRoleId, [Validators.required]],//userData.userRoleId
      department: [userData.csysOrgPotId, [Validators.required]],
      phone: [userData.csysUserPhone, [Validators.required]],
      email: [userData.csysUserEmail, [Validators.email]],
      address: [userData.csysUserAddress],
      employeeId: [userData.csysUserNumber]
    });
  }
  submitNum;
  submitTimer;
  //编辑提交 --> 用户组和组织架构为不必填是否需要判空执行定时器（默认全部必填）
  submitEdit(userId): void {
    let userData
    this.submitNum = 0;
    //校验控件
    for (const i in this.addUserForm.controls) {
      this.addUserForm.controls[i].markAsDirty();
      this.addUserForm.controls[i].updateValueAndValidity();
    }
    if (this.addUserForm.controls.name.invalid) return;
    if (this.addUserForm.controls.username.invalid) return;
    if (this.addUserForm.controls.password.invalid) return;
    if (this.addUserForm.controls.confitmPassword.invalid) return;
    if (this.addUserForm.controls.department.invalid) return;
    if (this.addUserForm.controls.position.invalid) return;
    if (this.addUserForm.controls.email.invalid) return;
    this.editOrginzation(userId);
    this.editUserRole(userId);
    console.log("当前密码", this.password)
    console.log("修改密码", Md5.hashStr(this.addUserForm.controls.password.value))
    //判断密码是否修改

    if (this.addUserForm.controls.password.value == this.password && this.addUserForm.controls.confitmPassword.value == this.password) {

      userData = {
        "csysUserId": userId,
        "csysUserUsername": this.addUserForm.controls.username.value,//用户名
        "csysUserPhone": this.addUserForm.controls.phone.value,//手机号
        "csysUserRealname": this.addUserForm.controls.name.value,//真实姓名
        "csysUserNumber": this.addUserForm.controls.employeeId.value,//员工号
        "csysUserGender": this.addUserForm.controls.gender.value,//性别
        "csysUserAge": this.addUserForm.controls.age.value,//年龄
        "csysUserEmail": this.addUserForm.controls.email.value,//邮箱
        "csysUserAddress": this.addUserForm.controls.address.value//地址
      }
    } else {
      userData = {
        "csysUserId": userId,
        "csysUserUsername": this.addUserForm.controls.username.value,//用户名
        "csysUserPassword": this.addUserForm.controls.password.value,//密码
        "csysUserPhone": this.addUserForm.controls.phone.value,//手机号
        "csysUserRealname": this.addUserForm.controls.name.value,//真实姓名
        "csysUserNumber": this.addUserForm.controls.employeeId.value,//员工号
        "csysUserGender": this.addUserForm.controls.gender.value,//性别
        "csysUserAge": this.addUserForm.controls.age.value,//年龄
        "csysUserEmail": this.addUserForm.controls.email.value,//邮箱
        "csysUserAddress": this.addUserForm.controls.address.value//地址
      }

    }
    console.log("zeq", userData);
    //添加用户
    this.httpService.putHttp("/csysuser", userData).subscribe((data: any) => {
      this.submitNum++;
    });
    this.submitTimer = setInterval(() => {
      if (this.submitNum == 3) {
        this.nzBtnLoding = false;
        this.msg.create("success", "编辑成功");
        this.nzTitle = "权限分配";
        this.windowShow = "userList";
        this.getUsersList();
        clearInterval(this.submitTimer);
      }
    }, 500);
  }
  //编辑组织架构
  editOrginzation(userId): void {
    let department = this.addUserForm.controls.department.value;//组织（部门）
    let organizationArray = [];//组织权限
    this.httpService.postHttp("/csysorgpotauth/condition").subscribe((data: any) => {
      let organization = data.data;
      for (let i = 0; i < organization.length; i++) {
        if (organization[i].csysUserId == userId) organizationArray.push(organization[i].csysOrgPotAuthId);
      }
      console.log("organizationArray", organizationArray);
      //当存在组织架构时候先删除在添加
      for (let i = 0; i < organizationArray.length; i++) {
        this.httpService.deleteHttp("/csysorgpotauth/" + organizationArray[i]).subscribe((data: any) => {
          //添加组织架构
          if (i == organizationArray.length - 1) {
            console.log("department", department);
            for (let i = 0; i < department.length; i++) {
              //查询节点信息
              this.httpService.getHttp("/csysorgpot/" + department[i]).subscribe((data: any) => {

                let organization = {
                  "csysUserId": userId,
                  "csysOrgPotId": department[i],
                  "csysOrgPotName": data.data.csysOrgPotName
                }
                console.log("bodys", organization);
                this.httpService.postHttp("/csysorgpotauth", organization).subscribe((data: any) => {
                  if (i == department.length - 1) {
                    this.submitNum++;
                  }
                });
              });

            }
          }
        });
      }
      //当改用户不存在组织架构时候
      if (organizationArray.length == 0) {
        for (let i = 0; i < department.length; i++) {
          let organization = {
            "csysUserId": userId,
            "csysOrgPotId": department[i]
          }
          console.log("123321", organization);
          this.httpService.postHttp("/csysorgpotauth", organization).subscribe((data: any) => {
            if (i == department.length - 1) {
              this.submitNum++;
            }
          });
        }
      }
    });
  }
  //编辑用户组
  editUserRole(userId): void {
    let position = this.addUserForm.controls.position.value;//用户组
    let deleteArray = [];
    this.httpService.postHttp("/csysuserrole/condition").subscribe((data: any) => {
      let userRoleData = data.data;
      console.log("userRoleData", userRoleData);
      //获得role id
      for (let i = 0; i < userRoleData.length; i++) {
        if (userRoleData[i].csysUserId == userId) deleteArray.push(userRoleData[i].csysUserRoleId);
      }
      console.log("deleteArray", deleteArray);
      //循环删除role表
      for (let i = 0; i < deleteArray.length; i++) {
        this.httpService.deleteHttp("/csysuserrole/" + deleteArray[i]).subscribe((data: any) => {
          if (i == deleteArray.length - 1) {
            for (let i = 0; i < position.length; i++) {
              let userRole = {
                "csysRoleId": position[i],
                "csysUserId": userId
              }
              console.log("userRole", userRole);
              this.httpService.postHttp("/csysuserrole", userRole).subscribe((data: any) => {
                if (i == position.length - 1) {
                  this.submitNum++;
                }
              });
            }
          }
        });
      }
      //当userRole表中不存在改用户角色执行
      if (deleteArray.length == 0) {
        this.httpService.deleteHttp("/csysuser/" + userId).subscribe((data: any) => {
          for (let i = 0; i < position.length; i++) {
            let userRole = {
              "csysRoleId": position[i],
              "csysUserId": userId
            }
            console.log("userRole", userRole);
            this.httpService.postHttp("/csysuserrole", userRole).subscribe((data: any) => {
              if (i == position.length - 1) {
                this.submitNum++;
              }
            });
          }
        });
      }
    });
  }
  //删除成员
  deleteUser(userid): void {
    let deleteArray = [];
    let organizationArray = [];
    console.log(userid);
    //获得组织的id
    this.httpService.postHttp("/csysorgpotauth/condition").subscribe((data: any) => {
      let organization = data.data;
      for (let i = 0; i < organization.length; i++) {
        if (organization[i].csysUserId == userid) organizationArray.push(organization[i].csysOrgPotAuthId);
      }
      for (let i = 0; i < organizationArray.length; i++) {
        this.httpService.deleteHttp("/csysorgpotauth/" + organizationArray[i]).subscribe((data: any) => {
        });
      }
    });
    this.httpService.postHttp("/csysuserrole/condition").subscribe((data: any) => {
      let userRoleData = data.data;
      console.log("userRoleData", userRoleData);
      //获得role id
      for (let i = 0; i < userRoleData.length; i++) {
        if (userRoleData[i].csysUserId == userid) deleteArray.push(userRoleData[i].csysRoleId);
      }
      console.log("deleteArray", deleteArray);
      //循环删除role表
      for (let i = 0; i < deleteArray.length; i++) {
        this.httpService.deleteHttp("/csysuserrole/" + deleteArray[i]).subscribe((data: any) => {
          //外键存在，异步操作，放在里面
          if (i == deleteArray.length - 1) {
            this.httpService.deleteHttp("/csysuser/" + userid).subscribe((data: any) => {
              if (data.code == "200") {
                this.msg.create("success", "");
              }
              this.getUsersList();
            });
          }
        });
      }
      //当userRole表中不存在改用户角色执行
      if (deleteArray.length == 0) {
        this.httpService.deleteHttp("/csysuser/" + userid).subscribe((data: any) => {
          if (data.code == "200") {
            this.msg.create("success", "");
          }
          this.getUsersList();
        });
      }
    });
  }
  //初始化表单控件
  initializeFromControl(): void {
    this.addUserForm = this.fb.group({
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confitmPassword: [null, [Validators.required, this.confirmationValidator]],
      age: [null],
      gender: ["男"],
      position: [null, [Validators.required]],
      department: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.email]],
      address: [null],
      employeeId: [null]
    });
  }

  //确认设置用户
  authorityConfirm(): void {
    this.nzBtnLoding = true;
    //校验控件控件
    for (const i in this.addUserForm.controls) {
      this.addUserForm.controls[i].markAsDirty();
      this.addUserForm.controls[i].updateValueAndValidity();
    }
    if (this.addUserForm.controls.name.invalid) return;
    if (this.addUserForm.controls.username.invalid) return;
    if (this.addUserForm.controls.password.invalid) return;
    if (this.addUserForm.controls.confitmPassword.invalid) return;
    if (this.addUserForm.controls.department.invalid) return;
    if (this.addUserForm.controls.position.invalid) return;
    if (this.nzTitle == "编辑成员") {
      this.submitEdit(this.editUserId);
    } else if (this.nzTitle == "添加成员") {
      this.insertUser();
    }
    // this.userCurrentList = JSON.parse(JSON.stringify(this.userChangeList));
  }
  displayData: Array<{ csysUserId: string; csysUserRealname: string; checked: boolean; }> = [];
  allChecked = false;
  disabledButton = true;
  checkedNumber = 0;
  dataSet = [];
  indeterminate = false;
  displayData1 = [];
  checkAll(value: boolean): void {
    this.displayData.forEach(data => data.checked = value);
    this.refreshStatus();
    console.log("123", this.displayData);
  }
  refreshStatus(): void {
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.dataSet.some(value => value.checked);
    this.checkedNumber = this.dataSet.filter(value => value.checked).length;
  }
  currentPageDataChange($event: Array<{ csysUserId: string; csysUserRealname: string; checked: boolean; }>): void {
    this.displayData1 = $event;
    this.refreshStatus();
  }
}
