import { base } from "@faker-js/faker";
import { APIRequestContext } from "@playwright/test";

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
}