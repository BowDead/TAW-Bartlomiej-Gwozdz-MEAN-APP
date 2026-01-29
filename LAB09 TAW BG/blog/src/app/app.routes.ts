import { Routes } from '@angular/router';
import { BlogItemDetailsComponent } from './components/blog-item-details/blog-item-details.component';
import {BlogHomeComponent} from './components/blog-home/blog-home.component';
import {FavoritesComponent} from "./components/favorites/favorites.component";
import { HiddenPostsComponent } from "./components/hidden-posts/hidden-posts.component";
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './services/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

export const routes: Routes = [
   {
	path: '',
	loadComponent: () => import('./components/home/home.component')
  	.then(m => m.HomeComponent)
  },
  {
	path: 'blog',
	loadComponent: () => import('./components/blog-home/blog-home.component')
  	.then(m => m.BlogHomeComponent),
	canActivate: [authGuard]
  },
  {
	path: 'blog/detail/:id',
	loadComponent: () => import('./components/blog-item-details/blog-item-details.component')
  	.then(m => m.BlogItemDetailsComponent)
  },
  {
	path: 'login',
	loadComponent: () => import('./components/login/login.component')
  	.then(m => m.LoginComponent)
  },

  { path: 'favorites',
    loadComponent: () => import("./components/favorites/favorites.component")
    .then(m => m.FavoritesComponent)},
  { path: 'hidden',
    loadComponent: () => import("./components/hidden-posts/hidden-posts.component")
    .then(m => m.HiddenPostsComponent)},
  {
	path: 'gallery',
	loadComponent: () => import('./components/gallery/gallery.component')
  	.then(m => m.GalleryComponent),
	canActivate: [authGuard]
  },
  {
	path: 'add-post',
	loadComponent: () => import('./components/add-post/add-post.component')
  	.then(m => m.AddPostComponent),
	canActivate: [authGuard]
  },
  {
	path: 'signup',
	loadComponent: () => import('./components/signup/signup.component')
  	.then(m => m.SignupComponent)
  },
  {
	path: 'profile',
	loadComponent: () => import('./components/profile/profile.component')
  	.then(m => m.ProfileComponent),
	canActivate: [authGuard]
  }

];