import { Component, OnInit } from '@angular/core';
import { MapComponent } from '../components/map/map.component';
import { SchoolService } from '../services/school.service';
import { School } from '../models/school.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MapComponent],
  template: `
    <div class="home-content">
      <h2 class="school-list-title">Établissements scolaires à Lyon</h2>
      <app-map [schools]="schools"></app-map>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  schools: School[] = [];

  constructor(private schoolService: SchoolService) {}

  ngOnInit() {
    this.schoolService.getSchoolsByCity('Lyon').subscribe((data: School[]) => {
      this.schools = data;
    });
  }
}