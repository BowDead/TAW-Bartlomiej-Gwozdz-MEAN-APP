import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryComponent } from './gallery.component';
import { DataService } from '../../services/data.service';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  let dataService: DataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load gallery items on init', () => {
    expect(component.galleryItems.length).toBeGreaterThan(0);
  });

  it('should open modal when image is clicked', () => {
    const mockItem = component.galleryItems[0];
    component.openImage(mockItem);
    
    expect(component.isModalOpen).toBe(true);
    expect(component.selectedImage).toEqual(mockItem);
  });

  it('should close modal', () => {
    component.isModalOpen = true;
    component.selectedImage = component.galleryItems[0];
    
    component.closeModal();
    
    expect(component.isModalOpen).toBe(false);
    expect(component.selectedImage).toBeNull();
  });
});
