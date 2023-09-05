import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Unit } from '../model/unit';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {
  constructor(private httpClient: HttpClient) {}
  private unitsUrl = `${environment.unit}`;
  getUnit(): Observable<Unit[]> {
    return this.httpClient.get<Unit[]>(this.unitsUrl);
  }
}
