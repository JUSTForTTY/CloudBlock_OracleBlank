import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable()
export class RpsBoardService {
  pageChangeTime$: Subject<number> = new Subject();

  constructor() { }
}
