import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { namedRoutes } from '../../named-routes';

@Component({
  selector: 'app-privacy-policy-page',
  imports: [MatIconModule],
  templateUrl: './privacy-policy-page.html',
  styleUrl: './privacy-policy-page.scss',
})
export class PrivacyPolicyPage {
  private readonly router = inject(Router);

  public goBack(): void {
    this.router.navigate([namedRoutes.login]);
  }
}
