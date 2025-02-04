import { Locator, Page } from '@playwright/test';

export class LoginPage {
  private page: Page;
  private emailInput: Locator;
  private passwordInput: Locator;
  private submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("[name='email']");
    this.passwordInput = page.locator("[name='password']");
    this.submitButton = page.locator("[type='submit']");
  }

  async open(): Promise<void> {
    await this.page.goto('http://dev-admin.fasted.space/');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}