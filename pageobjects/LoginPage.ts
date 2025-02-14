import { Locator, Page } from '@playwright/test';
import { ApiHelper } from './utils/ApiHelper';

export class LoginPage {
  private page: Page;
  private emailInput: Locator;
  private passwordInput: Locator;
  private submitButton: Locator;
  private apiHelper: ApiHelper;
  public accessToken: string;

  constructor(page: Page, apiHelper: ApiHelper) {
    this.page = page;
    this.emailInput = page.locator("[name='email']");
    this.passwordInput = page.locator("[name='password']");
    this.submitButton = page.locator("[type='submit']");
    this.apiHelper = apiHelper;
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
    this.accessToken = await this.apiHelper.getLoginAccessToken(this.page);
  }
}