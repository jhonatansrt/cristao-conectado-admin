import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../common/header/header';

@Component({
  selector: 'app-template',
  imports: [Header, RouterOutlet],
  templateUrl: './template.html',
  styleUrl: './template.scss',
})
export class Template {}
