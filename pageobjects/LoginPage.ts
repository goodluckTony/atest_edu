import { Locator, Page } from '@playwright/test';

export class LoginPage {
  private page: Page;
  private emailInput: Locator;
  private passwordInput: Locator;
  private submitButton: Locator;
  public accessToken: string;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("[placeholder='E-mail']");
    this.passwordInput = page.locator("[placeholder='Введіть пароль']");
    this.submitButton = page.locator("[type='submit']");
  }

  async open(): Promise<void> {
    await this.page.goto(process.env.BASE_URL!);
  }

  async login(email: string, password: string): Promise<void> {
    console.log('Logging in with:', { email, password });
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}