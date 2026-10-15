import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-control-sidebar',
  templateUrl: './control-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./control-sidebar.component.scss'],
})
export class ControlSidebarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
