import {ObjectId}  from 'mongodb'
export type Role = 'admin' | 'student' | 'supervisor';

export type IUser = {
    _id?:ObjectId
    name: string;
    email: string;
    password: string;
    photo: string;
    role: Role,
    verified:boolean,
    currentLevel :'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}