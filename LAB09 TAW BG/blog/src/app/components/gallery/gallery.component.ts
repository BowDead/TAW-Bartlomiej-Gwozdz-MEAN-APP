import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

interface GalleryItem {
  id: string;
  title: string;
  image: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  galleryItems: GalleryItem[] = [];
  selectedImage: GalleryItem | null = null;
  isModalOpen = false;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadGalleryItems();
  }

  loadGalleryItems(): void {
    this.dataService.getAll().subscribe((posts: any) => {
      this.galleryItems = posts.map((post: any) => ({
        id: post._id,
        title: post.title,
        image: post.image
      }));
    });
  }

  openImage(item: GalleryItem): void {
    this.selectedImage = item;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedImage = null;
    document.body.style.overflow = 'auto';
  }
}
