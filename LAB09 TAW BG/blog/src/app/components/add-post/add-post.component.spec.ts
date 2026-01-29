import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddPostComponent } from './add-post.component';
import { DataService } from '../../services/data.service';

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;
  let dataService: DataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPostComponent, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.postForm.value).toEqual({
      title: '',
      text: '',
      image: ''
    });
  });

  it('should mark form as invalid when fields are empty', () => {
    expect(component.postForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all required fields are filled', () => {
    component.postForm.patchValue({
      title: 'Test Title',
      text: 'This is a test post content with enough characters',
      image: 'https://example.com/image.jpg'
    });
    expect(component.postForm.valid).toBeTruthy();
  });

  it('should call dataService.addPost on valid form submission', () => {
    spyOn(dataService, 'addPost');
    
    component.postForm.patchValue({
      title: 'Test Title',
      text: 'This is a test post content',
      image: 'https://example.com/image.jpg'
    });
    
    component.onSubmit();
    
    expect(dataService.addPost).toHaveBeenCalledWith(
      'Test Title'
    );
  });

  it('should reset form after successful submission', () => {
    component.postForm.patchValue({
      title: 'Test Title',
      text: 'This is a test post content',
      image: 'https://example.com/image.jpg'
    });
    
    component.onSubmit();
    
    expect(component.postForm.value).toEqual({
      title: null,
      text: null,
      image: null
    });
  });
});
