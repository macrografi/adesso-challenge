import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { UnitsState } from '../state/units.state';
import { filter, from, map, Observable } from 'rxjs';
import { getUnitsAction } from '../action/units-action';
import { Unit } from '../model/unit';
import { Router } from '@angular/router';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit, AfterViewInit {
  unitLists: any[] = [];
  testList: any[] = [];
  selectedAge: string = 'All';

  //checked
  woodIsChecked: boolean = false;
  foodIsChecked: boolean = false;
  goldIsChecked: boolean = false;

  //coasts
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
  ageFilter(): void {
    if (this.selectedAge === 'All') {
      this.units$.subscribe(res => {
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
          //console.log(this.unitLists);
        });
    }
  }

  selectAge(e: any): void {
    this.selectedAge = e.target.innerText;
    this.ageFilter();
  }

  disableCost(param: any): void {
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

    const source2 = from([
      {
        id: 1,
        name: 'Archer',
        description:
          'Quick and light. Weak at close range; excels at battle from distance',
        expansion: 'Age of Kings',
        age: 'Feudal',
        cost: {
          Wood: 25,
          Gold: 45
        },
        build_time: 35,
        reload_time: 2,
        attack_delay: 0.35,
        movement_rate: 0.96,
        line_of_sight: 6,
        hit_points: 4,
        range: 30,
        attack: 4,
        armor: '0/0',
        accuracy: '80%'
      },
      {
        id: 2,
        name: 'Crossbowman',
        description: 'Upgraded archer',
        expansion: 'Age of Kings',
        age: 'Castle',
        cost: {
          Wood: 25,
          Gold: 45
        },
        build_time: 27,
        reload_time: 2,
        attack_delay: 0.35,
        movement_rate: 0.96,
        line_of_sight: 7,
        hit_points: 35,
        range: 5,
        attack: 5,
        armor: '0/0',
        attack_bonus: ['+3 spearmen'],
        accuracy: '85%'
      },
      {
        id: 3,
        name: 'Arbalest',
        description: 'Upgraded crossbowman',
        expansion: 'Age of Kings',
        age: 'Imperial',
        cost: {
          Wood: 25,
          Gold: 45
        },
        build_time: 27,
        reload_time: 2,
        attack_delay: 0.35,
        movement_rate: 0.96,
        line_of_sight: 7,
        hit_points: 40,
        range: 5,
        attack: 6,
        armor: '0/0',
        attack_bonus: ['+3 spearmen'],
        accuracy: '90%'
      },
      {
        id: 4,
        name: 'Cavalry Archer',
        description: 'Fast with ranged attack. Ideal for hit-and-run attacks',
        expansion: 'Age of Kings',
        age: 'Castle',
        cost: {
          Wood: 40,
          Gold: 70
        },
        build_time: 34,
        reload_time: 2,
        attack_delay: 1,
        movement_rate: 1.4,
        line_of_sight: 5,
        hit_points: 50,
        range: 4,
        attack: 6,
        armor: '0/0',
        attack_bonus: ['+2 spearmen'],
        search_radius: 6,
        accuracy: '50%'
      },
      {
        id: 5,
        name: 'Heavy Cavalry Archer',
        description: 'Upgraded Cavalry Archer',
        expansion: 'Age of Kings',
        age: 'Imperial',
        cost: {
          Wood: 40,
          Gold: 70
        },
        build_time: 27,
        reload_time: 2,
        attack_delay: 1,
        movement_rate: 1.4,
        line_of_sight: 6,
        hit_points: 60,
        range: 4,
        attack: 7,
        armor: '1/0',
        attack_bonus: ['+2 spearmen'],
        accuracy: '50%'
      }
    ]);

    const source3 = from(this.unitLists);
    source3
      ?.pipe(filter(r => r.cost.Wood >= 25))
      .subscribe(val => this.testList.push(val));
    console.log(this.testList);
  }

  setRange(param: any): void {
    if (param.name == 'wood') {
      this.woodCost = param.value;
    }
    if (param.name == 'food') {
      this.foodCost = param.value;
    }
    if (param.name == 'gold') {
      this.goldCost = param.value;
    }
  }

  checkValue(event: any): void {
    this.disableCost(event.target);
  }

  rangeChanged(event: any): void {
    this.setRange(event.target);
  }

  unitDetail(path: string, id: number): void {
    let detailUrl: string = path + '/' + id;
    this.router.navigate([detailUrl]).then(r => {});
  }
}
