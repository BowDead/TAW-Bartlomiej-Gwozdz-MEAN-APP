import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogItemComponent } from '../blog-item/blog-item.component';
import { DataService } from '../../services/data.service';
import { HiddenService } from '../../services/hidden.service';

@Component({
  selector: 'hidden-posts',
  standalone: true,
  imports: [CommonModule, BlogItemComponent],
  providers: [DataService],
  templateUrl: './hidden-posts.component.html',
  styleUrl: './hidden-posts.component.scss'
})
export class HiddenPostsComponent implements OnInit {
  items: any[] = [];
  hiddenIds: string[] = [];
  loading = true;

  constructor(
    private dataService: DataService,
    private hiddenService: HiddenService,
  ) {}

  ngOnInit(): void {
    this.refreshHidden();
  }

  refreshHidden(): void {
    this.hiddenIds = this.hiddenService.getHidden();

    if (this.hiddenIds.length === 0) {
      this.items = [];
      this.loading = false;
      return;
    }

    this.dataService.getAll().subscribe((response: any) => {
      const data = Array.isArray(response) ? response : [];
      const hiddenSet = new Set(this.hiddenIds.map(String));
      this.items = data.filter(item => item?.id && hiddenSet.has(String(item.id)));
      this.loading = false;
    });
  }

  handleHiddenChange(): void {
    this.hiddenIds = this.hiddenService.getHidden();
    const hiddenSet = new Set(this.hiddenIds.map(String));
    this.items = this.items.filter(item => item?.id && hiddenSet.has(String(item.id)));
  }

  handlePostDeleted(id: string): void {
    this.items = this.items.filter(item => item?.id !== id);
    this.hiddenIds = this.hiddenIds.filter(hId => hId !== id);
    this.hiddenService.removeHidden(id);
  }

  trackById(_: number, item: any): string | undefined {
    return item?.id;
  }
}
