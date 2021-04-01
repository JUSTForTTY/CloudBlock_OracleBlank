import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PageService } from 'ngx-block-core';


interface Data { index?: number, [key: string]: any }
@Injectable()
export class RpsBoardService {
  pageChangeTime$: Subject<number> = new Subject();
  private isAdding = false;

  constructor(private pageService: PageService) { }
  clearAll(allData: Data[], showData: Data[], otherData: Data[]) {
    showData.splice(0, showData.length)
    otherData.splice(0, otherData.length)
    allData.splice(0, showData.length)
  }

  visible(event, item: Data, index, showData: Data[], otherData: Data[]) {
    // console.log('visible', item.index, event.visible)
    if (!event.visible) {
      let addIndx = 0;
      for (const iterator of otherData) {
        if (iterator.index > item.index) {
          break;
        }
        addIndx++;
      }
      otherData.splice(addIndx, 0, item);
      showData.splice(index, 1);
    }
  }
  async pageChangeInit(allData: Data[], showData: Data[], otherData: Data[], reset = true) {
    if (reset) {
      showData.splice(0, showData.length)
      otherData.splice(0, otherData.length)

      for (let index = 0; index < allData.length; index++) {
        allData[index].index = index + 1;
        if (otherData.length > 0) {
          otherData.push(allData[index])
        } else {
          showData.push(allData[index])
          await this.pageService.sleep(10);
        }

      }
    } else {
      if (this.isAdding) return;
      this.addShowData(showData, otherData);
    }

  }
  private async addShowData(showData: Data[], otherData: Data[]) {
    this.isAdding = true;
    let oldnumber = showData.length;
    let addNumber = 0;
    for (const iterator of otherData) {
      showData.push(iterator);
      // console.log('visible',iterator.index,'push')
      addNumber++;
      oldnumber++;
      await this.pageService.sleep(10);
      if (oldnumber !== showData.length) {
        break;
      }
    }

    otherData.splice(0, oldnumber - showData.length);
    const showIds = [];
    for (const iterator of showData) {
      showIds.push(iterator.index)
    }
    // for (const iterator of otherData) {
    //   ids.push(iterator.index)
    // }

    for (let index = 1; index < otherData.length; index++) {
      const element = otherData[index];
      if (showIds.includes(element.index) || element.index === otherData[index - 1].index) {
        otherData.splice(index, 1);
        index--;
      }
    }
    if (otherData.length && showIds.includes(otherData[0].index)) {
      otherData.splice(0, 1);
    }
    this.isAdding = false;

  }
  async changePage(allData: Data[], showData: Data[], otherData: Data[]) {
    if (this.isAdding) return;
    this.isAdding = true;
    if (otherData.length === 0 || allData.length === 0) {
      this.isAdding = false;
      return;
    }
    const ToRight = []
    for (const iterator of showData) {
      ToRight.push(iterator)
    }
    showData.splice(0, showData.length)
    this.addShowData(showData, otherData)
    for (const iterator of ToRight) {
      otherData.push(iterator);
    }
    this.isAdding = false;
  }
}
