import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {DataService} from "../../services/data.service";
import {BlogItemComponent} from "../blog-item/blog-item.component";
import {CommonModule} from "@angular/common";
import {FilterTextPipe} from "../../pipes/filter-text.pipe";
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { PaginatePipe } from '../../pipes/paginate.pipe';
import { Subscription } from 'rxjs';
import { RatingService } from '../../services/rating.service';
import { HiddenService } from '../../services/hidden.service';

@Component({
  selector: 'blog',
  standalone: true,
  imports: [BlogItemComponent, CommonModule, FilterTextPipe, PaginationComponent, PaginatePipe],
  providers: [DataService],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit, OnDestroy {
  currentPage: number = 1;
  itemsPerPage: number = 4;
  @Input() filterText: string = '';

  public items$: any;
  public sortedItems: any[] = [];
  sortBy: 'default' | 'rating' = 'default';
  private queryParamsSubscription: Subscription | null = null;
  private hiddenIds: string[] = [];

  constructor(private service: DataService, private route: ActivatedRoute, private router: Router, private ratingService: RatingService, private hiddenService: HiddenService) {
  }
  ngOnInit(): void {
    this.hiddenIds = this.hiddenService.getHidden();
    this.getAll();
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
  } 
  
  onPageChange(page: number): void {
    console.log('Zmiana strony na:', page);
    console.log('Przed zmianą currentPage:', this.currentPage);
    this.currentPage = page;
    console.log('Po zmianie currentPage:', this.currentPage);
    console.log('Sorted items:', this.sortedItems.length);
    
    // Scroll do góry strony jak strone zmienie, u mnie mało znaczne, bo większość mi się mieści na jednym ekranie a posty mam w jednej linii
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setSortBy(sort: 'default' | 'rating'): void {
    this.sortBy = sort;
    this.currentPage = 1;
    this.updateSortedItems();
  }

  updateSortedItems(): void {
    if (!this.items$) {
      this.sortedItems = [];
      return;
    }
    
    this.hiddenIds = this.hiddenService.getHidden();
    const hiddenSet = new Set(this.hiddenIds.map(String));
    let items = [...this.items$].filter(item => item?.id && !hiddenSet.has(String(item.id)));
    
    if (this.sortBy === 'rating') {
      this.sortedItems = items.sort((a, b) => {
        const ratingA = this.ratingService.getAverageRating(a.id);
        const ratingB = this.ratingService.getAverageRating(b.id);
        return ratingB - ratingA;
      });
    } else {
      this.sortedItems = items;
    }
  }

  handleHiddenChange(id: string): void {
    this.sortedItems = this.sortedItems.filter(item => item?.id !== id);
    this.currentPage = 1;
  }

  handlePostDeleted(id: string): void {
    this.sortedItems = this.sortedItems.filter(item => item?.id !== id);
    this.currentPage = 1;
    this.getAll();
  }

  getAll(){
    console.log('getAll() called - refreshing posts');
    this.service.getAll().subscribe(response => {
      this.items$ = response;
      console.log('Posts refreshed:', response);
      this.updateSortedItems();
    });
  }
}
