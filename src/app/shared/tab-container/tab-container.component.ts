import {
  Component,
  AfterContentInit,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tab-container',
  templateUrl: './tab-container.component.html',
  styleUrls: ['./tab-container.component.css'],
})
export class TabContainerComponent implements AfterContentInit {
  constructor() {}

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> =
    new QueryList();
  ngAfterContentInit(): void {
    console.log(this.tabs);
    this.selectTab(this.tabs.first);
  }

  selectTab(tab: TabComponent) {
    this.tabs.forEach((tab) => (tab.active = false));
    tab.active = true;

    return false; //to prevent default
  }
}
