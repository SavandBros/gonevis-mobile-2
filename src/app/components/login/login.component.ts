import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // Login form.
  logInForm: FormGroup;
  // This variable indicates whether we are authenticating in user or not.
  loading: boolean;

  constructor(private formBuilder: FormBuilder, private toastController: ToastController,
              private router: Router, private authService: AuthService) {
    this.loading = false;
  }

  ngOnInit() {
    this.logInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /*
  * This function will show a toast by given message.
  * */
  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }

  /*
  * This function will return login form controls.
  * */
  get form(): { [key: string]: AbstractControl } {
    return this.logInForm.controls;
  }

  /*
  * This function will authenticate user.
  * */
  login(): void {
    // Break function if form is invalid.
    if (this.logInForm.invalid) {
      return;
    }
    // Update loading state.
    this.loading = true;
    // Payload required by BackEnd.
    const payload: { username: string, password: string } = {
      username: this.form.username.value,
      password: this.form.password.value
    };
    // API call
    this.authService.login(payload).subscribe((data: string): Promise<void> => {
      // Update loading state.
      this.loading = false;
      // Redirect user to 'Entries' page
      this.router.navigate(['/dash', 'posts']);
      // Show toaster which will greet user.
      return this.showToast(`Welcome back ${data}`);
    }, (errors: Array<object>): Promise<void> => {
      // Update loading state.
      this.loading = false;
      // Show toaster which will display an error.
      return this.showToast(errors['non_field_errors'][0]);
    });
  }
}
