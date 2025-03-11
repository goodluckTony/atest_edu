import { Locator, Page } from '@playwright/test';

export class StudentEditProfilePage {
  private page: Page;
  private teacherEditBtn: Locator;
  private lastNameInput: Locator;
  private firstNameInput: Locator;
  private surnameInput: Locator;
  private birthdayInput: Locator;
  private emailInput: Locator;
  private phoneInput: Locator;
  private telegramInput: Locator;
  private saveChangesButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.teacherEditBtn = page.locator("button:has-text('Редагувати')");
    this.lastNameInput = page.locator("[name='lastName']");
    this.firstNameInput = page.locator("[name='firstName']");
    this.surnameInput = page.locator("[name='surname']");
    this.birthdayInput = page.locator("[placeholder='DD.MM.YYYY']");
    this.emailInput = page.locator("[name='email']");
    this.phoneInput = page.locator("[name='phone']");
    this.telegramInput = page.locator("[name='telegram']");
    this.saveChangesButton = page.locator("button:has-text('Зберегти')");

  }
  
  async editTeacherProfile(newStudent: EditStudentData): Promise<void> {
    await this.teacherEditBtn.click();
    await this.page.waitForLoadState("networkidle");

    await this.lastNameInput.fill(newStudent.lastName);
    await this.firstNameInput.fill(newStudent.firstName);
    await this.surnameInput.fill(newStudent.surname);
    await this.birthdayInput.fill(newStudent.date);
    await this.phoneInput.fill(newStudent.phone);
    await this.telegramInput.fill(newStudent.telegram);
    await this.emailInput.fill(newStudent.email);
    await this.saveChangesButton.click();
  }

  getSaveChangesButton(): Locator {
    return this.saveChangesButton;
  }
}

export interface EditStudentData {
  lastName: string;
  firstName: string;
  surname: string;
  date: string;
  email: string;
  phone: string;
  telegram: string;
}