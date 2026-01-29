import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from "../../services/data.service";
import {CommonModule} from '@angular/common';
import {CommentsSectionComponent} from '../comments-section/comments-section.component';

@Component({
  selector: 'blog-item-details',
  standalone: true,
  imports: [CommonModule, CommentsSectionComponent],
  providers: [DataService],
  templateUrl: './blog-item-details.component.html',
  styleUrl: './blog-item-details.component.scss'
})
export class BlogItemDetailsComponent implements OnInit {
  public image: string = '';
  public text: string = '';
  public title: string = '';
  public author: string = '';
  public id: string = '';


  constructor(private service: DataService, private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;

      this.id = id;

      this.service.getById(id).subscribe((res: any) => {
        this.image = res.image;
        this.text = res.text;
        this.title = res.title;
        this.author = res.author || 'Nieznany autor';
      });
    });
  }
}
