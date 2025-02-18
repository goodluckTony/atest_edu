import { APIRequestContext, Page } from "@playwright/test";

export class ApiHelper {
    private request: APIRequestContext;
    private baseUrl: string;

    constructor(request: APIRequestContext, baseUrl: string) {
        this.request = request;
        this.baseUrl = baseUrl;
    }

    async deleteUser(userId: number, token: string): Promise<boolean> {
        const deleteRequest = await this.request.post(`${this.baseUrl}/graphql`, {
            headers: {
                'Authorization': `Bearer ${token}`,
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
}