import { User } from './../user/user';
import { Story } from './../story/story';

export interface Planning {
    id?: string,
    name: string,
    items: Array<Story>,
    users: Array<User>,
}