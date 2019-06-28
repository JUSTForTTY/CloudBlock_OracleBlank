import { Component, OnInit } from '@angular/core';
import { HttpService } from 'ngx-block-core';
import { environment } from '@env/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
    selector: 'app-tasktime',
    templateUrl: './tasktime.component.html',
    styleUrls: ['./tasktime.component.less']
})
export class TasktimeComponent implements OnInit {
    ttData: any;
    total: any;
    currentPage: number = 1;
    ttLoading: boolean;
    form: FormGroup;
    editId: any;
    statu: any;
    isVisiblesV: boolean = false;
    isConfirmLoading: boolean = false;
    constructor(private httpService: HttpService,public msg: NzMessageService, private fb: FormBuilder) { }

    ngOnInit() {
        this.getTTData(this.currentPage);
        this.init();
    }
    getTTData(currentPage: number): void {
        this.httpService.getHttpAllUrl(environment.DATA_SERVER_URL + "quartz/job").subscribe((jobData: any) => {
            jobData = jobData.data;
            this.httpService.postHttpAllUrl(environment.DATA_SERVER_URL + "csysschedule/listCondition?size=5" + "&page=" + currentPage).subscribe((data: any) => {
                this.httpService.postHttpAllUrl(environment.DATA_SERVER_URL + "csystransport/condition").subscribe((sportData: any) => {
                    sportData = sportData.data;
                    console.log("sportData", sportData);
                    this.ttData = data.data.list;
                    this.total = data.data.total;
                    this.currentPage = currentPage;
                    this.ttLoading = false;
                    console.log("asss", this.ttData)
                    for (let index = 0; index < this.ttData.length; index++) {
                        const element = this.ttData[index];
                        this.ttData[index]["color"] = "red";
                        this.ttData[index]["status"] = false;
                        for (let index1 = 0; index1 < jobData.length; index1++) {
                            const element1 = jobData[index1];
                            if (element.csysScheduleId == element1.jobName) {
                                this.ttData[index]["color"] = "green";
                                this.ttData[index]["status"] = true;
                                break;
                            }
                        }
                        for (let index3 = 0; index3 < sportData.length; index3++) {
                            const element3 = sportData[index3];
                            if (element.csysScheduleName == element3.csysTransportId) {
                                if (element3.transportStauts == 1) {
                                    this.ttData[index]["color"] = "green";
                                    this.ttData[index]["status"] = true;
                                    break;
                                }
                            }
                        }
                    }
                    this.ttData = [... this.ttData];
                    console.log("ttData", this.ttData);
                })
            })

        })
    }
    editTaskTime(item): void {
        this.editId = item.csysScheduleId;
        this.statu = "edit";
        this.form = this.fb.group({
            taskName: [item.csysScheduleName, [Validators.required]],
            jobClassName: [item.csysScheduleJobclass, [Validators.required]],
            timeExpress: [item.csysScheduleExpression, [Validators.required]],
            remark: [item.csysScheduleDesc]
        });
    }
    init() {
        this.form = this.fb.group({
            taskName: [null, [Validators.required]],
            jobClassName: ["com.company.project.core.utils.TestGetData", [Validators.required]],
            timeExpress: [null, [Validators.required]],
            remark: [null]
        });
    }
    deleteTT(id): void {
        this.httpService.deleteHttpAllUrl(environment.DATA_SERVER_URL + "csysschedule/" + id).subscribe((data: any) => {
            if (data.code == "200") {
                this.msg.success("删除成功");
                this.getTTData(this.currentPage);
            }
        })
    }
    stratTT(item): void {
        let ttData = {
            "templateId": item.csysScheduleName,
            "jobName": item.csysScheduleId,
            "schedule": item.csysScheduleExpression,
            "className": item.csysScheduleJobclass,
        };
        console.log("测试1", ttData);

        this.httpService.postHttpAllUrl(environment.DATA_SERVER_URL + "quartz/job", ttData).subscribe((data: any) => {
            if (data.code == "200") {
                this.msg.success("开启成功");
                this.getTTData(this.currentPage);
            } else {
                this.msg.error("开启失败，请稍后再试");
            }
        })
    }
    closeTT(item): void {
        console.log(environment.DATA_SERVER_URL + "quartz/job/" + item.csysScheduleId)
        let tranData = {
            "csysTransportId": item.csysScheduleName,
            "transportStauts": "0",
        }
        this.httpService.putHttpAllUrl(environment.DATA_SERVER_URL + "csystransport", tranData).subscribe((data: any) => { })
        this.httpService.deleteHttpAllUrl(environment.DATA_SERVER_URL + "quartz/job/" + item.csysScheduleId).subscribe((data: any) => {
            if (data.code == "200") {
                this.msg.success("关闭成功");
                this.getTTData(this.currentPage);
            } else {
                this.msg.error("关闭失败，请稍后再试");
            }
        })
    }

    keepTaskTime(id): void {
        let ttdata = {
            "csysScheduleId": id,
            "csysScheduleName": this.form.value.taskName,
            "csysScheduleJobclass": this.form.value.jobClassName,
            "csysScheduleState": "1",
            "csysScheduleExpression": this.form.value.timeExpress,
            "csysScheduleDesc": this.form.value.remark
        };
        this.httpService.putHttpAllUrl(environment.DATA_SERVER_URL + "csysschedule", ttdata).subscribe((data: any) => {
            this.isConfirmLoading = false;
            if (data.code == "200") {
                this.msg.success("编辑成功");
                this.init();
                this.getTTData(this.currentPage);
                this.isVisiblesV = false;
            }

        });
    }
    iTaskTime(): void {
       this.isVisiblesV = true;
    }
}
