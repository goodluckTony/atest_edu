import { test, expect } from '@playwright/test';
import fs from 'fs/promises';
import { LoginPage } from '../pageobjects/LoginPage';
import { AdminPanelUsersPage } from '../pageobjects/AdminPanelUsersPage';
import { StudentListPage } from '../pageobjects/StudentListPage';
import { StudentFormPage } from '../pageobjects/StudentFormPage';
import { StudentProfilePage } from '../pageobjects/StudentProfilePage';
import { AdminCredentials } from '../pageobjects/utils/AdminCredentials';
import { UserDataGenerator } from '../pageobjects/utils/UserDataGenerator';
import { ApiHelper } from "../pageobjects/utils/ApiHelper";
import { config } from '../config';

test.describe("Student creation", () => {
  let loginPage: LoginPage;
  let adminPanelUsersPage: AdminPanelUsersPage;
  let studentListPage: StudentListPage;
  let studentFormPage: StudentFormPage;
  let studentProfilePage: StudentProfilePage;
  let student;
  let apiHelper: ApiHelper;
  let userId: number;
  let mainCred: {email: string, pass: string};

  test.beforeEach(async ({ page, request }) => {
    mainCred = AdminCredentials.admin;
    loginPage = new LoginPage(page);
    adminPanelUsersPage = new AdminPanelUsersPage(page);
    studentListPage = new StudentListPage(page);
    studentFormPage = new StudentFormPage(page);
    studentProfilePage = new StudentProfilePage(page);
    
    apiHelper = await ApiHelper.create(request, config.apiUrl!, mainCred.email, mainCred.pass);
      
  });
    
  test('Should create student', async () => {
    student = UserDataGenerator.generateStudent();

    // Login as admin
    console.log(mainCred.email, mainCred.pass);
    await loginPage.open();
    await loginPage.login(mainCred.email, mainCred.pass);

    // Navigate to the admin panel
    await adminPanelUsersPage.navigateToStudentsList();
    await studentListPage.addNewStudentBtnClick();

    // Fill student form
    await studentFormPage.fillStudentForm(student);
    await studentFormPage.submitForm();

    // Search for the student in the list and check if the data is correct
    await studentListPage.searchStudentByEmail(student.email, student.telegram);

    await expect(studentProfilePage.getStudentImage()).toBeVisible();
    await expect(studentProfilePage.getStudentLastName()).toHaveText(student.lastName);
    await expect(studentProfilePage.getStudentFirstName()).toHaveText(student.firstName);
    await expect(studentProfilePage.getStudentSurname()).toHaveText(student.surname);
    await expect(studentProfilePage.getStudentDate()).toHaveText(student.date);
    await expect(studentProfilePage.getStudentEmail()).toHaveText(student.email);
    await expect(studentProfilePage.getStudentPhone()).toHaveText(student.phone);
    await expect(studentProfilePage.getStudentTelegram()).toHaveText(student.telegram);

    // TODO: add avatar
  });

  test.afterEach(async () => {
    userId = studentFormPage.studentId;

    // DELETE created user via API
    console.log(`Attempting to delete user. ID: ${userId}`);
    if(userId) {
      await apiHelper.deleteUser(userId);
      console.log(`Student with ID ${userId} deleted successfully.`)
    } else {
      console.warn('User ID or Token is missing. Skipping deletion.');
    }
  });
});