import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { UnitsState } from '../state/units.state';
import { filter, forkJoin, map, Observable, of } from 'rxjs';
import { getUnitsAction } from '../action/units-action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit, AfterViewInit {
  unitLists: any[] = [];
  //filter lists
  woodList: any[] = [];
  foodList: any[] = [];
  goldList: any[] = [];
  //age names
  selectedAge: string = 'All';
  //if range checkbox checked
  woodIsChecked: boolean = false;
  foodIsChecked: boolean = false;
  goldIsChecked: boolean = false;
  //range coasts
  woodCost: number = 0;
  foodCost: number = 0;
  goldCost: number = 0;

  constructor(private router: Router, private store: Store) {}

  @Select(UnitsState.getUnitsList) units$!: Observable<any>;
  noData = false;

  ngOnInit(): void {
    this.getInitialList();
    this.ageFilter();
  }

  ngAfterViewInit(): void {
    this.checkData();
  }

  getInitialList() {
    return this.store.dispatch(new getUnitsAction());
  }

  selectAge(e: any): void {
    this.selectedAge = e.target.innerText;
    this.ageFilter();
  }

  triggerCost(param: any): void {
    if (param.value == 'wood') {
      this.woodIsChecked = param.checked;
      if (!this.woodIsChecked) {
        this.woodCost = 0;
        this.woodList = [];
      }
      this.costFilter();
    }
    if (param.value == 'food') {
      this.foodIsChecked = param.checked;
      if (!this.foodIsChecked) {
        this.foodCost = 0;
        this.foodList = [];
      }
      this.costFilter();
    }
    if (param.value == 'gold') {
      this.goldIsChecked = param.checked;
      if (!this.foodIsChecked) {
        this.goldCost = 0;
        this.goldList = [];
      }
      this.costFilter();
    }

    // if unchecked all checkbox reset filter.
    if (!this.woodIsChecked && !this.foodIsChecked && !this.goldIsChecked) {
      this.ageFilter();
    }
    this.checkData();
  }

  resetCostFilter(): void {
    this.woodIsChecked = false;
    this.foodIsChecked = false;
    this.goldIsChecked = false;
    this.woodCost = 0;
    this.foodCost = 0;
    this.goldCost = 0;
  }

  setRange(param: any): void {
    if (param.name == 'wood') {
      this.woodCost = param.value;
      this.costFilter();
    }
    if (param.name == 'food') {
      this.foodCost = param.value;
      this.costFilter();
    }
    if (param.name == 'gold') {
      this.goldCost = param.value;
      this.costFilter();
    }
    this.checkData();
  }

  checkValue(event: any): void {
    this.triggerCost(event.target);
  }

  rangeChanged(event: any): void {
    this.setRange(event.target);
  }

  unitDetail(path: string, id: number): void {
    let detailUrl: string = path + '/' + id;
    this.router.navigate([detailUrl]).then(r => {});
  }

  ageFilter() {
    if (this.selectedAge === 'All') {
      this.units$?.subscribe(res => {
        this.unitLists = res;
      });
    } else {
      this.units$
        ?.pipe(
          map(result =>
            result.filter((res: { age: string }) => res.age == this.selectedAge)
          )
        )
        .subscribe(res => {
          this.unitLists = res;
        });
    }
    this.checkData();
    this.resetCostFilter();
  }

  costFilter(): void {
    this.woodList = [];
    this.foodList = [];
    this.goldList = [];
    //
    if (this.selectedAge == 'All') {
      if (this.woodIsChecked) {
        const woodRange = this.units$
          ?.pipe(
            map(result =>
              result.filter(
                (res: { cost: { Wood: number } }) =>
                  res.cost?.Wood >= this.woodCost
              )
            )
          )
          .subscribe(res => {
            this.woodList = res;
          });
      }
      if (this.foodIsChecked) {
        const foodRange = this.units$
          ?.pipe(
            map(result =>
              result.filter(
                (res: { cost: { Food: number } }) =>
                  res.cost?.Food >= this.foodCost
              )
            )
          )
          .subscribe(res => {
            this.foodList = res;
          });
      }
      if (this.goldIsChecked) {
        const goldRange = this.units$
          ?.pipe(
            map(result =>
              result.filter(
                (res: { cost: { Gold: number } }) =>
                  res.cost?.Gold >= this.goldCost
              )
            )
          )
          .subscribe(res => {
            this.goldList = res;
          });
      }
    }
    //
    else {
      if (this.woodIsChecked) {
        const woodRange = this.units$
          ?.pipe(
            map(result =>
              result.filter(
                (res: { age: string }) => res.age == this.selectedAge
              )
            ),
            map(result =>
              result.filter(
                (res: { cost: { Wood: number } }) =>
                  res.cost?.Wood >= this.woodCost
              )
            )
          )
          .subscribe(res => {
            this.woodList = res;
          });
      }
      if (this.foodIsChecked) {
        const foodRange = this.units$
          ?.pipe(
            map(result =>
              result.filter(
                (res: { age: string }) => res.age == this.selectedAge
              )
            ),
            map(result =>
              result.filter(
                (res: { cost: { Food: number } }) =>
                  res.cost?.Food >= this.foodCost
              )
            )
          )
          .subscribe(res => {
            this.foodList = res;
          });
      }
      if (this.goldIsChecked) {
        const goldRange = this.units$
          ?.pipe(
            map(result =>
              result.filter(
                (res: { age: string }) => res.age == this.selectedAge
              )
            ),
            map(result =>
              result.filter(
                (res: { cost: { Gold: number } }) =>
                  res.cost?.Gold >= this.goldCost
              )
            )
          )
          .subscribe(res => {
            this.goldList = res;
          });
      }
    }

    // Combine all streams width forkJoin
    const woodFilteredStream$ = of(this.woodList);
    const foodFilteredStream$ = of(this.foodList);
    const goldFilteredStream$ = of(this.goldList);

    forkJoin([woodFilteredStream$, foodFilteredStream$, goldFilteredStream$])
      .pipe(map(([s1, s2, s3]) => [...s1, ...s2, ...s3]))
      .subscribe(r => {
        this.unitLists = r;
      });
  }

  checkData(): void {
    setTimeout(() => {
      this.noData = this.unitLists.length === 0;
    }, 500);
  }
}
