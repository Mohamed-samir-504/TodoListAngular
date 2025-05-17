import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';


function equalPasswords(control: AbstractControl){
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    return { passwordsNotEqual: true };
  } 
  return null;
}

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  private router = inject(Router);

  signupForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),

    passwords: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    },{
      validators: [equalPasswords]
    })

  });

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { email, passwords } = this.signupForm.value;
      console.log('Signup submitted:', email, passwords);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}