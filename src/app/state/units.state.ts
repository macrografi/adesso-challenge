import { UnitsService } from '../service/units.service';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UnitsDefault } from '../default/units.default';
import { tap } from 'rxjs';
import { getUnitsAction } from '../action/units-action';

@State<UnitsDefault>({
  name: 'units',
  defaults: {
    units: []
  }
})

@Injectable()
export class UnitsState {
  constructor(private unitService: UnitsService) {}

  @Selector() static getUnitsList(state: UnitsDefault) {
    return state.units;
  }

  @Action(getUnitsAction)
  getUnits({ getState, setState }: StateContext<UnitsDefault>) {
    return this.unitService.getUnit().pipe(
      tap(results => {
        const state = getState();
        setState({
          ...state,
          units: results
        });
      })
    );
  }
}
