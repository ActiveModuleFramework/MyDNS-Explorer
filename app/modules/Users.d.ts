import { AmfModule } from 'active-module-framework/AmfModule';
interface UserInfo {
    no: number;
    type: string;
    id: string;
    name: string;
    admin: boolean;
}
export declare class Users extends AmfModule {
    userInfo: UserInfo;
    static onCreateModule(): Promise<boolean>;
    private static getLocalCount;
    onStartSession(): Promise<void>;
    isLogin(userId: any, userPass: any, local: any): Promise<boolean>;
    static getUserInfoFromNo(no: any, local: any): Promise<UserInfo>;
    static getUserInfo(userId: any, local: any): Promise<UserInfo>;
    logout(): {
        no: number;
        id: string;
        name: string;
        type: string;
        admin: boolean;
    };
    isAdmin(): boolean;
    JS_request(): Promise<UserInfo>;
    JS_logout(): Promise<{
        no: number;
        id: string;
        name: string;
        type: string;
        admin: boolean;
    }>;
    JS_login(userId: string, userPass: string, local: boolean, keep?: boolean): Promise<false | UserInfo>;
    JS_setUser(userNo: number, userId: string, userName: string, userPass: string, local: boolean): Promise<any>;
    JS_delUser(userNo: number, local: boolean): Promise<boolean>;
    JS_getUsers(local: any): Promise<false | {
        [key: string]: any;
    }[]>;
}
export {};
