import { Component, OnInit } from '@angular/core';
import {SearchBarComponent} from "../../shared/search-bar/search-bar.component";
import {BlogComponent} from "../blog/blog.component";
//domyślna loklizacja
@Component({
  selector: 'blog-home',
  standalone: true,
  imports: [SearchBarComponent, BlogComponent],
  templateUrl: './blog-home.component.html',
  styleUrl: './blog-home.component.scss'
})
export class BlogHomeComponent implements OnInit {

  public filterText: string = 'a';

  constructor() {
  }

  ngOnInit(): void {
  }

  getName($event: string): void {
    this.filterText = $event;
  }
}
