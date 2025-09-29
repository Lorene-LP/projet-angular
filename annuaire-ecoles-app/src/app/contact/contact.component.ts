import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchoolService } from '../services/school.service';
import { School } from '../models/school.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  schoolId: string | null = null;
  school: School | null = null;
  contactForm = {
    nom: '',
    email: '',
    objet: '',
    message: '',
    cgu: false
  };
  isSubmitting = false;
  submitMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private schoolService: SchoolService
  ) {}

  ngOnInit() {
    this.schoolId = this.route.snapshot.paramMap.get('id');
    if (this.schoolId) {
      // Simulation avec les données de Lyon
      this.schoolService.getSchoolsByCity('Lyon').subscribe(schools => {
        this.school = schools.find(s => s.id === this.schoolId) || null;
      });
    }
  }

  onSubmit() {
    if (this.contactForm.cgu && this.contactForm.nom && this.contactForm.email && this.contactForm.objet && this.contactForm.message) {
      this.isSubmitting = true;
      
      // Simulation d'envoi
      setTimeout(() => {
        this.isSubmitting = false;
        this.submitMessage = 'Message envoyé avec succès !';
        this.contactForm = { nom: '', email: '', objet: '', message: '', cgu: false };
      }, 2000);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}