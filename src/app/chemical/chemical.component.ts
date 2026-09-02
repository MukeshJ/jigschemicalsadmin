import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-chemical',
  templateUrl: './chemical.component.html',
  styleUrls: ['./chemical.component.scss'],
  imports: [RouterOutlet],
})
export class ChemicalComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
