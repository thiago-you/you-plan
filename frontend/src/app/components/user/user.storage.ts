import { User } from './user';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';   

@Injectable({providedIn: 'root'})
export class UserStorage {
    public value = new BehaviorSubject(this.user);

    public set user(value: User) {
        if (value.icon == undefined || value.icon == '' || value.icon == null) {
            value.icon = '';
    
            if (value.name != null && value.name.toLocaleLowerCase() == 'you') {
                value.icon = '1';
            } else {
                value.icon += Math.floor(Math.random() * (14 - 2 + 1)) + 2;
            }
        }

        this.value.next(value);
        localStorage.setItem('currentUser', JSON.stringify(value));
    }

    public get user(): User {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

        if (user.icon == undefined || user.icon == '' || user.icon == null) {
            user.icon = '';
    
            if (user.name != null && user.name.toLocaleLowerCase() == 'you') {
                user.icon = '1';
            } else {
                user.icon += Math.floor(Math.random() * (14 - 2 + 1)) + 2;
            }
        }

        return user;
    }

    public clear = () => {
        this.value.next(JSON.parse('{}'));
        localStorage.removeItem('currentUser');
    }
}