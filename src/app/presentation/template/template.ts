import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../common/header/header';
import { Menu } from '../common/menu/menu';
import { Footer } from '../common/footer/footer';

@Component({
  selector: 'app-template',
  imports: [Header, RouterOutlet, Menu, Footer],
  templateUrl: './template.html',
  styleUrl: './template.scss',
})
export class Template {}
