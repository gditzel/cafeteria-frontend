import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryEventsService {
  private readonly subject = new Subject<void>();
  readonly categoriesChanged$ = this.subject.asObservable();

  notifyCategoriesChanged(): void {
    this.subject.next();
  }
}
