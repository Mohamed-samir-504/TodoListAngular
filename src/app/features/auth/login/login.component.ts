import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  constructor(private authService: AuthService, private router: Router) { }
  
  loginForm = new FormGroup({
    email: new FormControl('',{
      validators:[Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login submitted:', email, password);
      this.authService.login(email!, password!).subscribe({
        next: (cred) => {
          this.router.navigate(['/user', cred.id, 'todos']);
        },
        error: (err) => {
          console.error('Login failed:', err.message);
          alert('Login failed. Please check your credentials.');
        }
      })
    }
  }
  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
