import { base } from "@faker-js/faker";
import { APIRequestContext, Page } from "@playwright/test";

export class ApiHelper {
    private request: APIRequestContext;
    private baseUrl: string;

    constructor(request: APIRequestContext, baseUrl: string) {
        this.request = request;
        this.baseUrl = baseUrl;
    }

    async deleteUser(userId: number, token: string) {
        const response = await this.request.post(`${this.baseUrl}/graphql`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            data: {
                query: `mutation {
                  deleteUser(id: ${userId})
                }`,
            },
        });

        const responseBody = await response.text();
        console.log('Raw Delete Response:', responseBody);

        if (response.status() === 200) {
            try {
                const responseJson = JSON.parse(responseBody);
                console.log('Parsed Delete Response:', responseJson);
                return responseJson.data.deleteUser;
            } catch (error) {
                console.error('Error parsing response as JSON:', error);
                return false;
            }
        } else {
            console.error(`Delete request failed with status: ${response.status()}`);
            return false;
        }

    }

    async getLoginAccessToken(page: Page): Promise<string> {
        return new Promise((resolve) => {
            page.on('response', async (response) => {
                if (response.url().includes('/graphql') && response.status() === 200) {
                    const request = response.request();
                    const postData = request.postData();

                    if (!postData) return;

                    const requestBody = JSON.parse(postData);
                    if (requestBody.query.includes('mutation SignIn')) {
                        const resJson = await response.json();
                        if (resJson.data?.signIn?.accessToken) {
                            console.log('Access token:', resJson.data.signIn.accessToken);
                            resolve(resJson.data.signIn.accessToken);
                        }
                    }
                }
            });
        });
    }

    async getCreatedTeacherId(page: Page): Promise<number | null> {
        return new Promise((resolve) => {
            page.on('response', async (response) => {
                if (response.url().includes('/graphql') && response.status() === 200) {
                    const request = response.request();
                    const postData = request.postData();

                    if (!postData) return;

                    const requestBody = JSON.parse(postData);
                    if (requestBody.query.includes('mutation createTeacher')) {
                        const resJson = await response.json();
                        if (resJson.data?.createTeacher) {
                            console.log('Captured User ID:', resJson.data.createTeacher.id);
                            resolve(resJson.data.createTeacher.id);
                        }
                    }
                }
            });
        });
    }

}