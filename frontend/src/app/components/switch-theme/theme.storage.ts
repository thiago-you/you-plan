import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';   

@Injectable({providedIn: 'root'})
export class ThemeStorage {
    public value = new BehaviorSubject(this.theme);

    public set theme(value: string) {
        this.value.next(value);
        localStorage.setItem('theme', JSON.stringify(value));
    }

    public get theme(): string {
        return localStorage.getItem('theme') || 'light';
    }

    public clear = () => {
        this.value.next(JSON.parse('{}'));
        localStorage.removeItem('theme');
    }

    public isDarkTheme(): boolean {
        return this.theme == 'dark';
    }
}