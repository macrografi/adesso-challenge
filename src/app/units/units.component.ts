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

  ngOnInit(): void {
    this.getInitialList();
    this.ageFilter();
  }

  ngAfterViewInit(): void {}

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
      }
    }
    if (param.value == 'food') {
      this.foodIsChecked = param.checked;
      if (!this.foodIsChecked) {
        this.foodCost = 0;
      }
    }
    if (param.value == 'gold') {
      this.goldIsChecked = param.checked;
      if (!this.foodIsChecked) {
        this.goldCost = 0;
      }
    }
    this.costFilter();
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
  }
  costFilter(): void {
    // Wood range filter
    if (this.woodIsChecked) {
      const woodRange = this.units$
        ?.pipe(
          map(result =>
            result.filter((res: { age: string }) => res.age == this.selectedAge)
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

    // Food range filter
    if (this.foodIsChecked) {
      const foodRange = this.units$
        ?.pipe(
          map(result =>
            result.filter((res: { age: string }) => res.age == this.selectedAge)
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

    // Gold range filter
    if (this.goldIsChecked) {
      const goldRange = this.units$
        ?.pipe(
          map(result =>
            result.filter((res: { age: string }) => res.age == this.selectedAge)
          ),
          map(result =>
            result.filter(
              (res: { cost: { Good: number } }) =>
                res.cost?.Good >= this.goldCost
            )
          )
        )
        .subscribe(res => {
          this.goldList = res;
        });
    }

    const woodFilteredStream$ = of(this.woodList);
    const foodFilteredStream$ = of(this.foodList);
    const goldFilteredStream$ = of(this.goldList);

    forkJoin([woodFilteredStream$, foodFilteredStream$, goldFilteredStream$])
      .pipe(map(([s1, s2, s3]) => [...s1, ...s2, ...s3]))
      .subscribe(r => {
        this.unitLists = r;
      });
  }
}
