import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
