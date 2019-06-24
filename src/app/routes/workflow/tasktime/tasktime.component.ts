import { Component, OnInit } from '@angular/core';
import { HttpService } from 'ngx-block-core';
import { environment } from '@env/environment';
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
  statu;
  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.getTTData(this.currentPage)
  }
  getTTData(currentPage: number): void {
    this.httpService.getHttpAllUrl(environment.SERVER_URL + "quartz/job").subscribe((jobData: any) => {
        jobData = jobData.data;
        this.httpService.postHttpAllUrl(environment.SERVER_URL + "csysschedule/listCondition?size=5" + "&page=" + currentPage).subscribe((data: any) => {
            this.httpService.postHttpAllUrl(environment.SERVER_URL + "csystransport/condition").subscribe((sportData: any) => {
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
}
