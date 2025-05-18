import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  imports: [],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {

  @Output() selectedTab = new EventEmitter<string>();
  activeTab: 'todo' | 'completed' = 'todo';

  switchTab(tab: 'todo' | 'completed') {
    this.selectedTab.emit(tab);
    this.activeTab = tab;
  }

}
