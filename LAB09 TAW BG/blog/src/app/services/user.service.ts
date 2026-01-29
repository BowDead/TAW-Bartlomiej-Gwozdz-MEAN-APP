import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  postsCount: number;
  posts: any[];
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:3100/api/user';

  constructor(private http: HttpClient) { }

  getUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.url}/profile/${userId}`);
  }

  updateUserProfile(userId: string, data: UpdateProfileData): Observable<any> {
    return this.http.put(`${this.url}/profile/${userId}`, data);
  }
}
