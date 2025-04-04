import { Locator, Page } from '@playwright/test';
import path from "path";

export class StudentEditProfilePage {
  private page: Page;
  private editBtn: Locator;
  private lastNameInput: Locator;
  private firstNameInput: Locator;
  private surnameInput: Locator;
  private birthdayInput: Locator;
  private emailInput: Locator;
  private phoneInput: Locator;
  private telegramInput: Locator;
  private saveChangesButton: Locator;
  private fileUploadInput: Locator;


  constructor(page: Page) {
    this.page = page;
    this.editBtn = page.locator("button:has-text('Редагувати')");
    this.lastNameInput = page.locator("[name='lastName']");
    this.firstNameInput = page.locator("[name='firstName']");
    this.surnameInput = page.locator("[name='surname']");
    this.birthdayInput = page.locator("[placeholder='DD.MM.YYYY']");
    this.emailInput = page.locator("[name='email']");
    this.phoneInput = page.locator("[name='phone']");
    this.telegramInput = page.locator("[name='telegram']");
    this.saveChangesButton = page.locator("button:has-text('Зберегти')");
    this.fileUploadInput = page.locator("input[type='file']");
  }
  
  async editStudentProfile(newStudent: EditStudentData): Promise<void> {
    await this.editBtn.click();
    await this.page.waitForLoadState("networkidle");

    await this.lastNameInput.fill(newStudent.lastName);
    await this.firstNameInput.fill(newStudent.firstName);
    await this.surnameInput.fill(newStudent.surname);
    await this.birthdayInput.fill(newStudent.date);
    await this.phoneInput.fill(newStudent.phone);
    await this.telegramInput.fill(newStudent.telegram);
    await this.emailInput.fill(newStudent.email);
    // TODO: add avatar
    await this.fileUploadInput.setInputFiles(path.resolve("assets/stud-img.png"));
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