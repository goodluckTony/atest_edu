import { Locator, Page } from '@playwright/test';

export class LoginPage {
  private page: Page;
  private emailInput: Locator;
  private passwordInput: Locator;
  private submitButton: Locator;
  public accessToken: string;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("[name='email']");
    this.passwordInput = page.locator("[name='password']");
    this.submitButton = page.locator("[type='submit']");
    this.listenLoginResponse();
  }

  async open(): Promise<void> {
    await this.page.goto('http://dev-admin.fasted.space/');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    // await this.page.pause();
    await this.submitButton.click();
    // await this.page.pause();
  }

  listenLoginResponse(): void {
    this.page.on('response', async (response) => {
        if (response.url().includes('/graphql') && response.status() === 200) {
          const request = response.request(); 
          const postData = request.postData(); // Get request body
          if (!postData) return;
          const requestBody = JSON.parse(postData); // Parse GraphQL request body
          if (requestBody.query.includes('mutation SignIn')) {
              const resJson = await response.json();
              
              if (resJson.data?.signIn?.accessToken) {
                console.log('Access token:', resJson.data?.signIn?.accessToken);
                this.accessToken = resJson.data?.signIn?.accessToken
              }
          }
        }
    });
  }
}