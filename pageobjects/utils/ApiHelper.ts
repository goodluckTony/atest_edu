import { APIRequestContext, expect, Page } from "@playwright/test";
import { assert } from "console";
import { AdminCredentials } from "./AdminCredentials";
import { UserDataGenerator } from "../utils/UserDataGenerator";

export class ApiHelper {
    private request: APIRequestContext;
    private baseUrl: string;
    private accessToken: string;

    private constructor(request: APIRequestContext, baseUrl: string) {
        this.request = request;
        this.baseUrl = baseUrl;
    }

    static async create(request: APIRequestContext, baseUrl: string, adminLogin: string, adminPassword: string): Promise<ApiHelper> {
        const instance = new ApiHelper(request, baseUrl);
        await instance.login(adminLogin, adminPassword);
        return instance;
    }

    private async login(email: string, password: string): Promise<void> {
        const loginRequest = await this.request.post(`${this.baseUrl}/graphql`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                operationName: "SignIn",
                query: "mutation SignIn($email: String!, $password: String!, $mode: Int!) {\n  signIn(input: {login: $email, password: $password, mode: $mode}) {\n    accessToken\n    __typename\n  }\n}",
                variables: {
                    email,
                    password,
                    mode: 2
                }
            }
        });

        expect(loginRequest.status()).toBe(200) 
        
        const responseJson = await loginRequest.json();
        this.accessToken = responseJson.data?.signIn?.accessToken;
    }

    async createTeacher(token: string): Promise<number | null> {
        const teacher = UserDataGenerator.generateTeacher();
        const createTeacherRequest = await this.request.post(`${this.baseUrl}/graphql`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: {
                operationName: "createTeacher",
                query: "mutation createTeacher($input: CreateTeacherInput!) {\n  createTeacher(input: $input) {\n    id\n    __typename\n  }\n}",
                variables: {
                    input: {
                        user: {
                            birthday: teacher.date,
                            email: teacher.email,
                            firstName: teacher.firstName,
                            lastName: teacher.lastName,
                            gender: teacher.gender,
                            phone: teacher.phone,
                            telegram: teacher.telegram,
                            link: teacher.link
                        },
                        subject: teacher.subject
                    }
                }
            }
        });

        const responseBody = await createTeacherRequest.text();
        console.log('API Response Status:', createTeacherRequest.status());
        console.log('API Response Body:', responseBody);
    
        if (createTeacherRequest.status() === 200) {
            try {
                const responseJson = JSON.parse(responseBody);
                const teacherId = responseJson.data?.createTeacher?.id || null;
                console.log('Created teacher ID:', teacherId);
                return teacherId;
            } catch (error) {
                console.error('Error parsing response:', error);
                return null;
            }
        }
    
        console.error('Request failed with status:', createTeacherRequest.status());
        return null;
    }

    async deleteUser(userId: number): Promise<boolean> {
        const deleteRequest = await this.request.post(`${this.baseUrl}/graphql`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                query: `
                    mutation {
                        deleteUser(id: ${userId})
                }`
            }
        });

        const responseBody = await deleteRequest.text();
        console.log('Raw Delete Response:', responseBody);

        if (deleteRequest.status() === 200) {
            try {
                const responseJson = JSON.parse(responseBody);
                console.log('Parsed Delete Response:', responseJson);
                return responseJson.data?.deleteUser;
            } catch (error) {
                console.error('Error parsing response as JSON:', error);
                return false;
            }
        } else {
            console.error(`Delete request failed with status: ${deleteRequest.status()}`);
            return false;
        }
    }

    // createTeacher mutation
}