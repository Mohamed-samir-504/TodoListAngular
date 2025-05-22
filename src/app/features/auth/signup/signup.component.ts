import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


function equalPasswords(control: AbstractControl) {
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

  constructor(private authService: AuthService, private router: Router) { }

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
    }, {
      validators: [equalPasswords]
    })

  });

  onSubmit(): void {
    if (this.signupForm.valid) {
      const name = this.signupForm.get('name')?.value;
      const email = this.signupForm.get('email')?.value;
      const password = this.signupForm.get('passwords.password')?.value;

      this.authService.signUp(name!, email!, password!).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Signup failed:', err.message);
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}