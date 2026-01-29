import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsSectionComponent } from './comments-section.component';

describe('CommentsSectionComponent', () => {
  let component: CommentsSectionComponent;
  let fixture: ComponentFixture<CommentsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsSectionComponent);
    component = fixture.componentInstance;
    component.postId = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load comments on init', () => {
    expect(component.comments).toBeDefined();
  });

  it('should add a comment', () => {
    component.newCommentAuthor = 'Test Author';
    component.newCommentContent = 'Test Content';
    const initialLength = component.comments.length;
    
    component.addComment();
    
    expect(component.comments.length).toBe(initialLength + 1);
    expect(component.newCommentAuthor).toBe('');
    expect(component.newCommentContent).toBe('');
  });
});
