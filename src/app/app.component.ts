import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  public window = window

  public readonly form = new FormGroup({
    name: new FormControl(''),
    age: new FormControl(0),
  })

  constructor(
    private aActivatedRoute: ActivatedRoute
  ) {


  }

  ngAfterViewInit(): void {
    console.log('component', this.aActivatedRoute.snapshot.queryParams);
  }


}
