import { User } from './user';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';   

@Injectable({providedIn: 'root'})
export class UserStorage {
    public value = new BehaviorSubject(this.user);

    public set user(value: User) {
        this.value.next(value);
        localStorage.setItem('currentUser', JSON.stringify(value));
    }

    public get user(): User {
        return JSON.parse(localStorage.getItem('currentUser') || '{}');
    }

    public clear = () => {
        this.value.next(JSON.parse('{}'));
        localStorage.removeItem('currentUser');
    }
}