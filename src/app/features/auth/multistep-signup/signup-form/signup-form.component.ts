import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { CredentialsComponent } from './credentials/credentials.component';

@Component({
  selector: 'app-signup-form',
  imports: [CommonModule,
    MatStepperModule,
    MatButtonModule,
    PersonalInfoComponent,
    ContactInfoComponent,
    CredentialsComponent],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css'
})

export class SignupFormComponent {
  formSteps: FormArray;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {

    this.formSteps = this.fb.array([
      this.fb.group({
        firstName: ['', Validators.required],
        middleName: [''],
        lastName: ['', Validators.required]
      }),
      this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        address: ['', Validators.required]
      }),
      this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      })
    ]);
  }

  getStep(index: number): FormGroup {
    return this.formSteps.at(index) as FormGroup;
  }

  onSubmit() {
    const personal = this.getStep(0).value;
    const contact = this.getStep(1).value;
    const credentials = this.getStep(2).value;

    const name = `${personal.firstName} ${personal.middleName} ${personal.lastName}`.trim();
    const email = contact.email;
    const password = credentials.password;

    this.authService.signUp(name, email, password).subscribe({
      next: () => {
          this.router.navigateByUrl('/login' , { replaceUrl: true });  
        },
        error: (err) => {
          console.error('Signup failed:', err.message);
        }
    });
  }
}
