import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { UnitsState } from '../../state/units.state';
import { map, Observable } from 'rxjs';
import { getUnitsAction } from '../../action/units-action';
import { ActivatedRoute } from '@angular/router';
import { Cost, UnitItem } from '../../model/unit';

@Component({
  selector: 'app-unit-detail',
  templateUrl: './unit-detail.component.html',
  styleUrls: ['./unit-detail.component.scss']
})
export class UnitDetailComponent implements OnInit {
  unitItem: UnitItem = {};
  constructor(private store: Store, private activatedRoute: ActivatedRoute) {}

  @Select(UnitsState.getUnitsList) units$!: Observable<any>;

  ngOnInit(): void {
    const getSnapshotId = this.activatedRoute.snapshot.params['id'];
    this.getInitialList();
    this.units$
      ?.pipe(
        map(result =>
          result.filter((res: { id: number }) => res.id == getSnapshotId)
        )
      )
      .subscribe(res => {
        res.map((value: any) => {
          console.log('value : ', value);
          this.unitItem = {
            id: value.id,
            name: value.name,
            description: value.description,
            age: value.age,
            wood: value.cost?.Wood,
            gold: value.cost?.Gold,
            food: value.cost?.Food,
            build_time: value.build_time,
            reload_time: value.reload_time,
            hit_points: value.hit_points,
            attack: value.attack,
            accuracy: value.accuracy
          };
        });
      });
  }

  getInitialList() {
    return this.store.dispatch(new getUnitsAction());
  }
}
